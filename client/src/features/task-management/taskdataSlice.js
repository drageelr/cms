import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  columnOrder: ['column-1','column-2'],
  tasks: {
    'task-1': {id: 'task-1', title: 'We created a static list and a static card!', desc: "hello"},
    'task-2': {id: 'task-2', title: 'We used a mix between Material UI React and Styled components!', desc: "world"},
    'task-3': {id: 'task-3', title: 'We used the "react-beautiful-dnd" to make the cards draggable between columns.', desc: "kamal"},
    'task-4': {id: 'task-4', title: 'We also used createSlice to implement reducers and action creators.', desc: "banda"}
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Ashar Javaid',
      taskIds: ['task-1', 'task-2']
    },
    'column-2': {
      id: 'column-2',
      title: 'Farkhanda Khan',
      taskIds: ['task-3', 'task-4']
    }
  }
}

let cId = 2
let tId = 4

const taskdata = createSlice({
  name: 'taskData',
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

export const { addTask, editTaskTitle, moveTask } = taskdata.actions


export default taskdata.reducer