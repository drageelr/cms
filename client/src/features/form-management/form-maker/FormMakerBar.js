import React from 'react'
import { Grid, Typography, Box, Button } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import ListIcon from '@material-ui/icons/List'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  propertiesPaper: {
    padding: theme.spacing(2),
  },
}))

export default function FormMakerBar({title}) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Paper square variant="outlined" className={classes.propertiesPaper}>
        <Grid container>
              <Grid item xs>
                <Typography variant="h5">
                  <Box marginLeft={30} fontWeight={600} m={1}>
                    {title}
                  </Box>
                </Typography>
              </Grid>
              <Grid item style={{marginTop: 5}}>
                <Button
                variant="contained"
                startIcon={<ListIcon/>}
                >Checklist</Button>
                <Button
                variant="contained"
                startIcon={<SaveIcon />}
                style={{marginLeft:7}}
                >Save</Button>
                <Button
                variant="contained"
                style={{marginLeft:7}}
                >Cancel</Button>
              </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
