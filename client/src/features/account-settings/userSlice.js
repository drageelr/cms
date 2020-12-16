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
  darkMode: false,
  themeColor: '#3578fa',
  isPending: true,
  error: null
}

export const login = createAsyncThunk(
  'user/login',
  async({email, password, userType}, {getState, rejectWithValue}) => {
    const {isPending} = getState().user
    if (!isPending){
      return
    }

    const QUERY = (userType === "Society") ?  '/api/auth/society/login' : '/api/auth/cca/login'

    return await apiCaller(QUERY, {email, password}, 200,
    (data)=> {
      localStorage.setItem('token', data.token)

      if (userType==="CCA"){
        return {token: data.token, user: {email, userType, password, name: (data.user.firstName + ' ' + data.user.lastName),...data.user},}
      }
      else {
        return {token: data.token, themeColor: '#3578fa', darkMode: false, user: {email, userType, password, ...data.user},}
      }
    },rejectWithValue)
  }
)
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async({currentPassword, newPassword}, {getState, rejectWithValue}) => {
    const {isPending, userType} = getState().user
    if (!isPending){
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


export const changeThemeColor = createAsyncThunk(
  'ccaDetails/changeThemeColor',
  async (themeObj,  { rejectWithValue }) => {
    const {ccaId, themeColor} = themeObj

    return await apiCaller('/api/account/cca/edit-account', {ccaId, themeColor}, 203,
    (data) => themeColor,
    rejectWithValue)
  }
)

export const changeDarkMode = createAsyncThunk(
  'ccaDetails/changeDarkMode',
  async (modeObj,  { rejectWithValue }) => {
    const {darkMode, ccaId} = modeObj
    
    return await apiCaller('/api/account/cca/edit-account', {ccaId, darkMode}, 203,
    (data) => darkMode,
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
    },

    setUserPicture: (state, action) => {
      state.picture = action.payload.picture
    },

    setUserDetails: (state, action) => {
      state.userType = action.payload.userType
      state.isLoggedIn = action.payload.isLoggedIn
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
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
    },

    [changeThemeColor.fulfilled]: (state, action) => {
      state.themeColor = action.payload
    },
    [changeThemeColor.rejected]: (state, action) => {
      state.error = action.payload
    },

    [changeDarkMode.fulfilled]: (state, action) => {
      state.darkMode = action.payload
    },
    [changeDarkMode.rejected]: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { logout, clearError, setUserPicture, setUserDetails } = user.actions

export default user.reducer