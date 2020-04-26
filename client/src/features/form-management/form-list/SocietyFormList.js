import React, { useEffect} from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import { Paper, List, Typography, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { fetchFormList } from '../formListSlice'

const useStyles = makeStyles((theme) => ({
  formListPaper: {
    overflow:'auto',
    height: '90vh',
    width: '20vw',
    backgroundColor: 'darkgray'
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
        <h4 style={{marginLeft: '30%', marginBottom: 7, color: 'white'}}>Forms List</h4>
        <List>
          {
            formList.list.map((form, index) => {
              return (
                form.isPublic ?  //display public forms only to societies
                <Paper key={index} style={{borderRadius: 3, margin: 10, backgroundColor: 'white'}} >
                  <Button onClick={()=>history.push(`/form-viewer/${form.formId}`)}>
                    <Typography style={{margin: 5}}>
                    {form.title}
                    </Typography>
                  </Button>
                  <br/>
                </Paper>
                : null
              )
            })
          }
        </List>
    </Paper>
  )
}

const mapStateToProps = (state) => ({
  formList: state.formList,
})

export default connect(mapStateToProps)(SocietyFormList)