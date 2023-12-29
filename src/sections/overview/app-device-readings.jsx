import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function AppDeviceReadings({ title, subheader, series, labels, ...other }) {

  const chartOptions = useChart({
    tooltip: {
      shared: true,
      intersect: false
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
        borderRadius: 2,
        dataLabels: {
          position: 'top',
        },
      },
    },
    
    xaxis: {
      categories: labels, 
    },
  });

  return (
    <Card {...other} sx={{ height: '100%', overflow: 'visible' }}>
      
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }}>
        <Chart
          type="bar"
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

AppDeviceReadings.propTypes = {
  labels: PropTypes.array,
  series: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};