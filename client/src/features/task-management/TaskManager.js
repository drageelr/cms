import React from 'react'
import {connect} from 'react-redux'
import TaskColumn from './task-list/TaskColumn'
import { moveTask } from './taskDataSlice'
import TaskArchive from './task-archive/TaskArchiveList'
import { DragDropContext } from 'react-beautiful-dnd'
import { Fab, Dialog, AppBar, Toolbar, Typography, Slide, IconButton, makeStyles, Box } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import ArchiveIcon from '@material-ui/icons/Archive'

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

function TaskManager({ columnData, dispatch }) {
  
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
    
    dispatch(moveTask({ 
      srcColumnId: source.droppableId,
      srcIndex: source.index,
      dstColumnId: destination.droppableId,
      dstIndex:  destination.index,
      taskId: draggableId,
    }))
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <br/>
      <Box display="flex" flex-direction="row" marginLeft={2}>
        { 
          columnData.map(ownerId => {
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
  columnData: state.taskData.columnOrder,
})

export default connect(mapStateToProps) (TaskManager)
