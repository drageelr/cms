import React, { useEffect} from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import { Paper, List, Typography, Button, Container } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { fetchFormList, clearError } from '../formListSlice'
import ErrorSnackbar from '../../../ui/ErrorSnackbar'

const useStyles = makeStyles((theme) => ({
  formListPaper: {
    overflow:'auto',
    height: '90vh',
    width: '20vw',
    background: 'linear-gradient(to right bottom, #430089, #82b4ff)'
  }
}))

function SocietyFormList({formList, dispatch}) {
  const classes = useStyles()
  const history = useHistory()

  useEffect(() => {
    dispatch(fetchFormList())
  }, [])

  return (
    <Paper className={classes.formListPaper} style={{position: 'absolute'}}>
        <Container>
          <h4 style={{color: 'white', textAlign: 'center'}}>Forms</h4>
          {
            formList.list.map((form, index) => (
                form.isPublic &&  //display public forms only to societies
                <Paper key={index} style={{borderRadius: 3, background: 'white'}} >
                  <Button onClick={()=>history.push(`/form-viewer/create/${form.formId}`)}>
                    <Typography style={{margin: 5, fontSize: 14, fontWeight: 500}}>
                    {form.title}
                    </Typography>
                  </Button>
                  <br/>
                </Paper>
            ))
          }
        </Container>
        <ErrorSnackbar stateError={formList.error} clearError={clearError} />
    </Paper>
  )
}

const mapStateToProps = (state) => ({
  formList: state.formList,
})

export default connect(mapStateToProps)(SocietyFormList)