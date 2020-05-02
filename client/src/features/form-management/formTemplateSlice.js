import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { convertToClientForm, convertToServerForm } from './formConverters'
import { apiCaller } from '../../helpers'

// Form Maker template creation state stored here, this could have been done locally inside the Form Maker as well
// but is done so to set aside the rigorous business logic required

const initialState = { 
  id: 0,
  isPublic: false,
  title: "",
  sectionsOrder: [], //ordered list of section Ids (any Ids are not unique to any other forms)
  sectionTitles: {},
  componentsOrder: {}, // sectionId:  list of component Ids in order
  componentTitles: {}, //componentId: componentTitle
  itemsOrder: {}, //componentId: ordered list of itemIds
  items: {}, //itemId: itemData
  checklistItems: [], //sectionId: subTask
  createMode: true,
  isPending: true,
  error: null,
}

let sId = 0 //section Id max
let cId = 0 //component Id max
let iId = 0 //item Id max


export const fetchForm = createAsyncThunk(
  'formTemplate/fetchForm',
  async (formId, { getState, rejectWithValue }) => {
    if (getState().formTemplate.isPending !== true) return
    
    return await apiCaller('/api/form/fetch', { formId: formId }, 200, 
    (data) => {
      const id = data.form.formId
      delete data.form['formId']
  
      return {
        id,
        ...convertToClientForm(data.form)  
      }
    }, rejectWithValue)
  }
)

export const createForm = createAsyncThunk(
  'formTemplate/createForm',
  async (_, { getState, rejectWithValue }) => {
    const {isPublic, title, sectionsOrder, sectionTitles, componentsOrder, componentTitles,
    itemsOrder, items, checklistItems} = getState().formTemplate

    return await apiCaller('/api/form/create', {form: convertToServerForm({
      title,
      isPublic,
      sectionTitles,
      componentTitles,
      items,
      sectionsOrder,
      componentsOrder,
      itemsOrder,
      checklistItems
    })}, 201, 
    (data) => ({
        id: data.formId,
        checklistIds: data.checklistIds
    }), rejectWithValue)
  }
)


export const editForm = createAsyncThunk(
  'formTemplate/editForm',
  async (_, {getState, rejectWithValue }) => {
    const {id, isPublic, title, sectionsOrder, sectionTitles, componentsOrder, componentTitles,
      itemsOrder, items, checklistItems} = getState().formTemplate
    
    const form = {formId: id,...convertToServerForm({
      title,
      isPublic,
      sectionTitles,
      componentTitles,
      items,
      sectionsOrder,
      componentsOrder,
      itemsOrder,
      checklistItems
    })}

    console.log("SENDING", form)

    return await apiCaller('/api/form/edit', {form: form}, 200, 
    (data) => ({
      id: data.formId,
      checklistIds: data.checklistIds
    }), rejectWithValue)
  }
)


function getMaxKey(object) {
  if (Object.keys(object).length === 0 && object.constructor === Object) return 0
  if (object === []) return 0

  let max = -Infinity
  for(const key in object) {
    if(Number(key) > max){
      max = Number(key)
    }
  }
  return max
}

const formTemplate = createSlice({
  name: 'formTemplate',
  initialState: initialState,
  reducers: {
    setCreateMode: (state, action) => { //example reducer
      state.createMode = action.payload.createMode
      state.isPending = false
    },

    setFormId: (state, action) => {
      state.id = action.payload.id
    },

    setTitle: (state, action) => { 
      state.title = action.payload
    },

    toggleIsPublic: (state, action) => {
      state.isPublic = !state.isPublic
    },

    clearError: (state, action) => {
      state.error = null
    },

    addSection: (state, action) => { 
      sId += 1
      state.sectionTitles[sId] = action.payload.title
      state.sectionsOrder.push(sId)
      state.componentsOrder[sId] = []
      state.checklistItems.push({sectionId: sId, description: "Edit here"})
    },

    editSection: (state, action) => { 
      state.sectionTitles[action.payload.id] = action.payload.title
    },

    addComponent: (state, action) => {
      cId += 1

      state.componentsOrder[action.payload.parentId].push(cId)
      state.componentTitles[cId] = action.payload.title
      state.itemsOrder[cId] = []
    },

    editComponent: (state, action) => {
      state.componentTitles[action.payload.id] = action.payload.title
    },

    addItem: (state, action) => {
      iId += 1
      state.itemsOrder[action.payload.parentId].push(iId)
      state.items[iId] = action.payload.newItemData
    },

    editItem: (state, action) => {
      state.items[action.payload.id] = action.payload.newItemData
    },

    moveFormPart: (state, action) => {
      const {type, id, offset, parentId} = action.payload
      
      function move(arr) {
        const index = arr.indexOf(id)
        const newIndex = index + offset
      
        if (newIndex > -1 && newIndex < arr.length){
          arr.splice(index, 1) // remove from array, return value not used
          arr.splice(newIndex, 0, id) //remove 0 items, just insert item id at newIndex
        }
      }

      switch(type){
        case 'item':
          move(state.itemsOrder[parentId])
        break
        case 'component':
          move(state.componentsOrder[parentId])
        break
        case 'section':
          move(state.sectionsOrder)
        break
        default:
          break
      }
    },

    editChecklistSubtask: (state, action) => {
      const {sectionId, subtask} = action.payload
      state.checklistItems.forEach(checklistItem => {
        if (checklistItem.sectionId === sectionId){
          checklistItem.description = subtask
        }
      })
    },

    resetState: (state, action) => {
      return { 
        id: 0,
        isPublic: false,
        title: "",
        sectionsOrder: [], 
        sectionTitles: {},
        componentsOrder: {},
        componentTitles: {},
        itemsOrder: {},
        items: {},
        checklistItems: [],
        createMode: true,
        isPending: true,
        error: null,
      }
    },

    deleteFormPart: (state, action) => { //example reducer
      const {type, id, parentId} = action.payload
      
      switch(type){
        case 'section':{
          const index = state.sectionsOrder.indexOf(id)
          if (index < 0) { //id not found for section
            break
          }
          
          state.sectionsOrder.splice(index, 1)
          delete state.sectionTitles[id] //section title removed

          if (id in state.componentsOrder){ //has existing components

            state.componentsOrder[id].map(componentId => { //for every component for section
              delete state.componentTitles[componentId] //delete component title

              if (componentId in state.itemsOrder){ //has existing items
                state.itemsOrder[componentId].map(itemId => { //for every item for component
                  delete state.items[itemId] //delete item
                })
                delete state.itemsOrder[componentId] //delete items order for component
              }
            })
            
            if (state.componentsOrder[id].length != 1){
              delete state.componentsOrder[id] //delete components order for section
            }
            else {
              state.componentsOrder[id] = []
            }
          }

          // must delete the corresponding checklist item as well, so just update it with a filtered list without that sectionId item
          state.checklistItems = state.checklistItems.filter(
            checklistItem => checklistItem.sectionId != id)
          break
        }
        case 'component':{
          const index = state.componentsOrder[parentId].indexOf(id)
          if (index > -1) { //index found
            state.componentsOrder[parentId].splice(index, 1) //remove from array
          }

          if (id in state.itemsOrder){ //check if component had items
            state.itemsOrder[id].map(itemId => { //for every item for this component
              delete state.items[itemId] //delete item
            })
            delete state.itemsOrder[id] //delete items order for component
          }


          if (state.componentTitles[id].length != 1){
            delete state.componentTitles[id] //item data removed
          }
          else {
            state.componentTitles[id] = ""
          }
          break
        } 
        case 'item': {
          const index = state.itemsOrder[parentId].indexOf(id)
          if (index > -1) { //index found
            state.itemsOrder[parentId].splice(index, 1) //remove from array
            delete state.items[id] //item data removed
          }
          break
        }
      }
    },
  },

  extraReducers: {
    [fetchForm.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchForm.fulfilled]: (state, action) => {
      if (state.isPending === true) {  
        sId = getMaxKey(action.payload.componentsOrder)
        cId = getMaxKey(action.payload.itemsOrder)
        iId = getMaxKey(action.payload.items)

        return {
          ...action.payload,
          createMode: false,
          isPending: false,
          error: null,
          sId,
          cId,
          iId
        }
      }
    },
    [fetchForm.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
    [createForm.fulfilled]: (state, action) => {
      state.isPending = false
      state.error = 'Form Created'
      state.createMode = false
      state.id = action.payload.id
    },
    [createForm.rejected]: (state, action) => {
      state.error = action.payload
    },
    [editForm.fulfilled]: (state, action) => {
      state.error = 'Form Edited'
    },
    [editForm.rejected]: (state, action) => {
      state.error = action.payload
    },
  }
})


export const { addSection, editSection, addItem, editItem, addComponent, editComponent, setFormId,
  editChecklistSubtask, deleteFormPart, toggleIsPublic, moveFormPart, clearError, setCreateMode, setTitle, resetState} = formTemplate.actions

export default formTemplate.reducer