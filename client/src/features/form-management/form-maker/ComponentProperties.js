import React, {useState} from 'react'
import { Button, Icon } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { closePropertiesWindow } from '../propertiesDataSlice'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { addComponent, editComponent } from '../formTemplateSlice'
import ConditionalItemDialog from './ConditionalItemDialog'


/**
  Displays the Component Properties Window in order to add / edit components, so conditionally renders
  in add and edit modes with input fields for the component title and component conditional items list here.

  @param {bool} propertyAddMode determines whether to open the ComponentProperties in Add (true) or Edit (false) mode
  @param {number} propertyId component ID
  @param {number} parentId sectionId for the parent section of this component
  @param {string} componentTitle component title
  @state dialogOpen (local)
*/

export default function ComponentProperties({propertyAddMode, propertyId, parentId, componentTitle}){
  const [dialogOpen, setDialogOpen] = useState(false)
  const dispatch = useDispatch()
  
  function closeProperties() {
    dispatch(closePropertiesWindow())
  }

  function toggleDialogOpen() {
    setDialogOpen(! dialogOpen)
  }

  return (
    <div>
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues={{label: componentTitle}}
        validate={values => {
          const errors = {}
          if (!values.label) {
            errors.label = 'Required'
          }
          return errors
        }}
        onSubmit={(values) => {
          if (propertyAddMode){
            dispatch(addComponent({parentId, title: values.label}))
          }
          else{
            dispatch(editComponent({id: propertyId, title: values.label}))
          }
          closeProperties()
        }}
      >
        {({ submitForm}) => (
          <Form>
            <Field component={TextField} name="label" required label="Component Title"/>
            <br />
            <Button variant="contained" color="primary" onClick={submitForm} type="submit" style={{marginTop: 20}}>Save</Button>
            <Button onClick={closeProperties} variant="contained" style={{marginLeft: 10, marginTop: 20}}>Cancel</Button>
          </Form>
        )}
      </Formik>

      <Button onClick={toggleDialogOpen} variant="contained" style={{marginTop: 20, padding: 10}} startIcon={<Icon>add</Icon>}>Add Conditional Item</Button>
      <ConditionalItemDialog componentId={propertyId} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} />
    </div>
  )
}