import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
  id: -1,
  email: "",
  password: "",
  name: "",
  nameInitials: "CD",
  role: "admin",
  userType: "CCA",
  isLoggedIn: false,
  picture: "",
  token: "",
  permissions: {
    ccaCRUD: true,
    accessFormMaker: true,
    createReqTask: true,
    createCustomTask: true,
    createTaskStatus: true,
    archiveTask: true,
    unarchiveTask: true,
    setFormStatus: true,
    addCCANote: true
  },
  isPending: true,
  error: null
}

export const login = createAsyncThunk(
  'user/login',
  async({email, password, userType}, {getState, rejectWithValue}) => {
    const {isPending} = getState().user
    if (isPending != true){
      return
    }

    const QUERY = (userType === "Society") ?  '/api/auth/society/login' : '/api/auth/cca/login'

    try {
      const res = await fetch(QUERY, {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      console.log(res)

      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 200) {
          throw new Error(`${data.statusCode}: ${data.message}\n${data.error.details}`)
        }
        if (userType==="CCA"){
          return {token: data.token, user: {email, userType, password, name: data.user.firstName + ' ' + data.user.lastName,...data.user},}
        }
        else {
          return {token: data.token, user: {email, userType, password, ...data.user},}
        }
      }
      throw new Error(`${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async({currentPassword, newPassword}, {getState, rejectWithValue}) => {
    const {isPending, userType, token} = getState().user
    if (isPending != true){
      return
    }

    const QUERY = (userType === "Society") ? '/api/account/society/change-password' : '/api/account/cca/change-password'

    try {
      const res = await fetch(QUERY, {
        method: 'POST',
        headers: {
          'Authorization': token, 
        },
        body: JSON.stringify({
          passwordCurrent: currentPassword,
          passwordNew: newPassword,
        })
      })

      console.log(res)
      if (res.ok) {
        const data = res.json()
        console.log(data)
        if (data.statusCode != 200) {
          throw new Error(`${data.statusCode}: ${data.message}\n${data.error.details}`)
        }

        return newPassword
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

const user = createSlice ({
  name:'user',
  initialState: initialState,
  reducers: {
    logout: (state,action) => {
      return initialState
    },
    clearError: (state, action) => {
      state.error = null
    }
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [login.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        return {
          ...action.payload.user,
          role: "admin",
          token: action.payload.token,
          isLoggedIn: true,
          isPending: false,
          error: null
        }
      }
    },
    [login.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },
    [changePassword.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [changePassword.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.password = action.payload
      }
    },
    [changePassword.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    }
  }
})

export const { logout, clearError } = user.actions

export default user.reducer