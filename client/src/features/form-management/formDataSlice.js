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
    const itemsData = getState().formData.itemsData

    console.log("ITEMS DATA", itemsData)

    const initialItemData = {
      textbox: '',
      textlabel: '',
      checkbox: false,
      dropdown: -1,
      radio: -1,
      file: ''
    }

    // must filter out item data to send section wise (do not send filled sections)
    // get all form template data, move section wise, for all items in that section,
    const sectionsFilled = sectionsOrder.map(sectionId => { 
      const isSectionFilled = (sectionId in componentsOrder) // if section has components 
      ? componentsOrder[sectionId].map(componentId => {
        const isComponentFilled = (componentId in itemsOrder) 
        ? itemsOrder[componentId].map(itemId => {
          if (!(itemId in itemsData)) return false //did not receive some item's data at all, then return false (unfilled)
    
          // compare against serverItemsData, if all items do not have initial state data in that section,
          const itemTemplate = items[itemId] // to get type of item to check initial state
          const itemData = itemsData[itemId] // data for that item currently

          return (itemData != initialItemData[itemTemplate.type]) // return false if item field has been filled 
        }).every(isItemFilled => isItemFilled == true)  // array of false values for that component
        : true  // if no items inside it's filled
        console.log("isComponentFilled ", componentId, isComponentFilled)
      }).every(isComponentFilled => isComponentFilled == true)
      : true
      console.log("isSectionFilled ", sectionId,  isSectionFilled)
      return isSectionFilled
    })
    
    console.log("Sections Filled", sectionsFilled)
    // remove all of those items from serverItemsData as the section is considered locked
    console.log("EDIT SEND", {formId: id, submissionId, itemsData})

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
  }
})

export const { setItemData, clearError, setCreateMode, resetState } = formData.actions

export default formData.reducer