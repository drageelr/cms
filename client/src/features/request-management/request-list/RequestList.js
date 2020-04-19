import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TablePagination from '@material-ui/core/TablePagination'
import { Button } from '@material-ui/core'
import {connect} from "react-redux"
import { changeFormStatus } from "../requestListSlice"

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const header = [
  'ReqId',
  'Form Title',
  'Date',
  'Society',
  'Form Status'
]

function RequestList({requestListData, dispatch}) {

  const classes = useStyles()
  const [status, setStatus] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)
 
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  } 

  function handleChangePage(event, newPage) {
    setPage(newPage)
  }

  function handleOpen() {
    setIsOpen(true)
  }

  function handleClose() {
    setIsOpen(false)
  }

  function handleEditStatus(event) {
    const formTempId = event.target.name
    const formStatus = event.target.value
    setStatus(event.target.value)
    dispatch(changeFormStatus({formTempId, formStatus}))
    return setStatus(event.target.value)
  }

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Request List</h2>
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
            {requestListData.formsOrder.map((row, index) => (
              <TableRow key={requestListData.forms[row].id}>
                <TableCell component="th" scope="row">
                  {requestListData.forms[row].id}
                </TableCell>
                <TableCell>{requestListData.forms[row].formId}</TableCell>
                <TableCell>{requestListData.forms[row].ccaNoteTimestamp}</TableCell>
                <TableCell>{requestListData.forms[row].userId}</TableCell>
                <TableCell>
                  <FormControl className={classes.formControl }>
                    <InputLabel id="label">{requestListData.forms[row].formStatus}</InputLabel>
                    <Select
                      labelId="label"
                      id="select"
                      open={isOpen}
                      onClose={handleClose}
                      onOpen={handleOpen}
                      value={status}
                      name={requestListData.forms[row].id}
                      onChange={handleEditStatus}
                    >
                      <MenuItem value="Pending" name={requestListData.forms[row].id}>Pending</MenuItem>
                      <MenuItem value="Issue" name={requestListData.forms[row].id}>Issue</MenuItem>
                      <MenuItem value="Approved" name={requestListData.forms[row].id}>Approved</MenuItem>
                      <MenuItem value="Rejected" name={requestListData.forms[row].id}>Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                    <div>
                      <Link to={"/form-request"}>
                      <Button 
                        disableElevation 
                        href="/form-request" 
                        color="primary"
                      >
                        view submission
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
            count={requestListData.formsOrder.length}
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
  requestListData: state.requestListData,
})

export default connect(mapStateToProps)(RequestList)
