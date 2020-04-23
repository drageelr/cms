import React from 'react'
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables"
import { Button, Typography, Box} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { useHistory } from 'react-router-dom'
import { toggleStatus, duplicateForm } from '../formListSlice'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import EditIcon from '@material-ui/icons/Edit'
import MoreButton from '../../../ui/MoreButton'

function FormList({formList, dispatch}) {
  const history = useHistory()

  function MoreFormOptionsButton({index}) {
    const menusList=[
      {
        text: 'Edit Form',
        icon: <EditIcon/>,
        onClick: ()=>history.push(`/form-maker/${index}`),
      },
      {
        text: 'Duplicate',
        icon: <FileCopyIcon/>,
        onClick: ()=>dispatch(duplicateForm({index})),
      },
      {
        text: 'Toggle Status',
        icon: <ToggleOnIcon/>,
        onClick: ()=>dispatch(toggleStatus({index})),
      }
    ]
    return <MoreButton menusList={menusList}/>
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
      <MoreFormOptionsButton index={index}/>
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