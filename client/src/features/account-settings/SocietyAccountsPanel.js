import React, {useState,useEffect} from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import {Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Button, Dialog, DialogContent, DialogTitle, 
  DialogContentText, DialogActions, Grid, CircularProgress, LinearProgress, Typography} from '@material-ui/core'
import {addSocietyAccount,editSocietyAccount,toggleActiveSocietyAccount,fetchSocietyAccounts} from './societyDataSlice'
import {connect} from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import MoreButton from '../../ui/MoreButton'
import ToggleOffIcon from '@material-ui/icons/ToggleOff'
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import * as Yup from 'yup'
import EditIcon from '@material-ui/icons/Edit'
import {clearError} from './societyDataSlice'
import ErrorSnackbar from '../../ui/ErrorSnackbar'
import PanelBar from './PanelBar'


const useStyles = makeStyles({
  root: {
    width: '100%',
    maxHeight: '100%',
    overflow: 'auto'
  },
  container: {
    maxHeight: '70%',
  },
})

/**
  The SocietyAccountsPanel Adds/Edits the data of a society, has fields with
  validation for email, password, Name, Name Initials, president email, and patron email
  
  @param {String} societyData for creating account  
 */

function SocietyAccountsPanel({societyData,dispatch}) {
  useEffect(() => {
    dispatch(fetchSocietyAccounts())
  },[])

  const classes = useStyles()
  const [isOpen,setIsOpen] = useState(false)
  const [editMode,setEditMode] = useState(false)
  const [editId, setEditId] = useState(-1)

  function EditDeleteMoreButton({societyId, active}) {
    const menusList=[
      {
        text: 'Edit',
        icon: <EditIcon/>,
        onClick: ()=>handleEdit(societyId)
      },
      {
        text: active ? 'Deactivate' : 'Activate',
        icon: active ? <ToggleOffIcon/> : <ToggleOnIcon/>, 
        onClick: ()=> dispatch(toggleActiveSocietyAccount({societyId, active}))
      },
    ]
    return <MoreButton menusList={menusList}/>
  }

  function handleAdd(){
    setEditMode(false)  
    setIsOpen (true)
  }

  function handleEdit(societyId){
    setEditId(societyId)
    setEditMode(true)  
    setIsOpen (true)
  }

  function SocietyDialog(){

    let initialValues = {
      nameInitials: '',
      name:'',
      email: '',
      presidentEmail: '',
      patronEmail: '',
      password: '',
      passwordRequired: !editMode,
    }

    if (editMode){
      const societyDetail = societyData.societyList.find((society,index) =>{
        return society.societyId === editId
      })
      if (societyDetail !== undefined){
          initialValues = {
          nameInitials: societyDetail.nameInitials,
          name: societyDetail.name,
          email: societyDetail.email,
          presidentEmail: societyDetail.presidentEmail,
          patronEmail: societyDetail.patronEmail,
          password: societyDetail.password  ,
          passwordRequired: !editMode,
        }
      }  
    }

    function handleClose(){
      setIsOpen(false)
    }

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelled by="draggable-dialog-title"
        >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {editMode ? "Edit Society Account" : "Add Society Account"}
        </DialogTitle>

        <Formik
          validateOnChange={false} validateOnBlur={true}
          initialValues={initialValues}
          validationSchema={Yup.object({
            passwordRequired: Yup.boolean(),
            email: Yup.string()
                .email('Invalid Email Address')
                .required('Required'),
            password: Yup.string()
            .min(8,'Must be at least 8 characters')
            .max(30,'Must be atmost 30 characters')
            .matches('^[a-zA-Z0-9]+$', 'All passwords must be alphanumeric (no special symbols).')
            .when("passwordRequired", {
              is: true,
              then: Yup.string().required("Must enter a password for the new account")
            }),
            nameInitials: Yup.string()
            .required('Required')
            .max(10,'Must be atmost 10 characters'),
            name: Yup.string()
            .required('Required')
            .max(100,'Must be atmost 100 characters'),
            presidentEmail: Yup.string()
              .email('Invalid Email Address')
              .required('Required'),
            patronEmail: Yup.string()
              .email('Invalid Email Address')  
              .required('Required'),
          })}
          onSubmit={(values,{setSubmitting}) => {
            dispatch(editMode? 
              editSocietyAccount({
                societyId: editId, 
                nameInitials: values.nameInitials,
                name: values.name,
                email: values.email,
                presidentEmail: values.presidentEmail,
                patronEmail: values.patronEmail,
                password: values.password
              })
              :addSocietyAccount({
                nameInitials: values.nameInitials,
                name: values.name,
                email: values.email,
                presidentEmail: values.presidentEmail,
                patronEmail: values.patronEmail,
                password: values.password
            })).then(()=>{
              setSubmitting(false)
            })
            handleClose()
          }}
        >
          {({submitForm, isSubmitting}) => (
            <Form>
              <DialogContent>
                <Grid container direction = "column" justify = "center" alignItems = "center" style = {{width: 400}}>
                  <Grid item style = {{width: 350, marginBottom: 10}}>
                    <Field component={TextField} name="name" required label="Name"/>
                  </Grid>
                  
                  <Grid item style = {{width: 350, marginBottom: 10}}>
                    <Field component={TextField} name="nameInitials" required label="Name Initials"/>    
                  </Grid>

                  <Grid item style = {{width: 350, marginBottom: 10}}>
                    <Field component={TextField} name="email" type="email" required label="Email"/>    
                  </Grid>
                  
                  <Grid item style = {{width: 350, marginBottom: 10}}>
                    <Field component={TextField} name="presidentEmail" type="email" required label="President Email"/>    
                  </Grid>

                  <Grid item style = {{width: 350, marginBottom: 10}}>
                    <Field component={TextField} name="patronEmail" type="email" required label="Patron Email"/>    
                  </Grid>

                  <Grid item style = {{width: 350, marginBottom: 10}}>
                    <Field component={TextField} name="password" type="password" required label={editMode ? "New Password" : "Password"}/>    
                  </Grid>
                </Grid>
              </DialogContent>
              {isSubmitting && <CircularProgress />}
              <DialogActions>
                <Button 
                  onClick={submitForm} 
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  >
                  Save
                </Button>
                
                <Button autoFocus onClick={handleClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>        
      </Dialog>
    )
  }
  return (
    <div>
    {
      societyData.isPending? <LinearProgress variant = "indeterminate"/>:
      <div>
        <PanelBar handleAdd={handleAdd} title="Society Accounts" buttonText="Add Society Account"/>
        <SocietyDialog/>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell >Initials</TableCell>
                  <TableCell align="right">Society Name</TableCell>
                  <TableCell align="right">Society Email</TableCell>  
                </TableRow>
              </TableHead>
                
              <TableBody>
              {societyData.societyList.map((society,index) => (
                societyData.isPending? <CircularProgress variant = "indeterminate"/>:
                <TableRow key={index} style={{background: society.active ? 'whitesmoke' : 'lightgray'}}>
                  <TableCell component="th" scope="row">
                    <Typography>{society.nameInitials}</Typography>
                  </TableCell>
                  <TableCell align="right"><Typography>{society.name}</Typography></TableCell>
                  <TableCell align="right"><Typography>{society.email}</Typography></TableCell>
                  <TableCell align="right">
                    <EditDeleteMoreButton societyId={society.societyId} active={society.active}/>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
              
            </Table>
          </TableContainer>
        </Paper>
      </div>
      }
      <ErrorSnackbar stateError={societyData.error} clearError={clearError} />
    </div>
    )
}


const mapStateToProps = (state) => ({
  societyData: state.societyData,
})

export default connect(mapStateToProps) (SocietyAccountsPanel)