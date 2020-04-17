import React from 'react'
import CCAAccountsPanel from './CCAAccountsPanel'
import SocietyAccountsPanel from './SocietyAccountsPanel'
import TaskStatusPanel from './TaskStatusPanel'
import ChangePassword from './ChangePassword'

export default function CCASettingsHome() {
    return (
        <div>
            <h3>CCA SETTINGS HOME</h3>
            <ChangePassword/>
            <CCAAccountsPanel/>
            <SocietyAccountsPanel/>
            <TaskStatusPanel/>
        </div>
    )
}
