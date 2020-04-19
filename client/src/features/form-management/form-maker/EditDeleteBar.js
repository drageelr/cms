import React, {useState} from 'react'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import {Grid, IconButton} from '@material-ui/core'
import {useDispatch} from 'react-redux'
import { deleteFormPart } from '../formTemplateSlice'

export default function EditDeleteBar({renderTitle, type, id}) {
  const [hovered, setHovered] = useState(false)
  const dispatch = useDispatch()

  function toggleHover() {
    setHovered(!hovered)
  }

  function handleDeleteFormPart() {
    dispatch(deleteFormPart({type, id}))
  }

  return (
    <Grid container direction="row" justify="space-between" alignItems="center" >
      <Grid item>
        {renderTitle()}
      </Grid>
      <Grid item onMouseEnter={toggleHover} onMouseLeave={toggleHover} style={{padding: 7}}>
        <div style={{visibility: hovered ? 'visible' : 'hidden'}}>
          <IconButton size='small'>
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
