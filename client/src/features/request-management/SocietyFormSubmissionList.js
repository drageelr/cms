import React from 'react'
import { connect } from 'react-redux'
import { Button, Paper} from '@material-ui/core'
import MUIDataTable from "mui-datatables"
import LinearProgress from '@material-ui/core/LinearProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import { deleteFormSubmission } from './requestListSlice'
import { makeStyles } from '@material-ui/core/styles'
/**
  The component displays a table of all the forms submitted by the society. The society can view
  the submission, as well as delete ir from their screen.

  @param {string} userId userId is the society user ID. the Id is used to fetch all forms submitted by user
  @param {object} requestListData corresponding slice from redux, used to fetch the forms data  
  @param {function} dispatch redux function which dispatches the delete form action to the reducer  
*/


const useStyles = makeStyles((theme) => ({
  submissionListPaper: {
    height: '90vh',
    width: '80vw',
  }
}))

export function SocietyFormSubmissionView({userId, requestListData, dispatch}) {
  const columns = ["Submitted Forms", "Last edited", "Progress Bar", "Form Status", " ", " "]
  const classes = useStyles()

  function handleDelete({index}) {
    dispatch(deleteFormSubmission(index))
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

  var rows = 0
  requestListData.formData.map(form => {
    if (form.userId === userId) {
    rows+=1
  }})

  var data = new Array(rows)
  for (var i = 0; i<data.length; i++) {
    data[i] = new Array(columns.length)
  }

  requestListData.formData.map((submittedForm, index) => {
    if(submittedForm.userId === userId) {
      requestListData.formTitles.map(formTitle => {
        if(submittedForm.formId === formTitle.id) {
          let progressVal = selectValue(submittedForm.formStatus)
          data[index][0] = formTitle.title
          data[index][1] = submittedForm.timestampModified
          data[index][2] = <LinearProgress 
            value={progressVal}
            thickness={15}
            style={{color: "yellow"}}
            variant="determinate"
            />
          data[index][3] = submittedForm.formStatus
          data[index][4] = <Button variant="outlined" color="primary" style={{marginRight: -30}}>
            View Submission
            </Button>
          data[index][5] = <DeleteIcon onClick={() => handleDelete({index})}/> 
          // pass the request id to delete the submitted form, as a submission is essentially a request, 
          // to delete the form, send the form index to the reducer and t will delete the form object 
          // from the array at that index
        }
      })
    }
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
  userData: state.userData,
  requestListData: state.requestListData
})

export default connect(mapStateToProps)(SocietyFormSubmissionView)