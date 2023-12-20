import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Backdrop from '@mui/material/Backdrop';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../reading-no-data';
import ReadingTableRow from '../reading-table-row';
import TableEmptyRows from '../reading-empty-rows';
import ReadingTableHead from '../reading-table-head';
import ReadingTableToolbar from '../reading-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function ReadingPage() {

  const [readings, setReadings] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('desc');

  const [orderBy, setOrderBy] = useState('fecha-hora');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isLoading, setIsLoading] = useState(false);

  /* Datatable methods */

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
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

  /* DateRangePicker */
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const dataFiltered = applyFilter({
    inputData: readings,
    comparator: getComparator(order, orderBy),
    filterName,
    dateRange
  });

  const notFound = !dataFiltered.length && !!filterName;

  /* UserAutocomplete */

  const userId = localStorage.getItem('id');
  const role = localStorage.getItem('role');

  const [userFilter, setUserFilter] = useState({
    userId: role === 'ADMINISTRADOR' ? '' : userId,
    userName: '',
  });

  useEffect(() => {
    const getReadingsForUser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_CLOUD_GATEWAY}${import.meta.env.VITE_MICRO_COLLECTION}/air-quality-measurement?userId=${userFilter.userId}`);
        setReadings(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    if (userFilter.userId !== '') getReadingsForUser();
    else if (userFilter.userId === '' && userFilter.userName === '') getReadingsForUser();
  }, [userFilter]);


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Lecturas</Typography>

      </Stack>

      <Card>
        <ReadingTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
          userFilter={userFilter}
          setUserFilter={setUserFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ReadingTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'nombre-dispositivo', label: 'Dispositivo' },
                  { id: 'fecha-hora', label: 'Fecha' },
                  { id: 'valor-methano', label: 'Metano' },
                  { id: 'ppm', label: 'PPM' },
                  { id: 'co2', label: 'CO2' },
                  { id: 'nombre-usuario', label: 'Usuario' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ReadingTableRow
                      key={row.id}
                      row={row}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, readings.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={readings.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Card>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}
