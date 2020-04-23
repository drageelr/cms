import React from 'react'
import TaskCard from './TaskCard'
import TaskAddButton from './TaskAddButton'
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { connect } from 'react-redux'

const ColumnContainer = styled.div`
  background-color: #dfe3e6;
  padding: 8px;
  border-radius: 3px;
  width: 300px;
  height: 100%;
  margin-right: 8px;
  margin-left: 3px
`
export function TaskColumn({ownerId, taskData}) {
  return (
    <ColumnContainer>
      <h4 style={{textAlign: 'left'}}> {taskData.columns[ownerId].title} </h4>
      <Droppable droppableId={ownerId}>
      {
        (provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            { taskData.columns[ownerId].taskIds.map((taskId, index) => 
              <TaskCard taskId={taskData.tasks[taskId].id} index={index} key={taskData.tasks[taskId]}/>
            )}
            {provided.placeholder}
            <TaskAddButton ownerId={ownerId} isColumn={false}/>
          </div>
        )
      }
      </Droppable>
    </ColumnContainer>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData,
})

export default connect(mapStateToProps) (TaskColumn)
