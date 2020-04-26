import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// send the userId to the server and it will return me the list of forms corresponding to that id

const sampleState = {
  formDataList : [
    {
      id: "R-ID-1",
      title: "Design Form",
      date: "15/02/2019",
      society: "LUMUN",
      formStatus: 'Approved',
    },
    {
      id: "R-ID-2",
      society: "LUMUN",
      date: "12/01/2020",
      title: "Auditorium Booking",
      formStatus: 'Unassigned',
    }
  ],
  isPending: true,
  error: null
}

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
    
    const fetchCall = () => {
      var promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(sampleState)
        }, 5000)
      })
      return promise
    }
    
    return sampleState
  }
)

export const deleteSubmission = createAsyncThunk(
  'submissionListData/deleteSubmission',
  async (reqId, { getState, rejectWithValue}) => {
    const { isPending } = getState().submissionListData

    if (isPending != true) {
      return
    }
    
    // console.log(reqId)
    return reqId
  }
)

const submissionListData = createSlice ({
  name:'submissionListData',
  initialState: initialState,
  extraReducers: {
    [fetchSocietyList.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchSocietyList.fulfilled]: (state, action) => {      
      if (state.isPending === true) {
        state.isPending = false
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

export default submissionListData.reducer