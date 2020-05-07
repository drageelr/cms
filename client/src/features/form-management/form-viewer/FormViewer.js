import React, {useEffect, useState} from 'react'
import FormViewerBar from './FormViewerBar'
import {makeStyles, List, Paper, Container, CircularProgress, Button, Typography, LinearProgress } from '@material-ui/core'
import { connect } from 'react-redux'
import ItemView from './ItemView'
import { fetchFormData, clearError, fetchFromToken } from '../formDataSlice'
import { setUserDetails } from '../../account-settings/userSlice'
import { fetchForm, clearError as clearErrorFormTemplate } from '../formTemplateSlice'
import { initializeVisibilities } from '../conditionalViewSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import ErrorSnackbar from '../../../ui/ErrorSnackbar'

const useStyles = makeStyles((theme) => ({
  sectionPaper: {
    padding: theme.spacing(2),
    height: '100%',
    marginBottom: 20,
    background: 'linear-gradient(to right bottom, #3274f3, #82b4ff)'
    // backgroundColor: theme.palette.primary.main,
  }
}))

function FormViewer({formTemplate, formData, dispatch, userType, conditionalView, match, location}) {
  const { title, sectionTitles, sectionsOrder, componentsOrder, itemsOrder, items } = formTemplate
  const { createMode, ccaNotes, societyNotes, id, itemFilledIds } = formData
  const [ sectionIndex, setSectionIndex ] = useState(0)
  const classes = useStyles()
  const viewerId = match && match.params.id // formId when in create mode, formDataId when in edit/review mode
  const presOrPat = match.params.type // patron or president
  const token = location.search.split('=')[1] // token for patron / pres
  const mode = (match && match.params.mode) || (presOrPat && "p_review") //president/patron review
  const inReview = mode == "review" || mode == "p_review"
  
  async function initializeFormViewer() {
    if (mode == "edit" || mode == "review" ){ //if in edit mode, also fetch form data
      const fetchFormDataResult = await dispatch(fetchFormData(viewerId))
      const formId = unwrapResult(fetchFormDataResult).formId
      const fetchFormResult = await dispatch(fetchForm(formId))
      const fetchedItems = unwrapResult(fetchFormResult).items
      dispatch(initializeVisibilities({items: fetchedItems}))
    }
    else if (mode == "create") {
      const fetchFormResult = await dispatch(fetchForm(viewerId))
      const fetchedItems = unwrapResult(fetchFormResult).items
      dispatch(initializeVisibilities({items: fetchedItems}))
    }

    if (presOrPat) { //patron, president issue/approval mode

      dispatch(setUserDetails({userType: "PresPatron", isLoggedIn: true ,token}))
      
      const fetchFromTokenResult = await dispatch(fetchFromToken(token))
      const { formId, submissionId } = unwrapResult(fetchFromTokenResult)
      const fetchFormResult = await dispatch(fetchForm(formId))
      const fetchedItems = unwrapResult(fetchFormResult).items
      await dispatch(fetchFormData(submissionId))
      dispatch(initializeVisibilities({items: fetchedItems}))
    }
  }
  
  useEffect(() => {
    initializeFormViewer()
  }, [])

  const sectionId = sectionsOrder[sectionIndex]

  return (
    <div>
      <FormViewerBar title={title} notesData={{ccaNotes, societyNotes}} submissionId={id}
        inReview={inReview} inReviewP={mode == "p_review"} presOrPat={presOrPat} isCCA={userType=="CCA"} createMode={createMode}/>
      <br/>
      {
      (mode == "create" ?  (formTemplate.isPending) : (formTemplate.isPending || formData.isPending)) 
      ? <LinearProgress style={{marginTop: -5}}  variant="indeterminate"/>
      : <Container>
        {/* //Container to center align the View, also sections and items rendered only (components are only logical) */}
        <Paper elevation={4} className={classes.sectionPaper}>
          <h3 style={{color: 'white', marginLeft: 10}}>{sectionTitles[sectionId]}</h3>
          <List>
            { 
              (sectionId in componentsOrder) && // does the section has components?
                componentsOrder[sectionId].map( componentId => {
                  if (componentId in itemsOrder) { // does the component have items?
                    const componentItemIds = itemsOrder[componentId]
                    return componentItemIds.map( itemId => 
                      // depending on conditionalView
                      (conditionalView[itemId] ? true : items[itemId].defaultVisibility) && //defaultVisibility can be overridden 
                      <ItemView 
                      key={itemId} 
                      componentItemIds={componentItemIds} 
                      id={itemId} 
                      inReview={inReview} 
                      templateData={items[itemId]}
                      />
                    )
                  }
                }
              ) //null for empty sections and columns
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
  userType: state.user.userType,
  conditionalView: state.conditionalView
})


export default connect(mapStateToProps) (FormViewer)