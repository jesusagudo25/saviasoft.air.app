import PropTypes from 'prop-types';
import { es } from 'date-fns/locale';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import SearchUser from './search-user';

// ----------------------------------------------------------------------

export default function ReadingFilters({ 
    openFilter, 
    onOpenFilter, 
    onCloseFilter,  
    userFilter, 
    setUserFilter,
    dateRange,
    setDateRange,
}) {

  const renderUsers = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Usuarios</Typography>
      <FormGroup>
        <SearchUser userFilter={userFilter} setUserFilter={setUserFilter} />
      </FormGroup>
    </Stack>
  );

  const renderDate = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Rango de fechas</Typography>
      <Stack>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={es}
        >
          <DatePicker
            label="Desde"
            value={dateRange.from}
            onChange={(newValue) => {
              setDateRange({ ...dateRange, from: newValue });
            }}
            slotProps={{ textField: { size: 'small' } }}
            inputFormat="dd-MM-yyyy"
          />
        </LocalizationProvider>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 1 }}>
          <Iconify icon="eva:arrow-ios-forward-fill" />
        </Box>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={es}
        >
          <DatePicker
            label="Hasta"
            value={dateRange.to}
            onChange={(newValue) => {
              setDateRange({ ...dateRange, to: newValue });
            }}
            slotProps={{ textField: { size: 'small' } }}
            inputFormat="dd-MM-yyyy"
          />
        </LocalizationProvider>
      </Stack>
    </Stack>
  );

  const userRole = localStorage.getItem('role');

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        Filtros&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            Filtros
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>

            
            {userRole === 'ADMINISTRADOR' && renderUsers}

            {renderDate}
            
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
            onClick={() => {
              const role = localStorage.getItem('role');

              if(role === 'ADMINISTRADOR') {
                setUserFilter({ userId: '', userName: '' });
              }

              setDateRange({ from: null, to: null });
            }}
          >
            Limpiar todo
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

ReadingFilters.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  userFilter: PropTypes.object,
  setUserFilter: PropTypes.func,
  dateRange: PropTypes.object,
  setDateRange: PropTypes.func,
};