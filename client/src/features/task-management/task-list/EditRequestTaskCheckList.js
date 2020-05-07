import React from 'react'
import { connect } from 'react-redux'
import { Checkbox, FormControlLabel } from '@material-ui/core'

export function RequestCheckList({taskId, taskData, dispatch}) {
  console.log("gere")
  return (
    <div>
      {
        taskData.taskList.map(task => {
          if(task.taskId === taskId) {
            task.subtasks.map(subtask => {
              console.log(subtask.description)
              return <div>
                  hello
                  {/* <FormControlLabel
                    control={
                      <Checkbox
                        disabled
                        checked
                        color='primary'
                      />
                    }
                    label={subtask.description}
                  /> */}
                </div>
              
            })
          }
        })
      }
    </div>
  )
}

const mapStateToStates = (state) => ({
  taskData: state.taskData
})

export default connect(mapStateToStates)(RequestCheckList)