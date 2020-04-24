import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addTaskAssignees, deleteTaskAssignee } from '../taskDataSlice'
import { Typography, List, ListItem, ListItemText, Grid, Dialog, DialogTitle} from '@material-ui/core'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'   
import ClearIcon from '@material-ui/icons/Clear'

/**
  Allows the user to add multiple assignees to the task. Also the user can delete an assignee 
  from the task .

  @param {object} taskData used to access multiple objects from the state.
  @param {string} taskId used to add assignees to this task with this id only
  @param {function} dispatch dispatch the actions of adding and deleting an assignee from the task
*/


function SimpleDialog({ onClose, open, taskData, taskId, dispatch }) {

  function handleClose() {
    onClose()
  }

  function handleListItemClick(value){
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
        var filteredAry = assigneeList.filter(function(e) { return e != currName })
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
      <Grid style={{marginTop: 10, padding:15}} container direction="row" justify='flex-start' alignItems="flex-start">
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
      {
        taskData.tasks[taskId].assigneeList.length === 0 ? null : 
        taskData.tasks[taskId].assigneeList.map(person => (
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
