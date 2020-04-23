import React from 'react'
import TaskColumn from './task-list/TaskColumn'
import {connect} from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { moveTask } from './taskDataSlice'
import TaskArchive from './task-archive/TaskArchive'
import Fab from '@material-ui/core/Fab'
import ArchiveIcon from '@material-ui/icons/Archive'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

const TaskManagerContainer = styled.div`
  display: flex;
  flex-direction: row;
`

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

function TaskManager({ taskData, dispatch }) {
  
  const classes = useStyles()
  const [open, setOpen] = React.useState(false);

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
      <TaskManagerContainer>
        { 
          taskData.columnOrder.map(ownerId => {
          return <TaskColumn 
                key={ ownerId }
                ownerId={ ownerId }                
              />
          })
        }
      </TaskManagerContainer>

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
  taskData: state.taskData,
})

export default connect(mapStateToProps) (TaskManager)
