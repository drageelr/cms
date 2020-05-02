import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from "../../helpers" 
import { useDispatch } from 'react-redux'
import { fetchForm } from './formTemplateSlice'


const initialState = {
  id: 0, //form data id
  formId: 0, //form Id
  userId: 0, //user id of the user that submitted
  formStatus: '',
  ccaNotes: [],
  societyNotes: [],
  itemsData: {},
  timestampCreated: '',
  timestampModified: '',
  createMode: true,
  isPending: true,
  error: null
}

export const fetchFormData = createAsyncThunk(
  'formData/fetchFormData',
  async (formDataId, { getState, rejectWithValue }) => {
    const { isPending } = getState().formData
    if (isPending != true) {
      return
    }
    const submissionId = Number(formDataId)

    return await apiCaller('/api/submission/fetch', {submissionId}, 200, 
    (data) => {
      let itemsData = {}
      data.itemsData.forEach(itemData => {
        itemsData[itemData.itemId] = itemData.data
      })
      
      return {
        id: submissionId,
        formId: data.formId,
        ccaNotes: data.ccaNotes,
        societyNotes: data.societyNotes,
        itemsData
      }
    }, 
    rejectWithValue)
  }
)


export const createFormData = createAsyncThunk(
  'formData/createFormData',
  async (_, {getState, rejectWithValue }) => {
    const formId = getState().formTemplate.id
    const itemsData = getState().formData.itemsData
    
    let serverItemsData = []
    for (let [itemId, data] of Object.entries(itemsData)) {
      serverItemsData.push({itemId, data})
    }

    // only required to send form Id and items Data when creating a form
    return await apiCaller('/api/submission/submit', {formId, itemsData: serverItemsData}, 200, 
    (data) => ({
      id: data.submissionId,
      timestampCreated: data.timestampCreated,
      timestampModified: data.timestampModified
    }), 
    rejectWithValue)
  }
)

export const editFormData = createAsyncThunk(
  'formData/editFormData',
  async (_, {getState, rejectWithValue }) => {
    const formId = getState().formTemplate.id
    const submissionId = getState().formData.id
    const itemsData = getState().formData.itemsData

    let serverItemsData = []
    for (let [itemId, data] of Object.entries(itemsData)) {
      serverItemsData.push({itemId, data})
    }

    console.log("EDIT SEND", {formId, submissionId, itemsData: serverItemsData})

    return await apiCaller('/api/submission/submit', {formId, submissionId, itemsData: serverItemsData}, 200, 
    (data) => ({}), 
    rejectWithValue)

  }
)

export const deleteFormData = createAsyncThunk(
  'formData/deleteFormData',
  async (formDataId, {rejectWithValue }) => {

    return await apiCaller('/api/form/delete', {formId: formDataId}, 203, 
    (data) => {
      return ''
    }, 
    rejectWithValue) 
  }
)


export const addCcaNote = createAsyncThunk(
  'formData/addCcaNote',
  async ({formId, note}, {rejectWithValue }) => {

    console.log(formId, note)
    
    return await apiCaller('/api/submission/cca/add-note', {
      submissionId: formId, 
      note: note
    }, 203, 
    (data) => {
      return {isPending: false, error: '', formId: formId, note: note}
    }, 
    rejectWithValue)
  }
)

export const addSocietyNote = createAsyncThunk(
  'formData/addSocietyNote',
  async ({formId, note}, {rejectWithValue }) => {

    console.log(formId, note)

    return await apiCaller('/api/submission/society/add-note', {
      submissionId: formId, 
      note: note
    }, 203, 
    (data) => {
      return {isPending: false, error: '', formId: formId, note: note}
    }, 
    rejectWithValue)
  }
)

const formData = createSlice({
  name: 'formData',
  initialState: initialState,
  reducers: {
    setCreateMode: (state, action) => {
      state.createMode = action.payload.createMode
    },

    setItemData: (state, action) => {
      state.itemsData[action.payload.id] = action.payload.data
    },

    clearError: (state, action) => {
      state.error = null
    },
  },
  extraReducers: {
    [fetchFormData.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchFormData.fulfilled]: (state, action) => {
      if (state.isPending === true) {
      
        return {
          id: action.payload.id,
          formId: action.payload.formId,
          ccaNotes: action.payload.ccaNotes,
          societyNotes: action.payload.societyNotes,
          itemsData: action.payload.itemsData,
          createMode: false,
          isPending: false,
          error: null,
        }
      }
    },
    [fetchFormData.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
    [editFormData.fulfilled]: (state, action) => {
      state.error = 'Edited Form Data'
    },
    [editFormData.rejected]: (state, action) => {
      state.error = action.payload
    },
    [deleteFormData.fulfilled]: (state, action) => {
      state.error = 'Deleted Form Data'
    },
    [deleteFormData.rejected]: (state, action) => {
      state.error = action.payload
    },
    [createFormData.fulfilled]: (state, action) => {
      state.error = 'Created Form Data'
      state.id = action.payload.id 
      state.createMode = false
    },
    [createFormData.rejected]: (state, action) => {
      state.error = action.payload
    },

    [addCcaNote.fulfilled]: (state, action) => {
      state.ccaNote = action.payload.note
    },
    [addCcaNote.rejected]: (state, action) => {
      state.error = action.payload
    },

    [addSocietyNote.fulfilled]: (state, action) => {
      state.societyNotes.push(action.payload.note)
    },
    [addSocietyNote.rejected]: (state, action) => {
      state.error = action.payload
    },
  }
})

export const { setItemData, clearError, setCreateMode } = formData.actions

export default formData.reducer