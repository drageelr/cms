import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: 0, //form data id
  formDataId: 0,
  userId: 0, //user id of the user that submitted
  itemsData: [ //only item data with ids
    {id: 0, data: "Hello Data"},
    {id: 1, data: "I am Data :-|"},
    {id: 2, option: 1},
    {id: 3, option: undefined},
    {id: 4, option: undefined}
  ]
}

const formData = createSlice({
  name: 'formData',
  initialState: initialState,
  reducers: {
  }
})

export const { } = formData.actions


export default formData.reducer