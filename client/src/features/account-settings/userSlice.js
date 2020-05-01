import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from "../../helpers"

const initialState = {
  id: -1,
  email: "",
  password: "",
  name: "",
  nameInitials: "CD",
  role: "",
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
    // console.log(user)
    const QUERY = (userType === "Society") ?  '/api/auth/society/login' : '/api/auth/cca/login'

    return await apiCaller(QUERY, {
      email: email,
      password: password
    }, 200,
    (data) => {
      if (userType==="CCA"){
        return {token: data.token, user: {email, userType, password, name: (data.user.firstName + ' ' + data.user.lastName),...data.user},}
      }
      else {
        return {token: data.token, user: {email, userType, password, ...data.user},}
      }
    },
    rejectWithValue)
  }
)

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async({currentPassword, newPassword}, {getState, rejectWithValue}) => {
    const {isPending, userType} = getState().user
    if (isPending != true){
      return
    }

    const QUERY = (userType === "Society") ? '/api/account/society/change-password' : '/api/account/cca/change-password'


    return await apiCaller(QUERY, {
      passwordCurrent: currentPassword,
      passwordNew: newPassword,
    }, 203,
    (data) => {
      return {newPassword}
    },
    rejectWithValue)
  }
)

const user = createSlice ({
  name:'user',
  initialState: initialState,
  reducers: {
    logout: (state, action) => {
      localStorage.removeItem("token")
      localStorage.removeItem("localUser")
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
        state.error = "Changed Password Successfully"
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