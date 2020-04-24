import { createSlice } from "@reduxjs/toolkit"

// Form Maker's property window state stored here used by its components

const initialState = {
  propertyType: '',
  propertyId: 1,
  propertyAddMode: false,
  parentId: 0,
}

const propertiesData = createSlice({
  name: 'propertiesData',
  initialState: initialState,
  reducers: {
    setPropertyWindow: (state, action) => {
      return action.payload
    },
    closePropertiesWindow: (state, action) => {
      state.propertyAddMode = false
      state.propertyType = ''
    },
  }
})

export const { setPropertyWindow, closePropertiesWindow } = propertiesData.actions


export default propertiesData.reducer