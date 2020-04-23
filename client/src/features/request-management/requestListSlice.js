import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  formTitles: [
    {id: "form-1", title: "Design Approval"},
    {id: "form-2", title: "Auditorium Booking"},
    {id: "form-3", title: "Petition"},
    {id: "form-4", title: "Event Approval"},
    {id: "form-5", title: "Service Request"},    
  ],

  isViewingForm: "",

  formData : [
    {
      id: 0, //form data id
      formId: "form-1", //form Id
      userId: "lumun", //user id of the user that submitted
      formStatus: 'Pending',
      ccaNote: "1. Please do not worry if you are unable to submit on time! 2. Read the instructions carefully!",
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
    },
    {
      id: 1, //form data id
      formId: "form-1", //form Id
      userId: "lumun", //user id of the user that submitted
      formStatus: 'Pending',
      ccaNote: '1. Please do not worry if you are unable to submit on time! 2. Read the instructions carefully!',
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
    },
    {
      id: 2, //form data id
      formId: "form-1", //form Id
      userId: "lumun", //user id of the user that submitted
      formStatus: 'Pending',
      ccaNote: '1. Please do not worry if you are unable to submit on time! 2. Read the instructions carefully!',
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
    },
  ]
}

const requestListData = createSlice ({
  name:'requestListData',
  initialState: initialState,
  reducers: {
    changeFormStatus: (state, action) => {
      const {status, index} = action.payload
      state.formData[index].formStatus = status
    },

    updateCcaNote: (state, action) => {
      console.log(action.payload)
      // state.formData.ccaNote = state.formData.ccaNote
    },

    formBeingViewed : (state, action) => {
      // console.log(a)
      state.isViewingForm = action.payload.id
      // console.log(obj)
    }
  }
})

export const { changeFormStatus, updateCcaNote, formBeingViewed } = requestListData.actions

export default requestListData.reducer