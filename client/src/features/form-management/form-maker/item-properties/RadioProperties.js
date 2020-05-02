import React from 'react'
import { Button} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { TextField, CheckboxWithLabel } from 'formik-material-ui'
import { useDispatch } from 'react-redux'
import { closePropertiesWindow } from '../../propertiesDataSlice'
import { addItem, editItem } from '../../formTemplateSlice'

// RadioProperties variant for Item Properties, item template includes {label, options, required, defaultVisibility}

export default function RadioProperties({propertyAddMode, propertyId, itemData, parentId}){
  const dispatch = useDispatch()
  const initialValues = itemData === null ? {
    label: '',
    options: '',
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
        else if (!values.options) {
          errors.options = 'Required'
        }
        return errors
      }}
      onSubmit={(values) => {
        const newItemData = {
          type: 'radio', 
          label: values.label,
          options: (typeof values.options === "string") ? values.options.split(',') : values.options,
          required: values.required, 
          defaultVisibility: values.defaultVisibility,
          conditionalItems: [{optionId: 0, itemId: 0}]
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

          <Field component={TextField} multiline rows={5} variant="outlined" fullWidth 
            name="options" label="Options" helperText="A list of options separated by commas" placeholder="Option A, Option B, ..."/>

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