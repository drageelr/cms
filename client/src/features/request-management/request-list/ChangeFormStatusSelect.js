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

export default function ChangeFormStatusSelect({submissionId, status, updateValue}) {
  const dispatch = useDispatch()
  const [localStatus, setLocalStatus] = React.useState(status)
  const [open, setOpen] = React.useState(false)

  function handleChange(e) {
    const newStatus = e.target.value
    setLocalStatus(newStatus)
    dispatch(changeFormStatus({submissionId, status: newStatus, issue: ""}))
    // updateValue(newStatus)
  }

  const disabledOptions = ["Pending(President)","Issue(President)", "Pending(Patron)", "Issue(Patron)", "Approved(Patron)"]
  const options = ["Pending(CCA)", "Issue(CCA)", "Approved(CCA)",  "Write-Up",  "Completed"]
  const statusColors = {
    "Pending(President)": "#F1C231",
    "Issue(President)": "#E24A00",
    "Pending(Patron)": "#F1C231",
    "Issue(Patron)": "#E24A00",
    "Approved(Patron)": "#009D5E",
    "Pending(CCA)": "#F1C231",
    "Issue(CCA)": "#E24A00",
    "Approved(CCA)": "#009D5E",
    "Write-Up": "#E24A00",
    "Completed": "#009D5E",
  }
  
  return (
    <div>
      <FormControl variant="outlined">
        <Select
          labelId = "status-label"
          id="label"
          open = {open}
          onClose={()=>setOpen(false)}
          value={localStatus}
          onOpen={()=>setOpen(true)}
          style={{height: 30, width: 200, backgroundColor: statusColors[localStatus] + '60'}}
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


