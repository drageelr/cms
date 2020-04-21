import React, {useState} from 'react'
import { Button, TextField, Icon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  FormControl, FormLabel, FormGroup, FormControlLabel, List, Checkbox, MenuItem, Select, InputLabel} from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { setPropertyWindow } from '../propertiesDataSlice'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
}))

export default function ComponentProperties({propertyAddMode, propertyId}){
  const [componentTitle, setComponentTitle] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const classes = useStyles()
  const dispatch = useDispatch()

  function handleChange(e){
    setComponentTitle(e.target.value)
  }
    
  function saveComponent(e) {
    //TODO: save component action dispatch
    closeProperties()    
  }

  function closeProperties() {
    dispatch(setPropertyWindow({propertyType: '', propertyId: ''}))
  }

  function toggleDialogOpen() {
    setDialogOpen(! dialogOpen)
  }

  function optionEffect() {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">If "Option 1 selected" show</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={false} onChange={toggleDialogOpen} name={"item-2"} />}
            label={"Item 2"}
          />
          <FormControlLabel
            control={<Checkbox checked={false} onChange={toggleDialogOpen} name={"item-3"} />}
            label={"Item 3"}
          />
        </FormGroup>
      </FormControl>
    )
  }

  return (
    
    <div>
      <h5 style={{marginTop: -5, marginBottom: -10, color:"darkgray"}}>ID {propertyId}</h5>
      <TextField required id="component-title" label="Component Title" value={componentTitle} onChange={handleChange}/>
      <Button onClick={toggleDialogOpen} variant="contained" style={{marginTop: 20, padding: 10}} startIcon={<Icon>add</Icon>}>Add Conditional Item</Button>
      <Button onClick={saveComponent} variant="contained" style={{marginTop: 20}}>Save</Button>
      <Button onClick={closeProperties} variant="contained" style={{marginLeft: 10, marginTop: 20}}>Cancel</Button>
      
      <Dialog onClose={toggleDialogOpen} aria-labelledby="conditional-item-dialog" open={dialogOpen}>
        <DialogTitle id="conditional-item-dialog-title">Conditional Item Options - {"Item 1"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            First select the conditional item from the list of component's items you have created. Note: Only a Dropdown or Radio Button group can be selected as a conditional item.
          </DialogContentText>
          <FormControl className={classes.formControl} >
            <InputLabel id="input-conditional-item-label">Select Conditional Item</InputLabel>
            <Select
              labelId="select-conditional-item-label"
              id="select-conditional-item"
              value={""}
              onChange={toggleDialogOpen}
            >
              <MenuItem value={"item-1"}>{"Item 1"}</MenuItem>
              <MenuItem value={"item-2"}>{"Item 2"}</MenuItem>
              <MenuItem value={"item-3"}>{"Item 3"}</MenuItem>
            </Select>
          </FormControl>
          <List>
            {optionEffect()}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialogOpen} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}