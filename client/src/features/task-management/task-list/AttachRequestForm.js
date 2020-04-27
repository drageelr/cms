import React, { useState } from 'react'
import { connect } from 'react-redux'
import { linkFormToTask } from '../taskDataSlice'
import MUIDataTable from "mui-datatables"
import { Grid, AppBar, Toolbar, IconButton, Typography, Button, Dialog, Slide } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

/**
  When in a Request Task Edit Dialog, user can link a form to the task, if not already linked.
  Opens a full page dialog with all the latest Requests submitted for the CCA.  

  @param {string} taskId used to add link a selected form to a unique task
  @param {object} requestListData slice of the requestList, used to populate the request list 
  table for the Task Manager 
  @param {function} dispatch dispatch the an acton that links the form to the task 
*/

const columns = ["Req ID", "Form Title", "Date", "Society"]

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export function AttachRequestForm({taskId, requestListData, dispatch}) {

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
      console.log(rowData)
      dispatch(linkFormToTask({taskId, requestId}))
    }
  }

  var data = new Array(requestListData.formData.length)
  for (var i = 0; i<data.length; i++) {
    data[i] = new Array(columns.length)
  }
  requestListData.formData.map((requestObj, index) => {
    requestListData.formTitles.map(titleObj =>{
      if (requestObj.formId === titleObj.id) {
        data[index][0] = requestObj.id
        data[index][1] = titleObj.title
        data[index][2] = requestObj.timeStampModified
        data[index][3] = requestObj.userId
      }
    })
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
          columns={["Req ID", "Form Title", "Date", "Society"]} 
          options={options}
        />
      </Dialog>
    </Grid>
  )
}

const mapStateToProps = (state) => ({
  requestListData: state.requestListData
})

export default connect(mapStateToProps)(AttachRequestForm)