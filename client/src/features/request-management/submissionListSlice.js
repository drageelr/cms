import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from '../../helpers'

const initialState = {
  formDataList: [],
  isPending: true,
  error: null
}

export const fetchSocietyList = createAsyncThunk(
  'submissionListData/fetchSocietyList',
  async (_, { getState, rejectWithValue}) => {
    const { isPending } = getState().submissionListData
    if (isPending != true) {
      return
    } 
    
    return await apiCaller('/api/submission/fetch-list', {}, 200, 
    (data) => ({formDataList: data.submissions}), 
    rejectWithValue)
  }
)

export const deleteSubmission = createAsyncThunk(
  'submissionListData/deleteSubmission',
  async (reqId, { getState, rejectWithValue}) => {
    const { isPending } = getState().submissionListData

    if (isPending != true) {
      return
    }
    
    return reqId
  }
)

const submissionListData = createSlice ({
  name:'submissionListData',
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: {
    [fetchSocietyList.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchSocietyList.fulfilled]: (state, action) => {      
      if (state.isPending === true) {
        state.isPending = false
        state.error = null
        state.formDataList = action.payload.formDataList
      }
    },
    [fetchSocietyList.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [deleteSubmission.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [deleteSubmission.fulfilled]: (state, action) => {
      const {reqId} = action.payload
      if (state.isPending === true) {
        state.isPending = false
        state.formDataList.map((formObj, index) => {
          if (formObj.id === reqId) {
            state.formDataList.splice(index, 1)
          }
        })
      }
    },
    [deleteSubmission.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
  }
})

export const { clearError } = submissionListData.actions

export default submissionListData.reducer