import React, { useState } from 'react'
import { Button, Dialog, TextField, DialogActions, Paper, Grid, Checkbox, FormControlLabel, Typography, FormControl, Select, Menu, MenuItem } from '@material-ui/core'
import { connect } from 'react-redux'
import { changeCheckStatus, addSubTaskToDashBoard } from '../taskDataSlice'
import SelectAssigneeButton from "./SelectAssigneeButton"

export function SubTask(props) {
  const {taskId, taskData, dispatch} = props

  const [check, setCheck] = useState(false)

  function handleCheckedBox({event, checkListObj}) {
    setCheck(event.target.checked)  
    var status = event.target.checked
    dispatch(changeCheckStatus({taskId, checkListObj, status}))
  }

  return (
    <div>
    {
      taskData.checkListItems.map(checkListObj => {
        if ((taskData.tasks[taskId].formDataId !== "") && taskData.tasks[taskId].formDataId === checkListObj.formId) { 
          return <Grid direction="row" justify="flex-start" alignItems="center">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox 
                      color='primary' 
                      checked={checkListObj.isChecked} 
                      value = {check}
                      onChange={(event) => {handleCheckedBox({event, checkListObj})}}
                    />
                  }
                  label={checkListObj.title}
                />
              </Grid>
              <Grid item >
                <SelectAssigneeButton taskId={taskId} checkListObj={checkListObj} />
              </Grid>
            </Grid>        
        }
      })
    }
    </div> 
  )
}

const mapStateToStates = (state) => ({
  taskData: state.taskData
})

export default connect(mapStateToStates)(SubTask)