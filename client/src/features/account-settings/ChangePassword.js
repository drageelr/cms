import React from 'react'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import {Container, LinearProgress} from '@material-ui/core'
import { TextField } from 'formik-material-ui'
import { changePassword, clearError } from './userSlice'
import { connect } from 'react-redux'
import ErrorSnackbar from '../../ui/ErrorSnackbar'
import { useHistory } from 'react-router-dom'

function ChangePassword({error, dispatch}) {
  const history = useHistory()

  return (
    <Container component="main" maxWidth="xs"> 
      <h1 style={{marginLeft: 40}}>Change Password</h1>
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues = {{
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }}
        validationSchema = {Yup.object({
          currentPassword: Yup.string()
            .required('Required')
            .min(8,'Must be at least 8 characters')
            .max(30,'Must be atmost 30 characters'),
          newPassword: Yup.string()
            .required('Required')
            .min(8,'Must be at least 8 characters')
            .max(30,'Must be atmost 30 characters')
            .matches('^[a-zA-Z0-9]+$', 'All passwords must be alphanumeric (no special symbols).'),
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
              <p>Minimum 8 characters, maximum 30 characters and must be alphanumeric.</p>

              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                required
                label="Password"
                name="currentPassword"
                type="password"
                fullWidth
                autoFocus
              ></Field>
              <br/>
              <br/>

              <Field
                component={TextField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="New Password"
                name="newPassword"
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
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                autoFocus
                type="password"
              ></Field>
              <br/>
              <br/>
              {isSubmitting && <LinearProgress />}
              <Button type="submit" variant="contained" color="primary" spacing= '10' onClick={onSubmit} >Change my Password</Button>
              <Button type="submit" variant="contained" color="primary" spacing= '10' style = {{marginLeft: 30}}>Cancel</Button>
            
            </Form>
          )
        }}
      </Formik>
      <ErrorSnackbar stateError={error} clearError={clearError} />
    </Container>
  )
}

const mapStateToProps = (state) => ({
  error: state.user.error,
})

export default connect(mapStateToProps) (ChangePassword)