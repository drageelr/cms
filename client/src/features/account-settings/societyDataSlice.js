import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from "../../helpers"

const initialState = {
  societyList: [],
  isPending: true,
  error: null
}

export const fetchSocietyAccounts = createAsyncThunk(
  'societyData/fetchSocietyAccounts',
  async(_, { getState, rejectWithValue}) => {
    const { isPending } = getState().societyData
    if (isPending != true) {
      return
    }

    return await apiCaller('/api/account/society/account-list', {}, 200,
    (data) => {
      return {isPending: false, error: '' , societyList: data.userList}
    },
    rejectWithValue)
  }
)

export const toggleActiveSocietyAccount = createAsyncThunk(
  'societyData/toggleActiveSocietyAccount',
  async({societyId, active}, { rejectWithValue}) => {
    return await apiCaller('/api/account/society/edit-account', {
      societyId: societyId,
      active: !active
    }, 203,
    (data) => {
      return {societyId, active}
    },
    rejectWithValue)   
  }
)

export const addSocietyAccount = createAsyncThunk(
  'societyData/addSocietyAccount',
  async (societyObject, { rejectWithValue }) => {
    const {nameInitials, name, email, presidentEmail, patronEmail, password} = societyObject
    return await apiCaller('/api/account/society/create-account', {
      email: email,
      password: password,
      name: name,
      nameInitials: nameInitials,
      presidentEmail: presidentEmail,
      patronEmail: patronEmail
    }, 201,
    (data) => {
      return {societyId: data.societyId, societyObject}
    },
    rejectWithValue)   
    }
)

export const editSocietyAccount = createAsyncThunk(
  'societyData/editSocietyAccount',
  async (societyObject, { rejectWithValue}) => {
    const {societyId, nameInitials, name, email, presidentEmail, patronEmail, password} = societyObject
    let body = {
      societyId: societyId,
      email: email,
      password: password,
      name: name,
      nameInitials: nameInitials,
      presidentEmail: presidentEmail,
      patronEmail: patronEmail
    }
    if (password !== undefined){
      body = {...body, password: password}
    }
    return await apiCaller('/api/account/society/edit-account', body, 203,
    (data) => {
      return {societyId, societyObject}
    },
    rejectWithValue)
  }
)


const societyData = createSlice({
  name: 'societyData',
  initialState: initialState,
  reducers: {
    clearError: (state, action)=>{
      state.error = null
    }
  },

  extraReducers: {
    [toggleActiveSocietyAccount.fulfilled]: (state, action) => {
      let i = 0
      state.societyList.map((obj,index) => {
        if (obj.societyId === action.payload.societyId){
          i = index
        }  
      })  
      state.societyList[i].active = !action.payload.active
    },
    [toggleActiveSocietyAccount.rejected]: (state, action) => {
        state.error = action.payload
    },

    [addSocietyAccount.fulfilled]: (state, action) => {
      console.log(action.payload)
      state.societyList.push({
        societyId: action.payload.societyId, 
        ...action.payload.societyObject
      })
      state.error = 'Society Account Added Successfully'
    },
    [addSocietyAccount.rejected]: (state, action) => {
        state.error = action.payload
    },

    [editSocietyAccount.fulfilled]: (state, action) => {
      let i = 0
      state.societyList.find((obj,index) => {
        if (obj.societyId === action.payload.societyId){
          i = index
        }
      })
      state.societyList[i] = action.payload.societyObject
      state.error = 'Society Account Edited Successfully'
    },
    [editSocietyAccount.rejected]: (state, action) => {
        state.error = action.payload
    },
    [fetchSocietyAccounts.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchSocietyAccounts.fulfilled]: (state, action) => {
      if(state.isPending === true){
        state.isPending = false
        state.societyList = action.payload.societyList
      }
    },
    [fetchSocietyAccounts.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    }
  }
})

export const {clearError} = societyData.actions

export default societyData.reducer