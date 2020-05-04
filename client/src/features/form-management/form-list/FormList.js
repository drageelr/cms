import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables"
import { Button, Typography, Box, CircularProgress} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { useHistory } from 'react-router-dom'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import ToggleOnIcon from '@material-ui/icons/ToggleOn'
import EditIcon from '@material-ui/icons/Edit'
import MoreButton from '../../../ui/MoreButton'
import ErrorSnackbar from '../../../ui/ErrorSnackbar'
import { deleteForm, changeFormStatus, fetchFormList, clearError } from '../formListSlice'
import { fetchForm, createForm } from '../formTemplateSlice'
import { simplifyTimestamp } from '../../../helpers'

function FormList({formList, dispatch}) {
  const history = useHistory()

  useEffect(() => {
    dispatch(fetchFormList())
  }, [])

  async function duplicateForm(formId) {
    await dispatch(fetchForm(formId))
    dispatch(createForm()) //the form has been loaded to state of the formTemplate, so createForm works with that
    dispatch(fetchFormList())
  }

  function MoreFormOptionsButton({index}) {
    const menusList=[
      {
        text: 'Edit Form',
        icon: <EditIcon/>,
        onClick: ()=>history.push(`/form-maker/${formList.list[index].formId}`),
      },
      {
        text: 'Duplicate',
        icon: <FileCopyIcon/>,
        onClick: ()=> duplicateForm(formList.list[index].formId),
      },
      {
        text: 'Toggle Status',
        icon: <ToggleOnIcon/>,
        onClick: ()=>dispatch(changeFormStatus({formId: formList.list[index].formId, isPublic: !formList.list[index].isPublic, index})),
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
    <div>
      {
        formList.isPending ? <CircularProgress style={{marginLeft: '49vw', marginTop: '40vh'}}/> :  
        <MUIDataTable
        title={<CreateNewFormButton/>} //Button inserted instead of title for form creation
        data={formList.list.map((form, index) => [ //only fetch public forms for society
          form.title, 
          form.creatorName, 
          <Box color="slategray" >{simplifyTimestamp(form.timestampModified, false)}</Box>,,
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
              dispatch(deleteForm(dataIndex))
            }
          }
        }}
      />
      }
      <ErrorSnackbar stateError={formList.error} clearError={clearError}/>
    </div>
  )
}

const mapStateToProps = (state) => ({
  formList: state.formList
})

export default connect(mapStateToProps)(FormList)