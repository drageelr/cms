import React, {useState} from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'
import { connect } from 'react-redux'
import { createSubTask } from '../taskDataSlice'

export function SelectAssigneeButton({taskId, checkListObj, userData, dispatch}) {

  console.log(checkListObj)
  
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