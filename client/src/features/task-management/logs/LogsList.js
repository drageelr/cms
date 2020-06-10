import React from 'react'
import { Grid, Typography, Avatar, Paper, Box, List } from '@material-ui/core'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { simplifyTimestamp } from '../../../helpers'

/**
  This component displays all the logs in form of a list.

  @param {string} taskId this is the Id of the task whom the user wants to edit
  @param {list} taskData slice from redux containing data of all the currently active tasks
  @param {list} ccaDetails slice from redux containing data of all the active members of CCA
**/

const useStyles = makeStyles((theme) => ({
  logEditorPaper: {
    overflow:'auto',
    height: '34vh',
    width: '55vw',
    marginLeft: 17
  },
  logPaper:{
    padding: 2, 
    borderRadius: 3, 
    margin: 8, 
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    width: '52.5vw',
  }
}))

export function LogsList({taskId, taskData, ccaDetails}) {
  const classes = useStyles()
  let ownerName="CMS User"
  let picture = ""

  return <Box borderRadius={8} border={1} borderColor="grey.400" className={classes.logEditorPaper}>
    <List>
      {
        taskData.map(taskObj => {
          if (taskObj.taskId === taskId) {
            if(taskObj.logs.length === 0) {
              return null
            } 
            else {
              const reversedLogList = taskObj.logs.map(item => item).reverse()
              return reversedLogList.map(logData => {
                ccaDetails.map(ccaUser => {
                  if (logData.creatorId !== -1) {
                    if(ccaUser.ccaId === logData.creatorId) {
                      ownerName = ccaUser.firstName + " " + ccaUser.lastName
                      // console.log(ownerName)
                      picture = ccaUser.picture
                    }
                  }
                })

                // console.log(ownerName)
                return <Paper className={classes.logPaper} >
                  <Grid container direction="column" justify="space-between" alignItems="flex-start">
                    <Grid direction="row" justify="space-between" alignItems="flex-start">
                      <Grid container>
                        <Avatar src={picture} style={{height: 15, width: 15, marginTop: 3}}/>
                        <Typography variant="subtitle2" style={{marginLeft: 3}}>
                          {ownerName}
                        </Typography>
                      <Grid>
                        {/* <Typography>
                          {simplifyTimestamp(logData.createdAt, false)}
                        </Typography> */}
                      </Grid>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Typography style={{marginLeft: 27, fontSize: 13}}>
                        {logData.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>          
              })
            }
          }
        })  
      }
    </List>
  </Box>
}

const mapStateToProps = (state) => ({
  taskData: state.taskData.taskList,
  ccaDetails: state.ccaDetails.ccaList
})

export default connect(mapStateToProps)(LogsList)