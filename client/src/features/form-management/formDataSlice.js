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

    try {
      const res = await fetch('/api/form/fetch', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          formId: formDataId
        })
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 200) {
          //CHANGE 1
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - "${JSON.stringify(data.error.details)}"`
          : `${data.statusCode}: ${data.message}`) 
        }
        return data.form
      }
      //CHANGE 2
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
    // return sampleState
  }
)


export const editFormData = createAsyncThunk(
  'formData/editFormData',
  async (_, {rejectWithValue }) => {
    try {
      const res = await fetch('/api/form/edit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          //
        })
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 203) {
          //CHANGE 1
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - "${JSON.stringify(data.error.details)}"`
          : `${data.statusCode}: ${data.message}`) 
        }
        
        return data.description
      }
      //CHANGE 2
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    } 
  }
)

export const deleteFormData = createAsyncThunk(
  'formData/deleteFormData',
  async (formDataId, {rejectWithValue }) => {
    try {
      const res = await fetch('/api/form/delete', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          formId: formDataId
        })
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 203) {
          //CHANGE 1
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - "${JSON.stringify(data.error.details)}"`
          : `${data.statusCode}: ${data.message}`) 
        }
        
        return ''  
      }
      //CHANGE 2
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    } 
  }
)

export const createFormData = createAsyncThunk(
  'formData/createFormData',
  async (formData, {rejectWithValue }) => {
    try {
      const res = await fetch('/api/form/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          form: formData
        })
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 203) {
          //CHANGE 1
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - "${JSON.stringify(data.error.details)}"`
          : `${data.statusCode}: ${data.message}`) 
        }
        
        return ''
        
      }
      //CHANGE 2
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    } 
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
    [editFormData.fulfilled]: (state, action) => {
      console.log(action.payload)
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
  }
})

export const { updateCcaNote, setItemData, addSocietyNote, clearError, setCreateMode } = formData.actions


export default formData.reducer