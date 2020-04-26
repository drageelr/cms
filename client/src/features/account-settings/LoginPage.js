import React from 'react'
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Container, LinearProgress, Grid } from '@material-ui/core'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { TextField } from 'formik-material-ui'
import { connect } from 'react-redux'
import { login, clearError } from './userSlice'
import ErrorSnackbar from '../../ui/ErrorSnackbar'
import landingBG from './landingBG.svg'

// card styling
const useStyles = makeStyles({
  root: {
    position: 'absolute',
    maxWidth: '32vw',
    marginLeft: 0,
    marginTop: 0,
    height: '100%',
    backgroundColor: "#3578fa",
    color: "secondary"
  },
  input: {
    backgroundColor: 'white',
    color: '#3578fa'
  }
})

function LoginPage({error, dispatch}) {
  const classes = useStyles()

  const [userType, setUserType] = React.useState("CCA")

  // React.useEffect(() => {
  //   dispatch(login({email: "admin@lums.edu.pk", password: "zoraiz123", userType: "CCA"}))
  // }, [])
  const selectedBGStyle = {backgroundColor: "#2555b5", color:"white"}
  const normalBGStyle = {backgroundColor: "cornflowerblue", color:"white"}
  const [role, setRole] = React.useState("CCA")
  return (
    <Container component="main" className={classes.root}>
      <img style={{position: 'absolute', left: '30vw', width: '70vw', height: '100vh'}}
      src={landingBG} alt="CMS"/>
      <div style={{marginTop: '30vh', marginLeft: '3vw'}}>
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
              .required('Required')
        })}
        onSubmit={ (values, { setSubmitting }) => {
            dispatch(login({email: values.email, password: values.password, userType: userType}))
            .then(() => {
              setSubmitting(false)
            })  
          }
        }
        >
          {({submitForm, isSubmitting})=>(
            <Form>
              <h1 style={{color: "white"}}>Login</h1>

              <ToggleButtonGroup size="medium" value={userType} exclusive>
                <ToggleButton
                value="CCA" 
                onClick={()=>setUserType("CCA")} 
                style={userType==="CCA" ? selectedBGStyle : normalBGStyle}>
                  CCA
                </ToggleButton>,
                <ToggleButton 
                value="Society" 
                onClick={()=>setUserType("Society")}
                style={userType==="Society" ? selectedBGStyle : normalBGStyle}>
                  Society
                </ToggleButton>
              </ToggleButtonGroup>
              <br/>            

              <Field
                component={TextField}
                variant="filled"
                margin="normal"
                required
                label="Email"
                name="email"
                autoFocus
                InputProps={{
                  className: classes.input,
                }}
              ></Field>
              <br/>            
              <Field
                component={TextField}
                variant="filled"
                margin="normal"
                required
                label="Password"
                name="password"
                type="password"
                autoFocus
                InputProps={{
                  className: classes.input,
                }}
              > 
              </Field>
              
              <br/>    
              <br/>
              {/* {isSubmitting && <LinearProgress />} */}
              <Button size="large" onClick={submitForm} 
              variant="contained" color="secondary" spacing= '10'
              endIcon={<NavigateNextIcon/>}>
                Login
              </Button>
            </Form>
          )}
        </Formik>
        
        </div>
          
      <ErrorSnackbar stateError={error} clearError={clearError}/>
    </Container>
  )
}

const mapStateToProps = (state) => ({
  error: state.user.error,
})

export default connect(mapStateToProps) (LoginPage)