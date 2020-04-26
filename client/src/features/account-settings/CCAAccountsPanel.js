import React, { useState, useEffect }from 'react'
import { addCCAAccount, toggleActiveCCAAccount, editCCAAccount, fetchCCAAccounts, changeCCAPicture, clearError } from './ccaDetailsSlice'
import { Button, Card, CardHeader, CardContent, Grid, Typography, FormControl, InputLabel, MenuItem, Switch, FormControlLabel, FormGroup,
  Avatar, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, LinearProgress, makeStyles, Container } from '@material-ui/core'
import {connect} from 'react-redux'
import MoreButton from '../../ui/MoreButton'
import ToggleOffIcon from '@material-ui/icons/ToggleOff'
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import EditIcon from '@material-ui/icons/Edit'
import { Formik, Form, Field } from 'formik'
import { TextField, Select } from 'formik-material-ui'
import * as Yup from 'yup'
import ErrorSnackbar from "../../ui/ErrorSnackbar"
import PanelBar from './PanelBar'
import AccessibilityIcon from '@material-ui/icons/Accessibility'


function CCAAccountPanel({ccaDetails,dispatch}) {

  useEffect(() => {
    dispatch(fetchCCAAccounts())
  }, [])
  
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenPermission, setIsOpenPermission] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(-1)
  const [picture, setPicture] = useState("https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-6.png")
  const [permissions, setPermissions] = useState({
    "ccaCRUD": false,
    "accessFormMaker": false,
    "createReqTask": false,
    "createCustomTask": false,
    "createTaskStatus": false,
    "archiveTask": false,
    "unarchiveTask": false,
    "setFormStatus": false,
    "addCCANote": false,
  })
  const [permissionMode, setPermissionsMode] = useState(false)

  function handleImageUpload(event, ccaId) {
    const url = URL.createObjectURL(event.target.files[0])
    setPicture(url)
  }

  function handlePermissionsChange(event, editId){
    setPermissions({ 
      ...permissions, 
      [event.target.name]: event.target.checked 
    })

    // dispatch(editCCAAccount({editId, permissions}))
  }

  function handlePermissions() {
    setPermissionsMode(true)
    setIsOpenPermission(true)
  }
  
  function handleClosePermission() {
    setIsOpenPermission(false)
    setPermissionsMode(false)
  }

  function handleClose(){
    setIsOpen(false)
  }

  function EditDeleteMoreButton({ccaId, active}){
    const menusList=[
      {
        text: 'Edit',
        icon: <EditIcon/>,
        onClick: ()=>handleEdit(ccaId)
      },
      {
        text: active ? 'Deactivate' : 'Activate',
        icon: active ? <ToggleOffIcon/> : <ToggleOnIcon/>,  
        onClick: ()=>dispatch(toggleActiveCCAAccount({ccaId, active}))
      },
      {
        text: 'Manage Permissions',
        icon: <AccessibilityIcon/>,
        onClick: () => handlePermissions(id)
      }
    ]
    return <MoreButton menusList={menusList}/>
  }

  function handleAdd(){
    setEditMode(false)
    setIsOpen(true)
  }
  
  function handleEdit(ccaId){
    setEditId(ccaId)
    setEditMode(true)
    setIsOpen(true)
  }

  function CCADialog(){
    let initialValues = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordRequired: !editMode,
      picture: 'https://pngimage.net/wp-content/uploads/2018/05/default-user-profile-image-png-6.png',
      role:'',
      permissions: {
        societyCRUD: true,
        ccaCRUD: true,
        accessFormMaker: true,
        createReqTask: true,
        createCustomTask: true,
        createTaskStatus: true,
        archiveTask: true,
        unarchiveTask: true,
        setFormStatus: true,
        addCCANote: true
      }
    }

    if(editMode){
      const ccaMember = ccaDetails.ccaList.find((member,index) => {
        return member.ccaId === editId
      })
      if(ccaMember !== undefined){
        initialValues = {
          ...ccaMember,
          passwordRequired: !editMode,

        }
      }
    }

    return(
      <Dialog 
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >

      <DialogTitle style={{ cursor: 'move' }} ccaId="draggable-dialog-title">
        {editMode ? "Edit Account" : "Add Account"}
      </DialogTitle>
      
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues = {initialValues}
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
          firstName: Yup.string().required(),
          lastName: Yup.string().required(),
          picture: Yup.string(),
          role: Yup.string().required(),
        })}
        onSubmit={(values, {setSubmitting}) => {
          dispatch(editMode ?
            editCCAAccount({
              ccaId: editId,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
              picture: picture,
              role:values.role,
              timestampCreated: values.timestampCreated,
              permissions: {
                societyCRUD: true,
                ccaCRUD: true,
                accessFormMaker: true,
                createReqTask: true,
                createCustomTask: true,
                createTaskStatus: true,
                archiveTask: true,
                unarchiveTask: true,
                setFormStatus: true,
                addCCANote: true
              },
            })
            :addCCAAccount({
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
              picture: picture,
              role:values.role,
              timestampCreated: values.timestampCreated,
              permissions: {
                societyCRUD: true,
                ccaCRUD: true,
                accessFormMaker: true,
                createReqTask: true,
                createCustomTask: true,
                createTaskStatus: true,
                archiveTask: true,
                unarchiveTask: true,
                setFormStatus: true,
                addCCANote: true
              },
            })).then(() => {
              setSubmitting(false)
              setEditMode(false)
              handleClose()
            })
        }}
      >
        {({submitForm, isSubmitting})=>(
          <Form>
            <DialogContent> 
              <Grid container direction="row" justify="space-evenly" alignItems="center">
                <Grid item direction = "column" justify = "space-evenly" alignItems = "center" style = {{width: 200}}>
                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="firstName" required label="First Name"/>
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="lastName" required label="Last Name"/>
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="email" required label="Email"/>
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="password" required type="password" label={editMode ? "New Password" : "Password"}/>
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <FormControl>
                      <InputLabel htmlFor="role">Role</InputLabel>
                      <Field
                        component={Select}
                        name="role"
                        inputProps={{
                          id: 'role',
                        }}
                        style={{width: 100}}
                      >
                        <MenuItem value={'member'}>Member</MenuItem>
                        <MenuItem value={'admin'}>Admin</MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid direction="column" justify="flex-end" alignItems="flex-start">
                    <Grid item>
                      <Avatar style = {{width:180, height:180, marginLeft: 50, marginTop: 30}} src={editMode ? initialValues.picture : picture}/>
                    </Grid>
                    <Grid item>
                      <input style = {{marginLeft: 80, marginTop: 10}} type="file" onChange={(e) => {handleImageUpload(e, editId)}}/>
                    </Grid>
                  </Grid>
                </Grid>
                
              </Grid>
            </DialogContent>
            <DialogActions>
              {isSubmitting && <CircularProgress/>}

              <Button onClick={submitForm} color="primary">
                Save
              </Button>

      (() => {
        if(permissionMode) {
          return (
            <Dialog 
              open={isOpenPermission}
              onClose={handleClosePermission}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Manage User Permissions
              </DialogTitle>
              <FormControl component="fieldset" style={{marginLeft: "10%", marginBottom: 20}}>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch color="primary" size="small" checked={permissions.ccaCRUD} onChange={handlePermissionsChange} name="ccaCRUD"/>}
                    label="ccaCRUD"
                    style={{marginBottom: 8}}
                  />
                  <FormControlLabel
                    control={<Switch color="primary" size="small" checked={permissions.accessFormMaker} onChange={handlePermissionsChange} name="accessFormMaker"/>}
                    label="Access Form Maker"
                    style={{marginBottom: 8}}
                  />
                  <FormControlLabel
                    control={<Switch color="primary" size="small" checked={permissions.createReqTask} onChange={handlePermissionsChange} name="createReqTask"/>}
                    label="Create Request Task"
                    style={{marginBottom: 8}}
                  />
                  <FormControlLabel
                    control={<Switch color="primary" size="small" checked={permissions.createCustomTask} onChange={handlePermissionsChange} name="createCustomTask"/>}
                    label="Create Custom Task"
                    style={{marginBottom: 8}}
                  />
                  <FormControlLabel
                    control={<Switch color="primary" size="small" checked={permissions.createTaskStatus} onChange={handlePermissionsChange} name="createTaskStatus"/>}
                    label="Create Task Status"
                    style={{marginBottom: 8}}
                  />
                  <FormControlLabel
                    control={<Switch color="primary" size="small" checked={permissions.archiveTask} onChange={handlePermissionsChange} name="archiveTask"/>}
                    label="Archive Task"
                    style={{marginBottom: 8}}
                  />
                  <FormControlLabel
                    control={<Switch color="primary" size="small" checked={permissions.unarchiveTask} onChange={handlePermissionsChange} name="unarchiveTask"/>}
                    label="Unarchive Task"
                    style={{marginBottom: 8}}
                  />
                  <FormControlLabel
                    control={<Switch color="primary" size="small" checked={permissions.setFormStatus} onChange={handlePermissionsChange} name="setFormStatus"/>}
                    label="Set Form Status"
                    style={{marginBottom: 8}}
                  />
                  <FormControlLabel
                    control={<Switch color="primary" size="small" checked={permissions.addCCANote} onChange={handlePermissionsChange} name="addCCANote"/>}
                    label="Add CCA Note"
                    style={{marginBottom: 8}}
                  />
                </FormGroup>
              </FormControl>
            </Dialog>
          )
        } else{
          return (
            <Dialog 
              open={isOpen}
              onClose={handleClose}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {editMode ? "Edit Account" : "Add Account"}
              </DialogTitle>
              
              <Formik
                validateOnChange={false} validateOnBlur={true}
                initialValues = {initialValues}
                validate={values => {
                  const errors = {}
                  return errors
                }}
                onSubmit={(values, {setSubmitting}) => {
                  dispatch(editMode ?
                    editCCAAccount({
                      id: editId,
                      firstName: values.firstName,
                      lastName: values.lastName,
                      email: values.email,
                      password: values.password,
                      picture: values.picture,
                      role:values.role,
                      timestampCreated: values.timestampCreated,
                      permission:values.permission,
                    })
                    :addCCAAccount({
                      firstName: values.firstName,
                      lastName: values.lastName,
                      email: values.email,
                      password: values.password,
                      picture: picture,
                      role:values.role,
                      timestampCreated: values.timestampCreated,
                      permission:values.permission,
                    })).then(() => {
                      setSubmitting(false)
                    })
                  setEditMode(false)
                }}
              >
                {({submitForm, isSubmitting})=>(
                  <Form>
                    <DialogContent> 
                      <Grid container direction="row" justify="space-evenly" alignItems="center">
                        <Grid item direction = "column" justify = "center" alignItems = "center" style = {{width: 200}}>
                          <Grid item style = {{width: 350}}>
                            <Field component={TextField} name="firstName" required label="First Name"/>
                          </Grid>

                          <Grid item style = {{width: 350}}>
                            <Field component={TextField} name="lastName" required label="Last Name"/>
                          </Grid>

                          <Grid item style = {{width: 350}}>
                            <Field component={TextField} name="email" required label="Email"/>
                          </Grid>

                          <Grid item style = {{width: 350}}>
                            <Field component={TextField} name="password" required label="Password"/>
                          </Grid>

                          <Grid item style = {{width: 350}}>
                            <Field component={TextField} name="role" required label="Role"/>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid direction="column" justify="flex-end" alignItems="flex-start">
                            <Grid item>
                              <Avatar style = {{width:180, height:180, marginLeft: 50, marginTop: 30}} src = {initialValues.picture}/>
                            </Grid>
                            <Grid item>
                              <input style = {{marginLeft: 80, marginTop: 10}} type="file" onChange={(e) => {handleImageUpload(e, editId)}}/>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      {isSubmitting && <CircularProgress/>}
                      <Button onClick={submitForm} color="primary">
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
          )}
      })()
    )
  }

  return (
    <div>
      {ccaDetails.isPending ? <LinearProgress /> :
        <div>
          <PanelBar handleAdd={handleAdd} title="CCA Accounts" buttonText="Add CCA Account"/>
          <CCADialog />
          <br/>
          <Container style={{color: "gray"}} >
          <Grid container spacing={3}>
          {
            ccaDetails.ccaList.map((ccaDetail,index) => (
              <Grid item xs={3}> 
                <Card variant="outlined" style = {{marginLeft: 10, maxWidth: 300, background: ccaDetail.active ? "whitesmoke" : "darkgray"}}>
                  <CardHeader
                    avatar={
                      <Avatar style = {{width:150, height:150}} src = {ccaDetail.picture}/>
                    }
                    action={
                      <EditDeleteMoreButton ccaId={ccaDetail.ccaId} active={ccaDetail.active}/>
                    }
                  />
                  <CardContent>
                    <Typography style = {{textAlign: 'left', fontSize: 20}}>{ccaDetail.firstName} {ccaDetail.lastName}</Typography>
                    <Typography>{ccaDetail.role}</Typography>
                    <Typography>{ccaDetail.email}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          }
          </Grid>
          </Container>
        </div>
      }
      <ErrorSnackbar stateError={ccaDetails.error} clearError={clearError}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  ccaDetails: state.ccaDetails,
})

export default connect(mapStateToProps) (CCAAccountPanel)