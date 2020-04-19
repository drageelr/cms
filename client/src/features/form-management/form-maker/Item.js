import React from 'react'
import {makeStyles, List, Divider, Grid, Paper, Typography } from '@material-ui/core'
import EditDeleteBar from './EditDeleteBar'

export const useStyles = makeStyles((theme) => ({
  itemPaper: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(1),
    paddingTop: 0.3,
    width: '97%',
    height: '100%',
    marginBottom: 10
  }
}))

export default function Item({id, data}) {
  const classes = useStyles()
  const {type, label, required, default_visibility} = data

  return (
    <Paper className={classes.itemPaper}>
      <EditDeleteBar 
      renderTitle={()=><h5>{label}</h5>}
      type={'section'}
      id ={id}/>
    </Paper>
  )
}

