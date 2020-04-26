import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

const sampleState = {
  societyList: [
    {
      id: 's-1',
      nameInitials: "LUMUN",
      name: "LUMS Model United Nations",
      email: "lumun@lums.edu.pk",
      presidentEmail: "zozo@gmail.com",
      patronEmail: "hamza@gmail.com",
      password: 'TEST'
    },
    {
      id: 's-2',
      nameInitials: "LUMUN",
      name: "LUMS Model United Nations",
      email: "lumun@lums.edu.pk",
      presidentEmail: "zozo@gmail.com",
      patronEmail: "hamza@gmail.com",
      password: 'TEST'
    }
  ],
  isPending: true,
  error: null
}  

const initialState = {
  societyList: [],
  isPending: true,
  error: null
}

export const fetchSocietyAccounts = createAsyncThunk(
  'societyData/fetchSocietyAccounts',
  async(_, { getState }) => {
    const { isPending } = getState().societyData
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
    console.log(sampleState)
    return result
  }
)

export const deleteSocietyAccount = createAsyncThunk(
  'societyData/deleteSocietyAccount',
  async(id, { getState }) => {
    const { isPending } = getState().societyData
    if (isPending != true) {
      return
    }
    return id
  }
)

export const addSocietyAccount = createAsyncThunk(
  'societyData/addSocietyAccount',
  async (societyObject, { getState }) => {
    const { isPending } = getState().societyData
    if (isPending != true) {
      return
    }
    return {id: 1,societyObject : societyObject}
  }
)


export const editSocietyAccount = createAsyncThunk(
  'societyData/editSocietyAccount',
  async (societyObject, { getState }) => {
    const { isPending } = getState().societyData
    if (isPending != true) {
      return
    }
    return societyObject
  }
)


let sId = 2
const societyData = createSlice({
  name: 'societyData',
  initialState: initialState,
  reducers: {
    clearError: (state, action)=>{
      state.error = null
    }
  },

  extraReducers: {
    [deleteSocietyAccount.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [deleteSocietyAccount.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        let i = 0
        state.societyList.map((obj,index) => {
          if (obj.id === action.payload.id){
            i = index
          }  
        })  
        state.societyList.splice(i,1)
        state.error = 'Society Account Deleted Successfully'
      }
    },
    [deleteSocietyAccount.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [addSocietyAccount.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [addSocietyAccount.fulfilled]: (state, action) => {
      if (state.isPending === true){
        state.isPending = false
        state.societyList.push({
        id : action.payload.id, 
        ...action.payload.societyObject
      })
      state.error = 'Society Account Added Successfully'
      } 
    },
    [addSocietyAccount.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [editSocietyAccount.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [editSocietyAccount.fulfilled]: (state, action) => {
      if(state.isPending === true){
        state.isPending = false
        let i = 0
        state.societyList.find((obj,index) => {
          if (obj.id === action.payload.id){
            i = index
          }
        })
        state.societyList[i] = action.payload
        state.error = 'Society Account Edited Successfully'
      }
    },
    [editSocietyAccount.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
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