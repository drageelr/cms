import { createSlice } from "@reduxjs/toolkit"

const initialState = [
  {id: 0, title: "Design Approval", creatorId: "Ashar Javaid", timestamp_modified: '02/13/2009 23:31:30', isPublic: false},
  {id: 1, title: "Auditorium Booking", creatorId: "Ashar Javaid", timestamp_modified: '02/13/2009 22:31:30', isPublic: true},
  {id: 2, title: "Petition", creatorId: "Zoraiz Qureshi", timestamp_modified: '02/13/2009 21:31:30', isPublic: true},
  {id: 3, title: "Event Approval", creatorId: "Farkhanda Khan", timestamp_modified: '02/13/2009 20:31:30', isPublic: false},
  {id: 4, title: "Service Request", creatorId: "Ashar Javaid", timestamp_modified: '02/13/2009 19:31:30', isPublic: true},
  {id: 0, title: "Design Approval", creatorId: "Ashar Javaid", timestamp_modified: '02/13/2009 23:31:30', isPublic: false},
  {id: 1, title: "Auditorium Booking", creatorId: "Ashar Javaid", timestamp_modified: '02/13/2009 22:31:30', isPublic: true},
  {id: 2, title: "Petition", creatorId: "Zoraiz Qureshi", timestamp_modified: '02/13/2009 21:31:30', isPublic: true},
  {id: 3, title: "Event Approval", creatorId: "Farkhanda Khan", timestamp_modified: '02/13/2009 20:31:30', isPublic: false},
  {id: 4, title: "Service Request", creatorId: "Ashar Javaid", timestamp_modified: '02/13/2009 19:31:30', isPublic: true},        
  {id: 0, title: "Design Approval", creatorId: "Ashar Javaid", timestamp_modified: '02/13/2009 23:31:30', isPublic: false},
  {id: 1, title: "Auditorium Booking", creatorId: "Ashar Javaid", timestamp_modified: '02/13/2009 22:31:30', isPublic: true},
  {id: 2, title: "Petition", creatorId: "Zoraiz Qureshi", timestamp_modified: '02/13/2009 21:31:30', isPublic: true},
  {id: 3, title: "Event Approval", creatorId: "Farkhanda Khan", timestamp_modified: '02/13/2009 20:31:30', isPublic: false},
  {id: 4, title: "Service Request", creatorId: "Ashar Javaid", timestamp_modified: '02/13/2009 19:31:30', isPublic: true},        
]

const fId = 0

const formList = createSlice({
  name: 'formList',
  initialState: initialState,
  reducers: {
    toggleStatus: (state, actions) => {
      const idx = actions.payload.index
      state[idx].isPublic = !state[idx].isPublic
    },

    duplicateForm: (state, actions) => {
      const idx = actions.payload.index
      state.splice(idx,0,{...state[idx]})
    }
  }
})

export const { toggleStatus, duplicateForm } = formList.actions


export default formList.reducer