import React, {useState} from 'react'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import {Grid, IconButton} from '@material-ui/core'
import {useDispatch} from 'react-redux'
import { deleteFormPart } from '../formTemplateSlice'
import { setPropertyWindow } from '../propertiesDataSlice'

export default function EditDeleteBar({renderTitle, type, id, parentId}) {
  const [hovered, setHovered] = useState(false)
  const dispatch = useDispatch()
  
  function handleDeleteFormPart() {
    if (type.substring(0, 4) === 'item'){
      dispatch(deleteFormPart({type:'item', id, parentId}))
    }
    else {
      dispatch(deleteFormPart({type, id, parentId}))
    }
  }

  function handleEditFormPart() {
    dispatch(setPropertyWindow({propertyType: type, propertyAddMode: false, propertyId: id, parentId}))
  }


  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item>
        {renderTitle()}
      </Grid>
      <Grid item onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} style={{padding: 7}}>
        <div style={{visibility: hovered ? 'visible' : 'hidden'}}>
          <IconButton onClick={handleEditFormPart} size='small'>
            <EditIcon fontSize='small'/>
          </IconButton>
          <IconButton onClick={handleDeleteFormPart} size='small'>
            <DeleteIcon fontSize='small'/>
          </IconButton>
        </div>
      </Grid>
    </Grid>
  )
}
