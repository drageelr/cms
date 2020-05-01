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
    if (isPending != true) {
      return
    }

    return await apiCaller('/api/form/fetch-list', {},
    200, (data)=>data.formList, rejectWithValue)
  }
)


export const deleteForm = createAsyncThunk(
  'formList/deleteForm',
  async (index, { rejectWithValue}) => {

    // return await apiCaller('/api/form/delete', {},
    // 200, (data)=>data.index, rejectWithValue)
    return rejectWithValue("API to be integrated. Deleting locally.")
  }
)


export const toggleStatus = createAsyncThunk(
  'formList/changeFormStatus',
  async (index, {rejectWithValue}) => {
    // return await apiCaller('/api/form/delete', {},
    // 200, (data)=>data.index, rejectWithValue)
    return index
  }
)

export const duplicateForm = createAsyncThunk(
  'formList/duplicateForm',
  async (index, {rejectWithValue}) => {
    // return await apiCaller('/api/form/delete', {},
    // 200, (data)=>data.index, rejectWithValue)
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

    [deleteForm.fulfilled]: (state, action) => {
      let i = 0
      state.list.map((obj,index) => {
        if (obj.id === action.payload){
          i = index
        }  
      })  
      state.list.splice(i,1)
    },
    [deleteForm.rejected]: (state, action) => {
      state.error = action.payload
    },

    [duplicateForm.fulfilled]: (state, action) => {
      const idx = action.payload
      state.list.splice(idx,0,{...state.list[idx]})
      state.error = ("API to be created. Duplicating locally.")
    },
    [duplicateForm.rejected]: (state, action) => {
      state.error = action.payload
    },

    [toggleStatus.fulfilled]: (state, action) => {
      const idx = action.payload
      state.list[idx].isPublic = !state.list[idx].isPublic
      state.error = ("API to be created. Changing status locally.")
    },
    [toggleStatus.rejected]: (state, action) => {
      state.error = action.payload
    },
  }
})

export const { clearError } = formList.actions


export default formList.reducer