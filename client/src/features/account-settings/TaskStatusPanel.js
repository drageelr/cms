import React, {useState, useEffect} from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Grid } from '@material-ui/core'
import {addTaskStatus,editTaskStatus,deleteTaskStatus,fetchTaskStatus} from './taskStatusDetailsSlice'

import {connect} from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'

import MoreButton from '../../ui/MoreButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import {login, clearError} from './taskStatusDetailsSlice'
import ErrorSnackbar from '../../ui/ErrorSnackbar'

import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress'

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow)

const useStyles = makeStyles({
  table: {
    minWidth: 600,
  },
})

function TaskStatusPanel({taskStatusDetails,dispatch}){

  useEffect(() => {dispatch(fetchTaskStatus())},[])
  // console.log(societyData)

  const classes = useStyles()
  const [isOpen,setIsOpen] = useState(false)

  const [editMode,setEditMode] = useState(false)
  const [editId, setEditId] = useState(-1)

  function EditDeleteMoreButton({id}) {
    const menusList=[
      {
        text: 'Edit',
        icon: <EditIcon/>,
        onClick: ()=>handleEdit(id)
      },
      {
        text: 'Delete',
        icon: <DeleteIcon/>,
        onClick: ()=>dispatch(deleteTaskStatus({id})),
      },
    ]
    return <MoreButton menusList={menusList}/>
  }

  function handleAdd(){
    setEditMode(false)  
    setIsOpen (true)
  }

  function handleEdit(id){
    setEditId(id)
    setEditMode(true)  
    setIsOpen (true)
  }

  function TaskStatusDialog(){
    let initialValues = {
      name: '',
      colorHex: ''
    }

    if (editMode){
      const taskDetail = taskStatusDetails.taskList.find((task,index) =>{
        return task.id === editId
      })
      if (taskDetail != undefined){
        initialValues = {name:taskDetail.name,colorHex: taskDetail.colorHex}
      }  
    }

    function handleClose(){
      setIsOpen(false)
    }

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        // PaperComponent={PaperComponent}
        aria-labelled by="draggable-dialog-title"
        >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {editMode ? "Edit Task Status" : "Add Task Status"}
        </DialogTitle>

        <Formik
          validateOnChange={false} validateOnBlur={true}
          initialValues={initialValues}
          validate={values => {
            const errors = {}
            return errors
          }}
          onSubmit={(values,{setSubmitting}) => {
            // (taskStatusDetails.isPending) ? <CircularProgress/>
            dispatch(editMode 
              ?editTaskStatus(({id: editId, name: values.name, colorHex: values.colorHex}))
              :addTaskStatus({name: values.name, colorHex: values.colorHex}))
              .then(()=>{
                setSubmitting(false)
              })
            handleClose()
          }}
        >
          {({submitForm, isSubmitting}) => (
            <Form>
              <DialogContent>
                <Grid container direction = "column" justify = "center" alignItems = "center" style = {{width: 400}}>
                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="name" required label="Name"/>
                  </Grid>
                  
                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="colorHex" required label="Color" helperText = "Enter Hex Value for Color (#000000)"/>    
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={submitForm} color="primary">
                  Save
                </Button>
                
                <Button autoFocus onClick={handleClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
        {/* <ErrorSnackbar stateError={taskStatusDetails.error} clearError={clearError} />    */}
      </Dialog>
    )
  }


  
  return (
    <div>
    {
    taskStatusDetails.isPending? <LinearProgress variant = "indeterminate"/>:
    <div>
    
      <div style={{float : 'right', marginRight : 10, marginTop: 3, marginBottom: 10}}>
        <Fab 
          variant="extended" 
          color="secondary" 
          float = "right"
          onClick = {handleAdd}
        >
          <AddIcon/>
          Add Task Status
        </Fab>
        <TaskStatusDialog/>
      </div>

      <h3 style = {{textAlign: 'center', fontSize: 20}}>Task Status Panel </h3>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Task Status</StyledTableCell>
            <StyledTableCell align="center">Color</StyledTableCell>
            <StyledTableCell align="right">Options</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {taskStatusDetails.taskList.map((taskStatusDetail,index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {taskStatusDetail.name}
              </StyledTableCell>
              <StyledTableCell align="center">
                <Button variant="contained" style={{backgroundColor:taskStatusDetail.colorHex}}/>

              </StyledTableCell>

              <StyledTableCell align="right">
                <EditDeleteMoreButton id={taskStatusDetail.id}/>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>

    </div>
    }
    <ErrorSnackbar stateError={taskStatusDetails.error} clearError={clearError} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  taskStatusDetails: state.taskStatusDetails,
})

export default connect(mapStateToProps) (TaskStatusPanel)
