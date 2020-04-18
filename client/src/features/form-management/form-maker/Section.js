import React from 'react'
import Component from './Component'
import {makeStyles, List, Divider, Grid, Paper, Typography } from '@material-ui/core'
import FormMakerAddButton from './FormMakerAddButton'

export const useStyles = makeStyles((theme) => ({
  sectionPaper: {
    backgroundColor: 'white',
    padding: theme.spacing(1),
    paddingTop: 0.3,
    width: '87%',
    height: '100%',
    marginBottom: 20
  }
}))


export default function Section({id, title, data}) {
  const classes = useStyles()
  const { componentsOrder, components, componentsData } = data
  return (
    <Paper className={classes.sectionPaper}>
      <h4>
        {title}
      </h4>
      <Divider/>
      <List>
      {
        componentsOrder[id].map(componentId => {
          return <Component key={componentId} id={componentId} title={components[componentId]} data={componentsData}/>
        }) 
      }
      <FormMakerAddButton type="component"/>
      </List>
    </Paper>
  )
}
