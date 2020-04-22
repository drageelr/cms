import React from 'react'
import FormViewerBar from './FormViewerBar'
import {makeStyles, List, Divider, Grid, Paper, Typography, Button, colors, Container } from '@material-ui/core'
import { connect } from 'react-redux'
import ItemView from './ItemView'

const useStyles = makeStyles((theme) => ({
  sectionPaper: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(2),
    height: '100%',
    marginBottom: 20,
    backgroundColor: theme.palette.primary.main,
  }
}))


function FormViewer({formTemplate, formData}) {
  const { title, isPublic, sections, sectionsOrder, componentsOrder, components, itemsOrder, items } = formTemplate
  const { ccaNote, ccaNoteTimestampModified, societyNotes } = formData
  const classes = useStyles()

  return (
    <div>
      <FormViewerBar title={formTemplate.title} notesData={{ccaNote, ccaNoteTimestampModified, societyNotes}}/>
      <br/>
      <Container>
      {
        sectionsOrder.map(sectionId => (
          <Paper elevation={4} className={classes.sectionPaper}>
            <h3 style={{color: 'white', marginLeft: 10}}>{sections[sectionId]}</h3>
            <List>
              { (sectionId in componentsOrder) ?
                componentsOrder[sectionId].map(componentId => {
                  return (componentId in itemsOrder) ?
                  itemsOrder[componentId].map(itemId => {
                    return <ItemView key={itemId} parentId={componentId} id={itemId} data={items[itemId]} />
                  }) : null
                }) : null 
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