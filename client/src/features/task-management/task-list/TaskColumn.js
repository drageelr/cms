import React from 'react'
import TaskCard from './TaskCard'
import TaskAddButton from './TaskAddButton'
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'

const ColumnContainer = styled.div`
  background-color: #dfe3e6;
  padding: 8px;
  border-radius: 3px;
  width: 300px;
  height: 100%;
  margin-right: 8px;
  margin-left: 3px
`
export default function TaskColumn({columnId, title, tasks}) {
  return (
    <ColumnContainer>
      <h4 style={{textAlign: 'left'}}> {title} </h4>
      <Droppable droppableId={columnId}>
      {
        (provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            { tasks.map((task, index) => 
              <TaskCard taskId={task.id} index={index} key={task.id} title={task.title} tasksData={tasks}/>
            )}
            {provided.placeholder}
            <TaskAddButton columnId={columnId} isColumn={false}/>
          </div>
        )
      }
      </Droppable>
    </ColumnContainer>
  )
}

