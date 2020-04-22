import React from 'react'
// import SocietyAccountCard from './SocietyAccountCard'
////////////////////////////////////////////////////////////////
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Button } from '@material-ui/core';

import {addSocietyAccount} from './societyPanelSlice'
import {Link} from 'react-router-dom'

import Container from '@material-ui/core/Container';
/////////////////////////////////////////////////////////////////
//now need to fetch data

import {connect} from 'react-redux'

///////////////////////////////////////////////////////////////////
const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '60%',
  },
});

const columns = [
  { id: 'init', label: 'Initials', minWidth: 170 }, //inits ka object
  { id: 'name', label: 'Society Name', minWidth: 100 }, //name ka object
  {
    id: 'email',
    label: 'Email Address',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString(),
  }//email ka object
];

const rows = [
  createData('LUMUN', 'LUMS Model United Nations', "lumun@lums.edu.pk"),
  createData('LARTS', 'LUMS Arts Society', "larts@lums.edu.pk"),
  createData('LES', 'LUMS ES', "LES@lums.edu.pk"),
];

//action->returning the object of data it recei
function createData(init, name, email) {
  return { init, name, email};
}

function SocietyAccountsPanel({societyData,dispatch}) {

  function handleClick(event){
    dispatch(addSocietyAccount(event.target.value))
  }
  
  const classes = useStyles();
  
  return (
    <div>
      <h2>SocietyAccountsPanel</h2>
      <Button
      // component = {AddEditSocietyDialog} 
      variant="contained" 
      color="primary" 
      spacing= '10' 
      style = {{float: "right", marginBottom:10}}
      onClick = {handleClick}
      value = {10}
      >Add society
      {/* *need to add a link so if person clicks it route to add/edit dialog box" */}
      </Button>
      
      {/* <SocietyAccountCard /> */}
      <Container>

      <Paper className={classes.root} style={{maxHeight: 450, overflow: 'auto'}}>
      <TableContainer className={classes.container}>
      <Table>
      <TableHead >
          <TableRow>
            <TableCell style = {{position: 'sticky', top: 0}}>Initials</TableCell>
            <TableCell align="right" style = {{position: 'sticky', top: 0}}>Society Name</TableCell>
            <TableCell align="right" style = {{position: 'sticky', top: 0}}>Society Email</TableCell>  
          </TableRow>
        </TableHead>
          
        <TableBody>
        {rows.map((row) => (
          <TableRow key={row.init}>
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="right">{row.name}</TableCell>
            <TableCell align="right">{row.email}</TableCell>
          </TableRow>
        ))}
        </TableBody>
          
      </Table>
      </TableContainer>
      </Paper>
      </Container>
    </div>
    )
}


const mapStateToProps = (state) => ({
  societyData: state.societyPanelData,
})

export default connect(mapStateToProps) (SocietyAccountsPanel)
