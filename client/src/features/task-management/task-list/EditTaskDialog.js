import React, {useState} from 'react'
import { connect } from 'react-redux'
import AttachRequestForm from './AttachRequestForm'
import TaskStatus from './TaskStatus'
import CheckList from "./CheckList"
import AddAssignee from "./AddAssignee"
import LogEditor from "../logs/LogEditor"
import { archiveTask, taskOwnerChange, updateTitle, updateDescription } from "../taskDataSlice"
import { Typography, Box, Card, Slide, FormControl, Select, TextField,  MenuItem, Grid, Dialog, DialogActions, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import SubjectIcon from '@material-ui/icons/Subject'

/**
  The task edit dialog is handled by this component. It navigates between sub components of the task
  editor dialog. The data to the child components e.g AddAssignee, Checklist components is 
  passed via this component.    

  @param {string} taskId this id is used to navigate between sub components of the task editor dialog  
  @param {object} taskData slice from redux corresponding to the current component
  @param {function} dispatch redux associated function to pass action creators to the reducer
  @param {bool} open a bool state passed from the TaskCard component to open the task editor Dialog Box
  @param {function} setOpen sets the state of open to true or false depending on the user input
*/

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export function EditTaskDialog({taskId, taskData, ccaDetails, dispatch, open, setOpen}) {  
  
  let defaultDesc = ""
  let defaultTitle = ""
  let defaultOwner = -1
  taskData.map(taskObj => {
    if (taskObj.taskId === taskId) {
      defaultDesc = taskObj.description
      defaultTitle = taskObj.title
      defaultOwner = taskObj.ownerId
    }
  })

  const [selectOpen, setSelectOpen] = useState(false)
  const [text, setText] = useState(defaultDesc)
  const [taskTitle, setTaskTitle] = useState(defaultTitle)
  const [owner, setOwner] = useState(defaultOwner)

  function handleSelectOpen(){
    setSelectOpen(true)
  }

  function handleSelectClose() {
    setSelectOpen(false)
  }
  
  function handleClickClose() {
    setOpen(false)
  }

  function handleCloseDialog(){
    console.log(owner)
    dispatch(taskOwnerChange({taskId, owner}))
    setOpen(false)
  }

  function handleOwnerSet(event) {
    // const ownerId = event.target.value
    setOwner(event.target.value)
  }

  function handleTitleChange (event) {
    let newTitle = event.target.value
    dispatch(updateTitle({taskId, newTitle}))
    setTaskTitle(event.target.value)
  }

  function handleDescChange(event) {
    const description = event.target.value
    dispatch(updateDescription({taskId, description}))
    setText(event.target.value)
  }

  function handleDelete() { // CALL EDIT TASK API/ARCHIVE TASK API
    let ownerId = -1
    taskData.map(taskObj => {
      if (taskObj.taskId === taskId) {
        ownerId = taskObj.ownerId
      }
    })
    dispatch(archiveTask({taskId, ownerId}))
  }

  function RequestVSCustom() { // conditionally render "CHecklist" and Request Form Button
    return (
      <Grid container direction="row" justify="space-between" alignItems="flex-start" style={{padding: "0px 17px 0px 17px"}}>
        <Grid item> {/*Checklist text*/}
          { taskId[0] === 'r' &&  
            <Typography gutterBottom variant="h5" color="inherit">
              Checklist:
            </Typography> 
          }
        </Grid>
        <Grid item> {/*REQUEST-FORM*/}
          {(() => {
            let submissionId = -1
            taskData.map(taskObj => {
              if (taskObj.taskId === taskId) {
                submissionId = taskObj.submissionId
              }
            })

            if (taskId[0] === 'r' && submissionId === -1) {
              return (
                <AttachRequestForm taskId={taskId}/>
              )
            } else {
              // console.log(submissionId)
              return (
                <Typography variant="h5">
                  Linked Request ID: {submissionId}
                </Typography> 
              )
            }
          })()}
        </Grid>
      </Grid>
    )
  }

  function AssignTaskOwner() { // Give Select Option to Add Task Assignee
    return (
      <Grid container direction="row" justify='flex-start' alignItems="flex-start">
        <Typography style={{marginRight: 5}} gutterBottom variant="h6" color="inherit">
          Task Owner:    
        </Typography>
        <FormControl>
          <Select
            labelId = "select-label"
            id="label"
            open={selectOpen}
            onClose={handleSelectClose}
            onOpen={handleSelectOpen}
            value={owner}
            onChange={handleOwnerSet}
            variant = "outlined"
            style={{height: 30, width: "100%",  marginTop: 3}}
          >
            <MenuItem value={owner}>
              <em>None</em>
            </MenuItem>
            {
              ccaDetails.map((ccaUser, index) => {
                return (
                  <MenuItem key={index} value={ccaUser.ccaId}>{ccaUser.firstName}</MenuItem> 
                ) 
              })
            }
          </Select>
        </FormControl>
      </Grid>
    )
  }

  function renderDialogBox() {
    return (
      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClickClose} TransitionComponent={Transition}>
        {/*TaskName----TaskID----TaskArchiveButton*/}
        <Grid style={{padding: "15px"}} item container direction="row" justify="space-between" alignItems="flex-start">
          <Grid>
              <Typography gutterBottom variant="h5" color="inherit">
                <Grid container direction="row"> 
                  <Grid item>
                    Task Name:
                    <TextField 
                      autoFocus
                      variant="outlined"
                      value={taskTitle}
                      defaultValue={taskTitle}
                      onChange={handleTitleChange}
                      style={{
                        resize: "none",
                        marginTop: -8,
                        marginLeft: 4,  
                        size:"small",
                        value:{taskTitle},
                        outline: "none"
                      }}
                    />
                  </Grid>
                </Grid>
                  <Typography gutterBottom variant="h6" color="textPrimary">
                    Task id: {taskId}
                  </Typography>
              </Typography>
          </Grid>
          <Grid>
            <DeleteIcon cursor="pointer" onClick={handleDelete} fontSize={"large"}/>
          </Grid>
        </Grid>

        {/*Description Box*/}
        <Box padding= {2} marginTop={-2}>
          <Typography gutterBottom variant="h6" color="inherit" style={{marginLeft:27}}>
            <Typography style={{marginLeft: -30, marginBottom: -36}}>
              <SubjectIcon fontSize={"large"}/>
            </Typography>
            Description
          </Typography>
          <Card style={{minHeight: 100, minWidth: 0, background: "#ebecf0"}}>
            <TextField 
              placeholder={"Add description here..."}
              autoFocus
              multiline
              rows="6"
              value={text}
              defaultValue={text}
              onChange={handleDescChange}
              style={{
                resize: "none",
                width: "100%",
                value:{text},
                overflow: "hidden",
                outline: "none",
                border: "none",
                background: "#ebecf0"
              }}
            />
          </Card>
        </Box>
        
        <Grid container direction="row" justify="space-between" alignItems="flex-start" style={{padding: "0px 17px 0px 17px"}}>
          <Grid item style={{marginBottom: 20}}> {/*Assign Task Owner*/}
            {AssignTaskOwner()}
          </Grid>
          <Grid item style={{marginTop: 5}}> {/*Task Status Colors*/}
            <TaskStatus taskId={taskId}/>
          </Grid>
        </Grid>
      
        {/*CheckList Text (and checklist) and Request Task Button conditionally rendered*/}
        {(() =>{
          if (taskId[0] === 'r') {
            return (
              <div>
                {RequestVSCustom()}
                {
                  taskData.map(taskObj => {
                    if (taskObj.taskId === taskId) {
                      if (taskObj.submissionId !== -1) {
                        return <Grid item style={{padding: "0px 17px 0px 17px", marginTop: -10}}>
                          {<CheckList taskId={taskId}/>}
                        </Grid>
                      } else {
                        return (
                          <h6 style={{marginTop: -1, marginLeft: 17}}>No Request Attached</h6>
                        )
                      }
                    }
                  })
                }
              </div>
            )
          }
        })()}

        {/* Task Assignees */}
        {/* <AddAssignee taskId={taskId}/> */}

        {/* Logs */}
        <LogEditor taskId={taskId}/>

        {/*Complete Task Button*/}
        <DialogActions>
          <div style={{marginRight: 10}}>
            <Button 
              variant="contained" 
              color="inherit"
              onClick={handleCloseDialog}
            >
              Complete Task
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    )
  }

  return renderDialogBox()
}

const mapStateToProps = (state) => ({
  taskData: state.taskData.taskList,
  ccaDetails: state.ccaDetails.ccaList
})

export default connect(mapStateToProps)(EditTaskDialog)