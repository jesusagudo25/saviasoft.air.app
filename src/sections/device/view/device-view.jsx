import axios from 'axios';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import BootstrapDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import BootstrapDialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

import {usePathname } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../device-no-data';
import DeviceTableRow from '../device-table-row';
import TableEmptyRows from '../device-empty-rows';
import DeviceTableHead from '../device-table-head';
import DeviceTableToolbar from '../device-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function DevicePage() {

  /* Get id url */
  const pathname = usePathname();

  const userId = pathname.split('/')[3];

  const [userName, setUserName] = useState('');

  const [devices, setDevices] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isLoading, setIsLoading] = useState(false);

  const [openModalDevice, setOpenModalDevice] = useState(false);

  const [itemSelected, setItemSelected] = useState(null);

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  /* Toastify */

  const toastifyMessage = (message, type) => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /* Modal methods */

  const handleCloseDialog = () => {
    setItemSelected(null);
    setOpenModalDevice(false);
    reset();
  }

  const handleSubmitDialog = async (event) => {
    setIsLoading(true);
    const id = itemSelected;
    setItemSelected(null);
    setOpenModalDevice(false);

    if (id) {
      
      const { name, location, serialNumber, uid } = event;
      await axios.put(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_ENTITY}/devices/${id}`, {
        name,
        location,
        serialNumber,
        uid,
      });
      setDevices(devices.map((device) => device.id === id ? { ...device, name, location, serialNumber, uid } : device));

      toastifyMessage('Dispositivo actualizado correctamente', 'success');
      reset();
    } else {
      const { name, location, serialNumber, uid } = event;

      const response = await axios.post(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_ENTITY}/devices`, {
        name,
        location,
        serialNumber,
        userId,
        uid,
        userName: `${userName || 'No asignado'}`
      });
      setDevices([...devices, response.data]);
      toastifyMessage('Dispositivo creado correctamente', 'success');
      reset();
    }

    setIsLoading(false);

  }

  /* Datatable methods */

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: devices,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_ENTITY}/devices/byUser/${userId}`)
      .then((response) => {
        setDevices(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    setIsLoading(true);

    axios.get(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_SECURTY}/users/${userId}`)
      .then((response) => {
        setUserName(`${response.data.firstName} ${response.data.lastName}`);
        setIsLoading(false);
      }
      )
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }
    , [userId]);
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Dispositivos de {userName}</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {
          setOpenModalDevice(true);
          reset();
        }}>
          Nuevo dispositivo
        </Button>
      </Stack>

      <Card>
        <DeviceTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <DeviceTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'name', label: 'Nombre' },
                  { id: 'serial', label: 'Serial' },
                  { id: 'location', label: 'Ubicación' },
                  { id: 'uid', label: 'UID' },
                  { id: 'status', label: 'Estado' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <DeviceTableRow
                      key={row.id}
                      row={row}
                      setIsLoading={setIsLoading}
                      devices={devices}
                      setDevices={setDevices}
                      id={row.id}
                      setItemSelected={setItemSelected}
                      toastifyMessage={toastifyMessage}
                      setValue={setValue}
                      setOpenModalDevice={setOpenModalDevice}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, devices.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={devices.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Card>

      <ToastContainer />

      <BootstrapDialog
        onClose={handleCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={openModalDevice}
        maxWidth='sm'
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
          Gestión de dispositivos
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{
            minWidth: 550,
          }}>

            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: 'El nombre es requerido',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres',
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Nombre"
                  {...field}
                  error={Boolean(errors.name)}
                  helperText={errors.name ? errors.name.message : ''}
                />
              )}
            />

            <Controller
              name="serialNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Serial"
                  {...field}
                />
              )}
            />

            <Controller
              name="location"
              control={control}
              defaultValue=""
              rules={{
                required: 'La ubicación es requerida',
                minLength: {
                  value: 2,
                  message: 'La ubicación debe tener al menos 2 caracteres',
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Ubicación"
                  {...field}
                  error={Boolean(errors.location)}
                  helperText={errors.location ? errors.location.message : ''}
                />
              )}
            />

            <Controller
              name="uid"
              control={control}
              defaultValue=""
              rules={{
                required: 'El UID es requerido',
              }}                
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="UID"
                  {...field}
                  error={Boolean(errors.uid)}
                  helperText={errors.uid ? errors.uid.message : ''}
                />
              )}
            />
            

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button size="large" onClick={handleCloseDialog}  >
            Cancelar
          </Button>
          <Button size="large" autoFocus disabled={isLoading} onClick={handleSubmit(handleSubmitDialog)}>
            Guardar
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}
