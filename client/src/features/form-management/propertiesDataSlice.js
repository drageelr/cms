import { createSlice } from "@reduxjs/toolkit"

// Form Maker's property window state stored here and other stuff used by its components

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
  }
})

export const { setPropertyWindow } = propertiesData.actions


export default propertiesData.reducer