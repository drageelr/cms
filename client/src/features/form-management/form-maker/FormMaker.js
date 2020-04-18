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

function FormMaker({formTemplate, formMaker}) {
  const { sections, sectionsOrder, sectionsData, checklist } = formTemplate
  const { propertyType } = formMaker
  const classes = useStyles()
  
  return (
    <div>
      <Properties propertyType={propertyType}/>
      <FormMakerBar title={formTemplate.title} />
      <Paper square variant="outlined"className={classes.viewPaper}>
        <List>
          {
            sectionsOrder.map(sectionId => {
              return <Section key={sectionId} id={sectionId} title={sections[sectionId]} data={sectionsData}/>
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
  formMaker: state.formMaker,
})

export default connect(mapStateToProps) (FormMaker)