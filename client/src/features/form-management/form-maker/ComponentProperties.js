import React, {useState} from 'react'
import { Button, Icon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  FormControl, FormLabel, FormGroup, FormControlLabel, List, Checkbox, MenuItem, Select, InputLabel} from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { setPropertyWindow } from '../propertiesDataSlice'
import { makeStyles } from '@material-ui/core/styles'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { addComponent, editComponent } from '../formTemplateSlice'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
}))

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
  const classes = useStyles()
  const dispatch = useDispatch()
  
  function closeProperties() {
    dispatch(setPropertyWindow({propertyType: '', propertyId: ''}))
  }

  function toggleDialogOpen() {
    setDialogOpen(! dialogOpen)
  }

  function optionEffect() {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">If "Option 1 selected" show</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={false} onChange={toggleDialogOpen} name={"item-2"} />}
            label={"Item 2"}
          />
          <FormControlLabel
            control={<Checkbox checked={false} onChange={toggleDialogOpen} name={"item-3"} />}
            label={"Item 3"}
          />
        </FormGroup>
      </FormControl>
    )
  }

  function ConditionalItemDialog() {
    return (
      <Dialog onClose={toggleDialogOpen} aria-labelledby="conditional-item-dialog" open={dialogOpen}>
        <DialogTitle id="conditional-item-dialog-title">Conditional Item Options - {"Item 1"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            First select the conditional item from the list of component's items you have created. Note: Only a Dropdown or Radio Button group can be selected as a conditional item.
          </DialogContentText>
          <FormControl className={classes.formControl} >
            <InputLabel id="input-conditional-item-label">Select Conditional Item</InputLabel>
            <Select
              labelId="select-conditional-item-label"
              id="select-conditional-item"
              value={""}
              onChange={toggleDialogOpen}
            >
              <MenuItem value={"item-1"}>{"Item 1"}</MenuItem>
              <MenuItem value={"item-2"}>{"Item 2"}</MenuItem>
              <MenuItem value={"item-3"}>{"Item 3"}</MenuItem>
            </Select>
          </FormControl>
          <List>
            {optionEffect()}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialogOpen} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
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
            <Button variant="contained" color="primary" onClick={submitForm} style={{marginTop: 20}}>Save</Button>
            <Button onClick={closeProperties} variant="contained" style={{marginLeft: 10, marginTop: 20}}>Cancel</Button>
          </Form>
        )}
      </Formik>

      <Button onClick={toggleDialogOpen} variant="contained" style={{marginTop: 20, padding: 10}} startIcon={<Icon>add</Icon>}>Add Conditional Item</Button>
      <ConditionalItemDialog/>
    </div>
  )
}