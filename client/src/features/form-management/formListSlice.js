import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const sampleFormList = [
  {formId: 0, title: "Design Approval", creatorId: "Ashar Javaid", timestampModified: '02/13/2009 23:31:30', isPublic: false},
  {formId: 1, title: "Auditorium Booking", creatorId: "Ashar Javaid", timestampModified: '02/13/2009 22:31:30', isPublic: true},
  {formId: 2, title: "Petition", creatorId: "Zoraiz Qureshi", timestampModified: '02/13/2009 21:31:30', isPublic: true},
  {formId: 3, title: "Event Approval", creatorId: "Farkhanda Khan", timestampModified: '02/13/2009 20:31:30', isPublic: false},
  {formId: 4, title: "Service Request", creatorId: "Ashar Javaid", timestampModified: '02/13/2009 19:31:30', isPublic: true},
]

const initialState = {
  list: [],
  isPending: true,
  error: null
}

// const fId = 0
export const fetchFormList = createAsyncThunk(
  'formList/fetchFormList',
  async (_, { getState, rejectWithValue}) => {
    const { isPending } = getState().formList
    if (isPending != true) {
      return
    }
    try {
      const res = await fetch('/api/form/fetch-list', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
      })
      console.log("elo jee", res)
      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 200) {
          //CHANGE 1
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - "${data.error.details}"`
          : `${data.statusCode}: ${data.message}`) 
        }
        return data.formList
      }
      //CHANGE 2
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

export const deleteForm = createAsyncThunk(
  'formList/deleteForm',
  async (index, { rejectWithValue}) => {
    try {
      const res = await fetch('/api/form/delete', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          formId: index
        })
      })
      // console.log("response: ",res)
      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 203) {
          //CHANGE 1
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - "${data.error.details}"`
          : `${data.statusCode}: ${data.message}`) 
        }
        return index
      }
      //CHANGE 2
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)


export const toggleStatus = createAsyncThunk(
  'formList/changeFormStatus',
  async (index, {rejectWithValue}) => {
    try {
      const res = await fetch('/api/form/edit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          index: index,
          isPublic: null
        })
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 203) {
          //CHANGE 1
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - "${data.error.details}"`
          : `${data.statusCode}: ${data.message}`) 
        }
        
        return index
        // return {isPending: false, error: '' , ccaList: data.userList}
      }
      //CHANGE 2
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

export const duplicateForm = createAsyncThunk(
  'formList/duplicateForm',
  async (index, {rejectWithValue}) => {
    try {
      const res = await fetch('/api/form/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`, 
        },
        body: JSON.stringify({
          formObj: null //Object required
        })
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        if (data.statusCode != 201) {
          //CHANGE 1
          throw new Error((data.error !== undefined) 
          ? `${data.statusCode}: ${data.message} - "${data.error.details}"`
          : `${data.statusCode}: ${data.message}`) 
        }
        
        return index
        // return {isPending: false, error: '' , ccaList: data.userList}
      }
      //CHANGE 2
      throw new Error(`${res.status}, ${res.statusText}`) 
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

const formList = createSlice({
  name: 'formList',
  initialState: initialState,
  reducers: {
    clearError: (state, action) => {
      state.error = null
    },
  },

  extraReducers: {
    [fetchFormList.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchFormList.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.list = action.payload
      }
    },
    [fetchFormList.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [deleteForm.fulfilled]: (state, action) => {
      let i = 0
      state.list.map((obj,index) => {
        if (obj.id === action.payload){
          i = index
        }  
      })  
      state.list.splice(i,1)
    },
    [deleteForm.rejected]: (state, action) => {
      state.error = action.payload
    },

    [duplicateForm.fulfilled]: (state, action) => {
      const idx = action.payload
      state.list.splice(idx,0,{...state.list[idx]})
    },
    [duplicateForm.rejected]: (state, action) => {
      state.error = action.payload
    },

    [toggleStatus.fulfilled]: (state, action) => {
      const idx = action.payload
      state.list[idx].isPublic = !state.list[idx].isPublic
    },
    [toggleStatus.rejected]: (state, action) => {
      state.error = action.payload
    },
  }
})

export const { clearError } = formList.actions


export default formList.reducer