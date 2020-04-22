import React from 'react'
import TaskStatusCard from './TaskStatusCard'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import NavigationIcon from '@material-ui/icons/Navigation';


//styling
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 600,
  },
});

//data creation
function createData(name, color, edit_delete) {
  return {name, color, edit_delete};
}

const rows = [
  createData('In-Progress', '#FF0000', 6.0),
  createData('In-Progress', '#FF0000', 9.0),
  createData('In-Progress', '#FF0000', 16.0),
  createData('In-Progress', '#FF0000', 3.7),
  createData('In-Progress', '#FF0000', 16.0),
];

{/* <Button variant="contained" color={row.color} disableElevation>

</Button> */}
export default function TaskStatusPanel() {
  const classes = useStyles();

  return (
  <div>
    <div style={{float : 'right', marginRight : 10, marginTop: 3, marginBottom: 10}}>
      <Fab variant="extended" color="secondary" float = "right">
        <AddIcon/>
        Add Task status
      </Fab>
    </div>
    <h3 style = {{textAlign: 'center', fontSize: 20}}>Task Status Panel </h3>
    <TableContainer component={Paper}>
    <Table className={classes.table} aria-label="customized table">
      <TableHead>
        <TableRow>
          <StyledTableCell>Task Status</StyledTableCell>
          <StyledTableCell align="center">Color</StyledTableCell>
          <StyledTableCell align="right">Edit/Delete Option</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <StyledTableRow key={row.name}>
            <StyledTableCell component="th" scope="row">
              {row.name}
            </StyledTableCell>
            {/* ///////////////////////////need to do color picker option */}
            <StyledTableCell align="center">
              <Button variant="contained" color="primary" backgroundColor="#0000FF"/>            
            </StyledTableCell>
            <StyledTableCell align="right">
              <Fab color="primary" aria-label="add" variant="extended" size="medium">
                  <NavigationIcon />
              </Fab>
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
    </TableContainer>

  </div>
  )
}
