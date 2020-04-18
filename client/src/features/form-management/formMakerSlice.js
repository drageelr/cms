import { createSlice } from "@reduxjs/toolkit"

// Form Maker's property window state stored here and other stuff used by its components

const initialState = {
  propertyType: ''
}

const formMaker = createSlice({
  name: 'formMaker',
  initialState: initialState,
  reducers: {
    setPropertyType: (state, action) => { 
      state.propertyType = action.payload.propertyType
    },
  }
})

export const { setPropertyType } = formMaker.actions


export default formMaker.reducer