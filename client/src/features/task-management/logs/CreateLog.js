import React , {useState} from 'react'
import { Grid, TextField, Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { setCusLogCreatorId } from '../taskDataSlice'
import { createNewLog } from "../taskDataSlice"
import LogsList from "./LogsList"

export function LogEditor({taskId, user, dispatch}) {
  const [logDesc, setLogDesc] = useState("")

  function handleUpdateLogs() {
    if (logDesc) {
      // setLogText(logDesc)
      setCusLogCreatorId({creatorId: user.id})
      if (logDesc.length > 0) {
        dispatch(createNewLog({taskId, logText: logDesc}))
      }
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
              value = {logDesc}
              onChange={(event) => {setLogDesc(event.target.value)}}
              variant="outlined"
              autoFocus="true"
              defaultValue = {logDesc}
              size="small"
              style={{padding: "9px", marginLeft: 8, width: "55vw"}}
              />
              <Button size="large" variant="contained" style={{marginTop: 20, marginLeft: 10}} onClick={handleUpdateLogs}>
                Post
              </Button>
            </Grid>
        </Grid>
      </Grid>

      <LogsList taskId={taskId}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(LogEditor)