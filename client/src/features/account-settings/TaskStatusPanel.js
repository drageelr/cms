import React, {useState, useEffect} from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogActions, DialogContent, DialogTitle, LinearProgress, Fab } from '@material-ui/core'
import {addTaskStatus,editTaskStatus,deleteTaskStatus,fetchTaskStatus} from './taskStatusDetailsSlice'
import {connect} from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import MoreButton from '../../ui/MoreButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import {clearError} from './taskStatusDetailsSlice'
import ErrorSnackbar from '../../ui/ErrorSnackbar'
import PanelBar from './PanelBar'

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}))(TableRow)

const useStyles = makeStyles((theme)=>({
  table: {
    minWidth: 600,
  },
  margin: {
    margin: theme.spacing(1),
  },
}))

/**
  The TaskStatusPanel consists of buttons to add new task statuses or 
  add/delete existing ones.

  @param {String} taskStatusDetails for task status to be added 
 */

function TaskStatusPanel({taskStatusDetails,dispatch}){
  
  useEffect(() => {dispatch(fetchTaskStatus())},[])

  const classes = useStyles()
  const [isOpen,setIsOpen] = useState(false)

  const [editMode,setEditMode] = useState(false)
  const [editId, setEditId] = useState(-1)

  function EditDeleteMoreButton({id}) {
    console.log("sending id: ", id)
    const menusList=[
      {
        text: 'Edit',
        icon: <EditIcon/>,
        onClick: ()=>handleEdit(id)
      },
      {
        text: 'Delete',
        icon: <DeleteIcon/>,
        onClick: ()=>dispatch(deleteTaskStatus(id)),
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
        return task.statusId === editId
      })
      if (taskDetail != undefined){
        initialValues = {name:taskDetail.name,color: taskDetail.color}
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
                <Fab onClick={submitForm} color="primary" variant="extended" size = "large">
                  Save
                </Fab>
                
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
      <PanelBar handleAdd={handleAdd} title={`Task Statuses (${taskStatusDetails.taskList.length})`} buttonText="Add New Task Status"/>
      <TaskStatusDialog/>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table" stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Task Status</StyledTableCell>
            <StyledTableCell align="center">Color</StyledTableCell>
            <StyledTableCell align="right">Options</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
          {taskStatusDetails.taskList !== undefined &&
          taskStatusDetails.taskList.map((taskStatusDetail,index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {taskStatusDetail.name}
              </StyledTableCell>
              <StyledTableCell align="center">
                <Button variant="contained" style={{backgroundColor:taskStatusDetail.color}}/>

              </StyledTableCell>

              <StyledTableCell align="right">
                {/* {console.log("id pressed: ", taskStatusDetail.statusId)} */}
                <EditDeleteMoreButton id={taskStatusDetail.statusId}/>
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
