import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { convertToClientForm, convertToServerForm } from './helpers'

// Form Maker template creation state stored here, this could have been done locally inside the Form Maker as well
// but is done so to set aside the rigorous business logic required

const sampleState = { // Sample form currently
  id: 0,
  isPublic: false,
  title: "Event Approval",
  sectionsOrder: [0, 1], //ordered list of section Ids (any Ids are not unique to any other forms)
  sections: {
    0:"Email Address", 
    1:"Society"
  },
  componentsOrder: {
    1: [2, 0], // sectionId:  list of component Ids in order
    0: [1] 
  },
  components: {
    0:"Component 1", //componentId: componentTitle
    1:"Component 2", 
    2:"Component 3"
  },
  itemsOrder: { 
    0: [0, 1], //componentId: ordered list of itemIds
    1: [4],
    2: [2, 3, 5] 
  },
  items: { //itemId: itemData
    0:{
      type: "textbox",
      label: "Society Email",
      placeHolder: "spades@lums.edu.pk",
      maxLength: 100,
      required: true,
      defaultVisibility: true
    },
    1:{
      type: "textlabel",
      label: "Important Notice: Please ensure that you have correctly filled out your entire details to prevent any future inconvenience.",
      required: true,
      defaultVisibility: true
    },
    2:{
      type: "dropdown",
      label: "Event Type",
      options: ["Small", "Medium", "Mega"],
      conditionalItems: {0: [3]}, // Key -> Index of option. [] -> List of Item Ids to trigger by that option selection
      required: true,
      defaultVisibility: false
    },
    3:{
      type: "radio",
      label: "Executive Council Role",
      options: ["President", "Vice President", "Treasurer", "General Secretary"],
      conditionalItems: {},
      required: true,
      defaultVisibility: false
    },
    4:{
      type: "checkbox",
      label: "I verify that I have provided all the correct details and have read the rules and guidelines.",
      required: true,
      defaultVisibility: true
    },
    5:{
      type: "file",
      label: "Upload Society Logo",
      fileTypes: ".jpg, .png",
      required: true,
      defaultVisibility: true
    },
  },
  checklistItems: {0:"Verify Email", 1:"Check Society"}, //sectionId: subTask
}

const initialState = { 
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

let sId = 0 //section Id max
let cId = 0 //component Id max
let iId = 0 //item Id max

export const fetchForm = createAsyncThunk(
  'formTemplate/fetchForm',
  async (formId, { getState, rejectWithValue}) => {
    console.log("Fetching")
    const { isPending } = getState().formTemplate
    if (isPending !== true) {
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
          formId: formId
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 200) {
          //CHANGE 1
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - "${JSON.stringify(data.error.details)}"`
          : `${data.statusCode}: ${data.message}`) 
        }
        
        const id = data.form.formId
        delete data.form['formId']
        
        console.log(data.form)
        return {
          id,
          ...convertToClientForm(data.form)  
        }
      }
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

export const createForm = createAsyncThunk(
  'formTemplate/createForm',
  async (_, {getState, rejectWithValue }) => {
    const {isPublic, title, sectionsOrder, sections, componentsOrder, components,
    itemsOrder, items, checklistItems} = getState().formTemplate

    try {
      const res = await fetch('/api/form/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          form: convertToServerForm({
            title,
            isPublic,
            sections,
            components,
            items,
            sectionsOrder,
            componentsOrder,
            itemsOrder,
            checklistItems
          })
        })
      })
      
      
      if (res.ok) {
        const data = await res.json()
        
        if (data.statusCode != 201) {
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - "${JSON.stringify(data.error.details)}"`
          : `${data.statusCode}: ${data.message}`) 
        }
        
        return {
          id: data.formId,
          checklistIds: data.checklistIds
        }
      }
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

export const editForm = createAsyncThunk(
  'formTemplate/editForm',
  async (_, {getState, rejectWithValue }) => {
    const {id, isPublic, title, sectionsOrder, sections, componentsOrder, components,
      itemsOrder, items, checklistItems} = getState().formTemplate

    try {
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
      
      console.log(form)

      const res = await fetch('/api/form/edit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          form: form
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        
        if (data.statusCode != 200) {
          //CHANGE 1
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - "${JSON.stringify(data.error.details)}"`
          : `${data.statusCode}: ${data.message}`) 
        }
        return {
          id: data.formId,
          checklistIds: data.checklistIds
        }
      }
      //CHANGE 2
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }    
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
      console.log(action.payload)
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
      // return { 
      //   id: 0,
      //   isPublic: false,
      //   title: "",
      //   sectionsOrder: [], 
      //   sections: {},
      //   componentsOrder: {},
      //   components: {},
      //   itemsOrder: {},
      //   items: {},
      //   checklistItems: [],
      //   createMode: true,
      //   isPending: true,
      //   error: null,
      // }
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