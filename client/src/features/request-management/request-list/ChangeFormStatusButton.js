import React from 'react'
import { Select, FormControl, MenuItem } from '@material-ui/core'
import { changeFormStatus } from '../requestListSlice'
import { useDispatch } from 'react-redux'

/**
  This is a state-ful Select Menu that provides the admin with a list of statuses that they
  can associate to tasks. 

  @param {number} requestId the id of the request whose status we are going to change, will be
  dispatched the store   
*/

export default function ChangeFormStatusButton({requestId}) {
  const dispatch = useDispatch()
  
  const [open, setOpen] = React.useState(false)
  const [status, setStatus] = React.useState("")

  function handleClick(e) {
    setStatus(e.target.value)
    var status= e.target.value
    dispatch(changeFormStatus({requestId, status}))
  }
  
  function handleOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  return (
    <div>
      <FormControl>
        <Select
          labelId = "status-label"
          id="label"
          open = {open}
          onClose={handleClose}
          value={status}
          onOpen={handleOpen}
          onChange={handleClick}
          style={{height: 30, width: 100}}
          variant = "outlined"
        >
          <MenuItem value="Pending" onClick={handleClick}>
            Pending
          </MenuItem>

          <MenuItem value="Issue" onClick={handleClick}>
            Issue
          </MenuItem>

          <MenuItem value="Approved" onClick={handleClick}>
            Approved
          </MenuItem>

          <MenuItem value="Rejected" onClick={handleClick}>
            Rejected
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

