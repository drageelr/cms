import React from 'react'
import {makeStyles, Paper, TextField, Checkbox, FormControlLabel, MenuItem, FormControl, 
  Radio, RadioGroup, FormLabel, Button, InputLabel, Select } from '@material-ui/core'
import EditDeleteBar from './EditDeleteBar'

export const useStyles = makeStyles((theme) => ({
  itemPaper: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(1),
    paddingTop: 0.3,
    width: '97%',
    height: '100%',
    marginBottom: 10,
  },
  formControl: {
    minWidth: '30%'
  }
}))

/**
  Returns an Item that renders conditionally based on type in item data,
  along with an edit/delete functionality through the EditDeleteBar.

  @param {number} id for the item
  @param {number} parentId for the parent component
  @param {object} data is the data required to render the item (with all possible item options due to multiple types)
*/

export default function Item({id, parentId, data}) {
  const classes = useStyles()
  const {type, label, required, placeHolder, maxLength, fileTypes, options} = data

  function renderItem() { //conditional rendering function based on item type
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
                checked={false}
                color="primary"
                required={required}
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
              style={{display: 'none'}}
              id={`file-${id}`}
              type="file"
              required={required}
            />
            <label htmlFor={`file-${id}`}>
              <Button variant="contained" color="primary" component="span">
                {label}
              </Button>
            </label>
          </div>
        )
      
      case 'radio':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup id={id} required={required}>
              {
                options.map((option, index) => {
                  return (
                    <FormControlLabel value={index} control={<Radio color="primary"/>} label={option} />
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
            <Select id={id} label={label} >
              {
                options.map((option, index) => {
                  return (
                    <MenuItem value={index}>{option}</MenuItem>
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
    <Paper elevation={2} className={classes.itemPaper} style={{paddingBottom: '4%'}}>
      <EditDeleteBar 
      renderTitle={()=><h5></h5>}
      type={'item-'+type}
      id ={id}
      parentId={parentId}
      />
      {renderItem()}
    </Paper>
  )
}
