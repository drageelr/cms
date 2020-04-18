import { createSlice } from "@reduxjs/toolkit"

const initalState = {
  form_id: 0, //form id
  user_id: 0, //user id of the user that submitted
  items_data: [ //only item data with ids
    {id: 0, data: "Hello Data"},
    {id: 1, data: "I am Data :-|"},
    {id: 2, option: 1},
    {id: 3, option: undefined},
    {id: 4, option: undefined}
  ]
}

const formData = createSlice({
  name: 'formData',
  initialState: initialState,
  reducers: {
    addTask: (state, action) => {
      tId += 1
      const taskId = `task-${tId}`
  
      const newTask = { 
        id: taskId,
        desc: action.payload.text
      }
  
      state.tasks[taskId] = newTask
      state.columns[action.payload.columnId].taskIds.push(taskId)
    },
      
      moveTask: (state, action) => {
        const { srcColumnId, srcIndex, dstColumnId, dstIndex, taskId } = action.payload
    
        const srcColumn = state.columns[srcColumnId]
        const dstColumn = state.columns[dstColumnId]
    
        srcColumn.taskIds.splice(srcIndex, 1) // delete the single task Id from src index from the source column
        dstColumn.taskIds.splice(dstIndex, 0, taskId) //insert it at dst index in the dst column
      },
      editTaskTitle: (state, action) => {
        const {taskId, text} = action.payload
        state.tasks[taskId].title = text
      }
  }
})

export const { addTask, editTaskTitle, moveTask } = formData.actions


export default formData.reducer