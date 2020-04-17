import React from 'react'
import FormMakerBar from './FormMakerBar'
import Properties from './Properties'
import AddSection from './AddSection'

export default function FormMaker() {
    return (
        <div>
            <FormMakerBar />
            <Properties />
            <AddSection />
        </div>
    )
}
