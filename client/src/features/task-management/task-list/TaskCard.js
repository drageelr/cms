import React, {useState} from 'react'
import { connect } from 'react-redux'
import EditTaskDialog from './EditTaskDialog'
import { Draggable } from "react-beautiful-dnd"
import { Card, CardContent, Typography, Grid, Box } from '@material-ui/core'
import StopIcon from '@material-ui/icons/Stop'
import EditIcon from '@material-ui/icons/Edit'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { subTaskDisplay } from '../taskDataSlice'

/**
  This component renders the cards in each column. Each Card displays some details about a task. 
  Essentially the Task Title, Task Id, Task Status and an edit icon which when clicked, opens the 
  edit dialog box.

  @param {string} taskId a unique taskId to access the tasks' details
  @param {number} index used to distinguish draggable cards 
  @param {object} taskData from the corresponding redux slice, to retrieve all the data related
  the a particular task and use it to populate the card 
*/

export function TaskCard({taskId, index, taskData, taskStatusDetails, dispatch}) {
  const [open, setOpen] = useState(false)
  let taskStatusName = ""
  let taskStatusColor = ""
  let statusId = -1
  //get defaultDesc, defaultTitle, defaultOwner, submissionId from taskData
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
  }

  function SubTask() {
    return (
      (taskObj !== undefined && taskObj.check === true) &&
      <Card key={index} style={{minHeight: 85, minWidth: 0, marginBottom: 10}} cursor="pointer" variant="outlined">
        <CardContent>
          <Grid item xs container direction="row" spacing={0}>
            <Grid item xs>
              <Typography key={index} gutterBottom variant="h6"> {taskObj.description} </Typography>
            </Grid> 
            <Grid>
              <DeleteOutlineIcon onClick={handleSubTaskDisplay} cursor="pointer"/>
            </Grid>
          </Grid>
          <Grid direction="row-reverse">
            <Typography variant='body2'>
              {taskId}
            </Typography>
          </Grid>
        </CardContent>
      </Card>
    )
  }

  function MainTask() {
    return <Card elevation={3} style={{minHeight: 85, minWidth: 0, marginBottom: 10}} cursor="pointer" >
      <CardContent>
        <Grid item xs container direction="row" spacing={0}>
          <Grid item xs>
            {
              <Typography key={index} gutterBottom variant="h6"> {taskObj.title} </Typography>
            }
          </Grid>  

          <Grid item> 
            <EditIcon onClick={() => setOpen(true)} fontSize="small" color="action" cursor="pointer"/>
            <EditTaskDialog 
              editMode={true}
              open={open}
              setOpen={setOpen}
              isRequestTask={taskId[0]==="r"}
              taskId={taskId}/>
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
  taskStatusDetails: state.taskStatusDetails.taskList
})

export default connect(mapStateToProps) (TaskCard)