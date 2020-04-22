import React, {useState} from 'react'
import {makeStyles, Paper, TextField, Checkbox, FormControlLabel, MenuItem, FormControl, Radio,
  RadioGroup, FormLabel, Button, InputLabel, Select } from '@material-ui/core'
import { connect } from 'react-redux'
import { setItemData } from '../formDataSlice'

export const useStyles = makeStyles((theme) => ({
  itemPaper: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(1),
    width: '97%',
    height: '100%',
    marginBottom: 10,
    paddingTop: 10,
  },
  formControl: {
    minWidth: '30%'
  }
}))

function ItemView({id, templateData, itemsData, dispatch}) {
  const classes = useStyles()
  const {type, label, required, placeHolder, maxLength, fileTypes, options} = templateData
  const [localData, setLocalData] = useState(itemsData[id])
  const data = itemsData[id]

  function renderItem() {
    switch (type){
      case 'textbox':
        return (
          <TextField
            id={id}
            label={label}
            placeholder = {placeHolder}
            required = {required}
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            maxLength={maxLength}
            value={localData} //store data locally for text field and update locally onChange
            onChange={(e)=>{setLocalData(e.target.value)}} 
            inputProps={{onBlur:()=>{dispatch(setItemData({id, data: localData}))}}} // only update redux state on blur for performance purposes
          />
        )

      case 'textlabel':
        return (
          <h5 id={id} style={{fontWeight:600}}>
            {label}
          </h5>
        )

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                id={id}
                checked={data}
                color="primary" // override, default color is secondary
                required={required}
                onChange={(e) => {dispatch(setItemData({id, data: e.target.checked}))}}
              />
            }
            label={label}
          />
        )

      case 'file':
        return (
          <div>
            <input
              accept={fileTypes}
              id={`file-${id}`}
              hidden // hide input html since MuiButton html will be used
              type="file"
              required={required}
              onChange={(e) => {dispatch(setItemData({id, data: e.target.files[0].name}))}} //single files only, at the first index in FileList
            />
            <label htmlFor={`file-${id}`}>
              <Button variant="contained"  component="span">
                {label}
              </Button>
              <p>{data}</p>
            </label>
          </div>
        )
      
      case 'radio':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup id={id} required={required} value={data} onChange={(e) => {dispatch(setItemData({id, data: e.target.value}))}}>
              {
                options.map((option, index) => {
                  return (
                    <FormControlLabel value={option} control={<Radio color="primary"/>}  label={option} />
                  )
                })
              }
            </RadioGroup>
          </FormControl>
        )
      
      case 'dropdown':
        return (
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>{label}</InputLabel>
            <Select id={id} label={label} value={data} onChange={(e) => {dispatch(setItemData({id, data: e.target.value}))}}>
              {
                options.map((option, index) => {
                  return (
                    <MenuItem value={option}>{option}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        )

      default:
        return null
    }
  }

  return (
    <Paper elevation={2} className={classes.itemPaper} >
      { renderItem() }
    </Paper>
  )
}

const mapStateToProps = (state) => ({ //needs both the template to render the form and data to populate it in edit submission mode
  itemsData: state.formData.itemsData,
})


export default connect(mapStateToProps) (ItemView)