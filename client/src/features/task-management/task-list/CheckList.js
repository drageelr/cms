import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import { fetchCheckList } from '../taskDataSlice'

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
  
  let submissionId = -1
  let ownerId = -1
  taskData.taskList.map(taskObj => { // get the submissionId associated to the task
    if (taskObj.taskId === taskId) {
      submissionId = taskObj.submissionId
      ownerId = taskObj.ownerId
    }
  })

  return (
    <div>
      {
        taskData.checkList.map(checkListObj => {
          return (
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled
                    checked
                    color='primary'
                  />
                }
                label={checkListObj.description}
              />
            </div>
          )
        })
      }
    </div>
  )
}

const mapStateToStates = (state) => ({
  taskData: state.taskData
})

export default connect(mapStateToStates)(CheckList)