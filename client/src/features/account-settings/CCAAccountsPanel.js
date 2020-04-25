import React, { useState }from 'react'
import { addCCAAccount, deleteCCAAccount, editCCAAccount } from './ccaDetailsSlice'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Card, CardHeader, CardMedia, CardContent, Grid, Typography, 
  Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import {connect} from 'react-redux'
import MoreButton from '../../ui/MoreButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '60%',
  },
})

function CCAAccountPanel({ccaDetails,dispatch}) {
  const classes = useStyles()

  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(-1)
  const [picture, setPicture] = useState(null)

  function EditDeleteMoreButton({id}){
    const menusList=[
      {
        text: 'Edit',
        icon: <EditIcon/>,
        onClick: ()=>handleEdit(id)
      },
      {
        text: 'Delete',
        icon: <DeleteIcon/>,
        onClick: ()=>dispatch(deleteCCAAccount({id})),
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
      permission:[]
    }

    if(editMode){
      const ccaMemberDetail = ccaDetails.find((detail,index) => {
        return detail.id === editId
      })
      if (ccaMemberDetail !== undefined){
        console.log(ccaMemberDetail.firstName)
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

    function handleClose(){
      setIsOpen(false)
    }

    function onDrop(picture){
      setPicture(picture)
    }
    return(
      <Dialog 
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >

      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {editMode ? "Edit Task Status" : "Add Task Status"}
      </DialogTitle>
      
      <Formik
        validateOnChange={false} validateOnBlur={true}
        initialValues = {initialValues}
        validate={values => {
          const errors = {}
          return errors
        }}
        onSubmit={(values) => {
          console.log(values)
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
            }))
            setEditMode(false)
            handleClose()
        }}
      >
        {({submitForm})=>(
          <Form>
            <DialogContent>
              <Grid container direction = "column" justify = "center" alignItems = "center" style = {{width: 400}}>
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
            </DialogContent>
            <DialogActions>
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
        <CCADialog/>
      </div>
      <Grid container spacing={3} >
      {ccaDetails.map((ccaDetail,index) => (
        <Grid item xs={4}> 
          <Card variant="outlined" style = {{maxWidth: 345}}>
            <CardHeader
              avatar={
                <Avatar style = {{width: 200, height:200}} src = {ccaDetail.picture}/>
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
        ))}
        </Grid>
      </div>
    )
}

const mapStateToProps = (state) => ({
  ccaDetails: state.ccaDetails,
})

export default connect(mapStateToProps) (CCAAccountPanel)