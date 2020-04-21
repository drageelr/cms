import { createSlice } from "@reduxjs/toolkit"

// Form Maker template creation state stored here, this could have been done locally inside the Form Maker as well
// but is done so to set aside the rigorous business logic required

const initialState = {
  formId: 0,
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
  checklist: {0:"Verify Email", 1:"Check Society"} //sectionId: subTask
}

let sId = 1 //section
let cId = 2//component
let iId = 1 //iId

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
      state.checklist[sId] = "Empty"
    },

    addComponent: (state, action) => {

    },

    addItem: (state, action) => {

    },

    editItem: (state, action) => {
      const {type, id} = action.payload
      switch(type){
        case 'section':{

          break
        }
        case 'component':{
          break
        }
        case 'item':{
          break
        }
      }
    },

    deleteFormPart: (state, action) => { //example reducer
      const {type, id} = action.payload
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
              
              delete state.componentsOrder[id] //delete components order for section
            }
            sId -= 1
          break
        }
        case 'component':{
          for (var sectionId in state.componentsOrder) {
            const index = state.componentsOrder[sectionId].indexOf(id)
            if (index > -1) { //index found
              state.componentsOrder[sectionId].splice(index, 1) //remove from array
            }
          }
          
          delete state.components[id] //item data removed
          break
        } 
        case 'item': {
          for (var componentId in state.itemsOrder) {
            const index = state.itemsOrder[componentId].indexOf(id)
            if (index > -1) { //index found
              state.itemsOrder[componentId].splice(index, 1) //remove from array
            }
          }

          delete state.items[id] //item data removed

          if (id in state.itemsOrder){
            state.itemsOrder[id].map(itemId => { //for every item for component
              delete state.items[itemId] //delete item
            })
            delete state.itemsOrder[id] //delete items order for component
          }
          break
        }
      }
    },
  }
})

export const { addSection, deleteFormPart, toggleIsPublic } = formTemplate.actions

export default formTemplate.reducer