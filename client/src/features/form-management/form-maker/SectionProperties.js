import React from 'react'
import { Button } from '@material-ui/core'
import { closePropertiesWindow } from '../propertiesDataSlice'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { addSection, editSection } from '../formTemplateSlice'

/**
  SectionProperties is the sub-property window for Sections, allowing only
  the editing of the section title.

  @param {number} propertyId for the section
  @param {bool}  propertyAddMode to check whether in add or edit mode
  @param {string} sectionTitle retrieved from state to modify
*/

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
    dispatch(closePropertiesWindow())
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