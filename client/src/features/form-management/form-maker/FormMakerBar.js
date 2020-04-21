import React from 'react'
import { Grid, Typography, Box, Button, FormControlLabel, Switch } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import ListIcon from '@material-ui/icons/List'
import {useDispatch} from 'react-redux'
import { setPropertyWindow } from '../propertiesDataSlice'
import { toggleIsPublic } from '../formTemplateSlice'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  propertiesPaper: {
    padding: theme.spacing(2),
  },
}))

export default function FormMakerBar({title, isPublic}) {
  const classes = useStyles()
  const dispatch = useDispatch()

  function viewChecklist(){
    dispatch(setPropertyWindow({propertyType: 'checklist', propertyId: ''}))
  }

  function handleSwitchChange(){
    dispatch(toggleIsPublic())
  }

  return (
    <div className={classes.root}>
      <Paper square variant="outlined" className={classes.propertiesPaper}>
        <Grid container
              direction="row"
              justify="space-between"
              alignItems="center">
              <Grid item>
                <Typography variant="h5">
                  <Box marginLeft={30} fontWeight={600} m={1}>
                    {title}
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
                >Save</Button>
                <Button
                variant="contained"
                style={{marginLeft:10, marginRight: 15}}
                >Cancel</Button>
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
    </div>
  )
}
