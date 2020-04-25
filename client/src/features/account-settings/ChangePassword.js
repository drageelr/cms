import React from 'react'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import {Container, Typography, LinearProgress} from '@material-ui/core'
import { TextField } from 'formik-material-ui'
import { changePassword } from './userSlice'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    backgroundColor: '#D3D3D3'
  },
  avatar: {
    margin: '10',
    backgroundColor: 'red',
  },
});


export default function ChangePassword() {
  const classes = useStyles()
  const dispatch = useDispatch()

  return (
    <Container component="main" maxWidth="xs"> 
    <h1>Change Password</h1>
    <Formik
      validateOnChange={false} validateOnBlur={true}
      initialValues = {{
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }}
      validationSchema = {Yup.object({
        currentPassword: Yup.string()
          .required('Required'),
        newPassword: Yup.string()
          .required('Required')
          .min(8,'Must be at least 8 characters')
          .max(25,'Must be atmost 25 characters'),
        confirmPassword: Yup.string()
          .when("newPassword",{
            is: val => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf(
              [Yup.ref("newPassword")],"Both passwords need to be the same."
            )
          })
      })}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword}))
        .then(() => {
          setSubmitting(false)
        })  
      }}
    >
      {({onSubmit, isSubmitting})=>{
        return(
          <Form>
            <Field
              component={TextField}
              variant="outlined"
              margin="normal"
              required
              label="Password"
              name="currentPassword"
              type="password"
              fullWidth = "false"
              autoFocus
            ></Field>
            <br/>
            <br/>

            <Field
              component={TextField}
              variant="outlined"
              margin="normal"
              required
              label="New Password"
              name="newPassword"
              fullWidth = "false"
              autoFocus
              type="password"
            ></Field>

            <br/>
            <br/>

            <Field
              component={TextField}
              variant="outlined"
              margin="normal"
              required
              label="Confirm Password"
              name="confirmPassword"
              fullWidth = "false"
              autoFocus
              type="password"
            ></Field>
            <br/>
            <br/>
            {isSubmitting && <LinearProgress />}
            <Button type="submit" variant="contained" color="primary" spacing= '10' onClick={onSubmit} >Change Password</Button>
            <Button type="submit" variant="contained" color="primary" spacing= '10' style = {{marginLeft: 30}}>Cancel</Button>
          
          </Form>
        )
      }}
    </Formik>
    </Container>
  )
}