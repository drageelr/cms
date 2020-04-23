import React, { useState } from 'react'
import { connect } from 'react-redux'
import {changeTaskStatus} from "../taskDataSlice"
import { Grid, Typography, FormControl, Select, MenuItem } from '@material-ui/core'
import StopIcon from '@material-ui/icons/Stop'

export function TaskStatus({taskId, taskData, dispatch}) {

  const [open, setOpen] = React.useState(false)
  const [status, setStatus] = React.useState("")

  function handleChange(e) {
    setStatus(e.target.value)
    var status= e.target.value
    dispatch(changeTaskStatus({taskId, status}))
  }

  function handleOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  return (
    <Grid>
      <Grid container direction="row" justify='flex-start' alignItems="flex-start">
        <Grid item>
          <Typography style={{padding:"0px 10px 0px 0px"}} gutterBottom variant="h6" color="inherit">
            Task Status:  
          </Typography>
        </Grid>
        <Grid item>
          <FormControl>
            <Select
              labelId = "status-label"
              id="label"
              open = {open}
              onClose={handleClose}
              value={status}
              onOpen={handleOpen}
              onChange={handleChange}
              style={{height: 30, width: 100}}
              variant = "outlined"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {taskData.taskStatuses.map(colorStatus => {
                return <MenuItem value={colorStatus.name}>
                  <Grid container direction="row" justify= "flex-start" alignItems="center">
                    <Grid item>
                      <StopIcon fontSize="large" style={{fill: `${colorStatus.colorHex}`}} />
                    </Grid>
                    <Grid item>
                      {colorStatus.name}
                    </Grid>
                  </Grid>
                </MenuItem>
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid> 
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData
})

export default connect(mapStateToProps)(TaskStatus)