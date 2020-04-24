import React, { useState } from 'react'
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

import {addSocietyAccount} from './societyDataSlice'
import {Link} from 'react-router-dom'

import Container from '@material-ui/core/Container';

import {connect} from 'react-redux'

// import AddEditSocietyDialog from './AddEditSocietyDialog'

///////////////////////////////////////////////////////////////////
const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '60%',
  },
});

function SocietyAccountsPanel({societyData,dispatch}) {

  // const classes = useStyles();
  // const [isOpen,setIsOpen] = useState(false)



  // const [isOpen,setIsOpen] = useState(false)
  // function handleClick(event){  
  //   setIsOpen (true)
  //   // return <AddEditSocietyDialog isOpen = {isOpen}/>
  //     // dispatch(addSocietyAccount(event.target.value))
  // }
  
  // function handleOpen(){  
  //   setIsOpen (true)
  // }


  // function TaskStatusDialog(){
  //   function handleClose(){
  //     setIsOpen(false)
  //   };
  
  //   return (
  //     <Dialog
  //       open={isOpen}
  //       onClose={handleClose}
  //       // PaperComponent={PaperComponent}
  //       aria-labelledby="draggable-dialog-title"
  //       >
  //       <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
  //         Add Task Status
  //       </DialogTitle>

  //       <Formik
  //         validateOnChange={false} validateOnBlur={true}
  //         initialValues={{
  //           nameInitials: "LUMUN",
  //           name: "LUMS model united nations",
  //           email: "lumun@lums.edu.pk",
  //           presidentEmail: "zozo@gmail.com",
  //           patronEmail: "hamza@gmail.com",
  //         }}
  //         validate={values => {
  //           const errors = {}
  //           return errors
  //         }}
  //         onSubmit={(values) => {
  //             dispatch(addTaskStatus({name: values.name, colorHex: values.colorHex}))
  //             handleClose()
  //         }}
  //       >
  //         {({submitForm}) => (
  //           <Form>
  //             <DialogContent>
  //               <Grid container direction = "column" justify = "center" alignItems = "center" style = {{width: 400}}>
  //                 <Grid item style = {{width: 350}}>
  //                   <Field component={TextField} name="name" required label="Name"/>
  //                 </Grid>
                  
  //                 <Grid item style = {{width: 350}}>
  //                   <Field component={TextField} name="colorHex" required label="Color" helperText = "Enter Hex Value for Color (#000000)"/>    
  //                 </Grid>
  //               </Grid>
  //             </DialogContent>
  //             <DialogActions>
  //               <Button onClick={submitForm} color="primary">
  //                 Save
  //               </Button>
                
  //               <Button autoFocus onClick={handleClose}>
  //                 Cancel
  //               </Button>
  //             </DialogActions>
  //           </Form>
  //         )}
  //       </Formik>        
  //     </Dialog>
  //   )
  // }


  const classes = useStyles();
  
  return (
    <div>
      <h2>SocietyAccountsPanel</h2>
      <Button
      variant="contained" 
      color="primary" 
      spacing= '10' 
      style = {{float: "right", marginBottom:10}}
      // onClick = {handleClick}
      value = {10}
      >Add society
      {/* *need to add a link so if person clicks it route to add/edit dialog box" */}
      </Button>
      {/* {isOpen? <AddEditSocietyDialog/> : null}       */}
      {/* <SocietyAccountCard /> */}
      <Container>
      {/* <AddEditSocietyDialog isOpen = {isOpen}/> */}
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
        {societyData.map((societyData,index) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              {societyData.name}
            </TableCell>
            <TableCell align="right">{societyData.name}</TableCell>
            <TableCell align="right">{societyData.email}</TableCell>
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
  societyData: state.societyData,
})

export default connect(mapStateToProps) (SocietyAccountsPanel)