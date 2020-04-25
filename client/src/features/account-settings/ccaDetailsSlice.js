import {createSlice} from '@reduxjs/toolkit'

//basically a list of all CCA members details-> list of objects
//need to add state for password verification
const initialState = [
  {
    id: 'cca-1',
    firstName: "Zoraiz",
    lastName: "Qureshi",
    email: "zq@gmail.com",
    password: '',
    picture: 'https://pbs.twimg.com/profile_images/1031129865590898689/AOratooC_400x400.jpg',
    role:'Admin',
    timestampCreated: '02/13/2020',
    permission:[]
  },
  {
    id: 'cca-2',
    firstName: "Farrukh",
    lastName: "Rasool",
    email: "fr@gmail.com",
    password: '',
    picture: 'https://pbs.twimg.com/profile_images/1031129865590898689/AOratooC_400x400.jpg',
    role:'Member',
    timestampCreated: '02/13/2020',
    permission:[]
  },  
]

let ccaId = 2
const ccaDetails = createSlice({
  name: 'ccaDetails',
  initialState: initialState,
  reducers: {
    addCCAAccount: (state,action) =>{
      ccaId+= 1
      state.push({
        id: `cca-${ccaId}`, 
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        password: action.payload.password,
        picture: action.payload.picture,
        role: action.payload.role,
        timestampCreated: action.payload.timestampCreated,
        permission: action.payload.permission,
      })
    },
    editCCAAccount: (state,action)=>{
      let i = 0
      state.map((obj,index) => {
        if (obj.id === action.payload.id){
          i = index
        }
      })
      state[i] = action.payload
    },
    deleteCCAAccount: (state,action)=>{
      let i = 0
      console.log(action.payload.id)
      state.map((obj,index) => {
        if (obj.id === action.payload.id){
          i = index
        }  
      })  

      state.splice(i,1)    
    }
  }
})

export const {addCCAAccount,deleteCCAAccount,editCCAAccount} = ccaDetails.actions

export default ccaDetails.reducer