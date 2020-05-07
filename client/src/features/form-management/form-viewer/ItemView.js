import React, {useState} from 'react'
import {makeStyles, Paper, TextField, Checkbox, FormControlLabel, MenuItem, FormControl, Radio,
  RadioGroup, FormLabel, Button, InputLabel, Select, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import GetAppIcon from '@material-ui/icons/GetApp'
import { setItemData, uploadFile, downloadFile } from '../formDataSlice'
import { setVisibilities } from '../conditionalViewSlice'
import { unwrapResult } from '@reduxjs/toolkit'

export const useStyles = makeStyles((theme) => ({
  itemPaper: {
    // backgroundColor: theme.palette.secondary.main,
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

function ItemView({id, templateData, itemsData, status, submissionId, itemFilledIds, componentItemIds, inReview, dispatch}) {
  const classes = useStyles()
  const {type, label, required, placeHolder, maxLength, fileTypes, options, conditionalItems} = templateData
  const itemData = itemsData.find(itemData => itemData.itemId == id)
  const isDisabled = itemFilledIds.includes(id) // items will be disabled if they were filled 
  // and not disabled if the form has an issue for the society to resolve
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

  function resetConditionalView() {
    const conditionalItemOptionObj = conditionalItems.find(ciObj => ciObj.optionId === data)  
    if (conditionalItemOptionObj !== undefined) {
      const visibleItems = [id, ...conditionalItemOptionObj.itemIds]
      const hiddenItems = componentItemIds.filter(x => !visibleItems.includes(x)) 
      let newVisibilities = {}
      visibleItems.forEach(vId => newVisibilities[vId] = true)
      hiddenItems.forEach(hId => newVisibilities[hId] = false)
      dispatch(setVisibilities({newVisibilities}))
    }
  }

  React.useEffect(() => {
    if (type == 'radio' || type == 'dropdown') {
      resetConditionalView()
    }
  }, [data])
    

  function renderItem() {
    const optionsConv = options !== undefined && options.map((option,index) => ({optionId: index, data: option})) 

    function conditionalChange(e) {
      const optionId = Number(e.target.value)
      dispatch(setItemData({itemId: id, data: optionId}))
    }
    
    

    async function handleFileChange(e){
      if (!inReview) {
        const formData = new FormData();
        console.log(e.target.files[0])
        formData.append("", e.target.files[0], e.target.files[0].name) // create multipart form data
        const uploadFileResult = await dispatch(uploadFile(formData))
        const fileToken = unwrapResult(uploadFileResult)
        dispatch(setItemData({itemId: id, data: fileToken}))
      }
      else { //file downloads in review mode
        dispatch(downloadFile({itemId: id, submissionId, fileName: `s${submissionId}_${label.toLowerCase()}`}))
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
            disabled={isDisabled}
            multiline
            error={localData.length > maxLength}
            helperText={ localData.length > maxLength ? `Max characters exceeded (${maxLength})` : '' }
            rows={3}
            variant="outlined"
            fullWidth
            maxLength={maxLength}
            value={localData} //store data locally for text field and update locally onChange
            onChange={(e)=> !inReview && setLocalData(e.target.value)} 
            inputProps={{onBlur:()=>{
                if (localData.length <= maxLength){
                  dispatch(setItemData({itemId: id, data: localData}))
                }
              } 
            }} // only update redux state on blur for performance purposes
          />
        )

      case 'textlabel':
        return (
          <Typography variant='h5'  id={id} style={{fontWeight:600, fontSize:14}}>
            {label}
          </Typography>
        )

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                id={id}
                disabled={isDisabled}
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
          !inReview ?
          <div>
            <input
              accept={fileTypes}
              id={`file-${id}`}
              hidden // hide input html since MuiButton html will be used
              type="file"
              required={required}
              onChange={handleFileChange} //single files only, at the first index in FileList
            />
            <label htmlFor={`file-${id}`}>
              <Button variant="contained" disabled={isDisabled} component="span" startIcon={<CloudUploadIcon/>}>
                {label}
              </Button>
              <p>{data.length != 0 && `Uploaded File [${data.substr(data.length - 7)}]`}</p>
            </label>
          </div> : 
          <Button variant="contained" onClick={handleFileChange} component="span" startIcon={<GetAppIcon/>}>
            Download File for {`\"${label}\"`}
          </Button>
        )
      
      case 'radio':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup id={id} value={data} onChange={(e) => !inReview && conditionalChange(e)}>
              {
                optionsConv.map((option, index) => {
                  return (
                    <FormControlLabel key={index} disabled={isDisabled} value={option.optionId} control={<Radio color="primary"/>}  label={option.data} />
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
                    <MenuItem key={index} disabled={isDisabled} value={option.optionId}>{option.data}</MenuItem>
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
  submissionId: state.formData.id,
  itemFilledIds: state.formData.itemFilledIds,
  status: state.formData.status
})


export default connect(mapStateToProps) (ItemView)