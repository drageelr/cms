const PUBLIC_URL = 'http//:167.71.224.73/'
//TODO: Localhost change to actual link

//1.1/1.2 Action Creator for CCA/Society Login

 export const login = createAsyncThunk(
   'user/login',
   async(email, password, role, {getState}) => {
     const {isPending} = getState.formTemplate
     if (isPending != true){
       return
     }
   }

   let api = '/api/auth/cca/login'
   if (role === "Society"){
     api = '/api/auth/society/login'
   }

   const res = await fetch(PUBLIC_URL + api, {
     method: 'POST',
     body: {
       email: email,
       password: password,
     }
   })

   const data = res.json()
   console.log(data)
   return {token: data.token, user: data.user}
 )

//2.1 Action Creator for Creating CCA Account

export const ccaCreate = createAsyncThunk(
  'account/cca/create'
  async(email, password, firstName, lastName, picture, permissions, {getState}) => {
    const {isPending} = getState.formTemplate
    if (isPending != true){
      return
    }
  }

  let api = '/api/account/cca/create-account'

  const res = await fetch(PUBLIC_URL + api, {
    method: 'POST',
    body: {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      picture: picture,
      permissions: permissions //List<Boolean>
    }
  })
  
  const data = res.json()
  console.log(data)
  return {ccaID: data.ccaID}
)

//2.2 Action Creator for Creating Society Account

export const societyCreate = createAsyncThunk(
  'account/society/create'
  async(email, password, name, nameInitials, presidentEmail, patronEmail, {getState}) => {
    const {isPending} = getState.formTemplateif (isPending != true){
      return
    }
  }

  let api = '/api/account/society/create-account'

  const res = await fetch(PUBLIC_URL + api, {
    method: 'POST',
    body: {
      email: email,
      password: password,
      name: name,
      nameInitials: nameInitials,
      presidentEmail: presidentEmail,
      patronEmail: patronEmail
    }
  })

  const data = res.json()
  console.log(data)
  return {societyID: data.societyID}
)
