import React , {useState} from 'react'
import { Grid, TextField, Button, Typography, Card, Avatar } from '@material-ui/core'
import { connect } from 'react-redux'
import { createNewLog } from '../taskDataSlice'

export function LogEditor({taskId, taskData, ccaDetails, user, dispatch}) {
  const [logText, setLogText] = useState("")

  let ownerName=""
  let picture = ""

  function handleUpdateLogs() {
    if (logText) {
      let creatorId = user.id
      console.log(logText)
      dispatch(createNewLog({taskId, creatorId, logText}))
    }
  }

  return (
    <div>
      <Grid container direction="column">
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
              defaultValue = {logText}
              size="small"
              style={{padding: "9px", marginLeft: 8, width: "60%"}}
              />
              <Button size="large" variant="contained" style={{marginTop: 20, marginLeft: 10}} onClick={handleUpdateLogs}>
                Post
              </Button>
            </Grid>
        </Grid>
      </Grid>

      {taskData.map(taskObj => {
        if (taskObj.taskId === taskId) {
          if(taskObj.logs.length === 0) {
            return null
          } else {
            return taskObj.logs.map(logData => {
              ccaDetails.map(ccaUser => {
                if(ccaUser.ccaId === logData.creatorId) {
                  ownerName = ccaUser.firstName + " " + ccaUser.lastName 
                  picture = ccaUser.picture
                }
              })
              return <Grid direction="row" justify="flex-start" alignItems="flex-start">
                <Grid item style={{marginLeft: 15, marginTop: 10}}>
                  <Card style={{width: "61%", height: "30%"}} raised="true">
                    <Grid container direction="row" justify="space-between" alignItems="flex-start">
                      <Grid item container style={{padding: "5px"}}>
                        <Avatar src={picture} style={{height: 20, width: 20, marginTop: 4}}/>
                        <Typography variant="h6" style={{marginLeft: 3}}>
                          {ownerName}
                        </Typography>
                        <Grid item style={{marginLeft: "55%"}}>
                          <Typography>
                            {logData.createdAt}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Typography style={{marginLeft: 27, fontSize: 16}}>
                      {logData.description}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            })
          }
        }
      })}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  taskData: state.taskData.taskList,
  ccaDetails: state.ccaDetails.ccaList
})

export default connect(mapStateToProps)(LogEditor)