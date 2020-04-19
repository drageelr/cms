import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  columnOrder: ['column-1','column-2'],
  archiveList: [

  ],
  tasks: {
    'task-1': {id: 'task-1', title: 'Group Logs', desc: "hello world", ownerId:'column-1', status: 'In Progess'},
    'task-2': {id: 'task-2', title: 'Documents', desc: "world! good bye", ownerId:'column-1', status: 'Approved'},
    'task-3': {id: 'task-3', title: 'Github', desc: "whats up",  ownerId:'column-2', status: 'Pending'},
    'task-4': {id: 'task-4', title: 'Request Management', desc: "accept my freind request", ownerId:'column-2', status: 'Rejected'},
    'task-10': {id: 'task-10', title: 'Aud Booking', desc: "Book aud now.",  ownerId:'column-2', status: 'Approved'},
    'task-7': {id: 'task-7', title: 'Any Problem', desc: "ok no problem!", ownerId:'column-1', status: 'Rejected'}
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
      },
      archiveTask: (state, action) => { // send the task id to the server and create an archive of it
        const {taskId, columnId} = action.payload
        state.columns[columnId].taskIds.map((id, index) => {
          if (taskId === id) {
            var filteredAry = state.columns[columnId].taskIds.filter(function(e) { return e !== id })
            const obj = state.tasks[taskId]
            // console.log(obj)
            state.archiveList.push(obj)
            // delete state.tasks[taskId]
            state.columns[columnId].taskIds = filteredAry
          }
        })
        // console.log(state.archiveList[0].ownerId)
      },
      unArchiveTask: (state, action) => { // when i get the archive tasks from server, i will also get the taskowner id with it so then adding task back to column is simple, for now hardcoding the column
        const {taskId,ownerId} = action.payload 
        state.columns[ownerId].taskIds.push(taskId) // put the task back in owners list
        state.archiveList.map(id => {
          var filteredAry = state.archiveList.filter(function(e) { return e.id !== taskId })
          state.archiveList = filteredAry
        })
      }
  }
})

export const { addTask, editTaskTitle, moveTask, archiveTask, unArchiveTask} = taskdata.actions


export default taskdata.reducer