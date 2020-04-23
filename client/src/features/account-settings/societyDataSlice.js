import {createSlice} from '@reduxjs/toolkit'

const initialState = [
  {
    id: 123,
    nameInitials: "LUMUN",
    name: "LUMS model united nations",
    email: "lumun@lums.edu.pk",
    presidentEmail: "zozo@gmail.com",
    patronEmail: "hamza@gmail.com",
    password: ''
  },
  {
    id: 124,
    nameInitials: "LUMUN",
    name: "LUMS model united nations",
    email: "lumun@lums.edu.pk",
    presidentEmail: "zozo@gmail.com",
    patronEmail: "hamza@gmail.com",
    password: ''
  }
]

const societyData = createSlice({
  name: 'societyData',
  initialState: initialState,
  reducers: {
    addSocietyAccount: (state,action) =>{
      return null
    },
    deleteSocietyAccount: (state,action)=>{
      return null
    },
    editSocietyAccount: (state,action)=>{
      return null
    }
  }
})

export const {addSocietyAccount,deleteSocietyAccount,editSocietyAccount} = societyData.actions

export default societyData.reducer