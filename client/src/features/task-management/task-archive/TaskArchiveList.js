import React from 'react'
import {BrowserRouter as Router, Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import TablePagination from '@material-ui/core/TablePagination'
import {useState} from 'react'
import {connect} from "react-redux"
import { Button } from '@material-ui/core'
import { unArchiveTask } from "../taskDataSlice"

/**   
  
  The archive list is fetched from the redux store and displayed in a table form. The table also provides
  an Unarchive button to unarchive the task.  

  @param {object} taskData slice from redux corresponding to the current component to get the archive list
  @param {function} dispatch redux associated function to pass action creators to the reducer
*/

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const header = [
  'Task Name',
  'Last Modified',
  'Task Status',
  ""
]

export function TaskArchive({taskData, dispatch}) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  function handleChangePage(event, newPage) {
    setPage(newPage)
  }

  function handleUnArchiveClick(event, taskId, ownerId) {
    dispatch(unArchiveTask({taskId, ownerId}))
  }

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Task Archive</h2>
      <TableContainer component={Paper}>
        <Table padding='checkbox' aria-label="simple table">
          <TableHead>
            <TableRow>
              {header.map((title, index) => (
                <TableCell key={`colTitle-${index}`}>
                  <div>
                    {title}
                  </div>
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody >
            {taskData.archiveList.map((eachRow, index) => (
              <TableRow key={eachRow.id}>
                <TableCell component="th" scope="row">{eachRow.id}</TableCell>
                <TableCell>{eachRow.title}</TableCell>
                <TableCell>{eachRow.status}</TableCell>
                <TableCell>
                  <div>
                    <Link to={"/task-manager"}>
                    <Button 
                      disableElevation 
                      href="/task-manager" 
                      color="primary"
                      onClick={(event) => handleUnArchiveClick(event,eachRow.id, eachRow.ownerId)}
                    >
                      Unarchive
                    </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow> 
            ))}
          </TableBody>
        </Table>
        <TablePagination 
          rowsPerPageOptions={[10]} 
          count={taskData.archiveList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData,
})

export default connect(mapStateToProps)(TaskArchive)
