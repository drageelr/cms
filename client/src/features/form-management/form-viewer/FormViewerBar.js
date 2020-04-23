import React, { useState } from 'react'
import { Grid, Typography, Box, Button } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import NotesIcon from '@material-ui/icons/Notes'
import SaveIcon from '@material-ui/icons/Save'
import NotesSideBar from './NotesSideBar'

const useStyles = makeStyles((theme) => ({
  propertiesPaper: {
    padding: theme.spacing(2),
  },
  primaryIcon: {
    color: theme.palette.primary.main,
  }
}))

export default function FormListBar({title, notesData, isCCA }) {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  function toggleDrawer() {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <div className={classes.root}>
      <Paper square variant="outlined" className={classes.propertiesPaper}>
        <Grid container direction="row" justify="space-between" alignItems="center">

          <Grid item>
            <Typography variant="h4">
                <Box fontWeight={600} m={1}>
                  {title}
                </Box>
              </Typography>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              startIcon={<NotesIcon/>}
              onClick={toggleDrawer}
            >Notes</Button>
        
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              style={{marginLeft:10}}
            >Save</Button>
        
            <Button
              variant="contained"
              style={{marginLeft:10, marginRight: 15}}
            >Cancel</Button>
          </Grid>

        </Grid>
      </Paper>
      <NotesSideBar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} notesData={notesData} isCCA={isCCA}/>
    </div>
  )
}