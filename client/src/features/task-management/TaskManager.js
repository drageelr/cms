import React from 'react'
import TaskColumn from './task-list/TaskColumn'
import TaskAddButton from './task-list/TaskAddButton'
import TaskArchive from './task-archive/TaskArchive'


export default function TaskManager() {
    return (
        <div>
            <h1>Task Manager</h1>
            <TaskColumn/>
            <TaskAddButton/>
            <TaskArchive/>
        </div>
    )
}