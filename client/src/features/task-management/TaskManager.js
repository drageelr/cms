import React, { useEffect, useState } from 'react'
import {connect} from 'react-redux'
import TaskColumn from './task-list/TaskColumn'
import { moveTask, fetchTaskManager } from './taskDataSlice'
import TaskArchive from './task-archive/TaskArchive'
import { DragDropContext } from 'react-beautiful-dnd'
import { Fab, Dialog, AppBar, Toolbar, Typography, Slide, IconButton, makeStyles, Box } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import ArchiveIcon from '@material-ui/icons/Archive'
import { fetchCCAAccounts } from '../account-settings/ccaDetailsSlice'
import { fetchTaskStatus } from '../account-settings/taskStatusDetailsSlice'
import { fetchCCARequestList } from '../request-management/requestListSlice'

/**
  The parent component that initiates the Task Manager. 

  @param {object} columnData from the corresponding redux slice, to retrieve all the data for 
  each column and pass it on to the sub components
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

function TaskManager({ ccaDetails, dispatch }) {

  // fetch the CCAAccountsList(before fetching the Task Manager) and save it in the ccaList Initial state in 
  // ccaDetailsSlice and then that slice will be used to extract CCA account details for Task Manager, also fetch
  // the task status as they are to be used for task cards
  useEffect(() => { 
    dispatch(fetchCCAAccounts())
    dispatch(fetchCCARequestList())
    dispatch(fetchTaskStatus())
  }, [])

  // we will decide and make columns based on the CCA Accounts List, the order in which the CCA Accounts List is
  // fetched, will be the order of the columns and for each account there will be a column in the Task Manager
  let columnOrder = []
  ccaDetails.map(ccaObj => {
    columnOrder.push(ccaObj.ccaId)
  })
  columnOrder = Array.from(new Set(columnOrder))

  /*
  A fetch call to the backend to FETCH the TASK MANAGER, once I get the taskList, I'll have to make a list of 
  all the columns, by going through each task and adding each unique ownerId to an array called columnOrder
  (will do this in the backend when the fetch task is fulfilled and in the fetchtaskfulfilled extraReducer)
  */
  useEffect(() => { 
    dispatch(fetchTaskManager())
  }, [])

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
    
    dispatch(moveTask({  // probably call the edit API as we want to update the ownerID of the task
      taskId: draggableId,
      srcColumnId: Number(source.droppableId),
      // srcIndex: source.index,
      dstColumnId: Number(destination.droppableId),
      // dstIndex:  destination.index,
    }))
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <br/>
      <Box display="flex" flex-direction="row" marginLeft={2}>
        { 
          columnOrder.map(ownerId => { // each ownerId is unique here 
          return <TaskColumn 
                key={ ownerId }
                ownerId={ ownerId }                
              />
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
    </DragDropContext>
  )
}

const mapStateToProps = (state) => ({
  ccaDetails: state.ccaDetails.ccaList
})

export default connect(mapStateToProps) (TaskManager)
