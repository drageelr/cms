import React from 'react'
import FormMakerBar from './FormMakerBar'
import Properties from './Properties'
import Section from './Section'
import {makeStyles, List, Paper } from '@material-ui/core'
import {connect} from 'react-redux'
import FormMakerAddButton from './FormMakerAddButton'

export const useStyles = makeStyles((theme) => ({
  viewPaper: {
    padding: theme.spacing(2),
    position: 'fixed',
    marginLeft: 234,
    width: '90%',
    maxHeight: '74%',
    overflow: 'auto',
    backgroundColor: 'darkgray'
  },
}))

/**
  The FormMaker Container fetches and passes down the form template rendering the Properties, FormMakerBar and
  the entire Form View facilitating the creation of an entire form. This acts the wrapper component that fetches 
  the entire form state via API.

  @param {object} formTemplate from the formTemplate redux slice, passed on in all child components for rendering of the
  form maker and properties view based on the current form loaded
*/

function FormMaker({formTemplate}) {
  const { title, isPublic, sections, sectionsOrder, componentsOrder, components, itemsOrder, items } = formTemplate
  const classes = useStyles()

  return (
    <div>
      <Properties formTemplate = {formTemplate} />
      <FormMakerBar title={title} isPublic={isPublic}/>
      <Paper square variant="outlined"className={classes.viewPaper}>
        <List>
          {
            sectionsOrder.map(sectionId => {
              return <Section key={sectionId} id={sectionId} title={sections[sectionId]} data={{componentsOrder, components, itemsOrder, items}}/>
            })
          }
          <FormMakerAddButton type="section"/>
        </List>
      </Paper>
    </div>
  )
}

const mapStateToProps = (state) => ({
  formTemplate: state.formTemplate,
})

export default connect(mapStateToProps) (FormMaker)