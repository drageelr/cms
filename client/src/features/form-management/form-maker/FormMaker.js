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
  const { sections, sectionsOrder, checklist, componentsOrder, components, itemsOrder, items } = formTemplate
  const classes = useStyles()
  
  return (
    <div>
      <Properties checklist={checklist} sections={sections} sectionsOrder={sectionsOrder} />
      <FormMakerBar title={formTemplate.title} isPublic={formTemplate.isPublic}/>
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