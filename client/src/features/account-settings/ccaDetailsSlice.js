import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

//basically a list of all CCA members details-> list of objects
//need to add state for password verification
// const sampleState = {
//   ccaList: [
//     {
//       ccaId: 'cca-1',
//       firstName: "Zoraiz",
//       lastName: "Qureshi",
//       email: "zq@gmail.com",
//       picture: 'https://pbs.twimg.com/profile_images/1031129865590898689/AOratooC_400x400.jpg',
//       role:'admin',
//       permissions:{
//         "societyCRUD": true,
//         "ccaCRUD": true,
//         "accessFormMaker": true,
//         "createReqTask": true,
//         "createCustomTask": true,
//         "createTaskStatus": true,
//         "archiveTask": true,
//         "unarchiveTask": true,
//         "setFormStatus": true,
//         "addCCANote": true
//       }
//     },
//     {
//       ccaId: 'cca-2',
//       firstName: "Farrukh",
//       lastName: "Rasool",
//       email: "fr@gmail.com",
//       picture: 'https://pbs.twimg.com/profile_images/1031129865590898689/AOratooC_400x400.jpg',
//       role:'member',
//       permissions:{
//         "societyCRUD": true,
//         "ccaCRUD": true,
//         "accessFormMaker": true,
//         "createReqTask": true,
//         "createCustomTask": true,
//         "createTaskStatus": true,
//         "archiveTask": true,
//         "unarchiveTask": true,
//         "setFormStatus": true,
//         "addCCANote": true
//       }
//     },  
//   ],
//   isPending: true,
//   error: null
// }

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

    try {
      const res = await fetch('/api/account/cca/account-list', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
      })

      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 200) {
          throw new Error(`${data.statusCode}: ${data.message}\n${data.error.details}`)
        }

        return {isPending: false, error: '' , ccaList: data.userList}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

export const toggleActiveCCAAccount = createAsyncThunk(
  'ccaDetails/toggleActiveCCAAccount',
  async ({ccaId, active}, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/account/cca/edit-account', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          ccaId: ccaId,
          active: !active
        })
      })

      if (res.ok) {
        const data = await res.json()
        console.log(data)

        if (data.statusCode != 203) {
          throw new Error(`${data.statusCode}: ${data.message}\n${data.error.details}`)
        }

        return {ccaId, active}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

export const editCCAPermissions = createAsyncThunk(
  'ccaDetails/editCCAPermissions',
  async ({ccaId, permissions}, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/account/cca/edit-account', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          ccaId: ccaId,
          permissions: permissions
        })
      })

      if (res.ok) {
        const data = await res.json()
        console.log(data)

        if (data.statusCode != 203) {
          throw new Error(`${data.statusCode}: ${data.message}\n${data.error.details}`)
        }

        return {ccaId, permissions}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
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

    try {
      const res = await fetch('/api/account/cca/edit-account', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 203) {
          throw new Error(`${data.statusCode}: ${data.message}\n${data.error.details}`)
        }

        return {ccaId, ccaObject}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

export const addCCAAccount = createAsyncThunk(
  'ccaDetails/addCCAAccount',
  async (ccaObject, { rejectWithValue }) => {
    const { firstName, lastName, email, password, picture, role, permissions } = ccaObject
    
    try {
      const res = await fetch('/api/account/cca/create-account', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          picture: picture,
          role: role,
          permissions: permissions
        })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 201) {
          throw new Error(`${data.statusCode}: ${data.message}\n${data.error.details}`)
        }
        return {ccaId: data.ccaId, ccaObject}
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
  async ({ccaId, url}, {rejectWithValue}) => {
    
    try {
      const res = await fetch('/api/account/cca/change-picture', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          picture: url
        })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 203) {
          throw new Error(`${data.statusCode}: ${data.message}\n${data.error.details}`)
        }
        return {ccaId, url}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err){
      return rejectWithValue(err.toString())
    }
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