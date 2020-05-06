import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables"
import { fetchTask, unArchiveTask } from "../taskDataSlice"
import { CircularProgress, Button} from '@material-ui/core'
import { Link } from 'react-router-dom'

function ArchiveList({ taskData, ccaDetails, dispatch }) {

  function handleUnArchiveClick({event, taskId, ownerId}) {
    dispatch(fetchTask({taskId, ownerId}))
    dispatch(unArchiveTask({taskId}))
  }

  function UnArchiveButton({taskId, ownerId}) {
    return <Link to={""}>
      <Button 
        disableElevation 
        href="" 
        color="primary"
        variant = "contained"
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
            if (archiveObj.archive === true) {
              return [
                archiveObj.taskId,
                archiveObj.title,
                // archiveObj.ownerId,
                <CCAName ownerId={archiveObj.ownerId}/>,
                archiveObj.updatedAt,
                <UnArchiveButton taskId={archiveObj.taskId} ownerId={archiveObj.ownerId}/>
              ]
            }})
          }
          columns={["Task ID", "Title", "Owner Name", "Last Modified", " "]}
          options={{
            search:false,
            searchOpen:false,
            print:false,
            download:false,
            viewColumns:false,
            filter: false,
            disableToolbarSelect: true,
            selectableRows:false,
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