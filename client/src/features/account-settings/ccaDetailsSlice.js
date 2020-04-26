import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { act } from 'react-dom/test-utils'

//basically a list of all CCA members details-> list of objects
//need to add state for password verification
const sampleState = {
  ccaList: [
    {
      id: 'cca-1',
      firstName: "Zoraiz",
      lastName: "Qureshi",
      email: "zq@gmail.com",
      password: 'TEST',
      picture: 'https://pbs.twimg.com/profile_images/1031129865590898689/AOratooC_400x400.jpg',
      role:'admin',
      timestampCreated: '02/13/2020',
      permissions:{
        "societyCRUD": true,
        "ccaCRUD": true,
        "accessFormMaker": true,
        "createReqTask": true,
        "createCustomTask": true,
        "createTaskStatus": true,
        "archiveTask": true,
        "unarchiveTask": true,
        "setFormStatus": true,
        "addCCANote": true
      }
    },
    {
      id: 'cca-2',
      firstName: "Farrukh",
      lastName: "Rasool",
      email: "fr@gmail.com",
      password: 'TEST',
      picture: 'https://pbs.twimg.com/profile_images/1031129865590898689/AOratooC_400x400.jpg',
      role:'member',
      timestampCreated: '02/13/2020',
      permissions:{
        "societyCRUD": true,
        "ccaCRUD": true,
        "accessFormMaker": true,
        "createReqTask": true,
        "createCustomTask": true,
        "createTaskStatus": true,
        "archiveTask": true,
        "unarchiveTask": true,
        "setFormStatus": true,
        "addCCANote": true
      }
    },  
  ],
  isPending: true,
  error: null
}

const initialState = {
  ccaList : [],
  isPending: true,
  error: null
}

export const fetchCCAAccounts = createAsyncThunk(
  'ccaDetails/fetchCCAAccounts',
  async (_, { getState }) => {
    const { isPending } = getState().ccaDetails
    
    if (isPending != true) {
      return
    } 

  const fetchCall = () => {
    var promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(sampleState)
      }, 1000)
    })
    return promise
  }

    const result = await fetchCall()
    return result
  }
)

export const deleteCCAAccount = createAsyncThunk(
  'ccaDetails/deleteCCAAccount',
  async (id, { getState }) => {
    const { isPending } = getState().ccaDetails
    
    if (isPending != true) {
      return
    } 

    return id
  }
)

export const editCCAAccount = createAsyncThunk(
  'ccaDetails/editCCAAccount',
  async (userData, { getState }) => {
    const { isPending } = getState().ccaDetails
    
    if (isPending != true) {
      return
    }

    return userData
  }
)

export const addCCAAccount = createAsyncThunk(
  'ccaDetails/addCCAAccount',
  async (userData, { getState, rejectWithValue }) => {
    const { isPending } = getState().ccaDetails
    const { firstName, lastName, email, password, 
      picture, role, userType, permissions } = userData
    if (isPending != true) {
      return
    }

    
    const QUERY = '/api/account/cca/create-account'

    try {
      const res = await fetch(QUERY, {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          picture: picture,
          permissions: {
            societyCRUD: true,
            ccaCRUD: true,
            accessFormMaker: true,
            createReqTask: true,
            createCustomTask: true,
            createTaskStatus: true,
            archiveTask: true,
            unarchiveTask: true,
            setFormStatus: true,
            addCCANote: true
          }
        })
      })

      console.log(res)
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        return {id: data.ccaId, userData}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err){
      return rejectWithValue(err.toString())
    }
  }
)

export const changeCCAPicture = createAsyncThunk(
  'ccaDetails/changeCCAPicture',
  async ({id, url}, { getState }) => {
    const { isPending } = getState().ccaDetails
    if (isPending != true) {
      return
    }

    return {id, url}
  }
)

let ccaId = 2
const ccaDetails = createSlice({
  name: 'ccaDetails',
  initialState: initialState,
  reducers: {
    clearError: (state, action) => {
      state.error = null
    },
  },
  extraReducers: {
    [deleteCCAAccount.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [deleteCCAAccount.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        let i = 0
        state.ccaList.map((obj,index) => {
          if (obj.id === action.payload.id){
            i = index
          }  
        })  

        state.ccaList.splice(i,1)
      }
    },
    [deleteCCAAccount.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [editCCAAccount.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [editCCAAccount.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        
        state.isPending = false
        let i = 0
        state.ccaList.map((obj,index) => {
          if (obj.id === action.payload.id){
            i = index
          }
        })
        state.ccaList[i] = action.payload
      }
    },
    [editCCAAccount.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [addCCAAccount.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [addCCAAccount.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        ccaId+= 1
        state.ccaList.push({
          id: action.payload.id, 
          ...action.payload.userData
        })
      }
    },
    [addCCAAccount.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
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
      }
    },
    [fetchCCAAccounts.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [changeCCAPicture.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [changeCCAPicture.fulfilled]: (state, action) => { 
      if (state.isPending === true) {
        state.isPending = false
        state.ccaList.map(ccaUser => {
          if (ccaUser.id === action.payload.id) {
            ccaUser.picture = action.payload.url
          }
        })
      }
    },
    [changeCCAPicture.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    }
  } 
})

export const { clearError } = ccaDetails.actions

export default ccaDetails.reducer