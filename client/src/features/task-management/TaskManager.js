import React from 'react'
import TaskColumn from './task-list/TaskColumn'
import TaskAddButton from './task-list/TaskAddButton'
import {connect} from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { moveTask } from './taskdataSlice'
import TaskArchive from './task-archive/TaskArchive'

const TaskManagerContainer = styled.div`
  display: flex;
  flex-direction: row;
`

function TaskManager({ taskData, dispatch }) {
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
          taskData.columnOrder.map(columnId => {
          const column = taskData.columns[columnId]

          return <TaskColumn 
                key={ column.id }
                columnId={ columnId }
                title={ column.title }
                tasks={ column.taskIds.map(taskId => 
                  taskData.tasks[taskId]
                )}
              />
          })
        }
      </TaskManagerContainer>
    </DragDropContext>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData,
})

export default connect(mapStateToProps) (TaskManager)
