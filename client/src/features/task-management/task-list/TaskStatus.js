import React from 'react'
import { connect } from 'react-redux'
import {changeTaskStatus} from "../taskDataSlice"
import { Grid, Typography, FormControl, Select, MenuItem } from '@material-ui/core'
import StopIcon from '@material-ui/icons/Stop'

/**
  Renders a Select Menu, allowing the user to select one one of the available statuses. It stores
  statusId in the task and uses the Status Hex value to display a color along side the status name.

  @param {string} taskId used to add assign a status for the task
  @param {object} taskData slice of the corresponding feature, used to populate the TaskStatuses Menu 
  @param {function} dispatch dispatch the change Task Status
*/

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
    <Grid container direction="row" justify='flex-end' alignItems="flex-start">
      <Grid item>
        <Typography style={{padding:"0px 0px 0px 0px", marginLeft: 100}} gutterBottom variant="h6" color="inherit">
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
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData
})

export default connect(mapStateToProps)(TaskStatus)