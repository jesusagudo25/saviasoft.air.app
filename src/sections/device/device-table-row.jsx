import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

const ButtonSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));


// ----------------------------------------------------------------------

export default function DeviceTableRow({
  row,
  setIsLoading,
  devices,
  setDevices,
  id,
  setItemSelected,
  toastifyMessage,
  setValue,
  setOpenModalDevice
}) {
  const [open, setOpen] = useState(null);

  const { name, location, serialNumber, uid, status } = row;

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover>

        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Label color={(serialNumber && 'success') || 'error'}>{serialNumber || 'N/A'}</Label>
        </TableCell>

        <TableCell>{location || 'N/A'}</TableCell>

        <TableCell>{uid || 'N/A'}</TableCell>

        <TableCell>
          <ButtonSwitch checked={status} inputProps={{ 'aria-label': 'ant design' }} onClick={
            async () => {
              setIsLoading(true);
              if(status) {
                toastifyMessage('El estado del dispositivo ha cambiado a inactivo', 'success');
              } else {
                toastifyMessage('El estado del dispositivo ha cambiado a activo', 'success');
              }
              setDevices(devices.map((device) => device.id === id ? { ...device, status: !status } : device));
              await axios.patch(`${import.meta.env.VITE_MICRO_ENTITY}/devices/${id}/status`, {
                status: !status
              });
              setIsLoading(false);
            }
          } />
        </TableCell>


        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 200, py: 1, px: 0 },
        }}
      >
        <MenuItem onClick={ () => {
          setItemSelected(id);
          setOpenModalDevice(true);
          setValue('name', name);
          setValue('location', location);
          setValue('serialNumber', serialNumber);

          handleCloseMenu();
        }
        }>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

      </Popover>
    </>
  );
}

DeviceTableRow.propTypes = {
  row: PropTypes.object,
  status: PropTypes.string,
  setIsLoading: PropTypes.func,
  devices: PropTypes.array,
  setDevices: PropTypes.func,
  id: PropTypes.any,
  setItemSelected: PropTypes.func,
  toastifyMessage: PropTypes.func,
  setValue: PropTypes.func,
  setOpenModalDevice: PropTypes.func,

};
