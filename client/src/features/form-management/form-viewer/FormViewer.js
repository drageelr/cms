import React, {useEffect} from 'react'
import FormViewerBar from './FormViewerBar'
import {makeStyles, List, Paper, Container, CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import ItemView from './ItemView'
import { fetchFormData, clearError } from '../formDataSlice'
import { fetchForm } from '../formTemplateSlice'
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
  const { title, sections, sectionsOrder, componentsOrder, itemsOrder, items } = formTemplate
  const { formId, createMode, ccaNote, ccaNoteTimestampModified, societyNotes, isPending } = formData
  const classes = useStyles()
  const formDataId = match.params.id

  function initializeFormViewer() {
    if (formDataId !== undefined){ //if in edit mode, also fetch form data
      dispatch(fetchFormData({formDataId, formId})).then(() =>
        dispatch(fetchForm(formId))
      )
    }
    else{
      dispatch(fetchForm(formId))
    }
  }
  
  useEffect(() => {
    initializeFormViewer()
  }, [])

  return (
    <div>
      <FormViewerBar formId={formId} title={title} notesData={{ccaNote, ccaNoteTimestampModified, societyNotes}} isCCA={userType==="CCA"} createMode={createMode}/>
      <br/>
      {
      (!createMode && isPending) ? <CircularProgress style={{marginLeft: '50vw', marginTop: '30vh'}}/> :  
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
      }
      <ErrorSnackbar stateError={formData.error} clearError={clearError}/>
    </div>
  )
}

const mapStateToProps = (state) => ({ //needs both the template and data to render the form
  formTemplate: state.formTemplate,
  formData: state.formData,
  userType: state.user.userType
})


export default connect(mapStateToProps) (FormViewer)