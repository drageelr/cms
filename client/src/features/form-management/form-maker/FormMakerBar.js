import React from 'react'
import { Grid, Typography, Button, Box } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
}))

export default function FormMakerBar({title}) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Paper square variant="outlined"className={classes.paper}>
        <Grid container>
              <Grid item xs>
                <Typography variant="h5">
                  <Box marginLeft={30} fontWeight={600} m={1}>
                    {title}
                  </Box>
                </Typography>
              </Grid>
              <Grid item>
                  Remove
              </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
