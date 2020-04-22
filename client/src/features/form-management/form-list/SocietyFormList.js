import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import { Paper, List, Typography, Container } from '@material-ui/core'
// import {} from '../formListSlice'


const useStyles = makeStyles((theme) => ({
  formListPaper: {
    overflow:'auto',
    height: '90vh',
    width: '20vw',
    backgroundColor: 'darkgray'
  }
}))

function SocietyFormList({formList}) {
  const classes = useStyles()

  return (
    <Paper className={classes.formListPaper}>
        <h4 style={{marginLeft: '30%', marginBottom: 7, color: 'white'}}>Forms List</h4>
        <List>
          {
            formList.map((form, index) => {
              return (
                form.isPublic ?  //display public forms only to societies
                <Paper key={index} style={{borderRadius: 3, margin: 10, backgroundColor: 'white'}} >
                  <Typography style={{margin: 5}}>
                  {form.title}
                  </Typography>
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