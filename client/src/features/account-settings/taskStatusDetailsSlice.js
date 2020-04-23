import {createSlice} from '@reduxjs/toolkit'

const initialState = [
  {
    id : 'ts-1',
    name: "Backlog",
    colorHex: '#808080',
  },
  {
    id : 'ts-2',
    name: "In Progress",
    colorHex: '#FF6347',
  },
  {
    id : 'ts-3',
    name: "Done",
    colorHex: '#00FF00',
  },
  {
    id : 'ts-4',
    name: "Urgent",
    colorHex: '#FF0000',
  },
]

let tsId = 4 
const taskStatusDetails = createSlice({
  name: "taskStatusDetails",
  initialState: initialState,
  reducers:{
    addTaskStatus: (state,action)=>{
      tsId += 1
      state.push({
        id: `ts-${tsId}`,
        name: action.payload.name,
        colorHex: action.payload.colorHex
      })
    },
    editTaskStatus: (state,action)=>{
      let i = 0
      state.map((obj,index) => {
        if (obj.id === action.payload.id){
          i = index
        }
      })
      state[i] = action.payload
    },
    deleteTaskStatus:(state,action)=>{
      let i = 0
      console.log(action.payload.id)
      state.map((obj,index) => {
        if (obj.id === action.payload.id){
          i = index
        }  
      })  

      state.splice(i,1)    
    }
  }
})

export const {addTaskStatus,editTaskStatus,deleteTaskStatus} = taskStatusDetails.actions

export default taskStatusDetails.reducer