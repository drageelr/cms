import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

// const sampleState = {
//   societyList: [
//     {
//       societyId: 's-1',
//       nameInitials: "LUMUN",
//       name: "LUMS Model United Nations",
//       email: "lumun@lums.edu.pk",
//       presidentEmail: "zozo@gmail.com",
//       patronEmail: "hamza@gmail.com",
//       password: 'TEST'
//     },
//     {
//       societyId: 's-2',
//       nameInitials: "LUMUN",
//       name: "LUMS Model United Nations",
//       email: "lumun@lums.edu.pk",
//       presidentEmail: "zozo@gmail.com",
//       patronEmail: "hamza@gmail.com",
//       password: 'TEST'
//     }
//   ],
//   isPending: true,
//   error: null
// }  

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

    try {
      const res = await fetch('/api/account/society/account-list', {
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

        return {isPending: false, error: '' , societyList: data.userList}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

export const toggleActiveSocietyAccount = createAsyncThunk(
  'societyData/toggleActiveSocietyAccount',
  async({societyId, active}, { rejectWithValue}) => {
    try {
      const res = await fetch('/api/account/society/edit-account', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          societyId: societyId,
          active: !active
        })
      })

      if (res.ok) {
        const data = await res.json()
        console.log(data)

        if (data.statusCode != 203) {
          throw new Error(`${data.statusCode}: ${data.message}\n${data.error.details}`)
        }

        return {societyId, active}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

export const addSocietyAccount = createAsyncThunk(
  'societyData/addSocietyAccount',
  async (societyObject, { rejectWithValue }) => {
    const {nameInitials, name, email, presidentEmail, patronEmail, password} = societyObject
    try {
      const res = await fetch('/api/account/society/create-account', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
          nameInitials: nameInitials,
          presidentEmail: presidentEmail,
          patronEmail: patronEmail
        })
      })

      if (res.ok) {
        const data = await res.json()
        console.log(data)
        if (data.status != 201) {
          throw new Error(`${data.status}: ${data.message}\n${data.error.details}`)
        }

        return {societyId: data.societyId, societyObject}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
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
    try {
      const res = await fetch('/api/account/society/edit-account', {
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

        return {societyId, societyObject}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
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