import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, IconButton, Box, Typography } from '@material-ui/core'
import MUIDataTable from "mui-datatables"
import LinearProgress from '@material-ui/core/LinearProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { makeStyles } from '@material-ui/core/styles'
import { fetchSocietyList, deleteSubmission, clearError } from './submissionListSlice'
import { useHistory } from 'react-router-dom'
import ErrorSnackbar from '../../ui/ErrorSnackbar'
import { simplifyTimestamp } from '../../helpers'

/**
  The component displays a table of all the forms submitted by the society. The society can view
  the submission, as well as delete ir from their screen.
  @param {object} user use is the society object. the Id from it is used to fetch all forms submitted by user
  @param {object} submissionListData corresponding slice from redux, used to fetch the forms data  
  @param {function} dispatch redux function which dispatches the delete form action to the reducer  
*/

const useStyles = makeStyles((theme) => ({
  submissionListPaper: {
    height: '90vh',
    width: '80vw',
  }
}))

function valueToColor(value, shade) {
  var r, g, b = 0
  if(value < 50) {
    r = 255
    g = Math.round(5.1 * value)
  }
  else {
    g = 255
    r = Math.round(510 - 5.10 * value)
  }
  return '#' + ('000000' + (r * 0x10000 + g * 0x100 + b * 0x1).toString(16)).slice(-6)
}

export function SocietyFormSubmissionView({user, submissionListData, dispatch}) {
  const history = useHistory()
  useEffect(() => {
    dispatch(fetchSocietyList())
  }, [])
  
  const statusTypes = ["Pending(President)","Issue(President)", "Pending(Patron)", "Issue(Patron)", "Approved(Patron)", 
    "Pending(CCA)", "Issue(CCA)", "Approved(CCA)",  "Write-Up",  "Completed"]
  const numStatuses = statusTypes.length
  
  const classes = useStyles()

  function handleDelete(submissionId) {
    dispatch(deleteSubmission(submissionId))
  }
  
  function selectValue(formStatus) {
    return (statusTypes.indexOf(formStatus) + 1) * 100 / numStatuses
  }  

  const options = {
    search:false,
    searchOpen:false,
    print:false,
    download:false,
    viewColumns:false,
    filter: false,
    disableToolbarSelect: true,
    selectableRows:false,
  }

  return (
    <div className={classes.submissionListPaper} style={{position: 'absolute', marginLeft: '20%'}}>
      <MUIDataTable
        title={"Submissions"} 
        data={
          submissionListData.formDataList.map((submission, index) => [
            <Typography variant="h5" style={{fontSize: 12, fontWeight: 600}}>
              {submission.formTitle}
            </Typography>,
            <Box color="text.secondary" ><DateRangeIcon style={{marginBottom: -5, marginRight: 4}}/>
              {simplifyTimestamp(submission.timestampModified, false)}
            </Box>,
            <LinearProgress 
            value={selectValue(submission.status)}
            thickness={15}  
            variant="determinate"
            />,
            <Box borderRadius={5} color="secondary.main" style={{
              backgroundColor: valueToColor(selectValue(submission.status)),
              padding: 5
              }}>
              <Typography variant="h5" style={{fontSize: 12, fontWeight: 700}}>
                {submission.status}
              </Typography>
            </Box>,
            <Button variant="outlined" 
            color="primary" 
            style={{marginRight: -30}}
            onClick={()=>history.push(`/form-viewer/edit/${submission.submissionId}`)}
            >
              view submission
            </Button>
          ])
        } 
        columns={["Submitted Form", "Last edited", "Approval Progress", "Form Status", "",]} 
        options={options}
      />
      <ErrorSnackbar stateError={ submissionListData.error } clearError={clearError}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  submissionListData: state.submissionListData
})

export default connect(mapStateToProps)(SocietyFormSubmissionView)
