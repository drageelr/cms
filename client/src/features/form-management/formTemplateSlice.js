import { createSlice } from "@reduxjs/toolkit"

// Form Maker template creation state stored here, this could have been done locally inside the Form Maker as well
// but is done so to set aside the rigorous business logic required

const initialState = {
  formId: 0,
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
    2: [2, 3] 
  },
  items: { //itemId: itemData
    0:{
      type: "TB",
      label: "MyTextBox",
      place_holder: "Some Place Holder",
      max_length: 100,
      required: true,
      default_visibility: true
    },
    1:{
      type: "TA",
      label: "MyTextLabel",
      place_holder: "Some Place Holder",
      max_length: 500,
      required: true,
      default_visibility: true
    },
    2:{
      type: "DD",
      label: "MyDropDown",
      options: ["Hello", "Hi"],
      conditional_items: {0: [3]}, // Key -> Index of option. [] -> List of Item Ids to trigger by that option selection
      required: true,
      default_visibility: false
    },
    3:{
      type: "RB",
      label: "MyRadioButton",
      options: [],
      conditional_items: {},
      required: true,
      default_visibility: false
    },
    4:{
      type: "CB",
      label: "MyCheckBox",
      options: [],
      conditional_items: {},
      required: true,
      default_visibility: true
    },
    5:{
      type: "FU",
      label: "FileUpload",
      options: [],
      conditional_items: {},
      required: true,
      default_visibility: true
    },
  },
  checklist: {0:"Verify Email", 1:"Check Society"} //sectionId: subTask
}

let sId = 1 //section
let cId = 2//component
let iId = 1 //iId

const formTemplate = createSlice({
  name: 'formTemplate',
  initialState: initialState,
  reducers: {
    addSection: (state, action) => { //example reducer
      sId += 1
      state.sections[sId] = action.payload.title
      state.sectionsOrder.push(sId)
      state.checklist[sId] = ""
    },
    deleteFormPart: (state, action) => { //example reducer
      const {type, id} = action.payload
      switch(type){
        case 'section':
            const index = state.sectionsOrder.indexOf(id)
            if (index < 0) { //id not found for section
              break
            }
            
            state.sectionsOrder.splice(index, 1)
            delete state.sections[id] //section title removed
            state.componentsOrder[id].map(componentId => { //for every component for section
              delete state.components[componentId] //delete component title
              state.itemsOrder[componentId].map(itemId => { //for every item for component
                delete state.items[itemId] //delete item
              })
              delete state.itemsOrder[componentId] //delete items order for component
            })

            delete state.componentsOrder[id] //delete components order for section
            sId -= 1
          break
        case 'component':

          break
        case 'item':
          
          break
      }
    },
  }
})

export const { addSection, deleteFormPart } = formTemplate.actions

export default formTemplate.reducer