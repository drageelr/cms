import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { apiCaller } from "../../helpers"

const initialState = {
  ccaList : [],
  isPending: true,
  error: null
}

export const fetchCCAAccounts = createAsyncThunk(
  'ccaDetails/fetchCCAAccounts',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().ccaDetails
    if (isPending != true) {
      return
    } 

    return await apiCaller('/api/account/cca/account-list', {}, 200,
    (data) => ({isPending: false, error: '' , ccaList: data.userList}),
    rejectWithValue)
  }
)

export const toggleActiveCCAAccount = createAsyncThunk(
  'ccaDetails/toggleActiveCCAAccount',
  async ({ccaId, active}, { rejectWithValue }) => {

    return await apiCaller('/api/account/cca/edit-account', {
      ccaId: ccaId,
      active: !active
    }, 203,
    (data) => ({ccaId, active}),
    rejectWithValue)
  }
)

export const editCCAPermissions = createAsyncThunk(
  'ccaDetails/editCCAPermissions',
  async ({ccaId, permissions}, { rejectWithValue }) => {

    return await apiCaller('/api/account/cca/edit-account', {
      ccaId: ccaId,
      permissions: permissions
    }, 203,
    (data) => ({ccaId, permissions}),
    rejectWithValue)
  }
)

export const editCCAAccount = createAsyncThunk(
  'ccaDetails/editCCAAccount',
  async (ccaObject, { rejectWithValue }) => {
    const {ccaId, firstName, lastName, email, password, picture, role} = ccaObject 
    let body = {
      ccaId: ccaId,
      email: email,
      firstName: firstName,
      lastName: lastName,
      picture: picture,
      role: role,
    }
    if (password !== undefined){
      body = {...body, password: password}
    }

    return await apiCaller('/api/account/cca/edit-account', body, 203,
    (data) => ({ccaId, ccaObject}),
    rejectWithValue)
  }
)

export const addCCAAccount = createAsyncThunk(
  'ccaDetails/addCCAAccount',
  async (ccaObject, { rejectWithValue }) => {
    const { firstName, lastName, email, password, picture, role, permissions } = ccaObject
    
    return await apiCaller('/api/account/cca/create-account', {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      picture: picture,
      role: role,
      permissions: permissions
    }, 201,
    (data) => ({ccaId: data.ccaId, ccaObject}),
    rejectWithValue)
  }
)

export const changeCCAPicture = createAsyncThunk(
  'ccaDetails/changeCCAPicture',
  async ({ccaId, url}, {rejectWithValue}) => {

    return await apiCaller('/api/account/cca/edit-account', {
      picture: url
    }, 203,
    (data) => ({ccaId, url}),
    rejectWithValue)
    
  }
)

const ccaDetails = createSlice({
  name: 'ccaDetails',
  initialState: initialState,
  reducers: {
    clearError: (state, action) => {
      state.error = null
    },
  },
  extraReducers: {
    [toggleActiveCCAAccount.fulfilled]: (state, action) => {
        state.ccaList.map((obj,index) => {
          if (obj.ccaId === action.payload.ccaId){
            state.ccaList[index].active = !action.payload.active
          }  
        })  
    },
    [toggleActiveCCAAccount.rejected]: (state, action) => {
        state.error = action.payload
    },

    [editCCAAccount.fulfilled]: (state, action) => {
      let i = 0
      state.ccaList.map((obj,index) => {
        if (obj.ccaId === action.payload.ccaId){
          i = index
        }
      })
      state.ccaList[i] = action.payload.ccaObject
      state.error = 'CCA Account Edited Successfully'
    },
    [editCCAAccount.rejected]: (state, action) => {
      state.error = action.payload
    },
    
    [addCCAAccount.fulfilled]: (state, action) => {
      state.ccaList.push({
        ccaId: action.payload.ccaId, 
        ...action.payload.ccaObject
      })
      state.error = 'CCA Account Added Successfully'
    },
    [addCCAAccount.rejected]: (state, action) => {
        state.error = action.payload
    },

    [fetchCCAAccounts.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchCCAAccounts.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.ccaList = action.payload.ccaList 
        // state.error = 'Fetched all CCA Accounts'
      }
    },
    [fetchCCAAccounts.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [changeCCAPicture.fulfilled]: (state, action) => { 
        state.ccaList.map(ccaUser => {
          if (ccaUser.ccaId === action.payload.ccaId) {
            ccaUser.picture = action.payload.url
          }
        })
    },
    [changeCCAPicture.rejected]: (state, action) => {
        state.error = action.payload
    },

    [editCCAPermissions.fulfilled]: (state, action) => {
      state.ccaList.map((obj,index) => {
        if (obj.ccaId === action.payload.ccaId){
          state.ccaList[index].permissions = action.payload.permissions
        }  
      })
      state.error = 'CCA Account Permissions Edited'
    },
    [editCCAPermissions.rejected]: (state, action) => {
        state.error = action.payload
    },
  } 
})

export const { clearError } = ccaDetails.actions

export default ccaDetails.reducer