import React, {useState} from 'react'
import {makeStyles, Paper, TextField, Checkbox, FormControlLabel, MenuItem, FormControl, Radio,
  RadioGroup, FormLabel, Button, InputLabel, Select } from '@material-ui/core'
import { connect } from 'react-redux'
import { setItemData } from '../formDataSlice'
import { setVisibilities } from '../conditionalViewSlice'

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

function ItemView({id, templateData, itemsData, componentItemIds, inReview, dispatch}) {
  const classes = useStyles()
  const {type, label, required, placeHolder, maxLength, fileTypes, options, conditionalItems} = templateData
  const itemData = itemsData.find(itemData => itemData.itemId == id)
  const initialItemData = {
    textbox: '',
    textlabel: '',
    checkbox: false,
    dropdown: -1,
    radio: -1,
    file: ''
  }
  const data = itemData === undefined ? initialItemData[type] : itemData.data
  const [localData, setLocalData] = useState(data)

  function renderItem() {
    const optionsConv = options !== undefined && options.map((option,index) => ({optionId: index, data: option})) 

    function conditionalChange(e) {
      const optionId = Number(e.target.value)
      dispatch(setItemData({itemId: id, data: optionId}))

      if (optionId in conditionalItems[optionId]) { //item has conditional options setup
        const visibleItems = [id, ...conditionalItems[optionId][optionId]] // items that should be turned on
        // must include itself as well
        
        // get all other items in that component, we have all componentItemIds
        const hiddenItems = componentItemIds.filter(x => !visibleItems.includes(x)) //by array difference using filter
        let newVisibilities = {}
        visibleItems.forEach(vId => newVisibilities[vId] = true)
        hiddenItems.forEach(hId => newVisibilities[hId] = false)
        dispatch(setVisibilities({newVisibilities}))
      }
    }

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
            onChange={(e)=> !inReview && setLocalData(e.target.value)} 
            inputProps={{onBlur:()=>{dispatch(setItemData({itemId: id, data: localData}))}}} // only update redux state on blur for performance purposes
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
                onChange={(e) => !inReview && dispatch(setItemData({itemId: id, data: e.target.checked}))}
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
              onChange={(e) => !inReview && dispatch(setItemData({itemId: id, data: e.target.files[0].name}))} //single files only, at the first index in FileList
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
            <RadioGroup id={id} value={data} onChange={(e) => !inReview && conditionalChange(e)}>
              {
                optionsConv.map((option, index) => {
                  return (
                    <FormControlLabel key={index} value={option.optionId} control={<Radio color="primary"/>}  label={option.data} />
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
            <Select id={id} label={label} value={data} onChange={(e) => !inReview && conditionalChange(e)}>
              {
                optionsConv.map((option, index) => {
                  return (
                    <MenuItem key={index} value={option.optionId}>{option.data}</MenuItem>
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