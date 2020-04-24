import {createSlice} from '@reduxjs/toolkit'

//basically a list of all CCA members details-> list of objects
//need to add state for password verification
const initialState = [{   
    ccaMemberDetails:{
        123:{
            memberName: "Ashar Javed",
            memberEmail: "aa@lums.edu.pk",
            role: "admin",
            userPicture: "/static/images/avatar/1.jpg"
        },
        124:{
            memberName: "Farkhanda khan",
            memberEmail: "fk@lums.edu.pk",
            role: "admin",
            userPicture: "/static/images/avatar/1.jpg"
        }
    }}
]

let id = 2
const ccaPanelData = createSlice({
    name: 'ccaPanelData',
    initialState: initialState,
    reducers: {
        addCCAAccount: (state,action) =>{
            id+= 1
            state.ccaMemberDetails[id] = action.payload
            console.log("Account added")
            console.log(state)
        },
        deleteCCAAccount: (state,action)=>{
            //confirm the {data}
            const {id} = action.payload
        },
        editCCAAccount: (state,action)=>{
            //confirm the {data}
            const {id} = action.payload
        }
    }
})

export const {addCCAAccount,deleteCCAAccount,editCCAAccount} = ccaPanelData.actions

export default ccaPanelData.reducer