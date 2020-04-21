import React from 'react'
import { Button } from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
import {useDispatch} from 'react-redux'
import { setPropertyWindow } from '../propertiesDataSlice'

export default function FormMakerAddButton({type}) {
  const dispatch = useDispatch()
  function viewAddItem(){
    dispatch(setPropertyWindow({propertyType: 'add-item', propertyAddMode: true})) //different property window from edit one
  }

  function viewAddComponent(){
    dispatch(setPropertyWindow({propertyType: 'component', propertyAddMode: true}))
  }

  function viewAddSection(){
    dispatch(setPropertyWindow({propertyType: 'section', propertyAddMode: true}))
  }

  const buttonStyle = {
    cursor: "pointer",
    borderRadius: 3,
    opacity: 0.7,
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