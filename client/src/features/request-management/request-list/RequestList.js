import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables"
import ChangeFormStatusSelect from './ChangeFormStatusSelect'
import { Button, CircularProgress, LinearProgress } from '@material-ui/core'
import { fetchCCARequestList } from '../requestListSlice'
import ErrorSnackBar from "../../../ui/ErrorSnackbar"
import {clearError} from "../../account-settings/userSlice"
import { useHistory } from "react-router-dom"

/**
  The component displays a table of all the requests provided to the CCA. THe CCA admin can view 
  the submission as well as change the status of the form.

  @param {object} requestListData corresponding slice from redux, used to fetch the request data  
*/

const columns = ["Req ID", "Form Title", "Date", "Society", "Form Status", ""]

export function RequestList({requestListData, dispatch}) {

  useEffect(() => {
    dispatch(fetchCCARequestList())
  }, [])
  
  let history = useHistory()

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
  
  function handleClick(reqId) {
    history.push(`/form-viewer/${reqId}`)
  }
  
  return (
    <div>
      {
        requestListData.isPending ? <LinearProgress variant="indeterminate"/> :
        <MUIDataTable
          title={"Request List"} 
          data={
            requestListData.formDataList.map((request, index) => [
              request.id,
              request.title,
              request.date,
              request.society,
              <ChangeFormStatusSelect requestId={request.id} requestStatus={request.formStatus} />,
              <Button 
                value={request.id}
                type = "button" 
                onClick={() => {handleClick(request.id)}}
                variant="outlined"
              >
                view submission
              </Button>
            ])} 
          columns={columns}
          options={options}
        />
      }
      <ErrorSnackBar stateError={requestListData.error}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  requestListData: state.requestListData
})

export default connect(mapStateToProps)(RequestList)