import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Icon from '@material-ui/core/Icon'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import { TextField } from '@material-ui/core'
import { createRequestTask, createCustomTask } from '../taskDataSlice'

/**
  This component renders the "Add a Task" icon which allows the user to add custom tasks to the
  columns. It provides the user with options to either create a Request Task or a Custom Task.

  @param {string} ownerId used to add the Add button in each column 
*/

export default function TaskAddButton({ ownerId }) {

  const [formOpen, setFormOpen] = useState(false)
  const [text, setText] = useState("")

  const reqButtonText = "Add Request Task"
  const cusButtonText = "Add Custom Task"

  const dispatch = useDispatch()

  function handleChange(event) {
    setText(event.target.value)
  }

  function closeForm() {
    setFormOpen(false)
    setText("")
  }

  function handleCreateTask(taskType) {
    if (taskType === "request") {
      if(text) {
        const reqTaskObject = { 
          title: text, 
          description: "", 
          submissionId: -1,
          ownerId: ownerId, 
          statusId: -1,
          //checklists: [] ---> optional if want to send, but essentially will be sent in edit task
        }
        dispatch(createRequestTask(reqTaskObject))
      }
    } else if (taskType === "custom") {
      if(text) {
        const cusTaskObject = { 
          title: text, 
          description: "",
          ownerId: ownerId, 
          statusId: -1,
        }

        dispatch(createCustomTask(cusTaskObject))
      }
    }
  }

  function renderActionButton () {
    const buttonStyle = {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      borderRadius: 3,
      height: 36,
      width: 272,
      paddingLeft: 10,
      opacity: 0.5,
      color: "inherit",
      backgroundColor: "inherit"
    }

    return(
      <div style={buttonStyle} onClick={() => setFormOpen(true)}>
        <Icon > add </Icon>
        <p> {"Add a Task"} </p>
      </div>
    )
  }

  function renderForm () {
    const placeholder = "Enter task title"
    return (
      <div>
        <Card style={{
          minHeight: 80,
          minWidth: 272,
          padding: "6px 8px 2px"
        }}>
          <TextField
            placeholder={placeholder}
            autoFocus
            multiline
            rows="3"
            label="Required"
            onBlur={closeForm}
            value={text}
            onChange={handleChange}
            style={{
              resize: "none",
              width: "100%",
              height: "10%",
              overflow: "hidden",
              outline: "none",
              border: "none",
            }}
          />
        </Card>

        <div style={{marginTop: 8, marginLeft: 12, display: "flex", alignItems: "center"}}>
            <Button 
              size="small" 
              onMouseDown={() => {handleCreateTask("request")}} 
              variant="contained" 
              style={{ color: "white", backgroundColor: "green"}}
            >
              {reqButtonText}
            </Button>

            <div style={{marginLeft: 4, display: "flex", alignItems: "center"}}>
              <Button 
                size="small" 
                onMouseDown={() => {handleCreateTask("custom")}} 
                variant="contained" 
                style={{ color: "white", backgroundColor: "green"}}
              >
                {cusButtonText}
              </Button>
          </div>
        </div>
      </div>
    )
  }

  return formOpen ? renderForm() : renderActionButton()
}