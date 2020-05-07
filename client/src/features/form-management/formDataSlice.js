import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from "../../helpers" 


const initialState = {
  id: 0, //form data id
  formId: 0, //form Id
  userId: 0, //user id of the user that submitted
  formStatus: '',
  ccaNotes: [],
  societyNotes: [],
  itemsData: [],
  timestampCreated: '',
  timestampModified: '',
  createMode: true,
  isPending: true,
  error: null
}

export const fetchFromToken = createAsyncThunk(
  'formData/fetchFromToken',
  async (_, {rejectWithValue }) => {

    return await apiCaller('/api/submission/fetch-review', {}, 200, 
    (data) => ({submissionId: data.submissionId, formId: data.formId}), 
    rejectWithValue)
  }
)


export const fetchFormData = createAsyncThunk(
  'formData/fetchFormData',
  async (formDataId, { getState, rejectWithValue }) => {
    const { isPending } = getState().formData
    if (isPending != true) {
      return
    }
    const submissionId = Number(formDataId)

    return await apiCaller('/api/submission/fetch', {submissionId}, 200, 
    (data) => ({
      id: submissionId,
      formId: data.formId,
      ccaNotes: data.ccaNotes,
      societyNotes: data.societyNotes,
      itemsData: data.itemsData
    }), 
    rejectWithValue)
  }
)


export const createFormData = createAsyncThunk(
  'formData/createFormData',
  async (_, {getState, rejectWithValue }) => {
    const formId = getState().formTemplate.id
    const itemsData = getState().formData.itemsData
    console.log(formId, itemsData)
    // only required to send form Id and items Data when creating a form
    return await apiCaller('/api/submission/submit', {formId, itemsData}, 200, 
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
    const { id, sectionsOrder, componentsOrder, itemsOrder, items } = getState().formTemplate
    const submissionId = getState().formData.id
    let itemsData = getState().formData.itemsData

    console.log("SENDING", itemsData)
    return await apiCaller('/api/submission/submit', {formId: id, submissionId, itemsData}, 200, 
    (data) => ({submissionId}), 
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
  async ({submissionId, note}, {rejectWithValue }) => {
    
    return await apiCaller('/api/submission/cca/add-note', {
      submissionId, 
      note
    }, 203, 
    (data) => {
      return {submissionId, note}
    }, 
    rejectWithValue)
  }
)

export const addSocietyNote = createAsyncThunk(
  'formData/addSocietyNote',
  async ({submissionId, note}, {rejectWithValue }) => {

    return await apiCaller('/api/submission/society/add-note', {
      submissionId, 
      note
    }, 203, 
    (data) => {
      return {submissionId, note}
    }, 
    rejectWithValue)
  }
)


export const uploadFile = createAsyncThunk(
  'formData/uploadFile',
  async (formData, {rejectWithValue }) => {
    console.log("FORM DATA", formData)
    try {
      let req_init = {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.token}` 
        },
      }
      delete req_init.headers['Content-Type'] //server adds header boundary itself
    
      const res = await fetch('/api/file/upload', req_init)
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        if (data.statusCode != 201) {
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - ${JSON.stringify(data.error.details).replace(/[\[\]\{\}"'\\]+/g, '').split(':').pop()}`
          : `${data.statusCode}: ${data.message}`) 
        }
        return data.fileToken // fileToken from data
      }
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

export const downloadFile = createAsyncThunk(
  'formData/downloadFile',
  async ({submissionId, itemId, fileName}, {rejectWithValue }) => {
    try {

      let req_init = {
        method: 'POST',
        body: JSON.stringify({
          submissionId, 
          itemId
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`,
        },
        // redirect: 'follow'
      }
      
      const res = await fetch('/api/file/download', req_init)

      if (res.ok) {
        const readBlob = await res.blob()
        const url = window.URL.createObjectURL(readBlob);
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      }
      else{
        throw new Error(`${res.status}, ${res.statusText}`) 
      }
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
    setCreateMode: (state, action) => {
      state.createMode = action.payload.createMode
    },

    resetState: (state, action) => {
      return initialState
    },

    setItemData: (state, action) => {
      const itemData = state.itemsData.find(itemData => itemData.itemId == action.payload.itemId)
      if (itemData === undefined){
        state.itemsData.push({itemId: action.payload.itemId, data: action.payload.data}) 
      }
      else {
        state.itemsData[state.itemsData.indexOf(itemData)].data = action.payload.data
      }
    },

    clearError: (state, action) => {
      state.error = null
    },

    setError: (state, action) => {
      state.error = action.payload.error
    }
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
      state.id = action.payload.submissionId
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
      state.ccaNotes.push({note: action.payload.note, timestampCreated: "Just now"})
    },
    [addCcaNote.rejected]: (state, action) => {
      state.error = action.payload
    },

    [addSocietyNote.fulfilled]: (state, action) => {
      state.societyNotes.push({note: action.payload.note, timestampCreated: "Just now"})
    },
    [addSocietyNote.rejected]: (state, action) => {
      state.error = action.payload
    },

    [uploadFile.fulfilled]: (state, action) => {

    },
    [uploadFile.rejected]: (state, action) => {
      state.error = action.payload
    },

    [downloadFile.fulfilled]: (state, action) => {
      
    },
    [downloadFile.rejected]: (state, action) => {
      state.error = action.payload
    },


    [fetchFromToken.fulfilled]: (state, action) => {
      state.id = action.payload.submissionId
    },

    [fetchFromToken.rejected]: (state, action) => {
      state.error = action.payload
    },
  }
})

export const { setItemData, clearError, setCreateMode, resetState, setError } = formData.actions

export default formData.reducer