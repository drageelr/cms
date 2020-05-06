import React, {useState, useEffect} from 'react'
import { withStyles, makeStyles, useTheme} from '@material-ui/core/styles'
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogActions, DialogContent, DialogTitle, LinearProgress, Fab, Tooltip } from '@material-ui/core'
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
import { Typography } from '@material-ui/core';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.secondary.main,
  },
  body: {
    fontSize: 14,
  },
  title: {
    padding: theme.spacing(2),
    marginTop: 10,
    color: theme.palette.text.secondary
  },
  container: {
    maxHeight: '70%',
  },
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
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
  const theme = useTheme()
  const [isOpen,setIsOpen] = useState(false)

  const [editMode,setEditMode] = useState(false)
  const [editId, setEditId] = useState(-1)

  function EditDeleteMoreButton({statusId}) {
    const menusList=[
      {
        text: 'Edit',
        icon: <EditIcon/>,
        onClick: ()=>handleEdit(statusId)
      },
      {
        text: 'Delete',
        icon: <DeleteIcon/>,
        onClick: ()=>dispatch(deleteTaskStatus(statusId)),
      },
    ]
    return <MoreButton menusList={menusList}/>
  }

  function handleAdd(){
    setEditMode(false)  
    setIsOpen (true)
  }

  function handleEdit(statusId){
    setEditId(statusId)
    setEditMode(true)  
    setIsOpen (true)
  }

  function TaskStatusDialog(){
    let initialValues = {
      name: '',
      color: ''
    }

    if (editMode){
      const taskDetail = taskStatusDetails.taskList.find((task,index) =>{
        return task.statusId === editId
      })
      if (taskDetail != undefined){
        initialValues = {name:taskDetail.name, color: taskDetail.color}
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
              ? editTaskStatus(({id: editId, name: values.name, color: values.color}))
              : addTaskStatus({name: values.name, color: values.color}))
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
                    <Field component={TextField} name="color" required label="Color" helperText = "Enter Hex Value for Color (#000000)"/>    
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
      
      <TableContainer className={classes.container}>
      <Table className={classes.table} aria-label="customized table" stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow style={{background: theme.palette.action.hover}}>
            <TableCell >Task Status</TableCell>
            <TableCell align="center">Color</TableCell>
            <TableCell align="right">Options</TableCell>
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
              <Tooltip title="Task Status Color" placement="right-end">
                <Button variant="contained" style={{backgroundColor:taskStatusDetail.color}}/>
              </Tooltip>
              </StyledTableCell>

              <TableCell align="right">
                <div>
                  <EditDeleteMoreButton id={taskStatusDetail.statusId}/>
                </div>
              </TableCell>
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
