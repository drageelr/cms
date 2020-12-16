import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables"
import ChangeFormStatusSelect from './ChangeFormStatusSelect'
import { Box, Button, LinearProgress, FormControlLabel, Grid, Typography, FormControl, Select, MenuItem, 
  Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from '@material-ui/core'
import { fetchCCARequestList, clearError } from '../requestListSlice'
import ErrorSnackBar from "../../../ui/ErrorSnackbar"
import { useHistory } from "react-router-dom"
import DateRangeIcon from '@material-ui/icons/DateRange'
import Switch from '@material-ui/core/Switch'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers'
import Timestamp from 'react-timestamp'

/**
  The component displays a table of all the requests provided to the CCA. THe CCA admin can view 
  the submission as well as change the status of the form.
  @param {object} requestListData corresponding slice from redux, used to fetch the request data  
*/

export function RequestList({requestListData, dispatch}) {
  //hooks
  const theme = useTheme()
  const history = useHistory()

  //constants
  const timeFilterOptions = ["1 month", "3 months", "1 year", "Specific duration"]
  const allStatuses = ["Issue(President)", "Pending(Patron)", "Issue(Patron)", "Approved(Patron)", 
  "Pending(CCA)", "Issue(CCA)", "Approved(CCA)",  "Write-Up",  "Completed"] //all statuses
  const ccaStatuses = ["Pending(CCA)", "Issue(CCA)", "Approved(CCA)",  "Write-Up",  "Completed"] 
  const options = {
    download: false,
    disableToolbarSelect: true,
    selectableRows:false,
    rowsPerPage: 6,
    customToolbar: () => <CustomFilterBar/>
  }
  const columns = [
    "Request ID",
    {
      name:"Form Title",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value
        }
      }
    }, 
    {
      name:"Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box >
              <DateRangeIcon style={{marginBottom: -5, marginRight: 4}}/>
              <Timestamp date={new Date(value)}/>
            </Box>
          )
        }
      }
    },
    "Society",
    {
      name: "Form Status",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          // rowData[0] in tableMeta contains the submissionId
          <ChangeFormStatusSelect 
            submissionId={tableMeta.rowData[0]} 
            value={value}
            updateValue={updateValue}  
          />
        )
      }
    },
    {
      name:"",
      options: {
        filter: false,
        print: false,
        download: false,
        sort: false
      }
    },
  ]

  //local states
  const [open, setOpen] = useState(false)
  const [openDateDialog, setOpenDateDialog] = useState(false)
  const [showAllFilter, setShowAllFilter] = useState(false)
  const [timeFilter, setTimeFilter] = useState("1 month")
  const [dateStart, setDateStart] = useState(new Date())
  const [dateEnd, setDateEnd] = useState(new Date())
  
  
  useEffect(() => {
    const dateUntil = updateDateRange(1)
    console.log(dateUntil)
    dispatch(fetchCCARequestList({
      statusList: ccaStatuses, 
      // timeObj: {
      //   dateStart: dateUntil,
      //   dateEnd: new Date()
      // }
    })) // by default requests are fetched for the last 1 month only 
  }, [])
  

  function updateDateRange(months) {
    const dateToday = new Date()
    let previousMonth = dateToday.getMonth() - months
    let subtractYear = false
    if (previousMonth < 0) {
      previousMonth += 12
      subtractYear = true
    }
    let dateUntil = (new Date(dateToday))
    dateUntil.setMonth(previousMonth)
    if (subtractYear) {
      dateUntil.setFullYear(dateToday.getFullYear() - 1)
    }

    setDateStart(dateUntil)
    setDateEnd(dateToday)
    return dateUntil
  }


  function handleDateChangeFrom(date){
    setDateStart(date)
  }

  function handleDateChangeTo(date){
    setDateEnd(date)
  }

  function handleDateDialogOpen(){
    setOpenDateDialog(true)
  }

  // function handleAddChip(chip) {
  //   var newList = statusFilter.push(chip)
  //   setState(newList)
  // }

  // function handleDeleteChip(chip,index) {
  //   var newList = statusFilter.filter(function(obj) {return obj !==chip})
  //   setStatusFilter(newList)
  // }

  function handleDateDialogClose() {
    setOpenDateDialog(false)
    dispatch(fetchCCARequestList({
      statusList: showAllFilter ? allStatuses : ccaStatuses, 
      // timeObj: {dateStart, dateEnd}
    }))
  }


  function handleShowAllFilterChange(e) {
    setShowAllFilter(e.target.checked)
    dispatch(fetchCCARequestList({
      statusList: e.target.checked ? allStatuses : ccaStatuses, 
      // timeObj: {dateStart, dateEnd}
    }))
  }


  function handleTimeFilterChange(e) {
    const timeFilterValue = e.target.value
    setTimeFilter(timeFilterValue)

    switch (timeFilterValue) {
      case "1 month":
        updateDateRange(1)
        break
      case "3 months": 
        updateDateRange(3)
        break
      case "1 year": 
        updateDateRange(12)
        break
      case "Specific duration":
        handleDateDialogOpen()
        break
      default:
        console.log("Invalid filter option.")
        break
    }
  }
  
  function handleOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  
  function handleClick(reqId) {
    history.push(`/form-viewer/review/${reqId}`)
  }

  function CustomFilterBar() {
    return (
      <Grid container direction= "row" justify="space-evenly" style={{marginLeft: '5%'}}>
        <CustomDatePicker />

        <Typography>
          Only requests with CCA statuses are shown by default.
        </Typography> 
        
        <Grid item>
          <FormControlLabel // ALL REQUESTS
            control={<Switch color="primary" size="small" checked={showAllFilter} onChange={handleShowAllFilterChange} name="show-all-filter"/>}
            label="Show All Requests"
          />
        </Grid>

        <Grid item>
          <FormControl variant="outlined" > {/*FILTER BY MONTHS*/}
            <Select labelId = "filter-month" id="label" open = {open} onClose={handleClose} onOpen={handleOpen} 
              value={timeFilter} style={{height: 30, width: 130}} variant = "outlined" onChange={handleTimeFilterChange}>
              {
                timeFilterOptions.map((filterType, index) => <MenuItem key={index} value={filterType}>{filterType}</MenuItem>)
              }
            </Select>
          </FormControl>
        </Grid>

        {/* 
        <Grid item> //FILTER BY STATUSES
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
              <Button onClick={handleDialogClose} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Grid> 
        */}
      </Grid>
    )
  }
  
  function CustomDatePicker() {
    return (
      <Dialog
        open={openDateDialog}
        onClose={handleDateDialogClose}
        aria-labelledby="status-dialog"
        aria-describedby="status-dialog-desc"
      >
        <DialogTitle id="status-dialog">Choose Custom Dates</DialogTitle>
        <DialogContent>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container direction="column" justify="center" alignItems="center">
              <KeyboardDatePicker disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" id="date-picker-inline" 
              label="From:" value={dateStart} onChange={handleDateChangeFrom} KeyboardButtonProps={{'aria-label': 'change date',}}/>
              <KeyboardDatePicker disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" id="date-picker-inline" 
              label="To:" value={dateEnd} onChange={handleDateChangeTo} KeyboardButtonProps={{'aria-label': 'change date',}}/>
            </Grid>
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDateDialogClose} color="primary" autoFocus type="submit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
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
              Request List
            </Box>
          </Typography>}
          data={
            requestListData.formDataList.map((request, _) => [
              request.submissionId,
              request.formTitle,
              request.timestampModified, //<DateRangeIcon style={{marginBottom: -5, marginRight: 4}}/>
              request.societyNameInitials,
              request.status,
              <Button 
                value={request.submissionId}
                color={theme.palette.type === "light" ? "primary" : "secondary"} 
                type = "button" 
                onClick={() => handleClick(request.submissionId)}
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