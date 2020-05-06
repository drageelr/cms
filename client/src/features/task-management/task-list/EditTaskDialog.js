import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import AttachRequestForm from './AttachRequestForm'
import TaskStatus from './TaskStatus'
import CheckList from "./CheckList"
import AddAssignee from "./AddAssignee"
import LogEditor from "../logs/LogEditor"
import { archiveTask, taskOwnerChange, updateTitle, updateDescription, createRequestTask,
  createCustomTask } from "../taskDataSlice"
import { Typography, Box, Card, Slide, FormControl, Select, TextField,  MenuItem, Grid, Dialog, DialogActions, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import CancelIcon from '@material-ui/icons/Cancel'
import SubjectIcon from '@material-ui/icons/Subject'

/**
  The task edit dialog is handled by this component. It navigates between sub components of the task
  editor dialog. The data to the child components e.g AddAssignee, Checklist components is 
  passed via this component.    

  @param {string} taskId this id is used to navigate between sub components of the task editor dialog  
  @param {object} taskData slice from redux corresponding to the current component
  @param {function} redux associated function to pass action creators to the reducer
  @param {bool} open a bool state passed from the TaskCard component to open the task editor Dialog Box
  @param {function} setOpen sets the state of open to true or false depending on the user input
*/

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export function EditTaskDialog({editMode, ownerId, isRequestTask, taskList, taskId, ccaDetails, dispatch, open, setOpen}) {  
  let initialState = { description: "", title: "", ownerId: -1, submissionId: -1, statusId: -1 }

  //get defaultDesc, defaultTitle, defaultOwner, submissionId from taskData
  const taskObj = taskList.find(taskObj => taskObj.taskId === taskId)
  if (taskObj !== undefined) { // if found
    const { description, title, ownerId, submissionId, statusId } = taskObj
    initialState = { description, title, ownerId, submissionId, statusId }
  }

  const [selectOpen, setSelectOpen] = useState(false)  
  const [desc, setDesc] = useState(initialState.description)
  const [taskTitle, setTaskTitle] = useState(initialState.title)
  const [owner, setOwner] = useState(initialState.ownerId)
  const [statusId, setStatusId] = useState(initialState.statusId)
  const [localSubmissionId, setSubmissionId] = useState(initialState.submissionId)


  function handleCreateComplete(){
    if (isRequestTask) {      
      const reqTaskObject = { 
        title: taskTitle, 
        description: desc, 
        submissionId: localSubmissionId,
        ownerId: ownerId, 
        statusId: statusId,
        archive: false
      }
      dispatch(createRequestTask(reqTaskObject))
    } 
    else {
      const cusTaskObject = { 
        title: taskTitle, 
        description: desc, 
        ownerId: ownerId, 
        statusId: statusId,
        archive: false
      }
      dispatch(createCustomTask(cusTaskObject))
    }
    setOpen(false)
  }
  
  async function handleOwnerSet(event) {
    setOwner(event.target.value)
    if (editMode) {
      dispatch(taskOwnerChange({taskId, owner: event.target.value}))
    }
  }

  function handleTitleChange (event) {
    if (editMode) {
      dispatch(updateTitle({taskId, newTitle: event.target.value}))
    }
  }

  function handleDescChange(event) {
    if (editMode) {
      dispatch(updateDescription({taskId, desc: event.target.value}))
    }
  }

  function handleDelete() {
    dispatch(archiveTask({taskId, ownerId}))
  }

  function RequestVSCustom() { // conditionally render "Checklist" and Request Form Button
    return (
      <Grid container direction="row" justify="space-between" alignItems="flex-start" style={{padding: "0px 17px 0px 17px"}}>
        <Grid item>
          {  // Checklist Text  
            <Typography gutterBottom variant="h5" color="inherit">
              Checklist:
            </Typography> 
          }
        </Grid>
        <Grid item>
          { // Request Form
            (localSubmissionId === -1 && !editMode)
            ? <AttachRequestForm ownerId={ownerId} setSubmissionId={setSubmissionId}/>
            : <Typography variant="h5">
                Linked Request ID: {localSubmissionId}
              </Typography> 
          }
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
            onClose={()=>setSelectOpen(false)}
            onOpen={()=>setSelectOpen(true)}
            value={owner}
            onChange={handleOwnerSet}
            variant = "outlined"
            style={{height: 30, width: "100%",  marginTop: 3}}
          >
            <MenuItem value={owner}>
              <em>None</em>
            </MenuItem>
            {
              ccaDetails.map((ccaUser, index) => 
                <MenuItem key={index} value={ccaUser.ccaId}>{ccaUser.firstName}</MenuItem> 
              )
            }
          </Select>
        </FormControl>
      </Grid>
    )
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={()=>setOpen(false)} TransitionComponent={Transition}>
      {/*TaskName----TaskID----TaskArchiveButton*/}
      <Grid style={{padding: "15px"}} item container direction="row" justify="space-between" alignItems="flex-start">
        <Typography gutterBottom variant="h5" color="inherit">
          <Grid container direction="row"> 
            Task Name:
            <TextField 
              id="task-title"
              variant="outlined"
              value={taskTitle}
              onChange={(e)=>{setTaskTitle(e.target.value)}}
              inputProps={{onBlur: handleTitleChange}}
              style={{resize: "none", marginTop: -8, marginLeft: 4, size:"small", outline: "none"}}
            />
          </Grid>
            <Typography gutterBottom variant="h6" color="textPrimary">
              ID: {taskId}
          </Typography>
        </Typography>
        <Grid>
          {
            editMode
            ? <DeleteIcon cursor="pointer" onClick={handleDelete} />
            : <CancelIcon cursor="pointer" onClick={()=>setOpen(false)} />
          }
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
            multiline
            rows="6"
            value={desc}
            onChange={(e)=>setDesc(e.target.value)}
            inputProps={{onBlur: handleDescChange}}
            style={{
              resize: "none",
              width: "100%",
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
          <AssignTaskOwner/>
        </Grid>
        <Grid item style={{marginTop: 5}}> {/*Task Status Colors*/}
          <TaskStatus setStatusId={setStatusId} taskId={taskId}/>
        </Grid>
      </Grid>
        
      {
        isRequestTask && /*CheckList Text (and checklist) and Request Task Button conditionally rendered*/
        <div>
          <RequestVSCustom/>
          {
            (localSubmissionId !== -1) 
            ? <Grid item style={{padding: "0px 17px 0px 17px", marginTop: -10}}>
                <CheckList taskId={taskId}/>
              </Grid>
            : <h6 style={{marginTop: -1, marginLeft: 17}}>No Request Attached</h6>
          }
        </div>
      }

      {/* Task Assignees */}
      {/* <AddAssignee taskId={taskId}/> */}
      {
        editMode && //Logs
        <LogEditor taskId={taskId}/>
      }
      {/*Complete Task Button*/}
      <DialogActions>
        <div style={{marginRight: 10}}>
          {
            (!editMode) &&
            <Button 
              variant="contained" 
              color="inherit"
              onClick={handleCreateComplete}
            >
              Create Task
            </Button>
          }
        </div>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = (state) => ({
  taskList: state.taskData.taskList,
  ccaDetails: state.ccaDetails.ccaList,
  taskView: state.taskView
})

export default connect(mapStateToProps)(EditTaskDialog)