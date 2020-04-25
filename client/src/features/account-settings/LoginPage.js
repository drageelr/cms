import React from 'react'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Container } from '@material-ui/core'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton';
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
  
  return (
    <Container component="main" className={classes.root}>
      {/* <img style={{position:"absolute", marginLeft: 0, marginTop: 0, width: '80%', height: '40%'}}
          src=""/> */}
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
      onSubmit={(values) => {
        dispatch(login({email: values.email, password: values.password, role: role}))
      }}
      >
        {({submitForm})=>(
          <Form>
            <h1>Login</h1>

            <ToggleButtonGroup size="medium" value={role} exclusive onChange={()=>{}}>
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

            <Button size="large" onClick={submitForm} variant="contained" color="primary" spacing= '10'>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Container>  
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps) (LoginPage)