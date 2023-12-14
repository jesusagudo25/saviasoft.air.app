import axios from 'axios';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import BootstrapDialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';
import BootstrapDialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {

  const [users, setUsers] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isLoading, setIsLoading] = useState(false);

  const [openModalUser, setOpenModalUser] = useState(false);

  const [openModalPassword, setOpenModalPassword] = useState(false);

  const [itemSelected, setItemSelected] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const { control, handleSubmit, reset, setValue, formState: { errors },getValues } = useForm();
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
    setOpenModalUser(false);
    setOpenModalPassword(false);
    reset();
  }

  const handleSubmitDialog = async (event) => {
    setIsLoading(true);
    const id = itemSelected;
    setItemSelected(null);
    setOpenModalUser(false);

    if (id) {
      
      const { firstName, lastName, email, role } = event;
      await axios.put(`${import.meta.env.VITE_MICRO_SECURTY}/users/${id}`, {
        firstName,
        lastName,
        email,
        role,
      });
      setUsers(users.map((user) => user.id === id ? { ...user, firstName, lastName, email, role } : user));

      if(id === JSON.parse(localStorage.getItem('id'))) {
        localStorage.setItem('role', role);
        window.location.reload();
      }

      toastifyMessage('Usuario actualizado correctamente', 'success');
      reset();
    } else {
      const { firstName, lastName, email, password, role } = event;
      const response = await axios.post(`${import.meta.env.VITE_MICRO_SECURTY}/users`, {
        firstName,
        lastName,
        email,
        password,
        role,
      });
      setUsers([...users, response.data]);
      toastifyMessage('Usuario creado correctamente', 'success');
      reset();
    }

    setIsLoading(false);

  }

  const handleChangePassword = async (event) => {
    setIsLoading(true);
    const id = itemSelected;
    setItemSelected(null);
    setOpenModalPassword(false);
    const { password, passwordConfirm } = event;

    if (password === passwordConfirm) {
      await axios.patch(`${import.meta.env.VITE_MICRO_SECURTY}/users/${id}/change-password`, {
        password,
        passwordConfirm,
      });
      toastifyMessage('Contraseña actualizada correctamente', 'success');
      reset();
    } else {
      toastifyMessage('Las contraseñas no coinciden', 'error');
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
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${import.meta.env.VITE_MICRO_SECURTY}/users`)
      .then((response) => {
        setUsers(response.data);
        setIsLoading(false);
      }
      )
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Usuarios</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {
          setOpenModalUser(true);
          reset();
        }}>
          Nuevo usuario
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'name', label: 'Nombre' },
                  { id: 'email', label: 'Correo electrónico' },
                  { id: 'role', label: 'Rol' },
                  { id: 'devices', label: 'Dispositivos' },
                  { id: 'status', label: 'Estado' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      setIsLoading={setIsLoading}
                      users={users}
                      setUsers={setUsers}
                      id={row.id}
                      setItemSelected={setItemSelected}
                      toastifyMessage={toastifyMessage}
                      setValue={setValue}
                      setOpenModalUser={setOpenModalUser}
                      setOpenModalPassword={setOpenModalPassword}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
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
        open={openModalUser}
        maxWidth='sm'
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
          Gestión de usuarios
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{
            minWidth: 550,
            minHeight: 300,
          }}>

            <Controller
              name="firstName"
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
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName ? errors.firstName.message : ''}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              rules={{
                required: 'El apellido es requerido',
                minLength: {
                  value: 2,
                  message: 'El apellido debe tener al menos 2 caracteres',
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Apellido"
                  {...field}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName ? errors.lastName.message : ''}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: 'El correo electrónico es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo electrónico inválido',
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  {...field}
                  error={Boolean(errors.email)}
                  helperText={errors.email ? errors.email.message : ''}
                />
              )}
            />

            <FormControl fullWidth sx={{ mt: 1 }} variant="outlined">
              <InputLabel id="lenguage-select-label">Rol</InputLabel>
              <Controller
                name="role"
                control={control}
                defaultValue="CLIENTE"
                rules={{
                  required: 'El rol es requerido',
                }}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    label="Rol"
                  >
                    <MenuItem value='CLIENTE'>Cliente</MenuItem>
                    <MenuItem value='ADMINISTRADOR'>Administrador</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

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

      <BootstrapDialog
        onClose={handleCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={openModalPassword}
        maxWidth='sm'
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
          Cambiar contraseña
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ 
            minWidth: 550,
            minHeight: 150,
          }}>

            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                }
              }}
              render={({ field }) => (
                <TextField
                  name="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                          <Iconify icon={showPassword ? 'ic:outline-visibility-off' : 'ic:outline-visibility'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  {...field}
                  error={Boolean(errors.password)}
                  helperText={errors.password ? errors.password.message : ''}
                />
              )}
            />

            <Controller
              name="passwordConfirm"
              control={control}
              defaultValue=""
              rules={{
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
                validate: (value) => value === getValues('password') || 'Las contraseñas no coinciden',
              }}
              render={({ field }) => (
                <TextField
                  name="passwordConfirm"
                  label="Confirmar contraseña"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPasswordConfirm((prev) => !prev)}>
                          <Iconify icon={showPasswordConfirm ? 'ic:outline-visibility-off' : 'ic:outline-visibility'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  {...field}
                  error={Boolean(errors.passwordConfirm)}
                  helperText={errors.passwordConfirm ? errors.passwordConfirm.message : ''}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button size="large" onClick={handleCloseDialog}  >
            Cancelar
          </Button>
          <Button size="large" autoFocus disabled={isLoading} onClick={handleSubmit(handleChangePassword)}>
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
