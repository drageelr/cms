import { createSlice } from "@reduxjs/toolkit"

const conditionalView = createSlice({
  name: 'conditionalView',
  initialState: {},
  reducers: {
    initializeVisibilities: (state, action) => {
      //visibilities are default visibilities initially 
      for (let [itemId, data] of Object.entries(action.payload.items)) {
        state[itemId] = data.defaultVisibility
      }
    },

    setVisibilities: (state, action) => {
      for (let [itemId, isVisible] of Object.entries(action.payload.newVisibilities)) {
        state[itemId] = isVisible
      }
    }
  }
})

export const { initializeVisibilities, setVisibilities } = conditionalView.actions

export default conditionalView.reducer