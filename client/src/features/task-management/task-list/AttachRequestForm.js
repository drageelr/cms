import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { linkFormToTask } from '../taskDataSlice'
import MUIDataTable from "mui-datatables"
import { Grid, AppBar, Toolbar, IconButton, Typography, Button, Dialog, Slide } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { fetchCCARequestList } from '../../request-management/requestListSlice'
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

export function AttachRequestForm({taskId, requestListData, dispatch}) {

  // fetch the CCA REQUEST LIST SO THAT IT CAN BE USED TO ATTACH A REQUEST TO A REQUEST TASK
  useEffect(() => { 
    dispatch(fetchCCARequestList())
  }, [])

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
      var requestId = rowData[0]
      dispatch(linkFormToTask({taskId, requestId})) // CALL EDIT TASK API
    }
  }

  var data = new Array(requestListData.length)
  for (var i = 0; i<data.length; i++) {
    data[i] = new Array(columns.length)
  }
  requestListData.map((requestObj, index) => {
    data[index][0] = requestObj.id
    data[index][1] = requestObj.title
    data[index][2] = requestObj.date
    data[index][3] = requestObj.society
    data[index][4] = requestObj.status
  })

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
          title={"Request List - Attach a Request to Task"} 
          data={data} 
          columns={columns} 
          options={options}
        />
      </Dialog>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  requestListData: state.requestListData.formDataList
})

export default connect(mapStateToProps)(AttachRequestForm)