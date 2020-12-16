import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from "../../helpers"

const initialState = {
  formDataList: [],
  isPending: true,
  error: null
}

export const fetchCCARequestList = createAsyncThunk(
  'requestListData/fetchCCARequestList',
  async (body, { getState, rejectWithValue }) => {
    const { isPending } = getState().requestListData

    if (!isPending) {
      return
    } 

    return await apiCaller('/api/submission/fetch-list', body, 200, 
    (data) => ({isPending: false, error: '' , ccaList: data.submissions}), 
    rejectWithValue)  
  }
)

export const changeFormStatus = createAsyncThunk(
  'requestListData/changeFormStatus',
  async ({submissionId, status, issue}, {rejectWithValue}) => {
    const body = issue === "" ? {submissionId, status} : {submissionId, status, issue} 
    return await apiCaller('/api/submission/update-status', body, 203, 
    (data) => ({submissionId, status}), 
    rejectWithValue)
  }
)

const requestListData = createSlice ({
  name:'requestListData',
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },

  extraReducers: {
    [fetchCCARequestList.pending]: (state) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchCCARequestList.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.formDataList = action.payload.ccaList
      }
    },
    [fetchCCARequestList.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [changeFormStatus.fulfilled]: (state, action) => {
      const {submissionId, status} = action.payload
      state.formDataList.forEach(submission => {
        if(submission.formId === submissionId) {
          submission.status = status
        }
      })
    },
    [changeFormStatus.rejected]: (state, action) => {
      state.error = action.payload
    },
  }
})

export const { clearError } = requestListData.actions


export default requestListData.reducer
