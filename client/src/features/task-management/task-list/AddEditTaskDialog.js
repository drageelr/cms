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
import DeleteIcon from '@material-ui/icons/Delete'
import LogEditor from "../logs/LogEditor"
import TaskCheckList from "./TaskCheckList"
import { connect } from 'react-redux'
import {editTaskTitle, archiveTask } from "../taskDataSlice"
import ListWithAddItem from "../task-list/TaskCheckList"
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import { Box } from '@material-ui/core'

// USE THE LOG EDITOR COMPONENT AND FUNCTIONALITY INSIDE THIS COMPONENT
// COnditional Rendering for displaying different dialog box things for new task and edit task

const DialogBoxContainer = styled.h5`
  display: flex;
  text-align: center;
  font-size: 1em;
  margin-left:2%
`
const DialogBoxIcon = styled.div`
  margin-left:%;
  text-align: right;
  font-size: 1em;
  component: span
`

export function AddEditTaskDialog({taskId, title, tasksData, columnId, dispatch}) {  
// columnid is passed if the user wants to archive a task

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

  function handleDelete() {
    dispatch(archiveTask({taskId, columnId}))
  }

  return (
    <div>
      <EditIcon onClick={handleClickOpen} fontSize="small" color="action" cursor="pointer"/>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogBoxContainer>
            Task Name: {title}
            <p>{taskId}</p>
            <DialogBoxIcon onClick={handleDelete}>
              <DeleteIcon/>
            </DialogBoxIcon>
        </DialogBoxContainer>
    
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
            <ListWithAddItem />
          </DialogContent>
          <DialogActions>
          <Button color="primary">
            Create Task
        </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default connect()(AddEditTaskDialog)
