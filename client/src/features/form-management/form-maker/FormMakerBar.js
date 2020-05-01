import React, {useState} from 'react'
import { Grid, Typography, Box, Button, FormControlLabel, Switch, Dialog, 
  DialogContent, DialogTitle, DialogContentText, DialogActions, IconButton, TextField } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import ListIcon from '@material-ui/icons/List'
import {useDispatch} from 'react-redux'
import { setPropertyWindow } from '../propertiesDataSlice'
import { toggleIsPublic, createForm, editForm } from '../formTemplateSlice'
import EditIcon from '@material-ui/icons/Edit'
import { useHistory } from 'react-router-dom'
import { setTitle } from '../formTemplateSlice'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  propertiesPaper: {
    padding: theme.spacing(2),
  },
}))

/**
  The FormMakerBar constitutes of the Form Title, the Checklist, Save Edits, Exit buttons and the 
  toggle Public/Private status switch on top of the Form Maker.

  @param {string} title for the form
  @param {bool} isPublic status for the form
  @param {bool} createMode edit or delete mode
*/

export default function FormMakerBar({title, isPublic, createMode}) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const [exitDialogOpen, setExitDialogOpen] = useState(false)
  const [titleDialogOpen, setTitleDialogOpen] = useState(false)
  const [localTitle, setLocalTitle] = useState(title)
  
  function viewChecklist(){
    dispatch(setPropertyWindow({propertyType: 'checklist', propertyId: ''}))
  }

  function handleSwitchChange(){
    dispatch(toggleIsPublic())
  }

  function handleTitleChange(e){
    setLocalTitle(e.target.value)
  }

  return (
    <div className={classes.root}>
      <Paper square variant="outlined" className={classes.propertiesPaper}>
        <Grid container direction="row" justify="space-between"alignItems="center">

          <Grid item>
            <Typography variant="h5">
              <Box marginLeft={30} fontWeight={600} m={1}>
                {title}
                <IconButton onClick={()=>setTitleDialogOpen(true)}><EditIcon fontSize="small"/></IconButton>
              </Box>
            </Typography>
          </Grid>

          <Grid item>
            <Button
            variant="contained"
            startIcon={<ListIcon/>}
            onClick={viewChecklist}
            >Checklist</Button>
            
            <Button
            variant="contained"
            startIcon={<SaveIcon />}
            style={{marginLeft:10}}
            onClick={()=> {
              if (createMode){
                dispatch(createForm()).then(()=> {
                  if (!createMode){
                    setTimeout(()=>{
                      history.goBack()
                    }, 3000)
                  }
                })
              }
              else {
                dispatch(editForm())
              }
            }}
            >Save</Button>
            
            <Button
            variant="contained"
            style={{marginLeft:10, marginRight: 15}}
            onClick={()=>setExitDialogOpen(true)}
            >Exit</Button>
            
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={handleSwitchChange}
                  id="is-public"
                  color="primary"
                />
              }
              label={isPublic ? "Public" : "Private"}
            />
          </Grid>
        </Grid>
      </Paper>

      <Dialog aria-labelledby="conditional-item-dialog" open={exitDialogOpen}>
        <DialogTitle id="exit-dialog-title">Exit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to exit? (All unsaved changes will be lost.)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>history.push('/forms')} color="primary">
            Yes
          </Button>
          <Button onClick={()=>setExitDialogOpen(false)}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog aria-labelledby="conditional-item-dialog" open={titleDialogOpen}>
        <DialogTitle id="exit-dialog-title">Edit Title</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField 
                variant="outlined"
                name="formTitle"
                margin="normal"
                required
                label="Form Title"
                onChange={handleTitleChange}
                autoFocus
              > {localTitle} </TextField>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>dispatch(setTitle(localTitle))} color="primary">
            Save
          </Button>
          <Button onClick={()=>setTitleDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
