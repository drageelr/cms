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

export default function ChangeFormStatusSelect({submissionId, status}) {
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(false)

  function handleChange(e) {
    dispatch(changeFormStatus({submissionId, status: e.target.value}))
  }

  const disabledOptions = ["Pending(President)","Issue(President)", "Pending(Patron)", "Issue(Patron)", "Approved(Patron)"]
  const options = ["Pending(CCA)", "Issue(CCA)", "Approved(CCA)",  "Write-Up",  "Completed"]

  return (
    <div>
      <FormControl variant="outlined">
        <Select
          labelId = "status-label"
          id="label"
          open = {open}
          onClose={()=>setOpen(false)}
          value={status}
          onOpen={()=>setOpen(true)}
          style={{height: 30, width: 200}}
          variant = "outlined"
          onChange={handleChange}
        >
          {
            options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)
          }
          {
            disabledOptions.map((option, index) => <MenuItem key={index} disabled={true} value={option}>{option}</MenuItem>)
          }
        </Select>
      </FormControl>
    </div>
  )
}


