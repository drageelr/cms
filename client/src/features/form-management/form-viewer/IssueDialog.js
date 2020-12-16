import React, {useState} from 'react'
import { Button, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, TextField } from '@material-ui/core'
import { connect } from 'react-redux'
import { changeFormStatus } from '../../request-management/requestListSlice'

function IssueDialog({presOrPat, issueDialogOpen, setIssueDialogOpen, submissionId, dispatch}) {
  const [issue, setIssue] = useState('')

  function handleIssueChange(e){
    setIssue(e.target.value)
  }

  function saveIssue() {
    console.log(presOrPat, " has issue ", issue, " with submission ", submissionId)
    if (presOrPat === "pres") { //president has an issue with the submission
      dispatch(changeFormStatus({submissionId, status: "Issue(President)", issue}))
    }
    else { //for patron
      dispatch(changeFormStatus({submissionId, status: "Issue(Patron)", issue}))
    }
    setIssueDialogOpen(false)
  }
  

  return (      
    <Dialog aria-labelledby="conditional-item-dialog" open={issueDialogOpen}>
      <DialogTitle id="exit-dialog-title">Attach Issue</DialogTitle>
      <DialogContent>
      <DialogContentText>
        <TextField 
        value={issue}
        onChange={handleIssueChange}
        variant="outlined"
        name="issue"
        margin="normal"
        label="Issue"
        required
        multiline
        rows={8}
        fullWidth
        autoFocus
        style={{width: "30vw"}}
        />
      </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button onClick={saveIssue} color="primary">
        Submit
      </Button>
      <Button onClick={()=>setIssueDialogOpen(false)}>
        Close
      </Button>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = (state) => ({
  submissionId: state.formData.id,
})

export default connect(mapStateToProps) (IssueDialog)