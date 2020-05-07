import React, { useState } from 'react'
import { Grid, Typography, Box, Button, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import NotesIcon from '@material-ui/icons/Notes'
import SaveIcon from '@material-ui/icons/Save'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
import NotesSideBar from './NotesSideBar'
import IssueDialog from './IssueDialog'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { createFormData, editFormData, resetState } from '../formDataSlice'
import { changeFormStatus } from '../../request-management/requestListSlice'

const useStyles = makeStyles((theme) => ({
  propertiesPaper: {
    padding: theme.spacing(2),
  },
  primaryIcon: {
    color: theme.palette.primary.main,
  }
}))

export default function FormViewerBar({ title, notesData, isCCA, createMode, submissionId, inReview, inReviewP, presOrPat}) {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const [issueDialogOpen, setIssueDialogOpen] = useState(false)
  const [approvedDialogOpen, setApprovedDialogOpen] = useState(false)
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
            {
            inReviewP ? (
              <Button
                color="primary"
                variant="contained"
                startIcon={<DoneOutlineIcon/>}
                onClick={() => {
                  dispatch(changeFormStatus({
                    submissionId, 
                    status: presOrPat == "pres" ? "Approved(President)" : "Approved(Patron)",
                    issue: ""
                  })).then((changeFormStatusResult) => {
                    setApprovedDialogOpen(true)
                  })
                }}
              >Approve</Button>
            )
            : (
              !createMode &&
              <Button
                variant="contained"
                startIcon={<NotesIcon/>}
                onClick={toggleDrawer}
              >Notes</Button>
            )
            }
            
            {
            !inReview && // hide save button in review mode
            <Button
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
              style={{marginLeft:10}}
              onClick={()=>dispatch(createMode ? createFormData() : editFormData())}
            >Save</Button>
            }

            {
              inReviewP ? (
                <Button
                  variant="contained"
                  startIcon={<ErrorOutlineIcon/>}
                  style={{marginLeft:10}}
                  onClick={()=> setIssueDialogOpen(true)}
                >Attach Issue</Button>
              )
              : (
                <Button
                variant="contained"
                style={{marginLeft:10, marginRight: 15}}
                onClick={()=> setExitDialogOpen(true)}
                >Exit</Button>
              )
            }
            
          </Grid>

        </Grid>
      </Paper>
      <NotesSideBar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} notesData={notesData} isCCA={isCCA}/>

      <Dialog aria-labelledby="exit-dialog" open={exitDialogOpen}>
        <DialogTitle id="exit-dialog-title">Exit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to exit? (All unsaved changes will be lost.)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{
              dispatch(resetState())
              history.goBack()
          }} color="primary">
            Yes
          </Button>
          <Button onClick={()=>setExitDialogOpen(false)}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog aria-labelledby="approved-dialog" open={approvedDialogOpen}>
        <DialogTitle id="approved-dialog-title">Submission Approved</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The submission under review has been approved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{
            setApprovedDialogOpen(false)
          }} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>


      <IssueDialog presOrPat={presOrPat} setIssueDialogOpen={setIssueDialogOpen} issueDialogOpen={issueDialogOpen} />
    </div>
  )
}