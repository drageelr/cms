import React, { useState } from 'react'
import { connect } from 'react-redux'
import { changeCheckStatus } from '../taskDataSlice'
import { Grid, Checkbox, FormControlLabel } from '@material-ui/core'
import SelectAssigneeButton from "./SelectAssigneeButton"

/**
  Displays a checklist of items that it receives in case a Form has been linked with this Task. 
  The checklist displays a checkbox, a short description and a "Select Assignee" button. The user
  can check and un-check the item as well as add a single assignee to the item.

  @param {string} taskId used for fetching formId for the task and render that form checklist
  @param {object} taskData from the corresponding redux slice, retrieve data related to the 
  task and the checklist 
  @param {function} dispatch to dispatch the action of changing the checklist checked
*/

export function SubTask({taskId, taskData, dispatch}) {

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
        if ((taskData.tasks[taskId].formDataId != "") && taskData.tasks[taskId].formDataId === checkListObj.formId) { 
          return (
          <div>
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
              <SelectAssigneeButton taskId={taskId} checkListObj={checkListObj} />
              </div>
          )
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