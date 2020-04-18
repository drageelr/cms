import { createSlice } from "@reduxjs/toolkit"

// Form Maker template creation state stored here, this could have been done locally inside the Form Maker as well
// but is done so to set aside the rigorous business logic required

const initialState = {
  formId: 0,
  title: "Event Approval",
  sections: ["Email Address", "Society"],
  sectionOrder: [2, 1], //ordered list of section Ids (any Ids are not unique to any other forms)
  components_order: {
    2: [2, 0], // sectionId:  list of component Ids in order
    1: [1] 
  },
  itemsOrder: { 
    0: [0, 1], //componentId: ordered list of itemIds
    1: [4],
    2: [2, 3] 
  },
  components: {
    0:{ title: "A",}, //componentId: componentData
    1:{ title: "B",}, 
    2:{ title: "C",}
  },
  items: { //itemId: itemData
    0:{
      type: "TB",
      label: "Some Label",
      place_holder: "Some Place Holder",
      max_length: 100,
      required: true,
      default_visibility: true
    },
    1:{
      type: "TA",
      label: "Some Label",
      place_holder: "Some Place Holder",
      max_length: 500,
      required: true,
      default_visibility: true
    },
    2:{
      type: "DD",
      label: "Some Label",
      options: ["Hello", "Hi"],
      conditional_items: {0: [3]}, // Key -> Index of option. [] -> List of Item Ids to trigger by that option selection
      required: true,
      default_visibility: false
    },
    3:{
      type: "RB",
      label: "Some Label",
      options: [],
      conditional_items: {},
      required: true,
      default_visibility: false
    },
    4:{
      type: "CC",
      label: "Some Label",
      options: [],
      conditional_items: {},
      required: true,
      default_visibility: true
    }
  },
  checklist: [ "Verify Email" ] //subTask
}

let sId = 1 //section
let cId = 1 //component
let iId = 1 //iId

const formTemplate = createSlice({
  name: 'formTemplate',
  initialState: initialState,
  reducers: {
    addSection: (state, action) => { //example reducer
      sId += 1
      state.sections.push(action.payload.title)
      state.section_order.push(sId)
      cId += 1 // new component made to be placed inside this section
      state.components_order[sId] = [cId] //this section has one component by default
    },
  }
})

export const { addSection } = formTemplate.actions


export default formTemplate.reducer