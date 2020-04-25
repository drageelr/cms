import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
  id: -1,
  email: "",
  password: "",
  name: "",
  nameInitials: "",
  role: "CCA",
  isLoggedIn: true,
  picture: "",
  token: "",
  isPending: true,
  error: null
}

// const API = 'http://localhost:3030/api'
const API = 'http//:167.71.224.7/api'

export const login = createAsyncThunk(
  'user/login',
  async({email, password, role}, {getState, rejectWithValue}) => {
    const {isPending} = getState().user
    if (isPending != true){
      return
    }
    
    let QUERY = '/auth/cca/login'
    if (role === "Society"){
      QUERY = '/api/auth/society/login'
    }
    try {
      const res = await fetch(API+QUERY, {
        method: 'POST',
        mode: 'no-cors', // no-cors, *cors, same-origin
        body: {
          email: email,
          password: password,
        }
      })
      if (res.ok) {
        const data = res.json()
        return {token: data.token, user: data.user}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async({currentPassword, newPassword}, {getState}) => {
    const {isPending} = getState().user
    if (isPending != true){
      return
    }

    return newPassword
  }
)

const user = createSlice ({
  name:'user',
  initialState: initialState,
  reducers: {
    logout: (state,action) => {
      return {
        id: -1,
        email: "",
        password: "",
        name: "",
        nameInitials: "",
        role: "CCA",
        isLoggedIn: false,
        token: "",
        isPending: true,
        error: null
      }
    },
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
          token: action.payload.token,
          isPending: false,
          error: null
        }
      }
    },
    [login.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload.message
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
        state.error = action.payload.message
      }
    }
  }
})

export const { logout } = user.actions

export default user.reducer