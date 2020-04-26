
//TODO: Localhost change to actual link

//1.1/1.2 Action Creator for CCA/Society Login

// export const login = createAsyncThunk(
//   'user/login',
//   async(email, password, role, {getState}) => {
//     const {isPending} = getState.formTemplate
//     if (isPending != true){
//       return
//     }
//   }
//   let api = '/api/auth/cca/login'
//   if (role === "Society"){
//     api = '/api/auth/society/login'
//   }
//   const res = await fetch(API + api, {
//     method: 'POST',
//     body: {
//       email: email,
//       password: password,
//     }
//   })
//   const data = res.json()
//   console.log(data)
//   return {token: data.token, user: data.user}
//   }
// )

//2.1 Action Creator for Creating CCA Account

// export const ccaCreate = createAsyncThunk(
//   'account/cca/create',
//   async({email, password, firstName, lastName, picture, permissions}, {getState, rejectWithValue}) => {
//     const {isPending} = getState().account
//     if (isPending != true){
//       return
//     }

//     const QUERY = '/account/cca/create-account'

//     try {
//       const res = await fetch(QUERY, {
//         method: 'POST',
//         mode: 'no-cors', 
//         body: {
//           email: email,
//           password: password,
//           firstName: firstName,
//           lastName: lastName,
//           picture: picture,
//           permissions: permissions
//         }
//       })
//       if (res.ok) {
//         const data = res.json()
//         return {ccaId: data.ccaId}
//       }
//       throw new Error(`Error: ${res.status}, ${res.statusText}`)
//     }
//     catch (error){
//       return rejectWithValue(err.toString())
//     }
//   }
// )

//2.2 Action Creator for Creating Society Account

export const societyCreate = createAsyncThunk(
  `account/society/create`,
  async({email, password, name, nameInitials, presidentEmail, patronEmail}, {getState, rejectWithValue}) => {
    const {isPending} = getState().user
    if (isPending != true){
      return
    }

    
    const QUERY = '/api/account/society/create-account'

    try {
      const res = await fetch(QUERY, {
        method: 'POST',
        headers: {
          'Authorization': token, 
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
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        return {societyId: data.societyId}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

//2.3 Action Creator for Editing CCA Account

export const ccaEdit= createAsyncThunk(
  `account/cca/edit`,
  async(ccaId, email, password, firstName, lastName, picture, permissions, {getState}) =>  {
    const {isPending} = getState().account
    if (isPending != true){
      return
    }

    
    const QUERY = '/api/account/cca/edit-account'

    try {
      const res = await fetch(QUERY, {
        method: 'POST',
        headers: {
          'Authorization': token, 
        },
        body: JSON.stringify({
          ccaId: ccaId,
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          picture: picture,
          permissions: permissions //List<Boolean>
        })
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        return
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

//2.4 Action Creator for Editing Society Account

export const editSocietyAccount = createAsyncThunk(
  'account/society/edit',
  async({societyId, email, password, name, nameInitials, presidentEmail, patronEmail}, {getState, rejectWithValue}) => {
    const {isPending} = getState().account
    if (isPending != true){
      return
    }

    
    const QUERY = '/api/account/society/edit-account'

    try {
      const res = await fetch(QUERY, {
        method: 'POST',
        headers: {
          'Authorization': token, 
        },
        body: JSON.stringify({
          societyId: societyId,
          email: email,
          password: password,
          name: name,
          nameInitials: nameInitials,
          presidentEmail: presidentEmail,
          patronEmail: patronEmail
        })
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        return
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

//2.5 Action Creator for Getting CCA Account List

export const ccaList = createAsyncThunk(
  'account/cca/list',
  async({getState, rejectWithValue}) => {
    const {isPending} = getState().account
    if (isPending != true){
      return
    }

    
    const QUERY = '/api/account/cca/account-list'

    try {
      const res= await fetch(QUERY, {
        method: 'POST',
        headers: {
          'Authorization': token, 
        },
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        return {userList: data.userList} //userList: [{ccaID, email, firstName, lastName, picture, active}]
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

//2.6 Action Creator for Getting Society Account List

export const societyList = createAsyncThunk(
  'account/society/list',
  async({getState, rejectWithValue}) => {
    const {isPending} = getState().account
    if (isPending != true){
      return
    }
    
    const QUERY = '/api/account/society/account-list'

    try {
      const res = await fetch(QUERY, {
        method: 'POST',
        headers: {
          'Authorization': token, 
        },
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        return {userList: data.userList}
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)

//2.7 Action Creator for Changing CCA Password

// export const ccaChangePassword = createAsyncThunk(
//   'account/cca/change-password',
//   async({passwordCurrent, passwordNew}, {getState, rejectWithValue}) => {
//     const {isPending} = getState().account
//     if (isPending != true){
//       return
//     }

//     
//     const QUERY = '/account/cca/change-password'
    
//     try {
//       const res = await fetch(QUERY, {
//         method: 'POST',
//         mode: 'no-cors',
//         body: {
//           passwordCurrent: passwordCurrent,
//           passwordNew: passwordNew
//         }
//       })
//       if (res.ok) {
//         const data = res.json()
//         return
//       }
//       throw new Error(`Error: ${res.status}, ${res.statusText}`)
//     }
//     catch (err) {
//       return rejectWithValue(err.toString())
//     }
//   }
// )

//2.8 Action Creator for Changing Society Password

// export const societyChangePassword = createAsyncThunk(
//   'account/society/change-password',
//   async ({passwordCurrent, passwordNew}, {getState, rejectWithValue}) => {
//     const {isPending} = getState().user
//     if (isPending != true){
//       return
//     }

//     
//     const QUERY = '/account/society/change-password'

//     try {
//       const res = await fetch(API, QUERY, {
//         method: 'POST',
//         mode: 'no-cors',
//         body: {
//           passwordCurrent: passwordCurrent,
//           passwordNew: passwordNew
//         }
//       })
//       if (res.ok) {
//         const data = res.json()
//         return
//       }
//       throw new Error(`Error: ${res.status}, ${res.statusText}`)
//     }
//     catch (err) {
//       return rejectWithValue(err.toString())
//     }
//   }
// )

//2.9 Action Creator for Change CCA Picture

export const ccaChangePicture = createAsyncThunk(
  'account/cca/change-picture',
  async({picture}, {getState, rejectWithValue}) => {
    const {isPending} = getState().user
    if (isPending != true){
      return
    }

    
    const QUERY = '/api/account/cca/change-picture'

    try {
      const res = await fetch(QUERY, {
        method: 'POST',
        headers: {
          'Authorization': token, 
        },
        body: JSON.stringify({
          picture: picture
        })
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        return 
      }
      throw new Error(`Error: ${res.status}, ${res.statusText}`)
    }
    catch (err) {
      return rejectWithValue(err.toString())
    }
  }
)