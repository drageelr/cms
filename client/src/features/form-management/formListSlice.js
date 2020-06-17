import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from '../../helpers'

const initialState = {
  list: [],
  isPending: true,
  error: null
}

export const fetchFormList = createAsyncThunk(
  'formList/fetchFormList',
  async (_, { getState, rejectWithValue}) => {
    const { isPending } = getState().formList
    if (!isPending) {
      return
    }

    return await apiCaller('/api/form/fetch-list', {},
    200, (data)=>data.formList, rejectWithValue)
  }
)


export const deleteForm = createAsyncThunk(
  'formList/deleteForm',
  async (formId, { rejectWithValue}) => {

    return await apiCaller('/api/form/delete', {formId},
    200, (data)=>data.index, rejectWithValue)
  }
)


export const changeFormStatus = createAsyncThunk(
  'formList/changeFormStatus',
  async ({formId, isPublic, index}, {rejectWithValue}) => {
    
    return await apiCaller('/api/form/change-status', {formId, isPublic},
    203, (data)=>({index}), rejectWithValue)
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

    [deleteForm.fulfilled]: (state, action) => {
      let i = 0
      state.list.forEach((obj,index) => {
        if (obj.id === action.payload){
          i = index
        }  
      })  
      state.list.splice(i,1)
      state.error = "Form and all related Submissions, Tasks and SubTasks have been deleted!"
    },
    [deleteForm.rejected]: (state, action) => {
      state.error = action.payload
    },

    [changeFormStatus.fulfilled]: (state, action) => {
      const idx = action.payload.index
      state.list[idx].isPublic = !state.list[idx].isPublic
    },

    [changeFormStatus.rejected]: (state, action) => {
      state.error = action.payload
    },
  }
})

export const { clearError } = formList.actions


export default formList.reducer