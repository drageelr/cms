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
  error:'', 
}

const initialState = {
  taskList: [],
  isPending: true,
  error:'',
}

export const fetchTaskStatus = createAsyncThunk(
  'taskStatusDetails/fetchTaskStatus',
  async(_, { getState, rejectWithValue}) => {
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
    return result
  }
)

export const deleteTaskStatus = createAsyncThunk(
  'taskStatusDetails/deleteTaskStatus',
  async(id, { getState, rejectWithValue}) => {
    const { isPending } = getState().taskStatusDetails
    if (isPending != true) {
      return
    }
    return id
  }
)

export const addTaskStatus = createAsyncThunk(
  'taskStatusDetails/addTaskStatus',
  async (taskStatusObject, { getState, rejectWithValue}) => {
    const { isPending } = getState().taskStatusDetails
    if (isPending != true) {
      return
    }
    return {id: 'ts-3',taskStatusObject : taskStatusObject}
  }
)

export const editTaskStatus = createAsyncThunk(
  'taskStatusDetails/editTaskStatus',
  async (taskStatusObject, { getState, rejectWithValue}) => {
    const { isPending } = getState().taskStatusDetails
    if (isPending != true) {
      return
    }
    return taskStatusObject
  }
)

let tsId = 4 
const taskStatusDetails = createSlice({
  name: "taskStatusDetails",
  initialState: initialState,
  reducers:{
    clearError: (state, action)=>{
      state.error = null
    }
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
        state.taskList.map((obj,index) => {
          if (obj.id === action.payload.id){
            i = index
          }  
        })  
        state.taskList.splice(i,1)
        state.error = 'Task Status Deleted'
      }
    },
    [deleteTaskStatus.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [addTaskStatus.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [addTaskStatus.fulfilled]: (state, action) => {
      if (state.isPending === true){
        state.isPending = false
        state.taskList.push({
        id : action.payload.id, 
        name: action.payload.taskStatusObject.name,
        colorHex: action.payload.taskStatusObject.colorHex,
      })
      state.error = 'Task Status Added'
      } 
    },
    [addTaskStatus.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
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
        state.error = 'Task Status Added'
      }
    },
    [editTaskStatus.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
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
        state.error = 'Task Status Panel Loaded'
      }
    },
    [fetchTaskStatus.rejected]: (state, action) => {
      if (state.isPending === true) {
        // state.isPending = false
        state.error = action.payload
      }
    } 
}})

export const {clearError} = taskStatusDetails.actions

export default taskStatusDetails.reducer