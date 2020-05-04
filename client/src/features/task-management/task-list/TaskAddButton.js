import React, { useState } from 'react'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import EditTaskDialog from './EditTaskDialog'

/**
  This component renders the "Add a Task" icon which allows the user to add custom tasks to the
  columns. It provides the user with options to either create a Request Task or a Custom Task.

  @param {string} ownerId used to add the Add button in each column 
*/

export default function TaskAddButton({ ownerId }) {
  const [open, setOpen] = useState(false)
  const [buttonsOpen, setButtonsOpen] = useState(false)
  const [isRequestTask, setIsRequestTask] = useState("")

  const commonStyle = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    height: 36,
    width: 272,
  }

  const buttonStyle = {
    ...commonStyle,
    paddingLeft: 10,
    opacity: 0.5,
    color: "inherit",
    backgroundColor: "inherit"
  }

  const buttonGroupStyle = {...commonStyle, marginTop: 8}

  function handleCreateTask(taskType) {
    setIsRequestTask(taskType === "request")
    setOpen(true)
  }

  function SelectTaskType () {
    return (
      <div style={buttonGroupStyle}>
          <Button 
            size="small" 
            onMouseDown={() => {handleCreateTask("request")}} 
            variant="contained" 
            style={{ color: "white", backgroundColor: "#009D5E", fontSize: 10}}
          >
            {"Request Task"}
          </Button>

          <div style={{marginLeft: 4, display: "flex", alignItems: "center"}}>
            <Button 
              size="small" 
              onMouseDown={() => {handleCreateTask("custom")}} 
              variant="contained" 
              style={{ color: "white", backgroundColor: "#E24A00", fontSize: 10}}
            >
              {"Custom Task"}
            </Button>
        </div>
      </div>
    )
  }

  return(
    <div>
      <div onMouseEnter={() => setButtonsOpen(true)} onMouseLeave={() => setButtonsOpen(false)}>
      {    
        buttonsOpen ?
        <SelectTaskType/> : 
        <div style={buttonStyle}>
          <Icon>add</Icon>
          <p> {"Add a Task"} </p>
        </div>
      }
      </div>
      <EditTaskDialog
        editMode={false}
        ownerId={ownerId}
        open={open}
        setOpen={setOpen}
        initialState = {{ description: "", title: "", ownerId: -1, submissionId: -1, statusId: -1 }}
        isRequestTask={isRequestTask}/>
    </div>
  )
}