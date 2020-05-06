import React from 'react'
import { Paper, Grid, Button, Typography, Box, makeStyles, Fab, Divider} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  propertiesPaper: {
    padding: theme.spacing(1.5),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}))

export default function PanelBar({handleAdd, title, buttonText}){
  const classes = useStyles()

  return <div className={classes.root}>
      <Grid container direction="row" justify="space-between"alignItems="center" className={classes.propertiesPaper}>
        <Grid item >
          <Typography variant="h4" >
            <Box fontWeight={700}>
              {title}
            </Box>
          </Typography>
        </Grid>

        <Grid item>
          <Fab
            size="medium"
            variant="contained" 
            color="primary" 
            // spacing= '10' 
            startIcon={<AddCircleIcon/>}
            className={classes.margin}
            onClick = {handleAdd}
          > <AddCircleIcon className={classes.extendedIcon}/> <subtitle1 style={{textSize: 10}}>{buttonText}</subtitle1>
          </Fab>
        </Grid>
      </Grid>
      <Divider />

  </div>
}