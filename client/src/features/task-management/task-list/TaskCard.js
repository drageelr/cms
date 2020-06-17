import React from 'react'
import { connect } from 'react-redux'
import { Draggable } from "react-beautiful-dnd"
import { Card, CardContent, Grid, Tooltip, makeStyles} from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { subTaskDisplay, deleteSubTask, setCurrTaskId, setTaskEditMode, setIsRequestTask } from '../taskDataSlice'
import FormatItalicRoundedIcon from '@material-ui/icons/FormatItalicRounded';
import AttachFileIcon from '@material-ui/icons/AttachFile'
import LinkIcon from '@material-ui/icons/Link'

/**
  This component renders the cards in each column. Each Card displays some details about a task. 
  The cards are of 2 types: 
  Task Card,
  SubTask
  Essentially the Task Title, Task Id, Task Status and an edit icon which when clicked, opens the 
  edit dialog box.

  @param {string} taskId a unique taskId to access the tasks' details
  @param {number} index used to distinguish draggable cards 
  @param {object} taskData from the corresponding redux slice, to retrieve all the data related
  the a particular task and use it to populate the card 
  @param {object} taskStatusDetails from the corresponding redux slice, to retrieve the task statuses that 
  are assigned to a task, along with the hex color values
*/

const useStyles = makeStyles((theme) => ({
  taskStatusBlock: {
    borderRadius: "4px",
    display: "block",
    float: "left",
    fontSize: "10px",
    fontWeight: 600,
    margin: "0 4px 5px 0",
    minWidth: "50px",
    width: "auto",
    marginTop: 2,
    padding: "1px 5px",
    color: "#ffffff"
  },
  displayIcons: {
    display: "inline-block",
    width: "100%",
    float: "left",
    padding: "5px 0 0 0"
  },
  mainTaskCard: {
    font: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Arial,sans-serif",
    marginBottom: "10px"
  },
  subTaskCard: {
    fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Arial,sans-serif",
    marginBottom: 10
  },
  miniIcon: {
    color: theme.palette.action.active
  }
}))

export function TaskCard({taskId, index, taskData, taskStatusDetails, dispatch}) {
  let taskStatusName = ""
  let taskStatusColor = ""
  let statusId = -1
  const taskObj = taskData.taskList.find(taskObj => taskObj.taskId === taskId)
  const classes = useStyles()

  if (taskObj !== undefined) { // if found
    statusId = taskObj.statusId
  }

  taskStatusDetails.forEach(statusObj => {
    if(statusObj.statusId === statusId) {
      taskStatusName = statusObj.name
      taskStatusColor = statusObj.color
    }
  })

  function handleSubTaskDisplay() {
    dispatch(subTaskDisplay({taskId}))
    
    let mainTaskId = -1 // the request task to which the sub task is associated
    taskData.taskList.forEach(taskObj => {
      if (taskObj.taskId === taskId) {
        mainTaskId = taskObj.assTaskId
      }
    })
    taskData.taskList.forEach(taskObj => {
      if (taskObj.taskId === mainTaskId) {
        dispatch(deleteSubTask({mainTaskId, taskId, subTaskList: taskObj.subtasks}))
      }
    })
  }

  function SubTask() {
    return (
      (taskObj !== undefined && taskObj.check !== true) &&
      <Card key={index} style={{marginBottom: 10, maxHeight: "50px"}} cursor="pointer" variant="outlined">
        <CardContent style={{marginTop: "-16px"}}>
          <div className={classes.displayIcons}>              
            <div style={{float: "left"}}>
              <span key={index} style={{fontSize: "13px", fontWeight: 400}}> {taskObj.description} </span>
            </div>
            <div style={{float: "right"}}>
              <span>
                <Tooltip title="Delete SubTask" placement="bottom-start">
                  <DeleteOutlineIcon onClick={handleSubTaskDisplay} cursor="pointer" fontSize="small"/>
                </Tooltip>
              </span>
            </div>
          </div>
          <div className={classes.displayIcons}>
            <div style={{float: "left"}}>
              <Tooltip title={"Linked Request ID: " + taskObj.assTaskId} placement="bottom-start">
                <LinkIcon fontSize="small" cursor="pointer"/>
              </Tooltip>
            </div>
            <div style={{float: "right"}}>
              <Tooltip title={"SubTask ID: " + taskObj.taskId} placement="bottom-start">
                <FormatItalicRoundedIcon fontSize="small" cursor="pointer"/>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  function handleEditTaskDialog() {
    dispatch(setCurrTaskId({taskId}))
    dispatch(setIsRequestTask({isRequestTask: taskId[0] === "r"}))
    dispatch(setTaskEditMode({taskEditMode: "edit"}))
  }

  function MainTask() {
    return (
      (taskObj !== undefined && taskObj.archive === false) &&
      <Card elevation={2} onClick={handleEditTaskDialog} className={classes.mainTaskCard}>
        <CardContent style={{marginBottom: "2px", marginTop: "-10px"}}>
          <span className={classes.taskStatusBlock} style={{background: taskStatusColor}}>{taskStatusName}</span>
          <Grid container>
              <span key={index} style={{fontSize: "14px", fontWeight: 550, paddingTop: 1, paddingBottom: 6}}> {taskObj.title} </span>
          </Grid>
          <div className={classes.displayIcons}>              
            {
              taskId[0] === 'r' && 
              <span>
                <Tooltip title="Request Attached" placement="bottom-start">
                  <AttachFileIcon 
                  className={classes.miniIcon}
                  style={{float:"left", fontSize: 14}} 
                  cursor="pointer"
                  />
                </Tooltip>
              </span>
            }
            <Tooltip title={"Task ID: " + taskObj.taskId} placement="bottom-start">
              <FormatItalicRoundedIcon 
              className={classes.miniIcon}
              style={{float: "right", marginRight: -10}} 
              fontSize="small" 
              cursor="pointer"
              />
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    )  
  }

  return (
    <Draggable draggableId={taskId} index={index}>
      {
        (provided) => (
          <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
            {
              taskId[0] === 's' 
              ? <SubTask/> 
              : <MainTask/>
            }
          </div>
        )
      }
    </Draggable>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData,
  taskStatusDetails: state.taskStatusDetails.taskList,
})

export default connect(mapStateToProps) (TaskCard)