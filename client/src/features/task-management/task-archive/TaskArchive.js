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


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const header = [
  'Task Id',
  'Task Name',
  'Task Status',
]

function TaskArchive({taskData, dispatch}) {

  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [unDoArchive, setUnDoArchive] = useState("")
 
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
