import React from 'react'
import {Formik, useField, Form} from 'formik'
import * as Yup from 'yup'

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import {Link} from 'react-router-dom'
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


// card styling
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

const CustomTextInput = ({label, ...props}) =>{
  const [field, meta] = useField(props)

  return (
    <>
      <label htmlFor = {props.id || props.name}>{label}</label>
      <input className = "text-input" {...field}{...props}/>
      {meta.touched && meta.error ? (
        <div>{meta.error}</div>
      ): null}
    </>
  )
}

//NEED TO CHECK THIS AGAIN
// const CustomCheckbox = ({children, ...props}) =>{
//   const [field, meta] = useField(props,'checkbox')
//   return (
//     <>
//       <label>
//       <input className = "text-input" {...field}{...props}/>
//         {children}
//       </label>
//       {meta.touched && meta.error ? (
//         <div>{meta.error}</div>
//       ): null}
//     </>
//   )
// }

const CustomSelect = ({label, ...props}) =>{
  const [field, meta] = useField(props)
  return (
    <>
      <label htmlfor = {props.id || props.name}>{label}</label>
      <select className = "text-input" {...field}{...props}/>
      {meta.touched && meta.error ? (
        <div>{meta.error}</div>
      ): null}
    </>
  )
}


export default function LoginPage() {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs"> 
      <Formik
      initialValues = {{
          name: '',
          email: '',
          acceptedTerms: false, //like some checkbox
          specialPowers: '',
      }}
      validationSchema={Yup.object({
          name: Yup.string()
              .min(3,'Must be atleast 3 characters')
              .max(15,'Must be atmost 15 characters')
              .required('Required'),
          email: Yup.string()
              .email('Invalid Email Address')
              .required('Required'),
          acceptedTerms: Yup.boolean()
              .required('Required')
              .oneOf([true],'You Must Accept the Terms & conditions'),
          specialPowers: Yup.string()
              .oneOf(['Admin','Society'],'Invalid special powers')
              .required('Required')

      })}
      onSubmit={(values,{setSubmitting, resetForm}) =>{
          setTimeout(()=>{
            alert(JSON.stringify(values,null,2))
            resetForm()
            setSubmitting(false)
                    
          },3000)
      }}
      >
        {props=>(
          <Form>
            {/* <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar> */}
            <h1 style = {{align: 'center' , marginRight: 10}}>LOGIN IN</h1>
            <TextField
              variant="outlined"
              margin="normal"
              required
              label="User name"
              name="name"
              autoComplete="name"
              fullWidth = "false"
              autoFocus
            ><CustomTextInput/> </TextField>
            {/* <Grid>
              <CustomTextInput name = "name" type= "text" placeholder='Username'/>
            </Grid> */}
            <br/>
            <br/>
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              label="email"
              name="email"
              autoComplete="email"
              fullWidth = "false"
              autoFocus
            >
              <CustomTextInput name = "email"/> 
            </TextField>
            
            <br/>    
            <br/>
            
            <CustomSelect name = "specialPower" type= "text" placeholder="Frank" placeholderTextColor = 'red'>
              <option Role = "">Select Your Role</option>
              <option Admin = "">Admin</option>
              <option CCA User = "">CCA User</option>
              <option Society User = "">SocietyUser</option>
            </CustomSelect>
            <br/>    
            <br/>
            
            {/* <checkbox type="checkbox">
              I accept
            </checkbox> */}
            {/* <CustomCheckbox>
              I accept the terms and conditions
            </CustomCheckbox> */}
            <br/>
            <Button variant="contained" color="primary" spacing= '10'>
              {props.isSubmitting ?'loading...': 'submit'}
            </Button>
            
            <br/>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>

          </Form>
        )}
      </Formik>
    </Container>  
  )
}

const styles = {
  button: {
    backgroundColor: 'red',
    borderRadius: '8px',
    color: 'white',
  }
}