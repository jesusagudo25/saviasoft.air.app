import { parse, isAfter, isEqual, isBefore } from 'date-fns';

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName, dateRange }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (device) => {
        const { 'nombre-dispositivo': nombreDispostivo } = device;
        const value = nombreDispostivo.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        return value;
      }
    );
  }

  if (dateRange.from || dateRange.to) {
     inputData = inputData.filter(
      (device) => {
        const { 'fecha-hora': fechaLectura } = device;
        

        const fechaLecturaDate = parse(fechaLectura.split(' ')[0], 'dd-MM-yyyy', new Date());
        const fromDate = dateRange.from ||  null;
        const toDate = dateRange.to || null;

        console.log(fechaLecturaDate, fromDate, toDate);
        let value = false;
        if(fromDate && toDate) {
          value = (isEqual(fechaLecturaDate, fromDate) || isAfter(fechaLecturaDate, fromDate)) && 
                  (isEqual(fechaLecturaDate, toDate) || isBefore(fechaLecturaDate, toDate));
        }
        else if(fromDate) {
          value = isEqual(fechaLecturaDate, fromDate) || isAfter(fechaLecturaDate, fromDate);
        }
        else if(toDate) {
          value = isEqual(fechaLecturaDate, toDate) || isBefore(fechaLecturaDate, toDate);
        }
        return value;
      }
    );
  }

  return inputData;
}
