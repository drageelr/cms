import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

/**
  A temporary initial state has been created to test with the components and render meaningful
  on the screen
*/

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
  ]
}

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

    const fetchCall = () => {
      var promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(sampleState)
        }, 5000)
      })
      return promise
    }
    
    // return rejectWithValue("TBD")
    return sampleState
  }
)

export const changeFormStatus = createAsyncThunk(
  'requestListData/changeFormStatus',
  async (statusObj, { getState }) => {
    const { isPending } = getState().requestListData
    
    if (isPending != true) {
      return
    } 

    return statusObj
  }
)

const requestListData = createSlice ({
  name:'requestListData',
  initialState: initialState,
  reducers: {
    //  // this is reducer is called if they society delete their submission
    // deleteFormSubmission: (state,action) => {
    //   state.formData.splice(action.payload, 1)
    // }
  },

  extraReducers: {
    [fetchCCARequestList.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchCCARequestList.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.formDataList = action.payload.formDataList
      }
    },
    [fetchCCARequestList.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload.message
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
          if(request.id === requestId) {
            request.formStatus = status
          }
        })
      }
    },
    [changeFormStatus.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload.message
      }
    },
  }
})

export default requestListData.reducer