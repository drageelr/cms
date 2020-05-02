import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables"
import ChangeFormStatusSelect from './ChangeFormStatusSelect'
import { Box, Button, LinearProgress, FormControlLabel, Grid, Typography, FormControl, Select, MenuItem, 
  Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core'
import { fetchCCARequestList, clearError } from '../requestListSlice'
import ErrorSnackBar from "../../../ui/ErrorSnackbar"
import { useHistory } from "react-router-dom"
import ListAltIcon from '@material-ui/icons/ListAlt'
import Switch from '@material-ui/core/Switch'
import ChipInput from 'material-ui-chip-input'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers'

/**
  The component displays a table of all the requests provided to the CCA. THe CCA admin can view 
  the submission as well as change the status of the form.

  @param {object} requestListData corresponding slice from redux, used to fetch the request data  
*/

const columns = ["Req ID", "Form Title", "Date", "Society", "Form Status", ""]

export function RequestList({requestListData, dispatch}) {

  useEffect(() => {
    dispatch(fetchCCARequestList()) // by default requests are fetched for the last 1 month only 
  }, [])
  
  const filters = ["1 month", "3 months", "1 year", "Specific Duration"]

  let history = useHistory()
  const [state, setState] = useState({
    completed: false
  })
  const [open, setOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDateDialog, setOpenDateDialog] = useState(false)
  const [monthFilter, setMonthFilter] = useState("1 month")
  const [statusFilter, setStatusFilter] = useState([])
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date('2020-04-01'))
  const [selectedDateTo, setSelectedDateTo] = useState(new Date('2020-05-01'))

  const options = {
    viewColumns:false,
    filter: false,
    disableToolbarSelect: true,
    selectableRows:false,
    customToolbar: () => <CustomFilterBar/>
  }

  function handleDateChangeFrom(date){
    setSelectedDateFrom(date)
  }

  function handleDateChangeTo(date){
    setSelectedDateTo(date)
  }

  function handleDateDialogOpen(){
    setOpenDateDialog(true)
    CustomDatePicker()
  }

  function handleDateDialogClose() {
    setOpenDateDialog(false)
  }

  function handleDialogOpen(){
    setOpenDialog(true)
  }

  function handleDialogClose() {
    setOpenDialog(false)
  }

  function handleAddChip(chip) {
    var newList = statusFilter.push(chip)
    setState(newList)
    console.log(statusFilter)
  }

  function handleDeleteChip(chip,index) {
    var newList = statusFilter.filter(function(obj) {return obj != chip})
    setStatusFilter(newList)
    console.log(statusFilter)
  }

  function handleMonthChange(e) {
    setMonthFilter(e.target.value)
    if(e.target.value === "Specific Duration") {
      handleDateDialogOpen()
    }
  }
  
  function handleOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function handleChange(event) {
    setState({
      ...state, 
      [event.target.name]: event.target.checked 
    })
    dispatch(fetchCCARequestList(state.completed)) // filter only the completed requests
  }
  
  function handleClick(reqId) {
    history.push(`/form-viewer/${reqId}`)
  }

  function CustomFilterBar() {
    return (
      <Grid container direction= "row" justify="space-evenly" style={{marginRight: 0, marginLeft: '10%'}}>
        <Grid item>
          <FormControlLabel // ONLY COMPLETED REQUESTS
            control={<Switch color="primary" size="small" checked={state.completed} onChange={handleChange} name="completed"/>}
            label="Completed Requests Only"
          />
        </Grid>

        <Grid item>
          <FormControl variant="outlined" > {/*FILTER BY MONTHS*/}
            <Select labelId = "filter-month" id="label" open = {open} onClose={handleClose} onOpen={handleOpen} 
              value={monthFilter} style={{height: 30, width: 130}} variant = "outlined" onChange={handleMonthChange}>
              <MenuItem value="None">None</MenuItem>
              {
                filters.map((filterType, index) => <MenuItem key={index} value={filterType}>{filterType}</MenuItem>)
              }
            </Select>
          </FormControl>
        </Grid>

        <Grid item>{/*FILTER BY STATUSES*/}
          <Button variant="outlined" color="default" onClick={handleDialogOpen}> 
            Filter by Status
          </Button>
          <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="status-dialog" aria-describedby="status-dialog-desc"
          >
            <DialogTitle id="status-dialog">{"Filter Requests by Form Statuses"}</DialogTitle>
            <DialogContent>
              <ChipInput
                size="small"
                value={statusFilter}
                onAdd={(chip) => handleAddChip(chip)}
                onDelete={(chip, index) => handleDeleteChip(chip, index)}
                label="Filter by Status"
                allowDuplicates = "false"
                style={{height: "90%", width: "100%"}}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary" autoFocus type="submit">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    )
  }
  
  function CustomDatePicker() {
    return (
      <div>
        <Dialog
          open={openDateDialog}
          onClose={handleDateDialogClose}
          aria-labelledby="status-dialog"
          aria-describedby="status-dialog-desc"
        >
          <DialogTitle id="status-dialog">{"Choose Custom Dates"}</DialogTitle>
          <DialogContent>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container direction="column" justify="center" alignItems="center">
                <KeyboardDatePicker disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" id="date-picker-inline" 
                label="From:" value={selectedDateFrom} onChange={handleDateChangeFrom} KeyboardButtonProps={{'aria-label': 'change date',}}/>
                <KeyboardDatePicker disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" id="date-picker-inline" 
                label="To:" value={selectedDateTo} onChange={handleDateChangeTo} KeyboardButtonProps={{'aria-label': 'change date',}}/>
              </Grid>
            </MuiPickersUtilsProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDateDialogClose} color="primary" autoFocus type="submit">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  return (
    <div>
      {
        requestListData.isPending ? <LinearProgress variant="indeterminate"/> :
        <MUIDataTable
          title={
          <Typography variant="h5">
            <Box fontWeight={600}>
              <ListAltIcon color="primary"/>  Request List
            </Box>
          </Typography>}
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
      <ErrorSnackBar stateError={requestListData.error} clearError={clearError}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  requestListData: state.requestListData
})

export default connect(mapStateToProps)(RequestList)