import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables"
import { fetchTask } from "../taskDataSlice"
import { CircularProgress, Button} from '@material-ui/core'
import { Link } from 'react-router-dom'

function ArchiveList({ taskData, ccaDetails, dispatch }) {

  function handleUnArchiveClick({event, taskId, ownerId}) {
    console.log(taskId, ownerId)
    dispatch(fetchTask({taskId, ownerId}))
  }

  function UnArchiveButton({taskId, ownerId}) {
    return <Link to={""}>
      <Button 
        disableElevation 
        href="" 
        color="primary"
        onClick={(event) => handleUnArchiveClick({event, taskId, ownerId})}
      >
        Unarchive
      </Button>
    </Link>
  }

  function CCAName(ownerId) {
    return ccaDetails.map(user => {
      if (user.ccaId === ownerId.ownerId) {
        return user.firstName
      }
    })
  }

  return (
    <div>
      {
        taskData.isPending ? <CircularProgress style={{marginLeft: '49vw', marginTop: '40vh'}}/> :  
        <MUIDataTable
          data={ taskData.archiveList.map((archiveObj, index) => {
            if (archiveObj.archive) {
              return [
                archiveObj.taskId,
                archiveObj.ownerId,
                <CCAName ownerId={archiveObj.ownerId}/>,
                archiveObj.updatedAt,
                <UnArchiveButton taskId={archiveObj.taskId} ownerId={archiveObj.ownerId}/>
              ]
            }})
          }
          columns={["Task ID", "Owner ID", "Owner Name", "Last Modified", " "]}
          options={{
            search:false,
            searchOpen:false,
            print:false,
            download:false,
            viewColumns:false,
            filter: false,
            disableToolbarSelect: true,
            selectableRows:false,
            // onRowsDelete: (rowsDeleted) => {
            //   for (let dataIndex in rowsDeleted.lookup) {
            //     dispatch(deleteForm(dataIndex))
            //   }
            // }
          }}
        />
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData,
  ccaDetails: state.ccaDetails.ccaList
})

export default connect(mapStateToProps)(ArchiveList)