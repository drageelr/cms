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
  sections: {},
  componentsOrder: {}, // sectionId:  list of component Ids in order
  components: {}, //componentId: componentTitle
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
  async (formId, { getState, rejectWithValue}) => {
    if (getState().formTemplate.isPending !== true) return
    
    return await apiCaller('/api/form/fetch', { formId: formId }, 200, 
    (data) => {
      delete data.form['formId']
  
      return {
        id: data.form.formId,
        ...convertToClientForm(data.form)  
      }
    }, rejectWithValue)
  }
)

export const createForm = createAsyncThunk(
  'formTemplate/createForm',
  async (_, {getState, rejectWithValue }) => {
    const {isPublic, title, sectionsOrder, sections, componentsOrder, components,
    itemsOrder, items, checklistItems} = getState().formTemplate

    return await apiCaller('/api/form/create', convertToServerForm({
      title,
      isPublic,
      sections,
      components,
      items,
      sectionsOrder,
      componentsOrder,
      itemsOrder,
      checklistItems
    }), 201, 
    (data) => ({
        id: data.formId,
        checklistIds: data.checklistIds
    }), rejectWithValue)
  }
)


export const editForm = createAsyncThunk(
  'formTemplate/editForm',
  async (_, {getState, rejectWithValue }) => {
    const {id, isPublic, title, sectionsOrder, sections, componentsOrder, components,
      itemsOrder, items, checklistItems} = getState().formTemplate

    const form = {formId: id,...convertToServerForm({
      title,
      isPublic,
      sections,
      components,
      items,
      sectionsOrder,
      componentsOrder,
      itemsOrder,
      checklistItems
    })}

    return await apiCaller('/api/form/edit', {form: form}, 200, 
    (data) => ({
      id: data.formId,
      checklistIds: data.checklistIds
    }), rejectWithValue)
  }
)

// export const editForm = createAsyncThunk(
//   'formTemplate/editForm',
//   async (_, {getState, rejectWithValue }) => {
//     const {id, isPublic, title, sectionsOrder, sections, componentsOrder, components,
//       itemsOrder, items, checklistItems} = getState().formTemplate

//     try {
//       const form = {formId: id,...convertToServerForm({
//         title,
//         isPublic,
//         sections,
//         components,
//         items,
//         sectionsOrder,
//         componentsOrder,
//         itemsOrder,
//         checklistItems
//       })}
      
//       console.log(form)

//       const res = await fetch('/api/form/edit', {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.token}`, 
//         },
//         body: JSON.stringify({
//           form: form
//         })
//       })
      
//       if (res.ok) {
//         const data = await res.json()
        
//         if (data.statusCode != 200) {
//           //CHANGE 1
//           throw new Error((data.error !== undefined) 
//           ? `${data.statusCode}: ${data.message} - "${JSON.stringify(data.error.details)}"`
//           : `${data.statusCode}: ${data.message}`) 
//         }
//         return {
//           id: data.formId,
//           checklistIds: data.checklistIds
//         }
//       }
//       //CHANGE 2
//       throw new Error(`${res.status}, ${res.statusText}`) 
//     }
//     catch (err) {
//       return rejectWithValue(err.toString())
//     }    
//   }
// )

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
      state.sections[sId] = action.payload.title
      state.sectionsOrder.push(sId)
      state.componentsOrder[sId] = []
      state.checklistItems.push({sectionId: sId, description: "Edit here"})
    },

    editSection: (state, action) => { 
      state.sections[action.payload.id] = action.payload.title
    },

    addComponent: (state, action) => {
      cId += 1

      state.componentsOrder[action.payload.parentId].push(cId)
      state.components[cId] = action.payload.title
      state.itemsOrder[cId] = []
    },

    editComponent: (state, action) => {
      state.components[action.payload.id] = action.payload.title
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
        sections: {},
        componentsOrder: {},
        components: {},
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
          delete state.sections[id] //section title removed

          if (id in state.componentsOrder){ //has existing components

            state.componentsOrder[id].map(componentId => { //for every component for section
              delete state.components[componentId] //delete component title

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


          if (state.components[id].length != 1){
            delete state.components[id] //item data removed
          }
          else {
            state.components[id] = ""
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
      state.error = 'Form Created'
      state.createMode = false
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


export const { addSection, editSection, addItem, editItem, addComponent, editComponent,
  editChecklistSubtask, deleteFormPart, toggleIsPublic, moveFormPart, clearError, setCreateMode, setTitle, resetState} = formTemplate.actions

export default formTemplate.reducer