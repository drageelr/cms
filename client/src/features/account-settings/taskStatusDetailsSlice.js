import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

const sampleState = {
  taskList: [
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
  ],
  isPending: true,
  error:''
}

const initialState = {
  taskList: [],
  isPending: true,
  error:''
}

export const fetchTaskStatus = createAsyncThunk(
  'taskStatusDetails/fetchTaskStatus',
  async(_, { getState }) => {
    const { isPending } = getState().taskStatusDetails
    if (isPending != true) {
      return
    }
    
    const fetchCall = () => {
      var promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(sampleState)
        }, 1000)
      })
      return promise
    }

    const result = await fetchCall()
    console.log(sampleState)
    return result
  }
)

export const deleteTaskStatus = createAsyncThunk(
  'taskStatusDetails/deleteTaskStatus',
  async(id, { getState }) => {
    const { isPending } = getState().taskStatusDetails
    if (isPending != true) {
      return
    }
    return id
  }
)

export const addTaskStatus = createAsyncThunk(
  'taskStatusDetails/addTaskStatus',
  async (taskStatusObject, { getState }) => {
    const { isPending } = getState().taskStatusDetails
    if (isPending != true) {
      return
    }
    return {id: 'ts-3',taskStatusObject : taskStatusObject}
  }
)

export const editTaskStatus = createAsyncThunk(
  'taskStatusDetails/editTaskStatus',
  async (taskStatusObject, { getState }) => {
    const { isPending } = getState().taskStatusDetails
    if (isPending != true) {
      return
    }
    return taskStatusObject
  }
)

// let tsId = 4 
const taskStatusDetails = createSlice({
  name: "taskStatusDetails",
  initialState: initialState,
  reducers:{
    // addTaskStatus: (state,action)=>{
    //   tsId += 1
    //   state.push({
    //     id: `ts-${tsId}`,
    //     name: action.payload.name,
    //     colorHex: action.payload.colorHex
    //   })
    // },
    // editTaskStatus: (state,action)=>{
    //   let i = 0
    //   state.map((obj,index) => {
    //     if (obj.id === action.payload.id){
    //       i = index
    //     }
    //   })
    //   state[i] = action.payload
    // },
    // deleteTaskStatus:(state,action)=>{
    //   let i = 0
    //   console.log(action.payload.id)
    //   state.map((obj,index) => {
    //     if (obj.id === action.payload.id){
    //       i = index
    //     }  
    //   })  

    //   state.splice(i,1)    
    // }
  },
  
  extraReducers: {
    [deleteTaskStatus.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [deleteTaskStatus.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        let i = 0
        console.log(action.payload.id)
        state.taskList.map((obj,index) => {
          if (obj.id === action.payload.id){
            i = index
          }  
        })  
        state.taskList.splice(i,1)
      }
    },
    [deleteTaskStatus.rejected]: (state, action) => {
      console.log(action)
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.error
      }
    },

    [addTaskStatus.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [addTaskStatus.fulfilled]: (state, action) => {
      console.log("hello",action.payload)
      if (state.isPending === true){
        state.isPending = false
        state.taskList.push({
        id : action.payload.id, 
        name: action.payload.taskStatusObject.name,
        colorHex: action.payload.taskStatusObject.colorHex,
      })
      } 
    },
    [addTaskStatus.rejected]: (state, action) => {
      console.log(action)
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.error
      }
    },

    [editTaskStatus.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [editTaskStatus.fulfilled]: (state, action) => {
      if(state.isPending === true){
        state.isPending = false
        let i = 0
        state.taskList.find((obj,index) => {
          if (obj.id === action.payload.id){
            i = index
          }
        })
        state.taskList[i] = action.payload
      }
    },
    [editTaskStatus.rejected]: (state, action) => {
      console.log(action)
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.error
      }
    },
    [fetchTaskStatus.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchTaskStatus.fulfilled]: (state, action) => {
      if(state.isPending === true){
        state.isPending = false
        state.taskList = action.payload.taskList
        // console.log(state)
      }
    },
    [fetchTaskStatus.rejected]: (state, action) => {
      console.log(action)
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.error
      }
    } 
}})

// const {addTaskStatus,editTaskStatus,deleteTaskStatus} = taskStatusDetails.actions

export default taskStatusDetails.reducer