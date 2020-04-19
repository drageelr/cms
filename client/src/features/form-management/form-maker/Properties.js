import React from 'react'
import { makeStyles, List, Divider, Grid, Paper, Typography, Button, TextField } from '@material-ui/core'
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import TextFormatIcon from '@material-ui/icons/TextFormat'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import SaveIcon from '@material-ui/icons/Save'
import SectionProperties from './SectionProperties'
import ComponentProperties from './ComponentProperties'
import { connect } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  propertiesPaper: {
    padding: theme.spacing(2),
    position: 'fixed',
    width: 200,
    height: '100%',
    backgroundColor: 'whitesmoke',
  },
  innerDiv: {
    padding: theme.spacing(2),
    marginTop: '3%',
    position: 'fixed',
    width: 200,
    maxHeight: '75%',
    backgroundColor: 'whitesmoke',
    overflow: 'auto'
  },
  subtaskPaper: {
    padding: theme.spacing(1),
    width: '90%',
    height: '100%',
    maxHeight: 100,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    marginBottom: 10,
  },
  checklist: {
    marginTop: '-1%',
    position: 'fixed',
    width: 200,
    maxHeight: '75%',
    overflow: 'auto'
  }
}))

export default function Properties({propertyType, checklist, sections, sectionsOrder}) {
  const classes = useStyles()

  let title = ""
  let renderProperties = null
  switch (propertyType) {
    case "item":
      title = "Add Item"
      renderProperties = <AddItemProperties/>
      break
    case "component":
      title = "Component"
      renderProperties = <ComponentProperties/>
      break
    case "section":
      title = "Section"
      renderProperties = <SectionProperties/>
      break    
    case "checklist":
      title = "Checklist"
      renderProperties = <ChecklistProperties/>
      break
  }

  if (propertyType === "") return ( // shown on default entry
    <Paper square variant="outlined" className={classes.propertiesPaper}>
      <h3 style={{marginTop: 10}}>Welcome to the CMS Form Maker!</h3>
      <p>
        You can add as many sections as required, logical components in them and items of the defined types within those.
        Contact us if you have any queries regarding usage.
      </p>
    </Paper>  
  )
  
  function AddItemProperties(){
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

  function ChecklistProperties(){
    return (
      <List className={classes.checklist}>
        {
          sectionsOrder.map(sectionId => {
            const sectionTitle = sections[sectionId]
            const subtask = checklist[sectionId]
            return <Paper className={classes.subtaskPaper}>
              <h5 style={{marginBottom: 0, marginTop: 4}} >{sectionTitle}</h5>
              <h6 style={{marginBottom: 2, marginTop: 5}}>{subtask}</h6>
            </Paper>
          })
        }
        <Button variant="contained" style={{marginTop: 4}} startIcon={<SaveIcon/>}>Save Checklist</Button>
      </List>
    )
  }
  
  
  return (
    <Paper square variant="outlined"className={classes.propertiesPaper}>
      <Grid container  direction="column" justify="flex-start" alignItems="center">
        <Grid item xs>
        <h3 style={{marginTop: 10}}>{title}</h3>
          <Divider variant="middle"/>
        </Grid>
        <List className={classes.innerDiv}>
          {renderProperties}
        </List>
      </Grid>
    </Paper>
  )
}