import React, { useEffect} from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import { Paper, Typography, Button, Container } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { fetchFormList, clearError } from '../formListSlice'
import ListAltIcon from '@material-ui/icons/ListAlt'
import ErrorSnackbar from '../../../ui/ErrorSnackbar'

const useStyles = makeStyles((theme) => ({
  formListPaper: {
    overflow:'auto',
    height: '92%',
    width: '20vw',
    background: 'linear-gradient(to right bottom, #3274f3, #82b4ff)'
    // background: 'linear-gradient(to right, #43cea2, #185a9d)'
    // background: 'linear-gradient(to right, #c33764, #1d2671)',
    // background: 'linear-gradient(to right, #3a1c71, #d76d77, #ffaf7b)'
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
                <Paper key={index} style={{borderRadius: 3, marginBottom: 10}} >
                  <Button onClick={()=>history.push(`/form-viewer/create/${form.formId}`)}>
                    <Typography style={{margin: 2, fontSize: 12, fontWeight: 500}}>
                      <ListAltIcon style={{marginBottom: -5, marginRight: 5}}/>{form.title}
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