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
      let i = 0
      console.log(action.payload.id)
      state.map((obj,index) => {
        if (obj.id === action.payload.id){
          i = index
        }  
      })  
      state.splice(i,1)
    },
    editSocietyAccount: (state,action)=>{
      let i = 0
      state.map((obj,index) => {
        if (obj.id === action.payload.id){
          i = index
        }
      })
      state[i] = action.payload
    }
  }
})

export const {addSocietyAccount,deleteSocietyAccount,editSocietyAccount} = societyData.actions

export default societyData.reducer