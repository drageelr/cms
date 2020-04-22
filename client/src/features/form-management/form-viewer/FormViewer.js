import React from 'react'
import FormView from './FormView'
import NotesSideBar from './NotesSideBar'

export default function FormViewer() {
    return (
        <div>
            <h1>FormViewer</h1>
            <NotesSideBar/>
            <FormView />
        </div>
    )
}
