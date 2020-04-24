import {createSlice} from '@reduxjs/toolkit'

const initialState = [
  {
    id: 's-1',
    nameInitials: "LUMUN",
    name: "LUMS model united nations",
    email: "lumun@lums.edu.pk",
    presidentEmail: "zozo@gmail.com",
    patronEmail: "hamza@gmail.com",
    password: ''
  },
  {
    id: 's-2',
    nameInitials: "LUMUN",
    name: "LUMS model united nations",
    email: "lumun@lums.edu.pk",
    presidentEmail: "zozo@gmail.com",
    patronEmail: "hamza@gmail.com",
    password: ''
  }
]

let sId = 2
const societyData = createSlice({
  name: 'societyData',
  initialState: initialState,
  reducers: {
    addSocietyAccount: (state,action) =>{
      sId += 1
      state.push({
        id: `s-${sId}`,
        name: action.payload.name,
        nameInitials: action.payload.nameInitials,
        email: action.payload.email,
        presidentEmail: action.payload.presidentEmail,
        patronEmail: action.payload.patronEmail,
        password: action.payload.password,
      })
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