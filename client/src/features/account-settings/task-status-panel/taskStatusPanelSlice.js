import {createSlice} from '@reduxjs/toolkit'

initialState = [
    {
        taskStatusid:1,
        taskStatusName: "",
        taskStatusColor: ""
    }
    
]

const taskStatusDetails = {
    name: "taskStatusDetails",
    initialState: initialState,
    reducer:{
        addTaskStatusName: (state,action)=>{
            const{srcTaskName,srcColor} = action.payload
        },
        editTaskStatus: (state,action)=>{
            const{} = action.payload
        },
        deleteTaskStatus:(state,action)=>{
            const{srcid} = action.payload
        }
    }
}

export const [addTaskStatusName,editTaskStatus,deleteTaskStatus] = taskStatusDetails.actions

export default taskStatusDetails.reducer