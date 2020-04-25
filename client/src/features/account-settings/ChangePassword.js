import React from 'react'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import {Container, Typography} from '@material-ui/core'
import { TextField } from 'formik-material-ui'

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
  return (
    <Container component="main" maxWidth="xs"> 
    <h1>Change Password</h1>
    <Formik
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
      onSubmit = {() => {}}
    >
      {({values, errors, handleSubmit, handleChange, handleBlur})=>{
        return(
          <Form>
            <Field
              component={TextField}
              variant="outlined"
              margin="normal"
              required
              label="Password"
              name="password"
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
              autoComplete="name"
              fullWidth = "false"
              autoFocus
              type="password"
              name="newPassword"
              onBlur={handleBlur}
              onChange={handleChange}
              value = {values.newPassword}
            ></Field>

            <br/>
            <br/>

            <Field
              component={TextField}
              variant="outlined"
              margin="normal"
              required
              label="Confirm Password"
              autoComplete="name"
              fullWidth = "false"
              autoFocus
              type="password"
              name="confirmPassword"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.confirmPassword}
            ></Field>
            <br/>
            <span class="error" style={{ color: "red" }}>
              {errors.confirmPassword}
            </span>
            <br/>
            <br/>
            <Button type="submit" variant="contained" color="primary" spacing= '10'>Change Password</Button>
            <Button type="submit" variant="contained" color="primary" spacing= '10' style = {{marginLeft: 30}}>Cancel</Button>
          
          </Form>
        )
      }}
    </Formik>
    </Container>
  )
}