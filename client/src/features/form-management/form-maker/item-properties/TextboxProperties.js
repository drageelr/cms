import React from 'react'
import { Button} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { TextField, CheckboxWithLabel } from 'formik-material-ui'
import { useDispatch } from 'react-redux'
import { setPropertyWindow } from '../../propertiesDataSlice'
import { addItem, editItem } from '../../formTemplateSlice'

export default function TextboxProperties({propertyAddMode, propertyId, itemData, parentId}){
  const dispatch = useDispatch()
  const initialValues = itemData === null ? {
    label: '',
    placeHolder: '',
    maxLength: 100,
    required: true,
    defaultVisibility: true
  } : itemData
  
  console.log(parentId)

  function closeProperties() {
    dispatch(setPropertyWindow({propertyType: ''}))
  }

  return (
    <Formik
      validateOnChange={false} validateOnBlur={true}
      initialValues={initialValues}
      validate={values => {
        const errors = {}
        if (!values.label) {
          errors.label = 'Required'
        }
        if (!values.maxLength) {
          errors.maxLength = 'Required'
        }
        return errors
      }}
      onSubmit={(values) => {
        const newItemData = {
          type: 'textbox', 
          label: values.label,
          placeHolder: values.placeHolder,
          maxLength: values.maxLength, 
          required: values.required, 
          defaultVisibility: values.defaultVisibility
        }

        if (propertyAddMode){
          dispatch(addItem({parentId, newItemData}))
        }
        else{
          dispatch(editItem({id: propertyId, newItemData}))
        }
        closeProperties()
      }}
    >
      {({ submitForm}) => (
        <Form>
          <Field component={TextField} name="label" required label="Label"/>
          <br/>
          <Field component={TextField} name="placeHolder" required label="Placeholder"/>
          <br/>
          <br/>
          <Field component={TextField} name="maxLength" required label="Max Length" helperText="Max length allowed (characters)"/>
          <Field component={CheckboxWithLabel} color='primary' name="required" type="checkbox" Label={{label: "Required"}}/>
          <Field component={CheckboxWithLabel} color='primary' name="defaultVisibility" type="checkbox" Label={{label: "Default Visibility"}}/>

          <br />
          <Button variant="contained" color="primary" onClick={submitForm} style={{marginTop: 20}}>Save</Button>
          <Button onClick={closeProperties} variant="contained" style={{marginLeft: 10, marginTop: 20}}>Cancel</Button>
        </Form>
      )}
    </Formik>
  )
}