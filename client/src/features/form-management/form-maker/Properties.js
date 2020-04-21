import React from 'react'
import { makeStyles, List, Divider, Grid, Paper, Button } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import SectionProperties from './SectionProperties'
import ComponentProperties from './ComponentProperties'
import { connect } from 'react-redux'
import {AddItemProperties, textboxProperties, textlabelProperties, 
  dropdownProperties, radioProperties, checkboxProperties, fileProperties} from './ItemProperties'

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

function Properties({propertiesData, checklist, sections, sectionsOrder}) {
  const classes = useStyles()
  const {propertyType, propertyAddMode, propertyId} = propertiesData

  let title = ""
  let renderProperties = null
  
  switch (propertyType) {
    case "add-item":
      title = "Add Item"
      renderProperties = <AddItemProperties/>
      break
    case "component":
      title = "Component"
      renderProperties = <ComponentProperties propertyAddMode={propertyAddMode} propertyId={propertyId}/>
      break
    case "section":
      title = "Section"
      renderProperties = <SectionProperties propertyAddMode={propertyAddMode} propertyId={propertyId} sections={sections}/>
      break    
    case "checklist":
      title = "Checklist"
      renderProperties = <ChecklistProperties/>
      break
    case "item-textbox":
      title = "Text Box"
      renderProperties = <textboxProperties/>
      break
    case "item-textlabel":
      title = "Text Label"
      renderProperties = <textlabelProperties/>
      break
    case "item-dropdown":
      title = "Dropdown"
      renderProperties = <dropdownProperties/>
      break
    case "item-radio":
      title = "Radio Button"
      renderProperties = <radioProperties/>
      break
    case "item-checkbox":
      title = "Checkbox"
      renderProperties = <checkboxProperties/>
      break 
    case "item-file":
      title = "File Upload"
      renderProperties = <fileProperties/>
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
        <h3 style={{marginTop: 10}}>{(propertyAddMode ? 'Add ' : 'Edit ') + title}</h3>
          <Divider variant="middle"/>
        </Grid>
        <List className={classes.innerDiv}>
          {renderProperties}
        </List>
      </Grid>
    </Paper>
  )
}

const mapStateToProps = (state) => ({
  propertiesData: state.propertiesData,
})

export default connect(mapStateToProps) (Properties)