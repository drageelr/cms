import React, {useState} from 'react'
import EditTaskDialog from './EditTaskDialog'
import { Draggable } from "react-beautiful-dnd"
import { Card, CardContent, Typography, Grid, MenuItem } from '@material-ui/core'
import StopIcon from '@material-ui/icons/Stop'
import { connect } from 'react-redux'
import EditIcon from '@material-ui/icons/Edit'

export function TaskCard(props) {

  const { taskId, index, taskData } = props
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
                maxHeight: 85,
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