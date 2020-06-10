import React from 'react'
import { Avatar, Paper, Box, List, Tooltip } from '@material-ui/core'
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
  
  let ownerName="CMS User" // default owner name
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
                ccaDetails.map(ccaUser => { // find the userId who created that log
                  if (logData.creatorId !== -1) {
                    if(ccaUser.ccaId === logData.creatorId) {
                      ownerName = ccaUser.firstName + " " + ccaUser.lastName // store the log creators' name
                      picture = ccaUser.picture
                    }
                  } else {
                    ownerName = "CMS Bot"
                    picture= ""
                  }
                })

                return <Paper className={classes.logPaper} >
                  {/* MAIN div */}
                  <div style={{color: "#ffffff", fontFamily: "Roboto,Noto Sans, Droid Sans,", fontSize: "15px", lineHeight: "20px", fontWeight: "400"}}>
                    <div style={{position: "relative", marginLeft: "40px", minHeight: "30px", padding: "6px 0px"}}>
                      {/* picture div */}
                      <div style={{height: "32px", left: "-40px", position: "absolute", top: "8px", width: "32px"}}> 
                        <Avatar src={picture}/> {/* display the log creators' picture */}
                      </div>
                      {/* name and date/time and description div */}
                      <div style={{marginLeft: 5, marginTop: 4}}>
                        <span>
                          <span style={{fontWeight: 630}}>{ownerName}</span> {/* display the log creators' name */}
                        </span>
                        <span style={{display: "inline-block", minWidth: "6px"}}></span>
                        <span style={{fontSize: "12px", fontWeight: 400, whiteSpace: "pre"}}>
                          {simplifyTimestamp(logData.createdAt, false)} {/* display the log creation time as well */}
                        </span>
                        <div style={{display: "block"}}>
                          <div >
                            <p style={{fontSize: "15px"}}>{logData.description}</p>  {/* display the log description */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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