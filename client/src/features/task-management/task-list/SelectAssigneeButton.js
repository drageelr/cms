import React, {useState} from 'react'
import { connect } from 'react-redux'
import { createSubTask } from '../taskDataSlice'
import { Button, Menu, MenuItem } from '@material-ui/core'

/**
  Renders a state-ful button that allows the user to add an assignee to the checklist item. Upon 
  getting an assignee, the checklist item is converted to a subtask and is displayed in the 
  assignee's column in the task manager window.

  @param {string} taskId passed to the createSubTask action to make a subtask for the current task
  @param {object} checkListObj contains the data of a checklist item, to check whether has been
  assigned an assignee or not
  @param {object} userData object with data of all users, provides user name for the Select Assignee Menu
  @param {function} dispatch to dispatch the action of creating a SubTask
*/

export function SelectAssigneeButton({taskId, checkListObj, userData, dispatch}) {
  const [anchorEl, setAnchorEl] = useState(null)

  function handleClick(e) {
    setAnchorEl(e.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }
  
  return (
    <div>
      {checkListObj.isAssigned ? <Button disabled onClick={handleClick} variant="contained" size="small"> Select Assignee</Button> :
      <Button onClick={handleClick} variant="contained" size="small"> Select Assignee</Button>}
      
      <Menu
        id="task-editor"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {userData.map(userObj => {
          return <MenuItem onClick={() => {dispatch(createSubTask({taskId, userObj, checkListObj}))}}>
            {userObj.firstName}
          </MenuItem>
        })}
      </Menu>
    </div>
  )
}

const mapStateToStates = (state) => ({
  userData: state.taskData.userData
})

export default connect(mapStateToStates)(SelectAssigneeButton)