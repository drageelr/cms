import React, {useState} from 'react'
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables"
import {Menu, MenuItem, IconButton} from '@material-ui/core'

import MoreVertIcon from '@material-ui/icons/MoreVert'
import { useHistory } from 'react-router-dom'
import { toggleStatus, duplicateForm } from '../formListSlice'

function FormList({formList, dispatch}) {
  const history = useHistory()

  function MoreButton(index) {
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
          <MenuItem onClick={()=>dispatch(duplicateForm(index))}>Duplicate</MenuItem>
          <MenuItem onClick={()=>dispatch(toggleStatus(index))}>Toggle Status</MenuItem>
        </Menu>
      </div>
    )
  }

  return (
    <MUIDataTable
    title={"Form List"}
    data={formList.map((form, index) => 
      [form.title, form.creatorId, form.timestampModified, form.isPublic ? 'Public' : 'Private', <MoreButton index={index}/>])}
    columns={['Name','Created by','Last edited','Status',{name: 'More', options: {filter: false, sort: false}}]}
    options={{
      print: false,
      searchPlaceholder: 'Search for a Form...',
      rowsPerPage: 6,
      onRowClick: (_, rowState) => {
        // history.push(`/form-maker/${rowState.dataIndex}`)
      },
      
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