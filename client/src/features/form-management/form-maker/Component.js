import React from 'react'
import Item from "./Item"
import {makeStyles, List, Divider, Grid, Paper, Typography } from '@material-ui/core'
import FormMakerAddButton from './FormMakerAddButton'
import EditDeleteBar from './EditDeleteBar'
import { blue } from '@material-ui/core/colors'

export const useStyles = makeStyles((theme) => ({
  componentsPaper: {
    backgroundColor: 'lightgray',
    padding: theme.spacing(1),
    paddingTop: 0.3,
    paddingLeft: 10,
    width: '98%',
    height: '98%',
    marginBottom: 10,
  }
}))


export default function Component({id, title, data, parentId}) {
  const classes = useStyles()
  const {itemsOrder, items} = data
  return (
    <Paper square elevation={0} className={classes.componentsPaper}>
      <EditDeleteBar 
      renderTitle={()=>
        <h6 style={{marginBottom: 0, marginTop: 6, color: 'darkgray'}}>
          {title}
        </h6>
      }
      type={'component'}
      id ={id}
      parentId={parentId}
      />
      
      <List>
      {
        (id in itemsOrder) ?
        itemsOrder[id].map(itemId => {
          return <Item key={itemId} parentId={id} id={itemId} data={items[itemId]} />
        }) 
        : null
      }
      <FormMakerAddButton type="item" parentId={id}/>
      </List>
    </Paper>
  )
}
