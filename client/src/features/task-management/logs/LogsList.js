import React from 'react'
import { Avatar, Paper, Box, List } from '@material-ui/core'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Timestamp from 'react-timestamp'

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
  
  let ownerName="CMS Bot" // default owner name
  let picture = "" //default picture src

  return <Box borderRadius={8} border={1} borderColor="grey.400" className={classes.logEditorPaper}>
    <List>
      {
        taskData.map(taskObj => {
          if (taskObj.taskId === taskId) {
            if(taskObj.logs.length === 0) {
              return null
            } 
            else {
              const reversedLogList = taskObj.logs.map(item => item).reverse() // reverse the log list so that it displays the most recent log first
              return reversedLogList.map(logData => { // for each log related to the task
                ccaDetails.forEach(ccaUser => { // find the userId who created that log
                  if (logData.creatorId !== -1) {
                    if(ccaUser.ccaId === logData.creatorId) {
                      ownerName = ccaUser.firstName + " " + ccaUser.lastName // store the log creators' name
                      picture = ccaUser.picture
                    }
                  } else {
                    ownerName = "CMS Bot"
                    picture = "https://is4-ssl.mzstatic.com/image/thumb/Purple20/v4/fe/37/96/fe3796df-60d8-b510-8952-8b007c5f8beb/source/512x512bb.jpg"
                  }
                })

                return <Paper className={classes.logPaper} >
                  {/* MAIN div */}
                  <div style={{color: "#ffffff", fontFamily: "Roboto,Noto Sans, Droid Sans,", fontSize: "14px", lineHeight: "20px", fontWeight: "400"}}>
                    <div style={{position: "relative", marginLeft: "40px", minHeight: "20px", padding: "4px 0px"}}>
                      {/* picture div */}
                      <Avatar src={picture} style={{height: "32px", left: "-34px", position: "absolute", top: "8px", width: "32px"}}/> {/* display the log creators' picture */}
                      {/* name and date/time and description div */}
                      <div style={{marginLeft: 5, marginTop: 4}}>
                        <span>
                          <span style={{fontWeight: 600}}>{ownerName}</span> {/* display the log creators' name */}
                        </span>
                        <span style={{display: "inline-block", minWidth: "6px"}}></span>
                        <span style={{fontSize: "10px", fontWeight: 400, whiteSpace: "pre"}}>
                          <Timestamp date={new Date(logData.createdAt)}/> {/* display the log creation time as well */}
                        </span>
                        <p style={{fontSize: "14px"}}>{logData.description}</p>  {/* display the log description */}
                      </div>
                    </div>
                  </div>
                </Paper>          
              })
            }
          }
          return null
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