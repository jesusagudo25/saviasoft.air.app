import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

import ReadingFilters from './reading-filter';

// ----------------------------------------------------------------------

export default function ReadingTableToolbar({ filterName, onFilterName, userFilter, setUserFilter, dateRange, setDateRange }) {
  
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3)
      }}
    >
      <OutlinedInput
        value={filterName}
        onChange={onFilterName}
        placeholder="Buscar dispositivo..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />

      <ReadingFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            userFilter={userFilter}
            setUserFilter={setUserFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
    </Toolbar>
  );
}

ReadingTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  userFilter: PropTypes.object,
  setUserFilter: PropTypes.func,
  dateRange: PropTypes.object,
  setDateRange: PropTypes.func
};
