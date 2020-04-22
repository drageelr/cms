import {createSlice} from '@reduxjs/toolkit'


//basically a list of all society details-> list of objects
const initalState = [
  {
    societyId:[
      {
        societyId: 123,
        societyInitials: "LUMUN",
        societyName: "LUMS model united nations",
        societyEmail: "lumun@lums.edu.pk",
        presidentEmail: "zozo@gmail.com",
        patronEmail: "hamza@gmail.com",
        password: ''
      },
      {
        societyId: 124,
        societyInitials: "LES",
        societyName: "LUMS LES",
        societyEmail: "LES@lums.edu.pk",
        presidentEmail: "LES@gmail.com",
        patronEmail: "patron@gmail.com",
        password: ''
      }
    ],
  },
  {
    isAdd: false,
  },
  {
    isEdit: false,
  }
]
const societyPanelData = createSlice({
    name: 'societyPanelData',
    initalState: initalState,
    reducers: {
        addSocietyAccount: (state,action) =>{
          state.map((obj,index)=>{
            obj.societyId.map((obj2,index)=> {
              console.log(obj2.societyId)
            })
          })  
        },
        deleteSocietyAccount: (state,action)=>{

        },
        editSocietyAccount: (state,action)=>{
            
        }

    }
})

export const {addSocietyAccount,deleteSocietyAccount,editSocietyAccount} = societyPanelData.actions

export default societyPanelData.reducer