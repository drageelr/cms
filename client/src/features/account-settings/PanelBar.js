import React from 'react'
import { Paper, Grid, Button, Typography, Box, makeStyles, Fab} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  propertiesPaper: {
    padding: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}))

export default function PanelBar({handleAdd, title, buttonText}){
  const classes = useStyles()

  return <div className={classes.root}>
    <Paper elevation={3} square variant="outlined" className={classes.propertiesPaper} zIndex={10}>
      <Grid container elevation={3} direction="row" justify="space-between"alignItems="center">
        <Grid item elevation={3}>
          <Typography variant="h4" elevation={3}>
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
            // startIcon={<AddCircleIcon/>}
            className={classes.margin}
            onClick = {handleAdd}
          > <AddCircleIcon className={classes.extendedIcon}/> <subtitle1 style={{textSize: 10}}>{buttonText}</subtitle1>
          </Fab>
        </Grid>
      </Grid>
    </Paper>
  </div>
}