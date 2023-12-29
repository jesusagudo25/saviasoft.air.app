import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

import { LoadingButton } from '@mui/lab';
import {
  Box, 
  Tab, 
  Tabs, 
  Card, 
  Stack,
  Backdrop,
  TextField, 
  Container,
  IconButton, 
  Typography,
  FormControl, 
  InputAdornment, 
  CircularProgress
} from '@mui/material';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function ProfilesView() {
  /* Toastify */
  const showNotification = (type, message) => {
    if (type === 'success') {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if (type === 'error') {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else if (type === 'warning') {
      toast.warn(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    else {
      toast.info(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const { control, handleSubmit, reset, } = useForm({
    reValidateMode: 'onBlur'
  });

  const id = localStorage.getItem('id');
  const role = localStorage.getItem('role');
  const [isLoading, setIsLoading] = React.useState(false);

  /* User settings */
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [errorsManual, setErrorsManual] = React.useState({});

  const [showPassword, setShowPassword] = useState(false);

  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const updateUser = () => {
    setIsLoading(true);
    const errors = {};

    if (firstName === '') {
      errors.firstName = 'Nombre es requerido';
    }

    if (lastName === '') {
      errors.lastName = 'Apellido es requerido';
    }

    if (email === '') {
      errors.email = 'Correo electrónico es requerido';
    }

    if (Object.keys(errors).length === 0) {

      axios.put(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_SECURTY}/users/${id}`, {
        firstName,
        lastName,
        email,
        role,
      })
        .then((response) => {
          setIsLoading(false);
          if(response?.data?.token) {
            localStorage.setItem('token', response.data.token);
            window.location.reload();
          }
  
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
      setErrorsManual({});
      toast.success('Usuario actualizado correctamente');
    }
    else {
      setErrorsManual(errors);
      setIsLoading(false);
    }
  }

  /* Select option */
  const [valueSelected, setValueSelected] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValueSelected(newValue);
  };

  /* Get all */

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_SECURTY}/users/${id}`)
      .then((response) => {
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setEmail(response.data.email);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });

  }, [id]);

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={3}>
          <Typography variant="h4" gutterBottom>
            Mi perfil
          </Typography>
        </Stack>


        <Card
          sx={{
            mb: 3,
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={valueSelected} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Información general" {...a11yProps(0)} />
              <Tab label="Cambiar contraseña" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <TabPanel value={valueSelected} index={0}>
            <Container sx={
              {
                padding: '20px',
              }
            }>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" gutterBottom>
                  Información general
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-start" mb={2} sx={
                {
                  gap: '10px',
                }
              }>
                <Typography variant="body1" gutterBottom>
                  Nombre
                </Typography>
                <FormControl
                  sx={{ width: '30%' }}
                >
                  <TextField id="outlined-basic" placeholder='Ingrese su nombre' variant="outlined" value={firstName} onChange={
                    (e) => {
                      setFirstName(e.target.value)
                    }
                  }
                    error={errorsManual.firstName}
                    helperText={errorsManual.firstName}
                  />

                </FormControl>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-start" mb={2} sx={
                {
                  gap: '10px',
                }
              }>
                <Typography variant="body1" gutterBottom>
                  Apellido
                </Typography>
                <FormControl
                  sx={{ width: '30%' }}
                >
                  <TextField id="outlined-basic" placeholder='Ingrese su apellido completo' variant="outlined" value={lastName} onChange={
                    (e) => {
                      setLastName(e.target.value)
                    }
                  }
                    error={errorsManual.lastName}
                    helperText={errorsManual.lastName}
                  />

                </FormControl>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-start" sx={
                {
                  gap: '10px',
                  mt: '20px',
                }
              }>
                <Typography variant="body1" gutterBottom>
                  Correo&nbsp; &nbsp;
                </Typography>
                <FormControl sx={{ width: '30%' }}>
                  <TextField id="outlined-basic" variant="outlined" value={email} onChange={
                    (e) => {
                      setEmail(e.target.value)
                    }
                  } placeholder='Ingrese su correo electrónico'
                    error={errorsManual.email}
                    helperText={errorsManual.email}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={
                {
                  mt: '30px',
                }
              }>
                <LoadingButton variant="contained" color="primary" loading={isLoading} onClick={updateUser}>
                  Guardar
                </LoadingButton>
              </Stack>
            </Container>
          </TabPanel>

          <TabPanel value={valueSelected} index={1}>
            <Container sx={
              {
                padding: '20px',
              }
            }>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" gutterBottom>
                  Cambiar contraseña
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-start" mb={2} sx={
                {
                  gap: '10px',
                }
              }>
                <Typography variant="body1" gutterBottom>
                  Contraseña actual
                </Typography>
                <Controller
                  name="currentPassword"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'La contraseña actual es requerida',
                  }}
                  render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                    <TextField
                      label="Contraseña actual"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-start" mb={2} sx={
                {
                  gap: '10px',
                }
              }>
                <Typography variant="body1" gutterBottom>
                  Nueva contraseña
                </Typography>
                <Controller
                  name="newPassword"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'La nueva contraseña es requerida',
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener un mínimo de 8 caracteres'
                    },
                    maxLength: {
                      value: 20,
                      message: 'La contraseña debe tener un máximo de 20 caracteres'
                    }
                  }}
                  render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                    <TextField
                      label='Nueva contraseña'
                      type={showPasswordConfirm ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} edge="end">
                              <Iconify icon={showPasswordConfirm ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                />

              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={
                {
                  mt: '30px',
                }
              }>
                <LoadingButton variant="contained" color="primary" onClick={handleSubmit((event) => {
                  setIsLoading(true)
                  axios.patch(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_SECURTY}/users`, {
                    currentPassword: event.currentPassword,
                    newPassword: event.newPassword,
                  })
                    .then((response) => {
                      setIsLoading(false)
                      showNotification('success', 'La contraseña se ha actualizado correctamente')
                      reset()
                    }).catch((error) => {
                      console.log(error)
                      showNotification('error', 'La contraseña actual es incorrecta')
                      setIsLoading(false)
                    })
                })}
                  loading={isLoading}
                >
                  Guardar
                </LoadingButton>
              </Stack>
            </Container>
          </TabPanel>
        </Card>

      </Container>

      {/* Toastify */}

      <ToastContainer />


      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}
