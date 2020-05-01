import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller} from "../../helpers"

/**
A temporary initial state has been created to test with the components and render meaningful
on the screen
*/

// const sampleState = {
// formDataList : [
// {
// societyId: "1",
// status: "Approved",
// formId: "REQ-1",
// formTitle: "Design Form",
// societyName: "LUMUN",
// societyNameInitials: "lumun",
// timestampCreated: "30/05/2020",
// timestampModified: "01/04/2020"
// },
// ],
// isPending: true,
// error: null
// }

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
    (data) => {
      return {isPending: false, error: '' , ccaList: data.submissions}
    }, 
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
    (data) => {
      return {isPending: false, error: '', requestId: requestId, status: status}
    }, 
    rejectWithValue)
  }
)

const requestListData = createSlice ({
  name:'requestListData',
  initialState: initialState,
  
  extraReducers: {
    [fetchCCARequestList.pending]: (state, action) => {
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

    [changeFormStatus.pending]: (state, action) => {
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

export default requestListData.reducer
