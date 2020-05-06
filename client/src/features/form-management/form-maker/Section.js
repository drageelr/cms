import React from 'react'
import Component from './Component'
import {makeStyles, List, Divider, Paper } from '@material-ui/core'
import FormMakerAddButton from './FormMakerAddButton'
import EditDeleteBar from './EditDeleteBar'

const useStyles = makeStyles((theme) => ({
  sectionPaper: {
    padding: theme.spacing(1),
    paddingTop: 0.3,
    width: '87%',
    height: '100%',
    marginBottom: 20
  }
}))

/**
  Returns a Section - a list of Components with an option to Edit and Delete
  itself as well as functionality to add a Component inside.

  @param {number} id for the section
  @param {string} title for the section
  @param {object} data section data required to use and pass (componentsOrder, components, itemsOrder, items)
*/

export default function Section({id, title, data}) {
  const classes = useStyles()
  const { componentsOrder, components, itemsOrder, items } = data
  
  return (
    <Paper elevation={4} className={classes.sectionPaper}>
      <EditDeleteBar 
        renderTitle={()=><h3 style={{marginLeft: 10}}>{title}</h3>}
        type={'section'}
        id ={id}
        />
      <Divider/>
      <List>
      {
        (id in componentsOrder) ?
        componentsOrder[id].map(componentId => {
          return <Component key={componentId} id={componentId} parentId={id} title={components[componentId]} data={{itemsOrder, items}}/>
        })
        : null 
      }
      <FormMakerAddButton type="component" parentId={id}/>
      </List>
    </Paper>
  )
}