import React, {useState} from 'react'
import { connect } from 'react-redux'
import SubTask from "./SubTaskCheckList"
import LogEditor from "../logs/LogEditor"
import { editTaskDesc, archiveTask, taskOwner } from "../taskDataSlice"
import AssigneeDialog from "./AddAssignee"
import TextareaAutosize from 'react-textarea-autosize'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteIcon from '@material-ui/icons/Delete'
import { makeStyles } from '@material-ui/core/styles'
import Grid from "@material-ui/core/Grid"
import { Typography, Paper, Box, Card, Slide, FormControl, Select, TextField, Chip, FormControlLabel, Checkbox, InputLabel } from '@material-ui/core'
import SubjectIcon from '@material-ui/icons/Subject'
import MenuItem from '@material-ui/core/MenuItem'
import TaskStatus from './TaskStatus'
import { Link } from 'react-router-dom'
import AttachRequestForm from './AttachRequestForm'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px",
    margin: 'auto',
    overflow: 'auto',
    backgroundColor:'#00000000',
    maxWidth : "xl",
    height: "auto"
  },
  colorBox: {
    fill:'black',
  }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const owners = [ "Farrukh", "Zoraiz", "Hamza F", "Hammad", "Hamza A" ]

const assignees = [
  { id: "ass-1", name: "Farrukh" },
  { id: "ass-2", name: "Zoraiz" },
  { id: "ass-3", name: "Hamza F" },
  { id: "ass-4", name: "Hammad" },
  { id: "ass-5", name: "Hamza A" }
]

export function EditTaskDialog(props) {  
  const { taskId, taskData, dispatch, open, setOpen } = props

  const classes=useStyles()
  const [text, setText] = useState("") // description state
  const [selectOpen, setSelectOpen] = useState(false) // owner select-box box state
  const [owner, setOwner] = useState("") // owner name state

  function handleSelectOpen(selectType){
    setSelectOpen(true)
  }

  function handleSelectClose(selectType) {
    setSelectOpen(false)
  }

  //task owner to be set when task moves between columns do this
  function handleOwnerSet(event) {
    const owner = event.target.value
    dispatch(taskOwner({taskId, owner}))
    setOwner(event.target.value)
  }

  function handleClickClose() {
    setOpen(false)
    setText("")
  }

  function handleDescChange(event) {
    const description = event.target.value
    dispatch(editTaskDesc({taskId, description}))
    setText(event.target.value)
  }

  function handleTaskDetailsSubmit(event){
    setOpen(false)
  }

  function handleDelete() {
    const ownerId = taskData.tasks[taskId].ownerId
    dispatch(archiveTask({taskId, ownerId}))
  }

  function renderDialogBox() {
    return (
      <Dialog 
        fullWidth={true}
        maxWidth="md"
        open={open} 
        onClose={handleClickClose} 
        TransitionComponent={Transition}
      >
        {/*TaskName----TaskID----TaskArchiveButton*/}
        <Grid style={{padding: 15}} item container direction="row" justify="space-between" alignItems="flex-start">
          <Grid>
              <Typography gutterBottom variant="h5" color="inherit">
                Task Name: {taskData.tasks[taskId].title}
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

            <TextareaAutosize 
            placeholder={"Add description here..."}
            autoFocus
            value={text}
            defaultValue={taskData.tasks[taskId].desc}
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
            
        <Grid container style={{marginTop: 0, padding: 15}} direction="row" justify='space-between' alignItems="baseline">
          {/* CHECKLIST-SUBTASK */}
          <Grid display="column" justify = "flex-start" alignItems="flex-start">
            <Grid item>
              { taskId[0] === 'r' &&  
                <Typography gutterBottom variant="h6" color="inherit">
                  Checklist:
                </Typography> 
              }
            </Grid>
            <Grid item>
              { taskId[0] === 'r' && <SubTask taskId={taskId}/> }
            </Grid>
          </Grid>
          
          {/* REQUEST-FORM */}
          <Grid item>
            <Grid container direction="column" justify="space-between" alignItems="flex-end">
              <Grid item>
                {taskId[0] === 'r' && taskData.tasks[taskId].formDataId === "" ? <AttachRequestForm taskId={taskId}/> :
                  taskData.tasks[taskId].formDataId} 
              </Grid>
          {/* TASK-STATUS */}
              <Grid item style={{padding:"20px"}}>
                <TaskStatus taskId={taskId}/>
              </Grid>
            </Grid>
          </Grid>
        </Grid> 

        {/* Assign Task Owner */}
        <Grid style={{marginTop: 5, padding: 15}} container direction="row" justify='flex-start' alignItems="flex-start">
          <Grid item>
            <Typography style={{padding:"3px 8px 0 0"}} gutterBottom variant="h6" color="inherit">
              Task Owner:    
            </Typography>
          </Grid>
          <Grid item>
            <FormControl>
              <Select
                labelId = "select-label"
                id="label"
                open={selectOpen}
                onClose={() => {handleSelectClose("assignTask")}}
                onOpen={() => {handleSelectOpen("assignTask")}}
                value={owner}
                onChange={handleOwnerSet}
                variant = "outlined"
                style={{height: 30, padding: "0px 0px 0px 0px", marginTop: 3}}
              >
                <MenuItem value={""} disabled>
                  <em>None</em>
                </MenuItem>
                {owners.map(person => {
                  return <MenuItem value={person}>{person}</MenuItem>  
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {/* Task Assignees */}
        <AssigneeDialog taskId={taskId}/>

        {/*Complete Task Button*/}
        <DialogActions>
          <div style={{marginRight: 10}}>
            <Button 
              variant="contained" 
              color="inherit"
              onClick={handleTaskDetailsSubmit}
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
