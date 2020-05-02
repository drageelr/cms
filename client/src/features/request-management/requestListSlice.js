import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller} from "../../helpers"

const initialState = {
  formDataList: [],
  isPending: true,
  error: null
}

export const fetchCCARequestList = createAsyncThunk(
  'requestListData/fetchCCARequestList',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().requestListData

    if (isPending != true) {
      return
    } 

    return await apiCaller('/api/submission/fetch-list', {}, 200, 
    (data) => ({isPending: false, error: '' , ccaList: data.submissions}), 
    rejectWithValue)  
  }
)

export const changeFormStatus = createAsyncThunk(
  'requestListData/changeFormStatus',
  async ({requestId, status}, { getState, rejectWithValue}) => {
    const { isPending } = getState().requestListData

    if (isPending != true) {
      return
    } 

    return await apiCaller('/api/submission/update-status', {
      submissionId: requestId ,
      status: status,
      issue: "hello world" // probably remove this at the end/ used for sending emails
    }, 203, 
    (data) => ({isPending: false, error: '', requestId: requestId, status: status}), 
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

    [changeFormStatus.pending]: (state) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [changeFormStatus.fulfilled]: (state, action) => {
      const {requestId, status} = action.payload
      if (state.isPending === true) {
        state.isPending = false
        state.formDataList.map(request => {
          if(request.formId === requestId) {
            request.status = status
          }
        })
      }
    },
    [changeFormStatus.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
  }
})

export const { clearError } = requestListData.actions

export default requestListData.reducer
