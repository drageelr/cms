import React, { useState } from 'react'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from "@material-ui/core/Grid"
import { Typography, Paper, Box, Card, DialogContentText, AppBar, Toolbar, IconButton, Slide, List, ListItem, Divider, ListItemText, FormControl, Select, InputLabel, makeStyles, Button } from '@material-ui/core'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'   
import ClearIcon from '@material-ui/icons/Clear'
import { addTaskAssignees, deleteTaskAssignee } from '../taskDataSlice'

function SimpleDialog(props) {

  const { onClose, open, taskData, taskId, dispatch } = props

  function handleClose() {
    onClose()
  }

  function handleListItemClick(value){
    console.log(value)
    dispatch(addTaskAssignees({value, taskId}))
    onClose(value)
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Choose Accounts</DialogTitle>
      <List>
        {taskData.users.map(assignee => (
          <ListItem button onClick={() => handleListItemClick(assignee)} key={assignee}>
            <ListItemText primary={assignee} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

export function AddAssignee({taskData, taskId, dispatch}) {
  const [open, setOpen] = useState(false)
  const [assigneeList, setAssigneeList] = useState([])

  function handleClickOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function handleDeleteAssignee(person) {
    assigneeList.map(currName => {
      if (currName === person) {
        var filteredAry = assigneeList.filter(function(e) { return e !== currName })
        setAssigneeList(filteredAry)
      }
    })
  }

  function handleClose(value) {
    setOpen(false)
  }

  function handleAssigneeDelete({person, taskId}) {
    dispatch(deleteTaskAssignee({person, taskId}))
  }

  return (
    <div>
      <Grid container style={{marginTop: 0, padding: 15}}>
        <Grid style={{marginTop: 10}} container direction="row" justify='flex-start' alignItems="flex-start">
          <Grid item>
            <Typography style={{padding:"0px 10px 0px 0px"}} gutterBottom variant="h6" color="inherit">
              Assignees:  
            </Typography>
          </Grid>
          <Grid>
            <Typography>
              <AddCircleOutlineIcon fontSize="large" onClick={handleClickOpen} cursor="pointer"/>
            </Typography>
          </Grid>
        </Grid>
        <SimpleDialog open={open} onClose={handleClose} taskData={taskData} taskId={taskId} dispatch={dispatch} />
      </Grid>
      
      {
        taskData.tasks[taskId].assList.length === 0 ? null : 
      taskData.tasks[taskId].assList.map(person => (
        <Grid  style={{padding: "5px 15px 15px 15px"}} container direction="column" justify='space-evenly' alignItems="flex-start">
          <Grid container direction="row">
            <Grid item style={{marginTop: 3, fontSize: 16}}>
              {person} 
            </Grid>                                                             
            <Grid item >
              <ClearIcon style={{marginLeft: 3}} onClick={() => {handleAssigneeDelete({person, taskId})}} fontSize="large" cursor="pointer"/>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </div>
  )

}

const mapStateToProps = (state) => ({
  taskData: state.taskData,
})

export default connect(mapStateToProps)(AddAssignee)
