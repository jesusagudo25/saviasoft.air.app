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

export default function UserTableRow({
  firstName,
  lastName,
  email,
  role,
  status,
  setIsLoading,
  users,
  setUsers,
  id,
  setItemSelected,
  toastifyMessage,
  setValue,
  setOpenModalUser,
  setOpenModalPassword,
}) {
  const [open, setOpen] = useState(null);

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
              {firstName} {lastName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>
          <Label color={(role === 'CUSTOMER' && 'error') || 'success'}>{role}</Label>
        </TableCell>

        <TableCell>
          <ButtonSwitch checked={status} inputProps={{ 'aria-label': 'ant design' }} onClick={
            async () => {
              setIsLoading(true);
              if(status) {
                toastifyMessage('Status changed successfully', 'success');
              } else {
                toastifyMessage('Status changed successfully', 'error');
              }
              setUsers(users.map((user) => user.id === id ? { ...user, status: !status } : user));
              await axios.patch(`${import.meta.env.VITE_MICRO_SECURTY}/users/${id}/status`, {
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
          setOpenModalUser(true);
          setValue('firstName', firstName);
          setValue('lastName', lastName);
          setValue('email', email);
          setValue('role', role);

          handleCloseMenu();
        }
        }>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={()=>{
          setItemSelected(id);
          setOpenModalPassword(true);
        }} sx={{ color: 'error.main' }}>
          <Iconify icon="mdi:password" sx={{ mr: 2 }} />
          Change Password
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  firstName: PropTypes.any,
  lastName: PropTypes.any,
  role: PropTypes.any,
  email: PropTypes.any,
  status: PropTypes.string,
  setIsLoading: PropTypes.func,
  users: PropTypes.array,
  setUsers: PropTypes.func,
  id: PropTypes.any,
  setItemSelected: PropTypes.func,
  toastifyMessage: PropTypes.func,
  setValue: PropTypes.func,
  setOpenModalUser: PropTypes.func,
  setOpenModalPassword: PropTypes.func,
};
