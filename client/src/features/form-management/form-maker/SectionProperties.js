import React, {useState} from 'react'
import SaveIcon from '@material-ui/icons/Save'
import { Button, LinearProgress } from '@material-ui/core'
import { setPropertyWindow } from '../propertiesDataSlice'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { addSection, editSection } from '../formTemplateSlice'

export default function SectionProperties({propertyId, propertyAddMode, sectionTitle}){
  const dispatch = useDispatch()
  
  function saveSection(newSectionTitle) {
    if (propertyAddMode) {
      dispatch(addSection({title: newSectionTitle}))
    }
    else {
      dispatch(editSection({id: propertyId, title: newSectionTitle}))
    }
    closeProperties()
  }
  
  function closeProperties() {
    dispatch(setPropertyWindow({propertyType: ''}))
  }

  return (      
    <Formik
      validateOnChange={false} validateOnBlur={true} initialValues={{sectionTitle: sectionTitle}}
      validate={values => {
        const errors = {}
        if (!values.sectionTitle) {
          errors.sectionTitle = 'Required'
        }
        return errors
      }}
      onSubmit={(values) => {
        saveSection(values.sectionTitle)
      }}
    >
      {({ submitForm}) => (
        <Form>
          <Field component={TextField} required name="sectionTitle" label="Section Title"/>
          <br />
          <Button variant="contained" color="primary" onClick={submitForm} style={{marginTop: 20}}
          >Save</Button>
          <Button onClick={closeProperties} variant="contained" style={{marginLeft: 10, marginTop: 20}}>Cancel</Button>
        </Form>
      )}
    </Formik>
  )
}