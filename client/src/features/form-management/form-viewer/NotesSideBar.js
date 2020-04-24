import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Drawer, Button, Paper, List, Typography} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { useDispatch } from 'react-redux'
import { updateCcaNote, addSocietyNote } from '../formDataSlice'

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    padding: theme.spacing(2),
    width: '22vw',
  },
  societyNotesPaper: {
    overflow:'auto',
    height: '40vh',
    backgroundColor: 'darkgray'
  }
}))

export default function NotesSideBar({drawerOpen, toggleDrawer, notesData, isCCA}) {
  const {ccaNote, ccaNoteTimestampModified, societyNotes } = notesData
  const classes = useStyles()
  const dispatch = useDispatch()

  function CCANotesSideBar() {
    return (
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues={{ccaNote: ccaNote}}
        validate={values => {
          const errors = {}
          if (values.ccaNote.length > 300) {
            errors.ccaNote = 'Please do not exceed 300 characters.'
          }
          return errors
        }}
        onSubmit={(values) => {
          dispatch(updateCcaNote({ccaNote: values.ccaNote}))
        }}
      >
        {({ submitForm}) => (
          <Form>
            <Field component={TextField} multiline rows={8} required variant="outlined" fullWidth name="ccaNote" label="CCA Note"/>
            <Button variant="contained" color="primary" onClick={submitForm} style={{marginTop: 8}}>Save</Button>
            <Button variant="contained" onClick={toggleDrawer} style={{marginLeft: 10, marginTop: 8}}>Cancel</Button>
            <p>Last modified: {ccaNoteTimestampModified}</p>
            <h5>Society Notes</h5>
            <Paper className={classes.societyNotesPaper}>
              <List>
                {
                  societyNotes.map((societyNote, index) => {
                    return (
                    <Paper key={index} style={{borderRadius: 3, margin: 10, width: '20vw', backgroundColor: 'white'}} >
                      <Typography style={{margin: 5}}>
                        {societyNote}
                      </Typography>
                      <br/>
                    </Paper>
                    )
                  })
                }
              </List>
            </Paper>
          </Form>
        )}
      </Formik>
    )
  }

  function SocietyNotesSideBar() {
    return (
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues={{newSocietyNote: ''}}
        onSubmit={(values) => {
          dispatch(addSocietyNote({newSocietyNote: values.newSocietyNote}))
        }}
      >
        {({ submitForm}) => (
          <Form>
            <h5>Notes from CCA</h5>
            <p>{ccaNote}</p>
            <h5>Society Notes</h5>
            <Paper className={classes.societyNotesPaper}>
              <List>
                {
                  societyNotes.map((societyNote, index) => {
                    return (
                    <Paper key={index} style={{borderRadius: 3, margin: 10, width: '20vw', backgroundColor: 'white'}} >
                      <Typography style={{margin: 5}}>
                        {societyNote}
                      </Typography>
                      <br/>
                    </Paper>
                    )
                  })
                }
              </List>
            </Paper>
            <Field component={TextField} multiline rows={2} required variant="filled" fullWidth name="newSocietyNote" label="Add Society Note"/>
            <Button variant="contained" color="primary" onClick={submitForm} style={{marginTop: 5}}>Add Note</Button>
            <Button variant="contained" onClick={toggleDrawer} style={{marginLeft: 10, marginTop: 5}}>Cancel</Button>
          </Form>
        )}
      </Formik>
    )
  }

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer} classes={{paper: classes.drawerPaper}}>
      {isCCA ? <CCANotesSideBar/> : <SocietyNotesSideBar/>}
    </Drawer>
  )
}
