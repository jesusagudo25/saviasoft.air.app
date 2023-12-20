import axios from 'axios';
import { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, TextField, FormLabel, FormControl } from '@mui/material';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function SettingsView() {

  
  const toastifyMessage = (message, type) => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit,  setValue, formState: { errors } } = useForm();

  const submitSettings = async (event) => {
    setIsLoading(true);

    const data = {
      maxMetano: event.maxMetano,
      maxCO2: event.maxCO2,
      maxPPM: event.maxPPM,
    };

    axios.put(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_ENTITY}/system-config/${import.meta.env.VITE_SYSTEM_CONFIG_ID}`, data)
      .then((response) => {
        setIsLoading(false);
        toastifyMessage('Configuración guardada correctamente', 'success');
      }
      )
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        toastifyMessage('Error al guardar la configuración', 'error');
      });
  }

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_ENTITY}/system-config/${import.meta.env.VITE_SYSTEM_CONFIG_ID}`)
      .then((response) => {

        setValue('maxMetano', response.data.maxMetano);
        setValue('maxCO2', response.data.maxCO2);
        setValue('maxPPM', response.data.maxPPM);

        setIsLoading(false);
      }
      )
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [setValue]);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Configuración</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}  onClick={handleSubmit(submitSettings)} >
          Guardar
        </Button>
      </Stack>

      <Card>
        <Stack direction="row" alignItems="center" justifyContent="space-between" p={5}>
          <FormControl>
            <FormLabel>Máximo valor de metano</FormLabel>
            <Controller
              name="maxMetano"
              control={control}
              defaultValue=""
              rules={{
                required: 'Por favor, ingrese el valor máximo de metano',
                
              }}
              render={({ field }) => (
                <TextField
                  sx={{ width: 300 }}
                  placeholder="Ingrese el valor máximo de metano"
                  {...field}
                  error={Boolean(errors.maxMetano)}
                  helperText={errors.maxMetano ? errors.maxMetano.message : ''}
                  type="number"
                />
              )}
            />
          </FormControl>
          <Iconify icon="mdi:arrow-top" width={40} height={40} sx={{ display: 'block', padding: '10px', borderRadius: '100%', backgroundColor: 'primary.main', color: 'white' }} />
          <FormControl>
            <FormLabel>Máximo valor de CO2</FormLabel>

            <Controller
              name="maxCO2"
              control={control}
              defaultValue=""
              rules={{
                required: 'Por favor, ingrese el valor máximo de CO2',
              }}
              render={({ field }) => (
                <TextField
                  sx={{ width: 300 }}
                  placeholder="Ingrese el valor máximo de CO2"
                  {...field}
                  error={Boolean(errors.maxCO2)}
                  helperText={errors.maxCO2 ? errors.maxCO2.message : ''}
                  type="number"

                />
              )}
            />
          </FormControl>
          <Iconify icon="mdi:arrow-top" width={40} height={40} sx={{ display: 'block', padding: '10px', borderRadius: '100%', backgroundColor: 'primary.main', color: 'white' }} />
          <FormControl>
            <FormLabel>Máximo valor de PPM</FormLabel>

            <Controller
              name="maxPPM"
              control={control}
              defaultValue=""
              rules={{
                required: 'Por favor, ingrese el valor máximo de PPM',
              }}
              render={({ field }) => (
                <TextField
                  sx={{ width: 300 }}
                  placeholder="Ingrese el valor máximo de PPM"
                  {...field}
                  error={Boolean(errors.maxPPM)}
                  helperText={errors.maxPPM ? errors.maxPPM.message : ''}
                  type="number"

                />
              )}
            />

          </FormControl>
        </Stack>

      </Card>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <ToastContainer />
    </Container>
  );
}
