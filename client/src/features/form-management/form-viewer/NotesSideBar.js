import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Drawer, Button, Paper, List, Typography} from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { useDispatch } from 'react-redux'
import { updateCcaNote } from '../formDataSlice'

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    padding: theme.spacing(2),
    width: 'auto',
  },
  societyNotesPaper: {
    overflow:'auto',
    height: '47vh',
    backgroundColor: 'darkgray'
  }
}))

export default function NotesSideBar({drawerOpen, toggleDrawer, notesData}) {
  const {ccaNote, ccaNoteTimestampModified, societyNotes } = notesData
  const classes = useStyles()
  const dispatch = useDispatch()

  //CCA
  return (
    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer} classes={{paper: classes.drawerPaper}}>
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues={{ccaNote: ccaNote}}
        validate={values => {
          const errors = {}
          if (!values.ccaNote) {
            errors.ccaNote = 'Required'
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
            <p>Last modified: {ccaNoteTimestampModified}</p>
            <Button variant="contained" color="primary" onClick={submitForm} style={{marginTop: 5}}>Save</Button>
            <Button variant="contained" onClick={toggleDrawer} style={{marginLeft: 10, marginTop: 5}}>Cancel</Button>
            <br/>
            <br/>
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
    </Drawer>
  )
}
