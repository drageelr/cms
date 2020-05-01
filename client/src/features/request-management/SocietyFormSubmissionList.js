import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Paper} from '@material-ui/core'
import MUIDataTable from "mui-datatables"
import LinearProgress from '@material-ui/core/LinearProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import { deleteFormSubmission } from './requestListSlice'
import { makeStyles } from '@material-ui/core/styles'
import { fetchSocietyList, deleteSubmission } from './submissionListSlice'
import { useHistory } from 'react-router-dom'
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
  
  const columns = ["Submitted Forms", "Last edited", "Progress Bar", "Form Status", " ", " "]
  const classes = useStyles()

  function handleDelete({reqId}) {
    dispatch(deleteSubmission({reqId}))
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

  var rows = submissionListData.formDataList.length
  submissionListData.formDataList.map(form => {
    if (form.id === user.id) {
    rows+=1
  }})

  var data = new Array(rows)
  for (var i = 0; i<data.length; i++) {
    data[i] = new Array(columns.length)
  }

  submissionListData.formDataList.map((submittedForm, index) => {
    let progressVal = selectValue(submittedForm.formStatus)
    var reqId = submittedForm.id
    data[index][0] = submittedForm.title
    data[index][1] = submittedForm.date
    data[index][2] = <LinearProgress 
      value={progressVal}
      thickness={15}  
      style={{color: "yellow"}}
      variant="determinate"
      />
    data[index][3] = submittedForm.formStatus
    data[index][4] = <Button variant="outlined" 
    color="primary" 
    style={{marginRight: -30}}
    onClick={()=>history.push(`/form-viewer/${submittedForm.id}`)}
    >
      View Submission
      </Button>
    data[index][5] = <DeleteIcon onClick={() => handleDelete({reqId})}/> 
  })

  return (
    <div className={classes.submissionListPaper} style={{position: 'absolute', marginLeft: '20%'}}>
      <MUIDataTable
        title={"Event Form Requests"} 
        data={data} 
        columns={columns} 
        options={options}
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  submissionListData: state.submissionListData
})

export default connect(mapStateToProps)(SocietyFormSubmissionView)