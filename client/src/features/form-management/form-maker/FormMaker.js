import React, {useState} from 'react'
import FormMakerBar from './FormMakerBar'
import Properties from './Properties'
import Section from './Section'
import {makeStyles, List, Divider, Grid, Paper, Typography, Button } from '@material-ui/core'
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