import React, {useState,useEffect} from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import {Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Button, Dialog, DialogContent, DialogTitle, 
  DialogContentText, DialogActions, Grid, CircularProgress, LinearProgress} from '@material-ui/core'
import {addSocietyAccount,editSocietyAccount,deleteSocietyAccount,fetchSocietyAccounts} from './societyDataSlice'
import {connect} from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import MoreButton from '../../ui/MoreButton'
import DeleteIcon from '@material-ui/icons/Delete'
import * as Yup from 'yup'
import EditIcon from '@material-ui/icons/Edit'
import {login, clearError} from './societyDataSlice'
import ErrorSnackbar from '../../ui/ErrorSnackbar'


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '60%',
  },
})

function SocietyAccountsPanel({societyData,dispatch}) {
  useEffect(() => {dispatch(fetchSocietyAccounts())},[])

  const classes = useStyles()
  const [isOpen,setIsOpen] = useState(false)

  const [editMode,setEditMode] = useState(false)
  const [editId, setEditId] = useState(-1)

  function EditDeleteMoreButton({id}) {
    const menusList=[
      {
        text: 'Edit',
        icon: <EditIcon/>,
        onClick: ()=>handleEdit(id)
      },
      {
        text: 'Delete',
        icon: <DeleteIcon/>,
        onClick: ()=> dispatch(deleteSocietyAccount({id}))
      },
    ]
    return <MoreButton menusList={menusList}/>
  }

  function handleAdd(){
    setEditMode(false)  
    setIsOpen (true)
  }

  function handleEdit(id){
    setEditId(id)
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
      password: ''
    }

    if (editMode){
      const societyDetail = societyData.societyList.find((society,index) =>{
        return society.id === editId
      })
      if (societyDetail !== undefined){
          initialValues = {
          nameInitials: societyDetail.nameInitials,
          name: societyDetail.name,
          email: societyDetail.email,
          presidentEmail: societyDetail.presidentEmail,
          patronEmail: societyDetail.patronEmail,
          password: societyDetail.password  
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
            email: Yup.string()
                .email('Invalid Email Address')
                .required('Required'),
            password: Yup.string().required('Required'),
            nameInitials: Yup.string().required('Required'),
            name: Yup.string().required('Required'),
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
                id: editId, 
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
                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="name" required label="Name"/>
                  </Grid>
                  
                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="nameInitials" required label="Name Initials"/>    
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="email" type="email" required label="Email"/>    
                  </Grid>
                  
                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="presidentEmail" type="email" required label="President Email"/>    
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="patronEmail" type="email" required label="Patron Email"/>    
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="password" type="password" required label="Password"/>    
                  </Grid>
                </Grid>
              </DialogContent>
              {isSubmitting && <CircularProgress />}
              <DialogActions>
                <Button 
                  onClick={submitForm} 
                  color="primary"
                  disabled={isSubmitting}
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
        <h2 style={{marginLeft: '1%'}}>Society Accounts</h2>
        <div>
          <Button
            variant="contained" 
            color="primary" 
            style = {{float: "right", marginBottom:10, marginRight: 50}}
            onClick = {handleAdd}
            >Add Society Account
          </Button>
          <SocietyDialog/>
        </div>
        <Paper className={classes.root} style={{maxHeight: 450, overflow: 'auto'}}>
        <TableContainer className={classes.container}>
        <Table>
        <TableHead >
            <TableRow>
              <TableCell style = {{position: 'sticky', top: 0}}>Initials</TableCell>
              <TableCell align="right" style = {{position: 'sticky', top: 0}}>Society Name</TableCell>
              <TableCell align="right" style = {{position: 'sticky', top: 0}}>Society Email</TableCell>  
            </TableRow>
          </TableHead>
            
          <TableBody>
          {societyData.societyList.map((society,index) => (
            societyData.isPending? <CircularProgress variant = "indeterminate"/>:
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {society.nameInitials}
              </TableCell>
              <TableCell align="right">{society.name}</TableCell>
              <TableCell align="right">{society.email}</TableCell>
              <TableCell align="right">
                <EditDeleteMoreButton id={society.id}/>
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