import React from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, List, MenuItem, Select, 
    InputLabel, makeStyles, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox} from '@material-ui/core'
import { connect } from 'react-redux'
import { addConditionalItemOption, toggleOptionItem } from '../propertiesDataSlice'
import { setItemConditionals } from '../formTemplateSlice'

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
}))


function ConditionalItemDialog({ componentId, items, itemsOrder, dialogOpen, setDialogOpen, conditionalItems, dispatch }) {
  const classes = useStyles()
  const [ currentCItemId, setCurrentCItemId ] = React.useState(-1) // store conditional item id and label selected in local state

  function toggleDialogOpen() {
    setDialogOpen(! dialogOpen)
    setCurrentCItemId(-1)
  }
  
  function handleConditionalItemChange(e){
    const cId = e.target.value
    setCurrentCItemId(cId)

    if (cId !==-1 && items[cId] !== undefined){
      items[cId].options.forEach((_, option_index) => {
        let optionItems = [] //store option items along the way as well
        itemsOrder[componentId].forEach(itemId => {
          if (itemId !==cId) {
            optionItems.push(itemId)
          }
        })
        dispatch(addConditionalItemOption({optionId: option_index, itemIds: optionItems}))
      })
    }
  }
  
  function OptionEffects() {
    return (
      <FormControl component="fieldset">
        {
          (currentCItemId !==-1 && items[currentCItemId] !== undefined) &&
          items[currentCItemId].options.map((option, option_index) => (
            <FormGroup key={option_index}>
              <FormLabel component="legend">If option {option} is selected, show</FormLabel>
              {
                itemsOrder[componentId].map((itemId, index) => (itemId !==currentCItemId) && // only show conditional items (radio / dropdowns)
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        color="primary"
                        checked={ option_index in conditionalItems ? conditionalItems[option_index].includes(itemId) : false } 
                        onChange={() => dispatch(toggleOptionItem({optionId: option_index, itemId}))} 
                        name={itemId} 
                      />
                    }
                    label={items[itemId].label}
                  />  
                )
              }
            </FormGroup>
          ))
        }
          
      </FormControl>
    )
  }
  
  return (
  <Dialog onClose={toggleDialogOpen} aria-labelledby="conditional-item-dialog" open={dialogOpen}>
    <DialogTitle id="conditional-item-dialog-title">Conditional Item Options</DialogTitle>
    <DialogContent>
    <DialogContentText>
      First select the conditional item from the list of component's items you have created. Note: Only a Dropdown or Radio Button group can be selected as a conditional item.
    </DialogContentText>
    <FormControl className={classes.formControl} >
      <InputLabel id="input-conditional-item-label">Select Conditional Item</InputLabel>
      <Select
      labelId="select-conditional-item-label"
      id="select-conditional-item"
      value={currentCItemId}
      onChange={handleConditionalItemChange}
      > 
      {   
        // if the component has items (key componentId in itemsOrder)
        (componentId in itemsOrder)  
        && itemsOrder[componentId].map((itemId, index) => {
          const itemData = items[itemId]
          
          // only show conditional items (radio / dropdowns)
          return (itemData.type==='radio' || itemData.type==='dropdown') 
            && <MenuItem key={index} value={itemId}>{itemData.label}</MenuItem>
        })
      }
      </Select>
    </FormControl>
    <List>
      <OptionEffects/>
    </List>
    </DialogContent>
    <DialogActions>
    <Button onClick={()=> {
      let convertedConditionalItems = []
      for (let [optionId, itemIds] of Object.entries(conditionalItems)) {
        convertedConditionalItems.push({optionId: Number(optionId), itemIds})
      }
      dispatch(setItemConditionals({itemId: currentCItemId, conditionalItems: convertedConditionalItems}))
      toggleDialogOpen()
    }} color="primary">
      Save
    </Button>
    <Button onClick={toggleDialogOpen}>
      Close
    </Button>
    </DialogActions>
  </Dialog>
  )
}


const mapStateToProps = (state) => ({
  itemsOrder: state.formTemplate.itemsOrder,
  items: state.formTemplate.items,
  conditionalItems: state.propertiesData.conditionalItems
})

export default connect(mapStateToProps) (ConditionalItemDialog)