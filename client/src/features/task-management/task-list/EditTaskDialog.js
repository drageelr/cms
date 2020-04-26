import React, {useState} from 'react'
import { connect, useStore } from 'react-redux'
import AttachRequestForm from './AttachRequestForm'
import TaskStatus from './TaskStatus'
import SubTask from "./SubTaskCheckList"
import AddAssignee from "./AddAssignee"
import LogEditor from "../logs/LogEditor"
import { archiveTask, taskOwner, updateTitle, updateDescription } from "../taskDataSlice"
import { Typography, Box, Card, Slide, FormControl, Select, TextField,  MenuItem, Grid, Dialog, DialogActions, TextareaAutosize, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import SubjectIcon from '@material-ui/icons/Subject'

/**
  The task edit dialog is handled by this component. It navigates between sub components of the task
  editor dialog. The data to the child components e.g AddAssignee, SubTaskChecklist components is 
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

export function EditTaskDialog({taskId, taskData, dispatch, open, setOpen}) {  
  const [selectOpen, setSelectOpen] = useState(false)
  const [text, setText] = useState(taskData.tasks[taskId].description)
  const [taskTitle, setTaskTitle] = useState(taskData.tasks[taskId].title)
  const [owner, setOwner] = useState("")

  function handleSelectOpen(){
    setSelectOpen(true)
  }

  function handleSelectClose() {
    setSelectOpen(false)
  }

  function handleOwnerSet(event) {
    const owner = event.target.value
    dispatch(taskOwner({taskId, owner}))
    setOwner(event.target.value)
  }

  function handleClickClose() {
    setOpen(false)
    // setText(""s)
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

  function handleCloseDialog(){
    setOpen(false)
  }

  function handleDelete() {
    const ownerId = taskData.tasks[taskId].ownerId
    dispatch(archiveTask({taskId, ownerId}))
  }

  function renderDialogBox() {
    return (
      <Dialog 
        fullWidth
        maxWidth="md"
        open={open} 
        onClose={handleClickClose} 
        TransitionComponent={Transition}
      >
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
                      defaultValue={"hell"}
                      onChange={handleTitleChange}
                      style={{
                        resize: "none",
                        marginTop: -8,
                        marginLeft: 4,  
                        size:"small",
                        value:{taskTitle},
                        overflow: "hidden",
                        outline: "none"
                      }}
                    />
                  </Grid>
                </Grid>
                  <Typography gutterBottom variant="subtitle1" color="textPrimary">
                    task id: {taskId}
                  </Typography>
              </Typography>
          </Grid>
          <Grid>
            <DeleteIcon cursor="pointer" onClick={handleDelete} fontSize={"large"}/>
          </Grid>
        </Grid>

        {/*Description Box*/}
        <Box padding= {2}>
          <Typography 
            gutterBottom 
            variant="h6" 
            color="inherit"
            style={{marginLeft:27, marginTop:0}}
          >
            <Typography style={{marginLeft: -30, marginBottom: -36}}>
              <SubjectIcon fontSize={"large"}/>
            </Typography>
            Description
          </Typography>
          <Card style={{
            minHeight: 100,
            minWidth: 0,
            background: "#ebecf0",
          }}>
            <TextField 
              placeholder={"Add description here..."}
              autoFocus
              multiline
              rows="6"
              value={text}
              defaultValue={taskData.tasks[taskId].description}
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
            
        <Grid 
          container 
          direction="row" 
          justify="space-between" 
          alignItems="flex-start"
          style={{padding: "0px 17px 0px 17px"}}
        >
          <Grid item> {/*Checklist text*/}
            { taskId[0] === 'r' &&  
              <Typography gutterBottom variant="h6" color="inherit">
                Checklist:
              </Typography> 
            }
          </Grid>
          <Grid item> {/*REQUEST-FORM*/}
            {taskId[0] === 'r' && taskData.tasks[taskId].formDataId === "" ? <AttachRequestForm taskId={taskId}/> :
              taskData.tasks[taskId].formDataId} 
          </Grid>
        </Grid>

        <Grid 
          container 
          direction="row" 
          justify="space-between" 
          alignItems="flex-start"
          style={{padding: "0px 17px 0px 17px"}}
        >
          <Grid item style={{marginBottom: 20}}> {/*CHECKLIST-SUBTASK*/}
            { taskId[0] === 'r' && <SubTask taskId={taskId}/> }
          </Grid>
          <Grid item style={{marginTop: 5}}> {/*Task Status Colors*/}
            <TaskStatus taskId={taskId}/>
          </Grid>
        </Grid>

        {/* Assign Task Owner */}
        <Grid container direction="row" justify='flex-start' alignItems="flex-start">
          <Grid item>
              <Typography style={{marginLeft: 17, marginRight: 5}} gutterBottom variant="h6" color="inherit">
                Task Owner:    
              </Typography>
          </Grid>
          <Grid item>
            <FormControl>
              <Select
                labelId = "select-label"
                id="label"
                open={selectOpen}
                onClose={handleSelectClose}
                onOpen={handleSelectOpen}
                value={owner}
                defaultValue={taskData.tasks[taskId].ownerId}
                onChange={handleOwnerSet}
                variant = "outlined"
                style={{height: 30, padding: "0px 0px 0px 0px", marginTop: 3}}
              >
                <MenuItem value={""} disabled>
                  <em>None</em>
                </MenuItem>
                {taskData.users.map((person, index) => {
                  return <MenuItem key={index} value={person}>{person}</MenuItem>  
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      
        {/* Task Assignees */}
        <AddAssignee taskId={taskId}/>

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
  taskData: state.taskData,
})

export default connect(mapStateToProps)(EditTaskDialog)
