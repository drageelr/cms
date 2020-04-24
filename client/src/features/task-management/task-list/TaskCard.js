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

export function TaskCard({taskId, index, taskData}) {

  const [open, setOpen] = useState(false)

  const statusId = taskData.tasks[taskId].status
  let taskStatusName = ""
  let taskStatusColor = ""

  taskData.taskStatuses.map(statObj => {
    if(statObj.id === statusId) {
      taskStatusName = statObj.name
      taskStatusColor = statObj.colorHex
    }
  })

  return (
    <Draggable draggableId={taskId} index={index}>
      {
        (provided) => (
          <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
            <Card 
              style={{
                minHeight: 85,
                minWidth: 0,
                marginBottom: 10,
              }}
              cursor="pointer"
              variant="outlined"
            >
              <CardContent>
                <Grid item xs container direction="row" spacing={0}>
                  <Grid item xs>
                    <Typography gutterBottom variant="h6">
                      {taskData.tasks[taskId].title} 
                    </Typography>
                  </Grid>  
                  {taskId[0] === 's' ? null : 
                  <Grid item> 
                    <EditIcon 
                      onClick={() => setOpen(true)} 
                      fontSize="small" 
                      color="action" 
                      cursor="pointer"
                    />
                    <EditTaskDialog open={open} setOpen = {setOpen} taskId={taskId}/>
                  </Grid>}
                </Grid>

                <Grid container direction="row" justify='space-between' alignItems="flex-end">
                  <Grid item>
                    <MenuItem>
                      <StopIcon fontSize="small" style={{fill: taskStatusColor, marginLeft:"-22%"}} />
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
          </div>
        )
      }
    </Draggable>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData,
})

export default connect(mapStateToProps) (TaskCard)