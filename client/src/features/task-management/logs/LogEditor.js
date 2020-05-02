import React , {useState} from 'react'
import { Grid, TextField, Button, Typography, Card } from '@material-ui/core'
import { connect } from 'react-redux'
import PersonIcon from '@material-ui/icons/Person'
import { createNewLog } from '../taskDataSlice'

export function LogEditor({taskId, taskData, ccaDetails, dispatch}) {
  const [logText, setLogText] = useState("")

  let ownerName=""

  function handleUpdateLogs() {
    if (logText) {
      dispatch(createNewLog({taskId, logText})) // call EDIT API
    }
  }

  return (
    <div>
    <Grid direction="column">
      <Grid direction="row" justify="flex-start" alignItems="flex-start" style={{marginTop: 20}}>
        <Grid item>
          <TextField
            id="logs-post"
            multiline
            rows={3}
            label="Logs"
            value = {logText}
            onChange={(event) => {setLogText(event.target.value)}}
            variant="outlined"
            autoFocus="true"
            size="small"
            style={{padding: "9px", marginLeft: 8, width: "60%"}}
            />
            <Button
              size="large"
              variant="contained"
              style={{marginTop: 20, marginLeft: 10}}
              onClick={handleUpdateLogs}
              >Post</Button>
          </Grid>
      </Grid>
    </Grid>
      {
        (() => {
          taskData.map(taskObj => {
            if(taskObj.taskId === taskId) {
              if(taskObj.logs.length === 0) {
                return null
              } else {
                return (
                  taskObj.logs.map(logData => {
                    ccaDetails.map(ccaUser => {
                      if(ccaUser.ccaId === logData.creatorId) {
                        ownerName = ccaUser.firstName + " " + ccaUser.lastName
                      }
                    })
                    return (
                      <Grid direction="row" justify="flex-start" alignItems="flex-start">
                        <Grid item style={{marginLeft: 10, marginTop: 10}}>
                          <Card style={{width: "61%"}} raised="true">
                            <PersonIcon size="large"/>
                            {ownerName}: 
                            <Typography style={{marginLeft: 20, fontSize: 16}}>
                              {logData.description}
                            </Typography>
                          </Card>
                        </Grid>
                      </Grid>
                    )
                  })
                )
              }
            }
          })
        //  else {
        //     return taskData.tasks[taskId].logsList.map(logData => {
        //       ownerName=taskData.columns[logData.creatorId].title
        //       return (
        //         <Grid direction="row" justify="flex-start" alignItems="flex-start">
        //           <Grid item style={{marginLeft: 10, marginTop: 10}}>
        //             <Card style={{width: "61%"}} raised="true">
        //               <PersonIcon size="large"/>
        //               {ownerName}: 
        //               <Typography style={{marginLeft: 20, fontSize: 16}}>
        //                 {logData.description}
        //               </Typography>
        //             </Card>
        //           </Grid>
        //         </Grid>
        //     )})
        //   }
        })()
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData.taskList,
  ccaDetails: state.ccaDetails.ccaList
})

export default connect(mapStateToProps)(LogEditor)