import React, {useState} from 'react'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import {Grid, IconButton} from '@material-ui/core'
import {useDispatch} from 'react-redux'
import { deleteFormPart, moveFormPart } from '../formTemplateSlice'
import { setPropertyWindow } from '../propertiesDataSlice'

/**
  The EditDeleteBar is present at the top of every Component, Item or Section, used to display their titles
  and an on hover visible Edit/Delete button group to edit them

  @param {object} renderTitle JSX object passed to render the title
  @param {string} type same as propertyType ('section', 'component', ...)
  @param {number} id  id of the section, item or component to which this bar is attached
  @param {number} parentId id of the parent of the attached component
*/

export default function EditDeleteBar({renderTitle, type, id, parentId}) {
  const [hovered, setHovered] = useState(false)
  const dispatch = useDispatch()
  const isItem = type.substring(0, 4) === 'item'

  function handleDeleteFormPart() {
    dispatch(deleteFormPart(isItem ? {type:'item', id, parentId} : {type, id, parentId}))
  }

  function handleEditFormPart() {
    dispatch(setPropertyWindow({propertyType: type, propertyAddMode: false, propertyId: id, parentId}))
  }

  function handleMoveFormPart(offset) {
    dispatch(moveFormPart(isItem ? {type:'item', id, parentId, offset} : {type, id, parentId, offset}))
  }

  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item>
        {renderTitle()}
      </Grid>
      <Grid item onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} style={{padding: 7}}>
        <div style={{visibility: hovered ? 'visible' : 'hidden'}}>
          <IconButton onClick={()=>handleMoveFormPart(-1)} size='small'>
            <ArrowUpwardIcon fontSize='small'/>
          </IconButton>
          <IconButton onClick={()=>handleMoveFormPart(1)} size='small'>
            <ArrowDownwardIcon fontSize='small'/>
          </IconButton>
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
