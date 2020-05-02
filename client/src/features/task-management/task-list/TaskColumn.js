import React from 'react'
import { connect } from 'react-redux'
import TaskCard from './TaskCard'
import TaskAddButton from './TaskAddButton'
import { Droppable } from 'react-beautiful-dnd'

/**
  Displays all the columns in the Task Manager. Each column belongs to a specific CCA user with
  their names as the title of the column.

  @param {string} ownerId id of a CCA user who owns the column
  @param {number} taskData from the corresponding redux slice, to retrieve all the data related
  the a particular owner to pass them on and populate the column.
*/

const columnStyle = {
  backgroundColor: '#dfe3e6',
  padding: 8,
  borderRadius: 3,
  width: 300,
  height: '100%',
  marginRight: 8,
  marginLeft: 3
}

export function TaskColumn({ownerId, taskData, ccaDetails}) {
  return (
    <div style={columnStyle}>
      {
        ccaDetails.map(ccaUserObj => {
          if (ownerId === ccaUserObj.ccaId) { // if the ownerId matches a ccaUserObj Id then print the ccaUser name for TM column header
            return (
              <h4 style={{textAlign: 'left'}}>
                {ccaUserObj.firstName + " " + ccaUserObj.lastName}
              </h4>
            )
          }
        })
      } 
      <Droppable droppableId={ownerId}>
      {
        (provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {
              taskData.taskList.map((taskObj, index) => {
                if (ownerId === taskObj.ownerId) {
                  return (
                    // <h1>hello</h1>
                    <TaskCard taskId={taskObj.taskId} index={index} key={taskObj.taskId}/>
                  )
                }
              })
            }
            {provided.placeholder}
            <TaskAddButton ownerId={ownerId} isColumn={false}/>
          </div>
        )
      }
      </Droppable>
    </div>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData,
  ccaDetails: state.ccaDetails.ccaList,
})

export default connect(mapStateToProps) (TaskColumn)
