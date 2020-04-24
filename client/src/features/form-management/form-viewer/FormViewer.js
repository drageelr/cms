import React from 'react'
import FormViewerBar from './FormViewerBar'
import {makeStyles, List, Paper, Container } from '@material-ui/core'
import { connect } from 'react-redux'
import ItemView from './ItemView'

const useStyles = makeStyles((theme) => ({
  sectionPaper: {
    padding: theme.spacing(2),
    height: '100%',
    marginBottom: 20,
    backgroundColor: theme.palette.primary.main,
  }
}))


function FormViewer({formTemplate, formData}) {
  const { title, sections, sectionsOrder, componentsOrder, itemsOrder, items } = formTemplate
  const { ccaNote, ccaNoteTimestampModified, societyNotes } = formData
  const classes = useStyles()

  return (
    <div>
      <FormViewerBar title={title} notesData={{ccaNote, ccaNoteTimestampModified, societyNotes}}/>
      <br/>
      <Container>
      { //Container to center align the View, also sections and items rendered only (components are only logical)
        sectionsOrder.map(sectionId => (
          <Paper elevation={4} className={classes.sectionPaper}>
            <h3 style={{color: 'white', marginLeft: 10}}>{sections[sectionId]}</h3>
            <List>
              { (sectionId in componentsOrder) ? // does the section has components?
                componentsOrder[sectionId].map(componentId => {
                  return (componentId in itemsOrder) ? // does the component have items?
                  itemsOrder[componentId].map(itemId => {
                    return <ItemView key={itemId} id={itemId} templateData={items[itemId]} />
                  }) : null
                }) : null //null for empty sections and columns
              }
            </List>
          </Paper>
        ))
      }
      </Container>
    </div>
  )
}

const mapStateToProps = (state) => ({ //needs both the template and data to render the form
  formTemplate: state.formTemplate,
  formData: state.formData,
})


export default connect(mapStateToProps) (FormViewer)