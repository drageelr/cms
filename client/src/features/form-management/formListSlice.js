import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const sampleFormList = [
  {formId: 0, title: "Design Approval", creatorId: "Ashar Javaid", timestampModified: '02/13/2009 23:31:30', isPublic: false},
  {formId: 1, title: "Auditorium Booking", creatorId: "Ashar Javaid", timestampModified: '02/13/2009 22:31:30', isPublic: true},
  {formId: 2, title: "Petition", creatorId: "Zoraiz Qureshi", timestampModified: '02/13/2009 21:31:30', isPublic: true},
  {formId: 3, title: "Event Approval", creatorId: "Farkhanda Khan", timestampModified: '02/13/2009 20:31:30', isPublic: false},
  {formId: 4, title: "Service Request", creatorId: "Ashar Javaid", timestampModified: '02/13/2009 19:31:30', isPublic: true},
]

const initialState = {
  list: [],
  isPending: true,
  error: null
}

// const fId = 0
export const fetchFormList = createAsyncThunk(
  'formList/fetchFormList',
  async (_, { getState }) => {
    const { isPending } = getState().formList
    if (isPending != true) {
      return
    }

    return sampleFormList
  }
)

export const deleteForm = createAsyncThunk(
  'formList/deleteForm',
  async (index, { getState }) => {
    const { isPending, list } = getState().formList
    if (isPending != true) {
      return
    }

    return index
  }
)


export const toggleStatus = createAsyncThunk(
  'formList/changeFormStatus',
  async (index, { getState }) => {
    const { isPending, formList } = getState().formList
    if (isPending != true) {
      return
    }

    return index
  }
)

export const duplicateForm = createAsyncThunk(
  'formList/duplicateForm',
  async (index, { getState }) => {
    const { isPending, formList } = getState().formList
    if (isPending != true) {
      return
    }

    return index
  }
)


const formList = createSlice({
  name: 'formList',
  initialState: initialState,
  reducers: {
    clearError: (state, action) => {
      state.error = null
    },
  },

  extraReducers: {
    [fetchFormList.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchFormList.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.list = action.payload
      }
    },
    [fetchFormList.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [deleteForm.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [deleteForm.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        let i = 0
        state.list.map((obj,index) => {
          if (obj.id === action.payload){
            i = index
          }  
        })  
        state.list.splice(i,1)
      }
    },
    [deleteForm.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [duplicateForm.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [duplicateForm.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        const idx = action.payload
        state.list.splice(idx,0,{...state.list[idx]})
      }
    },
    [duplicateForm.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [toggleStatus.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [toggleStatus.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        const idx = action.payload
        state.list[idx].isPublic = !state.list[idx].isPublic
      }
    },
    [toggleStatus.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
  }
})

export const { clearError } = formList.actions


export default formList.reducer