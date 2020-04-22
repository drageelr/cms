import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: 0, //form data id
  formId: 0, //form Id
  userId: 0, //user id of the user that submitted
  formStatus: 'Pending',
  ccaNote: '1. Please do not worry if you are unable to submit on time! 2. Read the instructions carefully!',
  ccaNoteTimestampModified: '03/13/2009 21:31:30',
  societyNotes: ['Vendor change, check section \'Vendors\'', 'Sent for approval'],
  itemsData: [ //only item data with ids
    {id: 0, data: "Hello Data"},
    {id: 1, data: "Data 2"},
    {id: 2, option: 1},
    {id: 3, option: undefined},
    {id: 4, option: undefined}
  ],
  timestampCreated: '02/13/2009 21:31:30',
  timestampModified: '02/13/2009 21:31:31'
}

const formData = createSlice({
  name: 'formData',
  initialState: initialState,
  reducers: {
    updateCcaNote: (state, action) => {
      state.ccaNote = action.payload.ccaNote
      // change time modified
    }

  }
})

export const { updateCcaNote } = formData.actions


export default formData.reducer