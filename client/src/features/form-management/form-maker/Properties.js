import React from 'react'
import { makeStyles, List, Divider, Grid, Paper, Typography, Button } from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import TextFormatIcon from '@material-ui/icons/TextFormat'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'

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
  },
}))

export default function Properties({propertyType}) {
  const classes = useStyles()
  const title = propertyType === "item" ? "Add Item" : "Component"
  const scrollStyle = {}
  if (propertyType === "") return (
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
  
  
  return (
    <Paper square variant="outlined"className={classes.propertiesPaper}>
      <Grid container  direction="column" justify="flex-start" alignItems="center">
        <Grid item xs>
        <h3 style={{marginTop: 10}}>{title}</h3>
          <Divider variant="middle"/>
        </Grid>
        <div className={classes.innerDiv} style={scrollStyle}>
          <List>
            {
            propertyType === 'item' ? AddItemProperties() : null
            }
          </List>
        </div>
      </Grid>
    </Paper>
  )
}
