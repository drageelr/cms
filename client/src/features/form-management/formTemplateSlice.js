import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Form Maker template creation state stored here, this could have been done locally inside the Form Maker as well
// but is done so to set aside the rigorous business logic required

const sampleForm = { // Sample form currently
  id: 0,
  isPublic: false,
  title: "Event Approval",
  creatorId: 1,
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
  checklist: {0:"Verify Email", 1:"Check Society"}, //sectionId: subTask
}

const initialState = { 
  id: 0,
  isPublic: false,
  title: "",
  creatorId: 1,
  sectionsOrder: [], 
  sections: {},
  componentsOrder: {},
  components: {},
  itemsOrder: {},
  items: {},
  checklist: {},
  isPending: false,
  error: ''
}

let sId = 1 //section
let cId = 2//component
let iId = 5 //iId

export const fetchFormById = createAsyncThunk(
  'formTemplate/fetchFormById',
  async (formId, { getState }) => {
    const { isPending } = getState().formTemplate
    
    if (isPending != true) {
      return
    }

    const fetchCall = () => {
      var promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(sampleForm)
        }, 1000)
      })
      return promise
    }

    cId = 0
    sId = 0
    iId = 0 

    const result = await fetchCall()
    return result
  }
)

const formTemplate = createSlice({
  name: 'formTemplate',
  initialState: initialState,
  reducers: {
    toggleIsPublic: (state, action) => { //example reducer
      state.isPublic = !state.isPublic
    },

    addSection: (state, action) => { //example reducer
      sId += 1
      state.sections[sId] = action.payload.title
      state.sectionsOrder.push(sId)
      state.componentsOrder[sId] = []
      state.checklist[sId] = "Empty"
    },

    editSection: (state, action) => { //example reducer
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
      state.checklist[sectionId] = subtask
    },

    deleteFormPart: (state, action) => { //example reducer
      const {type, id, parentId} = action.payload
      console.log(action.payload)
      
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
    [fetchFormById.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchFormById.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        return {
          ...action.payload,
          isPending: false,
          error: ''
        }
      }
    },
    [fetchFormById.rejected]: (state, action) => {
      console.log(action)
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.error
      }
    }
  }
})


export const { addSection, editSection, addItem, editItem, addComponent, editComponent,
  editChecklistSubtask, deleteFormPart, toggleIsPublic, moveFormPart} = formTemplate.actions

export default formTemplate.reducer