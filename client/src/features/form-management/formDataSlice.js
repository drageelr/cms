import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: 0, //form data id
  formId: 0, //form Id
  userId: 0, //user id of the user that submitted
  formStatus: 'Pending',
  ccaNote: '1. Please do not worry if you are unable to submit on time! 2. Read the instructions carefully!1. Please do not worry if you are unable to submit on time! 2. Read the instructions carefully!1. Please do not worry if',
  ccaNoteTimestampModified: '03/13/2009 21:31:30',
  societyNotes: ['Vendor change, check section \'Vendors\'', 'Sent for approval'],
  itemsData: { //itemId : itemData
    4: true, //checkbox
    2: 'Small', //dropdown
    3: 'Vice President', //radio
    5: "../../../public/logo192.png", //file
    0: "lumun@lums.edu.pk", //textbox
    1: "" //textlabel
  },
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
    },

    setItemData: (state, action) => {
      state.itemsData[action.payload.id] = action.payload.data
    },

    addSocietyNote: (state, action) => {
      state.societyNotes.push(action.payload.newSocietyNote)
    },

  }
})

export const { updateCcaNote, setItemData, addSocietyNote } = formData.actions


export default formData.reducer