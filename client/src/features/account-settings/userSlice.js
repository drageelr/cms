import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  lumun : {
    id: "lumun",
    email: "lumun@lums.edu.pk",
    password: "",
    name: "LUMUN",
    nameInitials: "lumun",
    presidentEmail: "",
    patronEmail: ""
  }
  // lrs : {
  //   id: "lrs",
  //   email: "lrs@lums.edu.pk",
  //   password: "",
  //   name: "LUMS Religious Society",
  //   nameInitials: "lrs",
  //   presidentEmail: "",
  //   patronEmail: ""
  // },
  // spades : {
  //   id: "spades",
  //   email: "spades@lums.edu.pk",
  //   password: "",
  //   name: "SPADES",
  //   nameInitials: "spades",
  //   presidentEmail: "",
  //   patronEmail: ""
  // }
}

const userData = createSlice ({
  name:'userData',
  initialState: initialState,
  reducers: {
    
  }
})

export const { } = userData.actions

export default userData.reducer