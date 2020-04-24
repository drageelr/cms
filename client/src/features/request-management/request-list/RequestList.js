import React, { useState } from 'react'
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables"
import ChangeFormStatusButton from './ChangeFormStatusButton'
import { Button } from '@material-ui/core'

/**
  The component displays a table of all the requests provided to the CCA. THe CCA admin can view 
  the submission as well as change the status of the form.

  @param {object} requestListData corresponding slice from redux, used to fetch the request data  
*/

const columns = ["Req ID", "Form Title", "Date", "Society", "Form Status", ""]

export function RequestList({requestListData}) {
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

  function handleClick(event) {
    console.log(event.target.value)
  }

  return (
    <MUIDataTable
      title={"Request List"} 
      data={requestListData.formData.map((request, index) => [
        request.formId,
        requestListData.formTitles.map(formList=>{
          return formList.id === request.formId ? formList.title : null
        }),
        request.timestampModified,
        request.userId,
        <ChangeFormStatusButton request={request} index= {index}/>,
        <Button 
          value={request.id}
          type = "button" 
          onClick={handleClick}
          variant="outlined"
        >
          view submission</Button>
      ])} 
      columns={columns} 
      options={options}
    />
  )
}

const mapStateToProps = (state) => ({
  requestListData: state.requestListData
})

export default connect(mapStateToProps)(RequestList)