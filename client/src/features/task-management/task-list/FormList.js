import React from 'react'
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables"
import {Menu, MenuItem, IconButton, Button, Typography, Box} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { useHistory } from 'react-router-dom'
import { toggleStatus, duplicateForm } from '../formListSlice'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import EditIcon from '@material-ui/icons/Edit'

function FormList({formList, dispatch}) {
  const history = useHistory()

  function MoreButton({index, editAllowed}) {
    const [anchorEl, setAnchorEl] = React.useState(null)
    
    function handleClick(e) {
      setAnchorEl(e.currentTarget)
    }
    
    function handleClose() {
      setAnchorEl(null)
    }

    return (
      <div>
        <IconButton size="small" onClick={handleClick}>
          <MoreVertIcon/>
        </IconButton>
        <Menu
          id="form-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          { editAllowed ? 
          <MenuItem onClick={()=>history.push(`/form-maker/${index}`)}>
            <EditIcon fontSize='small' style={{marginRight: 5}}/>
            Edit Form
          </MenuItem> : null }

          <MenuItem onClick={()=>dispatch(duplicateForm({index}))}>
            <FileCopyIcon fontSize='small' style={{marginRight: 5}}/>
            Duplicate
          </MenuItem>
          
          <MenuItem onClick={()=>dispatch(toggleStatus({index}))}>
            <ToggleOnIcon fontSize='small' style={{marginRight: 5}}/>
            Toggle Status
          </MenuItem>
        </Menu>
      </div>
    )
  }

  function CreateNewFormButton() {
    function handleClick(){
      history.push('/form-maker')
    }

    return (
      <Button onClick={handleClick} startIcon={<AddCircleIcon color="primary"/>} style={{fontSize: 14}}>
        <Typography variant="h6"> 
          <Box fontWeight={600}>
            Create a New Form
          </Box>
        </Typography>
      </Button>
    )
  }
  return (
    <MUIDataTable
    title={<CreateNewFormButton/>} //Button inserted instead of title for form creation
    data={formList.map((form, index) => [
      form.title, 
      form.creatorId, 
      form.timestampModified,
      form.isPublic ? 'Public' : 'Private', 
      <MoreButton index={index} editAllowed={form.isPublic}/>
    ])}
    columns={['Name','Created by','Last edited','Status',{name: 'More', options: {filter: false, sort: false}}]}
    options={{
      print: false,
      searchPlaceholder: 'Search for a Form...',
      rowsPerPage: 6,
      
      onRowsDelete: (rowsDeleted) => {
        for (let dataIndex in rowsDeleted.lookup) {
          console.log(dataIndex)
        }
      }
    }}
  />
  )
}

const mapStateToProps = (state) => ({
  formList: state.formList,
})

export default connect(mapStateToProps)(FormList)