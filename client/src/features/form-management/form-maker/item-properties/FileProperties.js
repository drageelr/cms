import React from 'react'
import { Button} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { TextField, CheckboxWithLabel } from 'formik-material-ui'
import { useDispatch } from 'react-redux'
import { closePropertiesWindow } from '../../propertiesDataSlice'
import { addItem, editItem } from '../../formTemplateSlice'


// FileProperties variant for Item Properties, item template includes {label, fileTypes, required, defaultVisibility}

export default function FileProperties({propertyAddMode, propertyId, itemData, parentId}){
  const dispatch = useDispatch()
  const initialValues = itemData === null ? {
    label: '',
    fileTypes: '',
    required: true,
    defaultVisibility: true
  } : itemData
  
  function closeProperties() {
    dispatch(closePropertiesWindow())
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
        return errors
      }}
      onSubmit={(values) => {
        const newItemData = {
          type: 'file', 
          label: values.label,
          fileTypes: values.fileTypes,
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
          <br/>
          <Field component={TextField} multiline rows={3} variant="outlined" fullWidth 
          name="fileTypes" label="Restricted File Types" helperText="A restricted list of file extensions separated by commas" placeholder=".jpg, .png, ..."/>

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