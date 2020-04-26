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

    return sampleState
  }
)


export const editFormData = createAsyncThunk(
  'formData/editFormData',
  async (_, { getState, rejectWithValue }) => {
    const { isPending, id, formId, userId, formStatus, ccaNote, ccaNoteTimestampModified, 
      societyNotes, itemsData, timestampModified, timestampCreated } = getState().formData
    if (isPending != true) {
      return
    }

    return '' 
  }
)

export const deleteFormData = createAsyncThunk(
  'formData/deleteFormData',
  async (formDataId, { getState, rejectWithValue }) => {
    const { isPending } = getState().formData
    if (isPending != true) {
      return
    }

    return '' 
  }
)

export const createFormData = createAsyncThunk(
  'formData/createFormData',
  async (formData, { getState, rejectWithValue }) => {
    const { isPending, formId, userId, formStatus, ccaNote, ccaNoteTimestampModified, 
      societyNotes, itemsData, timestampModified, timestampCreated } = getState().formData
    if (isPending != true) {
      return
    }

    return '' 
  }
)

const formData = createSlice({
  name: 'formData',
  initialState: initialState,
  reducers: {
    updateCcaNote: (state, action) => {
      state.ccaNote = action.payload.ccaNote
      // change time modified
    },

    setCreateMode: (state, action) => {
      state.createMode = action.payload.createMode
    },

    setItemData: (state, action) => {
      state.itemsData[action.payload.id] = action.payload.data
    },

    addSocietyNote: (state, action) => {
      state.societyNotes.push(action.payload.newSocietyNote)
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
    [editFormData.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [editFormData.fulfilled]: (state, action) => {
      console.log(action.payload)
      if (state.isPending === true) {
        state.isPending = false
        state.error = 'Edited Form Data'
      }
    },
    [editFormData.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
    [deleteFormData.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [deleteFormData.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = 'Deleted Form Data'
      }
    },
    [deleteFormData.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
    [createFormData.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [createFormData.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = 'Created Form Data' 
      }
    },
    [createFormData.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
  }
})

export const { updateCcaNote, setItemData, addSocietyNote, clearError, setCreateMode } = formData.actions


export default formData.reducer