import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { changeCheckStatus, createSubTask, fetchCheckList } from '../taskDataSlice'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import SelectAssigneeButton from "./SelectAssigneeButton"

/**
  Displays a checklistItems of items that it receives in case a Form has been linked with this Task. 
  The checklistItems displays a checkbox, a short description and a "Select Assignee" button. The user
  can check and un-check the item as well as add a single assignee to the item.

  @param {string} taskId used for fetching formId for the task and render that form checklistItems
  @param {object} taskData from the corresponding redux slice, retrieve data related to the 
  task and the checklistItems 
  @param {function} dispatch to dispatch the action of changing the checklistItems checked
*/

export function CheckList({taskId, taskData, dispatch}) {

  // useEffect(() => { 
  //   dispatch(fetchCheckList())
  // }, [])

  const [check, setCheck] = useState(false)

  let submissionId = -1
  taskData.taskList.map(taskObj => { // get the submissionId associated to the task
    if (taskObj.taskId === taskId) {
      submissionId = taskObj.submissionId
    }
  })

  function handleCheckedBox({event, checkListObj}) {
    setCheck(event.target.checked)
    var status = event.target.checked
    var subTaskDesc = checkListObj.description
    dispatch(changeCheckStatus({taskId, checkListObj, submissionId, status})) // CALL EDIT API
    dispatch(createSubTask({taskId, subTaskDesc}))
  }

  return (
    <div>
      {taskData.checkList.map(checkListObj => {
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
              label={checkListObj.description}
            />
            {/* {createSubTask()} */}
          </div>
        )
      })}
    </div> 
  )
}

const mapStateToStates = (state) => ({
  taskData: state.taskData
})

export default connect(mapStateToStates)(CheckList)