import React, {useState} from 'react'
import SaveIcon from '@material-ui/icons/Save'
import { Button, TextField } from '@material-ui/core'
import { addSection } from '../formTemplateSlice'
import { useDispatch } from 'react-redux'
import { setPropertyWindow } from '../formMakerSlice'

export default function SectionProperties(){
  const [sectionTitle, setSectionTitle] = useState("")
  const dispatch = useDispatch()

  function handleChange(e){
    setSectionTitle(e.target.value)
  }
    
  function saveSection(e) {
    dispatch(addSection({title: sectionTitle}))
    closeProperties()
  }
  
  function closeProperties() {
    dispatch(setPropertyWindow({propertyType: ''}))
  }

  return (
    
    <div>
      <TextField required id="section-title" label="Section Title" value={sectionTitle} onChange={handleChange}/>
      <Button onClick={saveSection} variant="contained" style={{marginTop: 20}}>Save</Button>
      <Button onClick={closeProperties} variant="contained" style={{marginLeft: 10, marginTop: 20}}>Cancel</Button>
    </div>
  )
}
