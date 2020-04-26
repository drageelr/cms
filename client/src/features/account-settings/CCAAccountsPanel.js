import React, { useState, useEffect }from 'react'
import { addCCAAccount, deleteCCAAccount, editCCAAccount, fetchCCAAccounts, changeCCAPicture, clearError } from './ccaDetailsSlice'
import { Button, Card, CardHeader, CardContent, Grid, Typography, FormControl, InputLabel, MenuItem, 
  Avatar, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, LinearProgress } from '@material-ui/core'
import {connect} from 'react-redux'
import MoreButton from '../../ui/MoreButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Formik, Form, Field } from 'formik'
import { TextField, Select } from 'formik-material-ui'
import * as Yup from 'yup'
import ErrorSnackbar from "../../ui/ErrorSnackbar"

function CCAAccountPanel({ccaDetails,dispatch}) {

  useEffect(() => {
    dispatch(fetchCCAAccounts())
  }, [])
  
  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(-1)
  const [picture, setPicture] = useState("")

  function handleImageUpload(event, id) {
    console.log(id)
    const url = URL.createObjectURL(event.target.files[0])
    setPicture(url)

    if(editMode) {
      dispatch(changeCCAPicture({id, url}))
    }
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
      const ccaMember = ccaDetails.ccaList.find((detail,index) => {
        return detail.id === editId
      })
      if(ccaMember !== undefined){
        initialValues = {
          ...ccaMember
        }
      }
    }

    function handleClose(){
      setIsOpen(false)
    }

    return(
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
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid Email Address')
            .required('Required'),
          password: Yup.string()
          .required('Required')
          .min(8,'Must be at least 8 characters')
          .max(30,'Must be atmost 30 characters')
          .matches('^[a-zA-Z0-9]+$', 'All passwords must be alphanumeric (no special symbols).'),
          firstName: Yup.string().required(),
          lastName: Yup.string().required(),
          picture: Yup.string().required(),
          role: Yup.string().required(),
        })}
        onSubmit={(values, {setSubmitting}) => {
          dispatch(editMode ?
            editCCAAccount({
              id: editId,
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
                    <Field component={TextField} name="password" required type="password" label="Password"/>
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
      {ccaDetails.isPending ? <LinearProgress /> :
        <div>
          <h2 style={{marginLeft: '1%'}}>CCA Accounts</h2>
          <div align="center">
            <Button
              size="large"
              variant="contained" 
              color="primary" 
              spacing= '10' 
              style = {{float: "right", marginBottom:10, marginRight: 50}}
              onClick = {handleAdd}
            > Add CCA Member
            </Button>
            <CCADialog />
          </div>
          <Grid container spacing={3} >
          {
            ccaDetails.ccaList.map((ccaDetail,index) => (
              <Grid item xs={2}> 
                <Card variant="outlined" style = {{marginLeft: 20, maxWidth: 300, background: "whitesmoke"}}>
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
      <ErrorSnackbar stateError={ccaDetails.error} clearError={clearError}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  ccaDetails: state.ccaDetails,
})

export default connect(mapStateToProps) (CCAAccountPanel)