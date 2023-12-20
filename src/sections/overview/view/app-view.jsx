import axios from 'axios';
import { useState, useEffect } from 'react';

import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import AppDeviceReadings from '../app-device-readings';


// ----------------------------------------------------------------------

export default function AppView() {

  const [chartSeries, setChartSeries] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('id');

  /* API */
  useEffect(() => {
    const getReadings = async () => {
      setIsLoading(true);
      try {
        if (role.includes('ADMINISTRADOR')) {
          const response = await axios.get(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_COLLECTION}/air-quality-measurement/top5`);

          const dataResponse = response.data.map((item) => {
            const { 'valor-methano': methane, ppm, co2, 'nombre-dispositivo': label } = item;
            return { methane, ppm, co2, label };
          });

          const methaneSeries = dataResponse.map((item) => item.methane);
          const ppmSeries = dataResponse.map((item) => item.ppm);
          const co2Series = dataResponse.map((item) => item.co2);
          const labelSeries = dataResponse.map((item) => item.label);

          const series = [];
          series.push({ 
            name: 'Metano',
            data: methaneSeries });
          series.push({ 
            name: 'PPM',
            data: ppmSeries });
          series.push({ 
            name: 'CO2',
            data: co2Series });
          setChartSeries(series);
          setChartLabels(labelSeries);
          setIsLoading(false);
          setIsComplete(true);

        } else {
          const response = await axios.get(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_COLLECTION}/air-quality-measurement/top5?userId=${userId}`);
          const dataResponse = response.data.map((item) => {
            const { 'valor-methano': methane, ppm, co2, 'nombre-dispositivo': label } = item;
            return { methane, ppm, co2, label };
          });

          const methaneSeries = dataResponse.map((item) => item.methane);
          const ppmSeries = dataResponse.map((item) => item.ppm);
          const co2Series = dataResponse.map((item) => item.co2);
          const labelSeries = dataResponse.map((item) => item.label);

          const series = [];
          series.push({ 
            name: 'Metano',
            data: methaneSeries });
          series.push({ 
            name: 'PPM',
            data: ppmSeries });
          series.push({ 
            name: 'CO2',
            data: co2Series });
          setChartSeries(series);
          setChartLabels(labelSeries);
          setIsLoading(false);
          setIsComplete(true);
        }

      } catch (error) {
        console.log(error);
      }
    }

    getReadings();
  }, [role, userId]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hola, bienvenido 👋
      </Typography>

      <Grid xs={12} md={6} lg={8}>
        {
          isComplete && (
            <AppDeviceReadings
              title="Mayores lecturas de dispositivos"
              subheader="Gráfica"
              series={chartSeries}
              labels={chartLabels}
            />
          )
        }
      </Grid >

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}
