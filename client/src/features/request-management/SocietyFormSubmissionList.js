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

export function SocietyFormSubmissionView({user, submissionListData, dispatch}) {
  const history = useHistory()
  const classes = useStyles()
  useEffect(() => {
    dispatch(fetchSocietyList())
  }, [])
  
  const statusTypes = ["Pending(President)","Issue(President)", "Pending(Patron)", "Issue(Patron)", "Approved(Patron)", 
    "Pending(CCA)", "Issue(CCA)", "Approved(CCA)",  "Write-Up",  "Completed"]

  const statusColors = {
    "Pending(President)": "#F1C231",
    "Issue(President)": "#E24A00",
    "Pending(Patron)": "#F1C231",
    "Issue(Patron)": "#E24A00",
    "Approved(Patron)": "#009D5E",
    "Pending(CCA)": "#F1C231",
    "Issue(CCA)": "#E24A00",
    "Approved(CCA)": "#009D5E",
    "Write-Up": "#E24A00",
    "Completed": "#009D5E",
  }
  
  const numStatuses = statusTypes.length

  function handleDelete(submissionId) {
    dispatch(deleteSubmission(submissionId))
  }

  function selectValue(formStatus) {
    return (statusTypes.indexOf(formStatus) + 1) * 100 / numStatuses
  }  

  const options = {
    searchOpen:false,
    print:false,
    download:false,
    viewColumns:false,
    disableToolbarSelect: true,
    selectableRows:false,
    rowsPerPage: 6
  }

  const columns = [
    {
      name:"Submitted Form",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Typography variant="h5" style={{fontSize: 12, fontWeight: 600}}>
              {value}
            </Typography>
          )
        }
      }
    }, 
    {
      name:"Last edited",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box color="text.secondary" >
              <DateRangeIcon style={{marginBottom: -5, marginRight: 4}}/>
              {value}
            </Box> 
          )
        }
      }
    }, 
    {
      name:"Approval Progress",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <LinearProgress 
            value={value}
            thickness={15}  
            variant="determinate"
            /> 
          )
        }
      }
    },
    {
      name:"Form Status",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box borderRadius={5} color="secondary.main" style={{
              backgroundColor: statusColors[value],
              padding: 5,
              maxWidth: '9vw',
              }}>
              <Typography variant="h5" style={{fontSize: 12, fontWeight: 700}}>
                {value}
              </Typography>
            </Box> 
          )
        }
      }
    }, 
    {
      name:"",
      options: {
        filter: false,
        print: false,
        download: false,
        sort: false
      }
    },
  ]

  return (
    <div className={classes.submissionListPaper} style={{position: 'absolute', marginLeft: '20%'}}>
      <MUIDataTable
        title={"Submissions"} 
        data={
          submissionListData.formDataList.map((submission, index) => [
            submission.formTitle,
            simplifyTimestamp(submission.timestampModified, false),
            selectValue(submission.status),
            submission.status,
            <Button key={index} variant="outlined" 
            color="primary" 
            style={{marginRight: -30}}
            onClick={()=>history.push(`/form-viewer/edit/${submission.submissionId}`)}
            >
              view submission
            </Button>
          ])
        } 
        columns={columns} 
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
