import React from 'react'
import {makeStyles, List, Divider, Grid, Paper, Typography } from '@material-ui/core'


export const useStyles = makeStyles((theme) => ({
  itemPaper: {
    backgroundColor: 'white',
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
      <h5>
        {label}
      </h5>
    </Paper>
  )
}

