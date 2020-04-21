import React, {useState} from 'react'
import SaveIcon from '@material-ui/icons/Save'
import { Button, LinearProgress } from '@material-ui/core'
import { addSection } from '../formTemplateSlice'
import { setPropertyWindow } from '../propertiesDataSlice'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'

export default function SectionProperties({propertyId, propertyAddMode, sections}){
  const dispatch = useDispatch()

  const initialValues = {
    sectionTitle: propertyAddMode ? '' : sections[propertyId]
  }
  
  function saveSection(sectionTitle) {
    dispatch(addSection({title: sectionTitle}))
    closeProperties()
  }
  
  function closeProperties() {
    dispatch(setPropertyWindow({propertyType: ''}))
  }

  return (      
    <Formik
      validateOnChange={false}
      validateOnBlur={true}
      initialValues={initialValues}
      validate={values => {
        const errors = {}
        if (!values.sectionTitle) {
          errors.sectionTitle = 'Required'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false)
        saveSection(values.sectionTitle)
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Form>
          <Field component={TextField} required name="sectionTitle" type="email" label="Section Title"/>
          {isSubmitting && <LinearProgress />}
          <br />
          <Button variant="contained" color="primary" disabled={isSubmitting} onClick={submitForm} style={{marginTop: 20}}
          >Save</Button>
          <Button onClick={closeProperties} variant="contained" style={{marginLeft: 10, marginTop: 20}}>Cancel</Button>
        </Form>
      )}
    </Formik>
  )
}