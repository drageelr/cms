import React, { useEffect, useState } from 'react'
import {connect} from 'react-redux'
import TaskColumn from './task-list/TaskColumn'
import TaskArchive from './task-archive/TaskArchive'
import { DragDropContext } from 'react-beautiful-dnd'
import { Fab, Dialog, AppBar, Toolbar, Typography, Slide, IconButton, makeStyles, Box, LinearProgress } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import ArchiveIcon from '@material-ui/icons/Archive'
import ErrorSnackbar from '../../ui/ErrorSnackbar'
import { fetchCCAAccounts } from '../account-settings/ccaDetailsSlice'
import { fetchTaskStatus } from '../account-settings/taskStatusDetailsSlice'
import { fetchCCARequestList } from '../request-management/requestListSlice'
import { moveTask, fetchTaskManager, fetchArchiveManager, editSubTask, moveSubTask, moveTaskSync, clearError } from './taskDataSlice'

/**
  The parent component that initiates the Task Manager. 

  @param {object} ccaDetails from the corresponding redux slice, to retrieve all the data of the CCA users for 
  each column and pass it on to the sub components
  @param {object} taskData slice from redux corresponding to the current component
  @param {function} dispatch from redux, used to dispatch the moveTask action to the reducer 
*/

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function TaskManager({ ccaDetails, taskData, dispatch }) {

  /* 
    fetch the CCAAccountsList(before fetching the Task Manager) and save it in the ccaList Initial state in 
    ccaDetailsSlice and then that slice will be used to extract CCA account details for Task Manager, also fetch
    the task status as they are to be used for task cards

    fetchTaskManager() --> A fetch call to the backend to FETCH the TASK MANAGER, once I get the taskList, I'll have to make a list of 
    all the columns, by going through each task and adding each unique ownerId to an array called columnOrder
    (will do this in the backend when the fetch task is fulfilled and in the fetchtaskfulfilled extraReducer)
  */

  useEffect(() => { 
    dispatch(fetchCCAAccounts())
    dispatch(fetchCCARequestList())
    dispatch(fetchTaskStatus())
    // dispatch(fetchArchiveManager())
    dispatch(fetchTaskManager())
  }, [])

  /* 
    The order in which the CCA Accounts List is fetched, will be the order of the columns in the Task Manager 
    and for each CCA Account there will be a column in the Task Manager.
  */
  
  let columnOrder = []
  ccaDetails.map(ccaObj => {
    columnOrder.push(ccaObj.ccaId)
  })
  columnOrder = Array.from(new Set(columnOrder))

  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  function handleClickOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }
  
  function onDragEnd(result){
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (destination.droppableId === source.droppableId 
      && source.index === destination.index) {
      return
    }
    
    if (draggableId[0] === 's') {
      let mainTaskId = -1

      dispatch(editSubTask({subTaskId: draggableId, dstColumnId: destination.droppableId}))

      taskData.taskList.forEach(taskObj => {
        if (taskObj.taskId === draggableId) {
          mainTaskId = taskObj.assTaskId
        }
      })
      dispatch(moveSubTask({mainTaskId}))
    } else {
      dispatch(moveTaskSync({taskId: draggableId, dstColumnId: destination.droppableId, dstIndex:  destination.index}))
      taskData.taskList.map(task => {
        if (task.taskId === draggableId) {
          console.log(task)
        }
      })
      dispatch(moveTask({  // probably call the edit API as we want to update the ownerID of the task
        taskId: draggableId,
        srcColumnId: source.droppableId,
        // srcIndex: source.index,
        dstColumnId: destination.droppableId,
        dstIndex:  destination.index
      }))
    }
  }

  return (
    taskData.isPending ? <LinearProgress /> :
    <DragDropContext onDragEnd={onDragEnd}>
      <br/>
      <Box display="flex" flex-direction="row" marginLeft={2}>
        { 
          columnOrder.map(ownerId => { // each ownerId is unique here 
            return <TaskColumn key={ ownerId } ownerId={ ownerId } />
          })
        }
      </Box>

      <div>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Fab color="primary" aria-label="archive">
            <ArchiveIcon onClick={handleClickOpen}/>
          </Fab>
        </div>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Archive List
              </Typography>
            </Toolbar>
          </AppBar>
          <TaskArchive />
        </Dialog>
      </div>
      <ErrorSnackbar stateError={taskData.error} clearError={clearError} />
    </DragDropContext>
  )
}

const mapStateToProps = (state) => ({
  ccaDetails: state.ccaDetails.ccaList,
  taskData: state.taskData
})

export default connect(mapStateToProps) (TaskManager)
