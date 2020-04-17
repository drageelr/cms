import React from 'react'
import LogEditor from "../logs/LogEditor"
import TaskCheckList from "./TaskCheckList"

export default function AddEditTaskDialog() {  
    return (
        <div>
            <TaskCheckList/>
            <LogEditor/>
        </div>
    )
}
