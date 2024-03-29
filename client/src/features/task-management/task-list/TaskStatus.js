import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Grid, Typography, FormControl, Select, MenuItem } from '@material-ui/core'
import StopIcon from '@material-ui/icons/Stop'

/**
  Renders a Select Menu, allowing the user to select one one of the available statuses. It stores
  statusId in the task and uses the Status Hex value to display a color along side the status name.

  @param {string} taskId Id of the current task 
  @param {object} taskData slice from redux containing data of all the currently active tasks
  @param {list} taskStatusDetails slice from redux containing data of all the currently active task statuses
*/

export function TaskStatus({taskId, taskData, setStatusId, taskStatusDetails}) {

  let defaultStatusId = -1
  let defaultStatusName = ""
  taskData.forEach(taskObj => {
    if (taskObj.taskId === taskId) {
      defaultStatusId = taskObj.statusId
    }
  })
  
  taskStatusDetails.forEach(statObj =>{
    if (statObj.statusId === defaultStatusId) {
      defaultStatusName = statObj.name
    }
  })

  const [statusCode, setStatusCode] = useState(defaultStatusName)
  const [open, setOpen] = useState(false)

  function handleChange(event) {
    var statusId = -1
    taskStatusDetails.forEach(statusObj => {
      if (statusObj.name === event.target.value) {
        statusId = statusObj.statusId
      }
    })
    setStatusId(statusId)
    setStatusCode(event.target.value)
  }

  function handleClose() {
    setOpen(false)
  }

  function handleOpen() {
    setOpen(true)
  }

  return (
    <Grid container direction="row" justify='flex-end' alignItems="flex-start">
    <Grid item>
      <Typography style={{padding:"0px 7px 0px 0px", marginLeft: 100}} gutterBottom variant="h6" color="inherit">
        Task Status:  
      </Typography>
    </Grid>
    <Grid item>
      <FormControl style={{minWidth: 120}}>
        <Select
          labelId="status-color-label"
          id="status-color"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={statusCode}
          onChange={handleChange}
          style={{height: 30, width: "100%"}}
          variant = "outlined"
        >
          <MenuItem value={defaultStatusName}>
            <em>None</em>
          </MenuItem>
          {
            taskStatusDetails.map(statusObj => (
                <MenuItem value={statusObj.name}>
                  <Grid container direction="row" justify= "flex-start" alignItems="center">
                    <Grid item>
                      <StopIcon fontSize="large" style={{fill: `${statusObj.color}`}} />
                    </Grid>
                    <Grid item>
                      {statusObj.name}
                    </Grid>                       
                  </Grid>
                </MenuItem>
              )
            )
          }
        </Select>
      </FormControl>
    </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData.taskList,
  taskStatusDetails: state.taskStatusDetails.taskList
})

export default connect(mapStateToProps)(TaskStatus)