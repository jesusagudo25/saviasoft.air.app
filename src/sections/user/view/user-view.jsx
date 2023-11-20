import axios from 'axios';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { InputLabel } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
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

  const [selected, setSelected] = useState([]);

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
  }

  const handleSubmitDialog = async (event) => {
    setIsLoading(true);
    const id = itemSelected;
    setItemSelected(null);
    setOpenModalUser(false);

    if (itemSelected) {
      const { firstName, lastName, email, role } = event;
      await axios.put(`${import.meta.env.VITE_MICRO_SECURTY}/users/${id}`, {
        firstName,
        lastName,
        email,
        role,
      });
      setUsers(users.map((user) => user.id === id ? { ...user, firstName, lastName, email, role } : user));
      toastifyMessage('User updated successfully', 'success');
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
      toastifyMessage('User created successfully', 'success');
    }

    setIsLoading(false);

  }

  const handleChangePassword = async (event) => {
    setIsLoading(true);
    const id = itemSelected;
    setItemSelected(null);
    setOpenModalPassword(false);
    const { password, passwordConfirm } = event;
    console.log(password, passwordConfirm);
    if (password === passwordConfirm) {
      await axios.patch(`${import.meta.env.VITE_MICRO_SECURTY}/users/${id}/change-password`, {
        password,
        passwordConfirm,
      });
      toastifyMessage('Password changed successfully', 'success');
      reset();
    } else {
      toastifyMessage('Passwords do not match', 'error');
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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
        <Typography variant="h4">Users</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {
          setOpenModalUser(true);
          reset();
        }}>
          New User
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
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'role', label: 'Role' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      firstName={row.firstName}
                      lastName={row.lastName}
                      email={row.email}
                      role={row.role}
                      status={row.status}
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
          Manage User
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
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name should be at least 2 characters',
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="First name"
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
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name should be at least 2 characters',
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Last name"
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
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Email address"
                  {...field}
                  error={Boolean(errors.email)}
                  helperText={errors.email ? errors.email.message : ''}
                />
              )}
            />

            <FormControl fullWidth sx={{ mt: 1 }} variant="outlined">
              <InputLabel id="lenguage-select-label">Role</InputLabel>
              <Controller
                name="role"
                control={control}
                defaultValue="CUSTOMER"
                rules={{
                  required: 'Role is required',
                }}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    label="Role"
                  >
                    <MenuItem value='CUSTOMER'>Customer</MenuItem>
                    <MenuItem value='ADMIN'>Admin</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            {!itemSelected && (
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password should be at least 6 characters',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Password"
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    error={Boolean(errors.password)}
                    helperText={errors.password ? errors.password.message : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(event) => event.preventDefault()}
                            edge="end"
                          >
                            {showPassword ? <Iconify icon="eva:eye-fill" /> : <Iconify icon="eva:eye-off-fill" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            )}

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button size="large" onClick={handleCloseDialog}  >
            Cancel
          </Button>
          <Button size="large" autoFocus disabled={isLoading} onClick={handleSubmit(handleSubmitDialog)}>
            Save
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
          Manage User
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
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password should be at least 6 characters',
                }
              }}
              render={({ field }) => (
                <TextField
                  name="password"
                  label="Password"
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
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password should be at least 6 characters',
                },
                validate: (value) => value === getValues('password') || 'The passwords do not match',
              }}
              render={({ field }) => (
                <TextField
                  name="passwordConfirm"
                  label="Password Confirm"
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
            Cancel
          </Button>
          <Button size="large" autoFocus disabled={isLoading} onClick={handleSubmit(handleChangePassword)}>
            Save
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
