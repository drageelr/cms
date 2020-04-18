import React from 'react'
import { Button } from '@material-ui/core'
import Icon from '@material-ui/core/Icon'
import {useDispatch} from 'react-redux'
import { setPropertyType } from '../formMakerSlice'

export default function FormMakerAddButton({type}) {
  const dispatch = useDispatch()
  function addItem(){
    dispatch(setPropertyType({propertyType: 'item'}))
  }

  function addComponent(){
    dispatch(setPropertyType({propertyType: 'component'}))
  }

  function addSection(){

  }

  const buttonStyle = {
    cursor: "pointer",
    borderRadius: 3,
    opacity: 0.6,
    width: 300 
  }

  let clickHandler = addItem
  if (type === 'component'){
    clickHandler = addComponent
  }
  else if (type === 'section'){
    clickHandler = addSection
  }

  return <Button variant='outlined' onClick={clickHandler} style={buttonStyle} startIcon={<Icon >add</Icon>}>add {type}</Button>
}