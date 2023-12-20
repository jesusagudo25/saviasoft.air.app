
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';



// ----------------------------------------------------------------------

export default function ReadingTableRow({
  row,
}) {

  const { 'nombre-dispositivo': deviceName, 'fecha-hora': timestamp, 'valor-methano': methaneValue, 'alerta-methano': methaneAlert, 'ppm': ppmValue, 'alerta-ppm': ppmAlert, 'co2': co2Value, 'alerta-co2': co2Alert, 'nombre-usuario': userName } = row;

  return (
    <TableRow hover>

      <TableCell component="th" scope="row">
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2" noWrap>
            {deviceName}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>{timestamp}</TableCell>

      <TableCell>
        <Label color={(methaneAlert && 'error') || 'success'}>{methaneValue}</Label>
      </TableCell>

      <TableCell>
        <Label color={(ppmAlert && 'error') || 'success'}>{ppmValue}</Label>
      </TableCell>

      <TableCell>
        <Label color={(co2Alert && 'error') || 'success'}>{co2Value}</Label>
      </TableCell>

      <TableCell>{userName}</TableCell>

    </TableRow>

  );
}

ReadingTableRow.propTypes = {
  row: PropTypes.object,
};
