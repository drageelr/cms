import React from 'react'
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import TextFormatIcon from '@material-ui/icons/TextFormat'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import { Grid, Button,} from '@material-ui/core'

export function textboxProperties(){
  //TODO
  return (
    <Grid container direction='column'>

    </Grid>
  )
}

export function textlabelProperties(){
  //TODO
  return (
    <Grid container direction='column'>

    </Grid>
  )
}

export function dropdownProperties(){
  //TODO
  return (
    <Grid container direction='column'>

    </Grid>
  )
}

export function radioProperties(){
  //TODO
  return (
    <Grid container direction='column'>

    </Grid>
  )
}
export function checkboxProperties(){
  //TODO
  return (
    <Grid container direction='column'>

    </Grid>
  )
}

export function fileProperties(){
  //TODO
  return (
    <Grid container direction='column'>

    </Grid>
  )
}

export function AddItemProperties(){
  return (
    <Grid container direction='column' >
      <Button color="primary" variant="contained" style={{marginBottom: 15}} startIcon={<TextFieldsIcon/>}>Text Box</Button>
      <Button color="primary" variant="contained" style={{marginBottom: 15}} startIcon={<TextFormatIcon/>}>Text Label</Button>
      <Button color="primary" variant="contained" style={{marginBottom: 15}} startIcon={<ArrowDropDownCircleIcon/>}>Dropdown</Button>
      <Button color="primary" variant="contained" style={{marginBottom: 15}} startIcon={<RadioButtonCheckedIcon/>}>Radio Button</Button>
      <Button color="primary" variant="contained" style={{marginBottom: 15}} startIcon={<CheckBoxIcon/>}>Checkbox</Button>
      <Button color="primary" variant="contained" style={{marginBottom: 15}} startIcon={<AttachFileIcon/>}>File Upload</Button>
    </Grid>
  )
}