import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from '../../helpers'

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
    
    return await apiCaller('/api/task-manager/task-status/fetch-all', {}, 200,
    (data) => {
      return {taskList: data.statuses}
    },
    rejectWithValue)

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
    const {name,color} = taskStatusObject
    return await apiCaller('/api/task-manager/task-status/create', {name: name, color: color}, 201,
    (data) => {
      return {statusId: data.statusId,taskStatusObject}
    },
    rejectWithValue)
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
      console.log("das: ", action.payload)
      if(state.isPending === true){
        state.isPending = false

        state.taskList.push({
          id: action.payload.id,
          ...action.payload.taskStatusObject
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
      // console.log("fetchTaskStatus.fulfilled")
      if(state.isPending === true){
        state.isPending = false
        // console.log(action.payload)
        state.taskList = action.payload.taskList
        state.error = 'Task Status Panel Loaded'
      }
    },
    [fetchTaskStatus.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    } 
}})

export const {clearError} = taskStatusDetails.actions

export default taskStatusDetails.reducer