import React from 'react'
import Item from "./Item"
import {makeStyles, List, Paper, Typography } from '@material-ui/core'
import FormMakerAddButton from './FormMakerAddButton'
import EditDeleteBar from './EditDeleteBar'

const useStyles = makeStyles((theme) => ({
  componentsPaper: {
    backgroundColor: theme.palette.action.disabled,
    padding: theme.spacing(1),
    paddingTop: 0.3,
    paddingLeft: 10,
    width: '98%',
    height: '98%',
    backgroundColor: 'lightgray',
    marginBottom: 10,
    border: 1,
  }
}))

/**
  Returns a Component - a logical composition of Items, only visible on the Form Maker, with an option to Edit and Delete
  itself as well as functionality to add an Item inside.

  @param {number} id component id
  @param {string} title component title
  @param {object} data  component data required (itemsOrder and items)
  @param {number} parentId parent section id
*/

export default function Component({id, title, data, parentId}) {
  const classes = useStyles()
  const {itemsOrder, items} = data
  return (
    <Paper elevation={0} className={classes.componentsPaper}>
      <EditDeleteBar 
      renderTitle={()=>
        <Typography color="text.secondary"style={{marginBottom: 0, marginTop: 6, fontSize: 10}}>
          {title}
        </Typography>
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
