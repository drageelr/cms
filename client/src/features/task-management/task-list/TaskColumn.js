import React from 'react'
import TaskCard from './TaskCard'
import TaskAddButton from './TaskAddButton'

export default function TaskColumn() {
    return (
        <div>
            <h1>Task Column</h1>
            <TaskCard/>
            <TaskAddButton/>
        </div>
    )
}
