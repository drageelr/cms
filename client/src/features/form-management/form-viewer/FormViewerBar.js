import React, { useState } from 'react'
import { Grid, Typography, Box, Button, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import NotesIcon from '@material-ui/icons/Notes'
import SaveIcon from '@material-ui/icons/Save'
import NotesSideBar from './NotesSideBar'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { createFormData, editFormData, resetState } from '../formDataSlice'

const useStyles = makeStyles((theme) => ({
  propertiesPaper: {
    padding: theme.spacing(2),
  },
  primaryIcon: {
    color: theme.palette.primary.main,
  }
}))

export default function FormListBar({submissionId, title, notesData, isCCA, createMode , inReview}) {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  function toggleDrawer() {
    setDrawerOpen(!drawerOpen)
  }

  return (
    <div className={classes.root}>
      <Paper square variant="outlined" className={classes.propertiesPaper}>
        <Grid container direction="row" justify="space-between" alignItems="center">

          <Grid item>
            <Typography variant="h5">
                <Box fontWeight={600}>
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
        
            {
            !inReview && // hide save button in review mode
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              style={{marginLeft:10}}
              onClick={()=>dispatch(createMode ? createFormData() : editFormData())}
            >Save</Button>
            }

            <Button
            variant="contained"
            style={{marginLeft:10, marginRight: 15}}
            onClick={()=> setExitDialogOpen(true)}
            >Exit</Button>
          </Grid>

        </Grid>
      </Paper>
      <NotesSideBar submissionId={submissionId} drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} notesData={notesData} isCCA={isCCA}/>

      <Dialog aria-labelledby="conditional-item-dialog" open={exitDialogOpen}>
        <DialogTitle id="exit-dialog-title">Exit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to exit? (All unsaved changes will be lost.)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{
              dispatch(resetState())
              history.push('/request-list')
          }} color="primary">
            Yes
          </Button>
          <Button onClick={()=>setExitDialogOpen(false)}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}