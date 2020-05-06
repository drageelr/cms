import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, IconButton, Box } from '@material-ui/core'
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

export function SocietyFormSubmissionView({user, submissionListData, dispatch}) {
  const history = useHistory()
  useEffect(() => {
    dispatch(fetchSocietyList())
  }, [])
  
  const statusTypes = ["Approved", "Pending", "Issue"]
  const classes = useStyles()

  function handleDelete(submissionId) {
    dispatch(deleteSubmission(submissionId))
  }
  
  function selectValue(formStatus) {
    if(formStatus == "Approved") {
      return 100
    } else if (formStatus == "Pending") {
      return 50
    } else if (formStatus == "Issue") {
      return 20
    } else {
      return 0
    }
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
        title={"Event Form Requests"} 
        data={
          submissionListData.formDataList.map((submission, _) => [
            <h4>{submission.formTitle}</h4>,
            <Box color="slategray" ><DateRangeIcon style={{marginBottom: -5, marginRight: 4}}/>{simplifyTimestamp(submission.timestampModified)}</Box>,
            <LinearProgress 
            value={selectValue(submission.status)}
            thickness={15}  
            style={{color: "yellow"}}
            variant="determinate"
            />,
            submission.status,
            <Button variant="outlined" 
            color="primary" 
            style={{marginRight: -30}}
            onClick={()=>history.push(`/form-viewer/edit/${submission.submissionId}`)}
            >
              view submission
            </Button>,
            <IconButton onClick={() => handleDelete(submission.submissionId)}>
              <DeleteIcon/>
            </IconButton>
          ])
        } 
        columns={["Submitted Forms", "Last edited", "Progress", "Form Status", "", ""]} 
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
