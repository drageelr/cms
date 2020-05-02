import React, {useEffect, useState} from 'react'
import FormViewerBar from './FormViewerBar'
import {makeStyles, List, Paper, Container, CircularProgress, Button } from '@material-ui/core'
import { connect } from 'react-redux'
import ItemView from './ItemView'
import { fetchFormData, clearError } from '../formDataSlice'
import { fetchForm, clearError as clearErrorFormTemplate } from '../formTemplateSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import ErrorSnackbar from '../../../ui/ErrorSnackbar'

const useStyles = makeStyles((theme) => ({
  sectionPaper: {
    padding: theme.spacing(2),
    height: '100%',
    marginBottom: 20,
    backgroundColor: theme.palette.primary.main,
  }
}))

function FormViewer({formTemplate, formData, dispatch, userType, match}) {
  const { title, sectionTitles, sectionsOrder, componentsOrder, itemsOrder, items } = formTemplate
  const { formId, createMode, ccaNotes, societyNotes, isPending } = formData
  const [ sectionIndex, setSectionIndex ] = useState(0)
  const classes = useStyles()
  const viewerId = match.params.id // formId when in create mode, formDataId when in edit/review mode
  const mode = match.params.mode

  async function initializeFormViewer() {
    if (mode == "edit" || mode == "review"){ //if in edit mode, also fetch form data
      const fetchFormDataResult = await dispatch(fetchFormData(viewerId))
      const formId = unwrapResult(fetchFormDataResult).formId
      dispatch(fetchForm(formId))
    }
    else if (mode == "create") {
      dispatch(fetchForm(viewerId))
    }
  }
  
  useEffect(() => {
    initializeFormViewer()
  }, [])

  const sectionId = sectionsOrder[sectionIndex]

  return (
    <div>
      <FormViewerBar formId={formId} title={title} notesData={{ccaNotes, societyNotes}} isCCA={userType==="CCA"} createMode={createMode}/>
      <br/>
      {
      (!createMode && isPending) ? <CircularProgress style={{marginLeft: '50vw', marginTop: '30vh'}}/> :  
      <Container>
        {/* //Container to center align the View, also sections and items rendered only (components are only logical) */}
        <Paper elevation={4} className={classes.sectionPaper}>
          <h3 style={{color: 'white', marginLeft: 10}}>{sectionTitles[sectionId]}</h3>
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
        { sectionIndex != 0 &&
          <Button onClick={()=> setSectionIndex(sectionIndex-1)} variant="contained" style={{marginLeft: 10, marginBottom: 20}}>Previous</Button>
        }
        {
          (sectionIndex < sectionsOrder.length - 1) &&
          <Button variant="contained" color="primary" onClick={()=> setSectionIndex(sectionIndex+1)} style={{marginBottom: 20}}>Next Section</Button>
        }
      </Container>
      }
      <ErrorSnackbar stateError={formData.error} clearError={clearError}/>
      <ErrorSnackbar stateError={formTemplate.error} clearError={clearErrorFormTemplate}/>
    </div>
  )
}

const mapStateToProps = (state) => ({ //needs both the template and data to render the form
  formTemplate: state.formTemplate,
  formData: state.formData,
  userType: state.user.userType
})


export default connect(mapStateToProps) (FormViewer)