import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from '../../helpers'


const initialState = {
  taskList: [],
  isPending: true,
  error: null,
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
  async(statusId, { rejectWithValue}) => {

    return await apiCaller('/api/task-manager/task-status/delete', {statusId: statusId}, 203,
    (data) => {
      return {id: statusId}
    },
    rejectWithValue)
  }
)

export const addTaskStatus = createAsyncThunk(
  'taskStatusDetails/addTaskStatus',
  async (taskStatusObject, {rejectWithValue}) => {
    const {name,color} = taskStatusObject

    return await apiCaller('/api/task-manager/task-status/create', {name, color: color}, 201,
    (data) => {
      return {id: data.statusId,taskStatusObject}
    },
    rejectWithValue)
  }
)

export const editTaskStatus = createAsyncThunk(
  'taskStatusDetails/editTaskStatus',
  async (taskStatusObject, { rejectWithValue}) => {
    const {id,name,color} = taskStatusObject
    
    return await apiCaller('api/task-manager/task-status/edit',{statusId: id, name, color: color}, 203,
    (data) => {
      return taskStatusObject
    },
    rejectWithValue)
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
    [deleteTaskStatus.fulfilled]: (state, action) => {
      let i = 0
      state.taskList.map((obj,index) => {
        if (obj.statusId === action.payload.statusId){
          i = index
        }  
      })  
      state.taskList.splice(i,1)
      state.error = 'Task Status Deleted'
    },
    [deleteTaskStatus.rejected]: (state, action) => {
      state.error = action.payload
    },

    [addTaskStatus.fulfilled]: (state, action) => {
        state.isPending = false
        state.taskList.push({
          id: action.payload.id,
          ...action.payload.taskStatusObject
        })
    },
    [addTaskStatus.rejected]: (state, action) => {
        state.error = action.payload
    },

    [editTaskStatus.fulfilled]: (state, action) => {
      let i = 0
      state.taskList.find((obj,index) => {
        if (obj.statusId === action.payload.id){
          i = index
        }
      })
      state.taskList[i] = action.payload
      state.error = 'Task Status Edited'
    },
    [editTaskStatus.rejected]: (state, action) => {
        state.error = action.payload

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