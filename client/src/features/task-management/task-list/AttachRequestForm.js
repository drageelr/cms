import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables"
import { Grid, AppBar, Toolbar, IconButton, Typography, Button, Dialog, Slide, Box } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { fetchCheckList } from '../taskDataSlice'
/**
  When in a Request Task Edit Dialog, user can link a form to the task, if not already linked.
  Opens a full page dialog with all the latest Requests submitted for the CCA.  

  @param {string} taskId used to add link a selected form to a unique task
  @param {object} requestListData slice of the requestList, used to populate the request list 
  table for the Task Manager 
  @param {function} dispatch dispatch the an acton that links the form to the task 
*/

const columns = ["Req ID", "Form Title", "Date", "Society", "Request Status"]

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export function AttachRequestForm({ownerId, formDataList, setSubmissionId, dispatch}) {

  // fetch the CCA REQUEST LIST SO THAT IT CAN BE USED TO ATTACH A REQUEST TO A REQUEST TASK

  const [open, setOpen] = useState(false)

  function handleClickOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
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
    onRowClick : (rowData, rowMeta, dataIndex) => {
      const submissionId = rowData[0]
      setSubmissionId(submissionId)
      dispatch(fetchCheckList({ownerId, submissionId}))
      // const fetchChecklists = await
      // const checklist = unwrapResult(fetchChecklists)
    }
  }

  return (
    <Grid>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Attach a Request Form
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6">
              Request List - Create Request Task
            </Typography>
          </Toolbar>
        </AppBar>
        
        <MUIDataTable
          title={
          <Typography variant="h5">
            <Box fontWeight={600}>
              Request List - Attach a Request to Task
            </Box>
          </Typography>}
          data={
            formDataList.map((request, _) => [
              request.submissionId,
              request.formTitle,
              request.timestampModified,
              request.societyNameInitials,
              request.status
            ])} 
          columns={["Req ID", "Form Title", "Date", "Society", "Form Status"]}
          options={options}
        />
      </Dialog>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  formDataList: state.requestListData.formDataList
})

export default connect(mapStateToProps)(AttachRequestForm)