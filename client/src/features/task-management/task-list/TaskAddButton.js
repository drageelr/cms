import React, { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Icon from '@material-ui/core/Icon'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { connect } from 'react-redux'
import { addTask } from '../taskdataSlice'

function TaskAddButton({columnId, dispatch}) {
  const [formOpen, setFormOpen] = useState(false)
  const [text, setText] = useState("")
  const reqButtonText = "Add Request Task"
  const cusButtonText = "Add Custom Task"

  function handleChange(event) {
    setText(event.target.value)
  }

  function closeForm() {
    setFormOpen(false)
    setText("")
  }

  function handleEditTaskTitle() {
    if (text) {
      dispatch(addTask({columnId, text}))
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
          <TextareaAutosize 
            placeholder={placeholder}
            autoFocus
            onBlur={closeForm}
            value={text}
            onChange={handleChange}
            style={{
              resize: "none",
              width: "100%",
              overflow: "hidden",
              outline: "none",
              border: "none",
            }}
          />
        </Card>
        <div style={{marginTop: 8, marginLeft: 12, display: "flex", alignItems: "center"}}>
            <Button size="small" onMouseDown={handleEditTaskTitle} variant="contained" style={{ color: "white", backgroundColor: "green"}}>
              {reqButtonText}
            </Button>
            <div style={{marginLeft: 4, display: "flex", alignItems: "center"}}>
              <Button size="small" onMouseDown={handleEditTaskTitle} variant="contained" style={{ color: "white", backgroundColor: "green"}}>
                {cusButtonText}
              </Button>
          </div>
        </div>
      </div>
    )
  }

  return formOpen ? renderForm() : renderActionButton()
}

export default connect() (TaskAddButton)
