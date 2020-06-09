import React, {useState} from 'react'
import { connect } from 'react-redux'
import EditTaskDialog from './EditTaskDialog'
import { Draggable } from "react-beautiful-dnd"
import { Card, CardContent, Typography, Grid, Box, Tooltip} from '@material-ui/core'
import StopIcon from '@material-ui/icons/Stop'
import EditIcon from '@material-ui/icons/Edit'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { subTaskDisplay, deleteSubTask, setCurrTaskId, setTaskEditMode, setIsRequestTask } from '../taskDataSlice'

/**
  This component renders the cards in each column. Each Card displays some details about a task. 
  The cards are of 2 types: 
  Task Card,
  SubTask
  Essentially the Task Title, Task Id, Task Status and an edit icon which when clicked, opens the 
  edit dialog box.

  @param {string} taskId a unique taskId to access the tasks' details
  @param {number} index used to distinguish draggable cards 
  @param {object} taskData from the corresponding redux slice, to retrieve all the data related
  the a particular task and use it to populate the card 
  @param {object} taskStatusDetails from the corresponding redux slice, to retrieve the task statuses that 
  are assigned to a task, along with the hex color values
*/

export function TaskCard({taskId, index, taskData, taskStatusDetails, dispatch}) {
  // const [open, setOpen] = useState(false)
  let taskStatusName = ""
  let taskStatusColor = ""
  let statusId = -1
  const taskObj = taskData.taskList.find(taskObj => taskObj.taskId === taskId)

  if (taskObj !== undefined) { // if found
    statusId = taskObj.statusId
  }

  taskStatusDetails.forEach(statusObj => {
    if(statusObj.statusId === statusId) {
      taskStatusName = statusObj.name
      taskStatusColor = statusObj.color
    }
  })

  function handleSubTaskDisplay() {
    dispatch(subTaskDisplay({taskId}))
    
    let mainTaskId = -1 // the request task to which the sub task is associated
    taskData.taskList.map(taskObj => {
      if (taskObj.taskId === taskId) {
        mainTaskId = taskObj.assTaskId
      }
    })
    taskData.taskList.map(taskObj => {
      if (taskObj.taskId === mainTaskId) {
        dispatch(deleteSubTask({mainTaskId, taskId, subTaskList: taskObj.subtasks}))
      }
    })
  }

  function SubTask() {
    return (
      (taskObj !== undefined && taskObj.check !== true) &&
      <Card height="10%" key={index} style={{marginBottom: 10}} cursor="pointer" variant="outlined">
        <CardContent>
          <Grid item xs container direction="row" spacing={0}>
            <Grid item xs>
              <Typography key={index} gutterBottom variant="subtitle1"> {taskObj.description} </Typography>
            </Grid> 
            <Grid>
              <Tooltip title="Delete SubTask" placement="bottom-end"> 
                <DeleteOutlineIcon onClick={handleSubTaskDisplay} cursor="pointer"/>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container direction="row" justify='space-between' alignItems="flex-end">
            <Grid>
              <Typography variant='subtitle2'>
                {"Task ID: "}
                {taskObj.assTaskId}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant='subtitle2'>
                {taskId}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }

  function handleEditTaskDialog() {
    dispatch(setCurrTaskId({taskId}))
    dispatch(setIsRequestTask({isRequestTask: taskId[0] === "r"}))
    dispatch(setTaskEditMode({taskEditMode: "edit"}))
  }

  function MainTask() {
    return (
      (taskObj !== undefined && taskObj.archive === false) &&
      <Card elevation={3} style={{minHeight: 85, minWidth: 0, marginBottom: 10}}  cursor="pointer" >
        <CardContent >
          <Grid item xs container direction="row" spacing={0}>
            <Grid item xs>
              {
                <Typography key={index} gutterBottom variant="h6"> {taskObj.title} </Typography>
              }
            </Grid>  

            <Grid item>
              <Tooltip title="Edit Task" placement="bottom-end"> 
                <EditIcon onClick={handleEditTaskDialog} fontSize="small" color="action" cursor="pointer"/>
              </Tooltip>
            </Grid>
          </Grid>

          <Grid container direction="row" justify='space-between' alignItems="flex-end">
            <Grid item>
              <Box fontSize={12}>
                <StopIcon fontSize="small" style={{fill: taskStatusColor, marginBottom: -4}} /> {/*if condition if no task status*/}
                {taskStatusName} 
              </Box>
            </Grid>
            <Grid>
              <Typography variant='subtitle2'>
                {taskId}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )  
  }

  return (
    <Draggable draggableId={taskId} index={index}>
      {
        (provided) => (
          <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
            {
              taskId[0] === 's' 
              ? <SubTask/> 
              : <MainTask/>
            }
          </div>
        )
      }
    </Draggable>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData,
  taskStatusDetails: state.taskStatusDetails.taskList,
})

export default connect(mapStateToProps) (TaskCard)