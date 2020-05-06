import React, { useEffect } from 'react'
import FormMakerBar from './FormMakerBar'
import Properties from './Properties'
import Section from './Section'
import { makeStyles, List, Paper, CircularProgress } from '@material-ui/core'
import {connect} from 'react-redux'
import FormMakerAddButton from './FormMakerAddButton'
import { fetchForm, clearError, setCreateMode, setTitle, resetState } from '../formTemplateSlice'
import ErrorSnackbar from '../../../ui/ErrorSnackbar'

export const useStyles = makeStyles((theme) => ({
  viewPaper: {
    padding: theme.spacing(2),
    position: 'fixed',
    marginLeft: 234,
    width: '90%',
    maxHeight: '74%',
    overflow: 'auto',
    backgroundColor: theme.palette.action.hover
  },
}))

/**
  The FormMaker Container fetches and passes down the form template rendering the Properties, FormMakerBar and
  the entire Form View facilitating the creation of an entire form. This acts the wrapper component that fetches 
  the entire form state via API.

  @param {object} formTemplate from the formTemplate redux slice, passed on in all child components for rendering of the
  form maker and properties view based on the current form loaded

*/

function FormMaker({ formTemplate, dispatch, match }) {
  const { createMode, title, isPublic, sectionTitles, sectionsOrder, componentsOrder, componentTitles, itemsOrder, items, isPending, error } = formTemplate
  const classes = useStyles()
  const formId = match.params.id
  
  useEffect(() => {
    if (formId !== undefined){
      dispatch(fetchForm(formId))
      setCreateMode({createMode: false})
    }
    else{
      dispatch(resetState())
      dispatch(setTitle("New Form"))
    }
  }, [])

  return (
    <div>
      <Properties formTemplate={formTemplate} />
      <FormMakerBar title={title} isPublic={isPublic} createMode={createMode}/>
      {
      (!createMode && isPending) ? <CircularProgress style={{marginLeft: '55vw', marginTop: '30vh'}}/> :  
      <Paper square variant="outlined"className={classes.viewPaper}>
        <List>
          {
            sectionsOrder.map(sectionId => {
              return <Section key={sectionId} id={sectionId} title={sectionTitles[sectionId]} data={{componentsOrder, componentTitles, itemsOrder, items}}/>
            })
          }
          <FormMakerAddButton type="section"/>
        </List>
      </Paper>
      }
      <ErrorSnackbar stateError={formTemplate.error} clearError={clearError}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  formTemplate: state.formTemplate,
})

export default connect(mapStateToProps) (FormMaker)