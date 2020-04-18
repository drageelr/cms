import React from 'react'
import { makeStyles, List, Divider, Grid, Paper, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    position: 'fixed',
    width: 200,
    height: '100%',
    backgroundColor: 'whitesmoke'
  },
}))

export default function Properties({isItem}) {
  const classes = useStyles()
  const typeName = isItem ? "Item" : "Component"
  return (
    <div className={classes.root}>
    <Paper square variant="outlined"className={classes.paper}>
      <Grid container  direction="column" justify="flex-start" alignItems="center">
        <Grid item xs>
          <Typography variant="h6">
            {typeName} Properties
          </Typography>
          <Divider variant="middle"/>
        </Grid>
        <List>
          Test
        </List>
      </Grid>
    </Paper>
    </div>
  )
}
