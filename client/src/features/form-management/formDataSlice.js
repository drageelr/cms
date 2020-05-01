import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const sampleState = {
  id: 0, //form data id
  formId: 0, //form Id
  userId: 0, //user id of the user that submitted
  formStatus: 'Pending',
  ccaNote: '1. Please do not worry if you are unable to submit on time! 2. Read the instructions carefully!1. Please do not worry if you are unable to submit on time! 2. Read the instructions carefully!1. Please do not worry if',
  ccaNoteTimestampModified: '03/13/2009 21:31:30',
  societyNotes: ['Vendor change, check section \'Vendors\'', 'Sent for approval'],
  itemsData: { //itemId : itemData
    4: true, //checkbox
    2: 'Small', //dropdown
    3: 'Vice President', //radio
    5: "../../../public/logo192.png", //file
    0: "lumun@lums.edu.pk", //textbox
    1: "" //textlabel
  },
  timestampCreated: '02/13/2009 21:31:30',
  timestampModified: '02/13/2009 21:31:31',
}

const initialState = {
  id: 0, //form data id
  formId: 0, //form Id
  userId: 0, //user id of the user that submitted
  formStatus: '',
  ccaNote: '',
  ccaNoteTimestampModified: '',
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

    return await apiCaller('/api/form/fetch', {formId: formDataId}, 200, 
    (data) => {
      return data.form
    }, 
    rejectWithValue)
  }
)

export const editFormData = createAsyncThunk(
  'formData/editFormData',
  async (_, {rejectWithValue }) => {
    
    return await apiCaller('/api/form/edit', {}, 203, 
    (data) => {
      return data.description
    }, 
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

export const createFormData = createAsyncThunk(
  'formData/createFormData',
  async (formData, {rejectWithValue }) => {
    
    return await apiCaller('/api/form/create', {form: formData}, 203, 
    (data) => {
      return ''
    }, 
    rejectWithValue)
  }
)

export const updateCcaNote = createAsyncThunk(
  'formData/updateCcaNote',
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
          ...action.payload,
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
    },
    [createFormData.rejected]: (state, action) => {
      state.error = action.payload
    },

    [updateCcaNote.fulfilled]: (state, action) => {
      state.ccaNote = action.payload.note
    },
    [updateCcaNote.rejected]: (state, action) => {
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