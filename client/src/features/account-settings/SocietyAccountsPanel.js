import React, {useState,useEffect} from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Grid, CircularProgress } from '@material-ui/core'
import {addSocietyAccount,editSocietyAccount,deleteSocietyAccount,fetchSocietyAccounts} from './societyDataSlice'

import {connect} from 'react-redux'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'

import MoreButton from '../../ui/MoreButton'

import DeleteIcon from '@material-ui/icons/Delete'

import EditIcon from '@material-ui/icons/Edit'


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '60%',
  },
})

function SocietyAccountsPanel({societyData,dispatch}) {
  useEffect(async () => {
    await dispatch(fetchSocietyAccounts())
  },[])
  console.log(societyData)


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
        // PaperComponent={PaperComponent}
        aria-labelled by="draggable-dialog-title"
        >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {editMode ? "Edit Task Status" : "Add Task Status"}
        </DialogTitle>

        <Formik
          validateOnChange={false} validateOnBlur={true}
          initialValues={initialValues}
          validate={values => {
            const errors = {}
            return errors
          }}
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
                    <Field component={TextField} name="email" required label="Email"/>    
                  </Grid>
                  
                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="presidentEmail" required label="President Email"/>    
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="patronEmail" required label="Patron Email"/>    
                  </Grid>

                  <Grid item style = {{width: 350}}>
                    <Field component={TextField} name="password" required label="Password"/>    
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
      <h2>SocietyAccountsPanel</h2>
      <div>
        <Button
          variant="contained" 
          color="primary" 
          spacing= '10' 
          style = {{float: "right", marginBottom:10}}
          onClick = {handleAdd}
          >Add society
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
    )
}


const mapStateToProps = (state) => ({
  societyData: state.societyData,
})

export default connect(mapStateToProps) (SocietyAccountsPanel)