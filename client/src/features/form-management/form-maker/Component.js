import React from 'react'
import Item from "./Item"
import {makeStyles, List, Divider, Grid, Paper, Typography } from '@material-ui/core'
import FormMakerAddButton from './FormMakerAddButton'

export const useStyles = makeStyles((theme) => ({
  componentsPaper: {
    backgroundColor: 'lightgray',
    padding: theme.spacing(1),
    paddingTop: 0.3,
    paddingLeft: 10,
    width: '97%',
    height: '98%',
    marginBottom: 10,
  }
}))


export default function Component({id, title, data}) {
  const classes = useStyles()
  const {itemsOrder, items} = data
  return (
    <Paper square variant='outlined' className={classes.componentsPaper}>
    <h6 style={{marginBottom: 0, marginTop: 6}}>
      {title}
    </h6>
    <List>
    {
      itemsOrder[id].map(itemId => {
        return <Item key={itemId} id={itemId} data={items[itemId]}/>
      }) 
    }
    <FormMakerAddButton type="item"/>
    </List>
    </Paper>
  )
}
