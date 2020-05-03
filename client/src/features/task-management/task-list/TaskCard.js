import React, {useState} from 'react'
import { connect } from 'react-redux'
import EditTaskDialog from './EditTaskDialog'
import { Draggable } from "react-beautiful-dnd"
import { Card, CardContent, Typography, Grid, MenuItem } from '@material-ui/core'
import StopIcon from '@material-ui/icons/Stop'
import EditIcon from '@material-ui/icons/Edit'

/**
  This component renders the cards in each column. Each Card displays some details about a task. 
  Essentially the Task Title, Task Id, Task Status and an edit icon which when clicked, opens the 
  edit dialog box.

  @param {string} taskId a unique taskId to access the tasks' details
  @param {number} index used to distinguish draggable cards 
  @param {object} taskData from the corresponding redux slice, to retrieve all the data related
  the a particular task and use it to populate the card 
*/

export function TaskCard({taskId, index, taskData, taskStatusDetails}) {

  const [open, setOpen] = useState(false)

  var statusId = -1
  taskData.taskList.map(taskObj => {
    if (taskId === taskObj.taskId) {
      statusId = taskObj.statusId
    }
  })

  let taskStatusName = ""
  let taskStatusColor = ""

  taskStatusDetails.map(statusObj => {
    if(statusObj.statusId === statusId) {
      taskStatusName = statusObj.name
      taskStatusColor = statusObj.color
    }
  })

  function renderSubTask() {
    return <Card style={{minHeight: 85, minWidth: 0, marginBottom: 10}} cursor="pointer" variant="outlined">
      <CardContent>
        <Grid item xs container direction="row" spacing={0}>
          <Grid item xs>
            {
              taskData.taskList.map(taskObj => {
                if (taskObj.taskId === taskId) {
                  return <Typography gutterBottom variant="h6"> {taskObj.description} </Typography>
                }
              })
            }
          </Grid>  
          <Grid>
            <Typography variant='body2'>
              {taskId}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  }

  function renderMainTask() {
    return <Card style={{minHeight: 85, minWidth: 0, marginBottom: 10}} cursor="pointer" variant="outlined">
      <CardContent>
        <Grid item xs container direction="row" spacing={0}>
          <Grid item xs>
            {
              taskData.taskList.map(taskObj => {
                if (taskObj.taskId === taskId) {
                  return (
                    <Typography gutterBottom variant="h6"> {taskObj.title} </Typography>
                  )
                }
              })
            }
          </Grid>  

          <Grid item> 
            <EditIcon onClick={() => setOpen(true)} fontSize="small" color="action" cursor="pointer"/>
            <EditTaskDialog open={open} setOpen = {setOpen} taskId={taskId}/>
          </Grid>
        </Grid>

        <Grid container direction="row" justify='space-between' alignItems="flex-end">
          <Grid item>
            <MenuItem>
              <StopIcon fontSize="small" style={{fill: taskStatusColor, marginLeft:"-22%"}} /> {/*if condition if no task status*/}
              {taskStatusName} 
            </MenuItem>
          </Grid>
          <Grid>
            <Typography variant='body2'>
              {taskId}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  }

  return (
    <Draggable draggableId={taskId} index={index}>
      {
        (provided) => (
          <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
            {(()=>{
              return taskId[0] === 's' ? renderSubTask() : renderMainTask()
            })()}
          </div>
        )
      }
    </Draggable>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData,
  taskStatusDetails: state.taskStatusDetails.taskList
})

export default connect(mapStateToProps) (TaskCard)