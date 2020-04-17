import React from 'react'
import AddEditTaskDialog from './AddEditTaskDialog'
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import EditIcon from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography'

// ADD FUNCTIONALITY IF THE TASK IS CLICKED THEN THE DETAILS OF THE TASK ARE OPENED
  
export default function TaskCard({taskId, index, title, tasksData }) {
  return (
    <Draggable draggableId={taskId} index={index}>
      {
        (provided) => (
          <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
            <Card style={styles.cardContainer}>
              <AddEditTaskDialog taskId={taskId} title={title} tasksData={tasksData}/>
              <CardContent>
                <Typography gutterBottom>                
                  {title}
                </Typography>
                <Typography variant='body2' marginTop="100">
                  {"In Progress"}
                  <Typography variant='body2' align='right'>
                    {taskId}
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </div>
        )
      }
    </Draggable>
  )
}

const styles =  {
  cardContainer: {
    marginBottom: 10
  }
}
