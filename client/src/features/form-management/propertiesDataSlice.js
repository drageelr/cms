import { createSlice } from "@reduxjs/toolkit"

// Form Maker's property window state stored here used by its components

const initialState = {
  propertyType: '',
  propertyId: 1,
  propertyAddMode: false,
  parentId: 0,
  conditionalItems: {}
}

const propertiesData = createSlice({
  name: 'propertiesData',
  initialState: initialState,
  reducers: {
    setPropertyWindow: (state, action) => {
      return {...action.payload, conditionalItems: {}}
    },
    
    closePropertiesWindow: (state, action) => {
      state.propertyAddMode = false
      state.propertyType = ''
    },

    addConditionalItemOption: (state, action) => {
      state.conditionalItems[action.payload.optionId] = action.payload.itemIds
    },


    toggleOptionItem: (state, action) => {
      const {optionId, itemId} = action.payload
      const idx = state.conditionalItems[optionId].indexOf(itemId)
      if (idx === -1){ //not there, then add it
        state.conditionalItems[optionId].push(itemId)
      }
      else { //remove it
        state.conditionalItems[optionId].splice(idx, 1)
      }
    }
  }
})

export const { setPropertyWindow, closePropertiesWindow, addConditionalItemOption, toggleOptionItem } = propertiesData.actions


export default propertiesData.reducer