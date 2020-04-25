import React from 'react'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Container, LinearProgress, Snackbar, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { TextField } from 'formik-material-ui'
import { login } from './userSlice'
import { connect } from 'react-redux'

// card styling
const useStyles = makeStyles({
  root: {
    maxWidth: '30vw',
    marginLeft: '5vw',
    marginTop: '20vh'
  },
})

function LoginPage({user, dispatch}) {
  const classes = useStyles()
  const [role, setRole] = React.useState("CCA")
  const [snackOpen, setSnackOpen] = React.useState(true)

  return (
    <Container component="main" className={classes.root}>
      <Formik
      validateOnChange={false} validateOnBlur={true}
      initialValues = {{
          email: '',
          password: '',
      }}
      validationSchema={Yup.object({
          email: Yup.string()
              .email('Invalid Email Address')
              .required('Required'),
          password: Yup.string()
      })}
      onSubmit={ (values, { setSubmitting }) => {
          dispatch(login({email: values.email, password: values.password, role: role}))
          .then(() => {
            setSubmitting(false)
          })  
        }
      }
      >
        {({submitForm, isSubmitting})=>(
          <Form>
            <h1>Login</h1>

            <ToggleButtonGroup size="medium" value={role} exclusive>
              <ToggleButton value="CCA" onClick={()=>setRole("CCA")}>
                CCA
              </ToggleButton>,
              <ToggleButton value="Society" onClick={()=>setRole("Society")}>
                Society
              </ToggleButton>
            </ToggleButtonGroup>

            <Field
              component={TextField}
              variant="outlined"
              margin="normal"
              required
              label="Email"
              name="email"
              fullWidth = "false"
              autoFocus
            ></Field>
            <br/>            
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
            > 
            </Field>
            
            <br/>    
            <br/>
            {isSubmitting && <LinearProgress />}
            <Button size="large" onClick={submitForm} variant="contained" color="primary" spacing= '10'>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
        open={(user.error != null) && snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(true)}
        message={user.error}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={()=>setSnackOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>  
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps) (LoginPage)