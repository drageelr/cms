import React from 'react'
import { Button } from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
import {useDispatch} from 'react-redux'
import { setPropertyWindow } from '../formMakerSlice'

export default function FormMakerAddButton({type}) {
  const dispatch = useDispatch()
  function viewAddItem(){
    dispatch(setPropertyWindow({propertyType: 'item'}))
  }

  function viewAddComponent(){
    dispatch(setPropertyWindow({propertyType: 'component'}))
  }

  function viewAddSection(){
    dispatch(setPropertyWindow({propertyType: 'section'}))
  }

  const buttonStyle = {
    cursor: "pointer",
    borderRadius: 3,
    opacity: 0.6,
    width: 300 
  }

  let clickHandler = viewAddItem
  switch(type){
    case "component":
      clickHandler = viewAddComponent
      break
    case "section":
      clickHandler = viewAddSection
      break
  }
  
  return <Button variant='outlined' onClick={clickHandler} style={buttonStyle} startIcon={<Icon >add</Icon>}>add {type}</Button>
}