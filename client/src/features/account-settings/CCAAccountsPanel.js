import React, { useState, useEffect }from 'react'
import { addCCAAccount, deleteCCAAccount, editCCAAccount, fetchCCAAccounts, changeCCAPicture } from './ccaDetailsSlice'
import { Button, Card, CardHeader, CardContent, Grid, Typography, 
  Avatar, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, LinearProgress, FormGroup, FormControlLabel, Switch, FormControl } from '@material-ui/core'
import {connect} from 'react-redux'
import MoreButton from '../../ui/MoreButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import AccessibilityIcon from '@material-ui/icons/Accessibility'

function CCAAccountPanel({ccaDetails,dispatch}) {

  useEffect(() => {
    dispatch(fetchCCAAccounts())
  }, [])
  
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenPermission, setIsOpenPermission] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(-1)
  const [picture, setPicture] = useState("")
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

  function handleImageUpload(event, id) {
    const url = URL.createObjectURL(event.target.files[0])
    setPicture(url)
    if(editMode) {
      dispatch(changeCCAPicture({id, url}))
    }
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

  function EditDeleteMoreButton({id}){
    const menusList=[
      {
        text: 'Edit',
        icon: <EditIcon/>,
        onClick: ()=>handleEdit(id)
      },
      {
        text: 'Deactivate',
        icon: <DeleteIcon/>,  
        onClick: ()=>dispatch(deleteCCAAccount({id}))
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
  
  function handleEdit(id){
    setEditId(id)
    setEditMode(true)
    setIsOpen(true)
  }

  function CCADialog(){
    let initialValues = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      picture: '',
      role:'',
      timestampCreated: '',
      permission:[]
    }

    if(editMode){
      const ccaMemberDetail = ccaDetails.ccaList.find((detail,index) => {
        return detail.id === editId
      })
      if(ccaMemberDetail !== undefined){
        initialValues = {
          firstName: ccaMemberDetail.firstName,
          lastName: ccaMemberDetail.lastName,
          email: ccaMemberDetail.email,
          password: ccaMemberDetail.password,
          picture: ccaMemberDetail.picture,
          role:ccaMemberDetail.role,
          timestampCreated: ccaMemberDetail.timestampCreated,
          permission:ccaMemberDetail.permission,
        }
      }
    }

    return(
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
          <div align="center">
            <h1>CCA Accounts Panel</h1>
            <Button
              variant="contained" 
              color="primary" 
              spacing= '10' 
              style = {{float: "right", marginBottom:10}}
              onClick = {handleAdd}
            > Add CCA member
            </Button>
            <CCADialog />
          </div>
          <Grid container spacing={3} >
          {
            ccaDetails.ccaList.map((ccaDetail,index) => (
              <Grid item xs={3}> 
                <Card variant="outlined" style = {{maxWidth: 300, background: "snow"}}>
                  <CardHeader
                    avatar={
                      <Avatar style = {{width:150, height:150}} src = {ccaDetail.picture}/>
                    }
                    action={
                      <EditDeleteMoreButton id={ccaDetail.id}/>
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
        </div>
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  ccaDetails: state.ccaDetails,
})

export default connect(mapStateToProps) (CCAAccountPanel)