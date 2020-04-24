import React from 'react'
import { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Container from '@material-ui/core/Container'
import EditIcon from '@material-ui/icons/Edit'
import TextareaAutosize from 'react-textarea-autosize'
import LogEditor from "../logs/LogEditor"
import TaskCheckList from "./TaskCheckList"
import { connect } from 'react-redux'
import editTaskTitle from "../taskdataSlice"

// USE THE LOG EDITOR COMPONENT AND FUNCTIONALITY INSIDE THIS COMPONENT
// COnditional Rendering for displaying different dialog box things for new task and edit task

export function AddEditTaskDialog({taskId, title, tasksData, dispatch}) {  
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState("")

  function handleClose() {
    setIsOpen(false)
  }

  function handleClickOpen() {
    setIsOpen(true)
  }

  function handleChange(event) {
    setText(event.target.value)
  }

  function editTaskTitle() { // edit the title of the task
    if(text) {
      dispatch(editTaskTitle({taskId, title, tasksData}))
    }
  }

  return (
    <div>
      <Container style ={{marginLeft: '85%'}}>
        <EditIcon onClick={handleClickOpen} fontSize="small" color="action" cursor="pointer"/>
      </Container>

      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Task Name: {title}</DialogTitle>
        <DialogContent>
          <TextareaAutosize 
            placeholder={"Add description of the task here..."} 
            autoFocus
            value={text}
            onBlur={handleClose}
            onChange={handleChange}
            style={{
              resize: "none",
              width: "90%",
              overflow: "hidden",
              outline: "none",
              border: "none",
            }}
          />
        </DialogContent>
        <DialogActions>
        <Button color="primary">
          Create Task
        </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
  console.log(text)
}

export default connect()(AddEditTaskDialog)
