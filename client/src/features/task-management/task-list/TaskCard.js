import React from 'react'
import AddEditTaskDialog from './AddEditTaskDialog'
import { Draggable } from "react-beautiful-dnd"
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

export default function TaskCard({taskId, index, title, columnId, tasksData }) {

  let taskStatus="" 
  tasksData.map(item => {
    if (item.id === taskId) {
      taskStatus=item.status
    }
  })
  return (
    <Draggable draggableId={taskId} index={index}>
      {
        (provided) => (
          <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
            <Card style={styles.cardContainer}>
              <CardContent>
                <Typography gutterBottom>                
                  {title}
                  <AddEditTaskDialog taskId={taskId} title={title} columnId={columnId} tasksData={tasksData} />
                </Typography>
                <Typography variant='body2' alignItems="right">
                  {taskStatus}
                  <Typography variant='body2' align='right' color="inherit">
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
