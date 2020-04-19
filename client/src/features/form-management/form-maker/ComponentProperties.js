import React, {useState} from 'react'
import { Button, TextField } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { setPropertyWindow } from '../formMakerSlice'

export default function ComponentProperties(){
  const [componentTitle, setComponentTitle] = useState("")
  const dispatch = useDispatch()

  function handleChange(e){
    setComponentTitle(e.target.value)
  }
    
  function saveComponent(e) {
    closeProperties()
    
  }


  function closeProperties() {
    dispatch(setPropertyWindow({propertyType: ''}))
  }

  return (
    
    <div>
      <TextField required id="component-title" label="Component Title" value={componentTitle} onChange={handleChange}/>
      <Button onClick={saveComponent} variant="contained" style={{marginTop: 20}}>Save</Button>
      <Button onClick={closeProperties} variant="contained" style={{marginLeft: 10, marginTop: 20}}>Cancel</Button>
    </div>
  )
}
