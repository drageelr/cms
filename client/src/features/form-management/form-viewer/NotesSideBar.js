import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Drawer, Button, Paper, List, Typography} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { useDispatch } from 'react-redux'
import { addCcaNote, addSocietyNote } from '../formDataSlice'

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    padding: theme.spacing(2),
    width: '22vw',
  },
  notesPaper: {
    overflow:'auto',
    height: '30vh',
    backgroundColor: theme.palette.primary.main
  }
}))

export default function NotesSideBar({formId, drawerOpen, toggleDrawer, notesData, isCCA}) {
  const {ccaNotes, societyNotes } = notesData
  const classes = useStyles()
  const dispatch = useDispatch()

  function NotesList({notes}) {
    return <Paper className={classes.notesPaper}>
      <List>
        {
          notes.map((note, index) => {
            return (
            <Paper key={index} style={{borderRadius: 3, margin: 10, width: '20vw', backgroundColor: 'white'}} >
              <Typography style={{margin: 5}}>
                {note}
              </Typography>
              <br/>
            </Paper>
            )
          })
        }
      </List>
    </Paper>
  }

  function CCANotesSideBar() {
    return (
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues={{newCCANote: ''}}
        validate={values => {
          const errors = {}
          if (values.newCCANote.length > 100) {
            errors.newCCANote = 'Please do not exceed 100 characters.'
          }
          return errors
        }}
        onSubmit={(values) => {
          dispatch(addCcaNote({formId: formId, ccaNote: values.newCCANote}))
        }}
      >
        {({ submitForm}) => (
          <Form>
            <NotesList notes={ccaNotes}/>
            <Field component={TextField} multiline rows={2} required variant="filled" fullWidth name="newCCANote" label="Add CCA Note"/>
            <Button variant="contained" color="primary" onClick={submitForm} type="submit" style={{marginTop: 8}}>Add CCA Note</Button>
            <Button variant="contained" onClick={toggleDrawer} style={{marginLeft: 10, marginTop: 8}}>Cancel</Button>
            <h5>Society Notes</h5>
            <NotesList notes={societyNotes}/>
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
        validate={values => {
          const errors = {}
          if (values.newSocietyNote.length > 100) {
            errors.newSocietyNote = 'Please do not exceed 100 characters.'
          }
          return errors
        }}
        onSubmit={(values) => {
          dispatch(addSocietyNote({formId: formId, newSocietyNote: values.newSocietyNote}))
        }}
      >
        {({ submitForm}) => (
          <Form>
            <h5 style={{marginTop: 5}}>Notes from CCA</h5>
            <Paper className={classes.notesPaper}>
              <List>
                {
                  ccaNotes.map((ccaNote, index) => {
                    return (
                    <Paper key={index} style={{borderRadius: 3, margin: 10, width: '20vw', backgroundColor: 'white'}} >
                      <Typography style={{margin: 5}}>
                        {ccaNote}
                      </Typography>
                      <br/>
                    </Paper>
                    )
                  })
                }
              </List>
            </Paper>

            <h5>Society Notes</h5>
            <Paper className={classes.notesPaper}>
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
