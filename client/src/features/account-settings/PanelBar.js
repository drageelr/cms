import React from 'react'
import { Paper, Grid, Button, Typography, Box, makeStyles } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  propertiesPaper: {
    padding: theme.spacing(2),
  },
}))


export default function PanelBar({handleAdd, title, buttonText}){
  const classes = useStyles()

  return <div className={classes.root}>
    <Paper square variant="outlined" className={classes.propertiesPaper}>
      <Grid container direction="row" justify="space-between"alignItems="center">
        <Grid item>
          <Typography variant="h4">
            <Box fontWeight={600} m={1}>
              {title}
            </Box>
          </Typography>
        </Grid>

        <Grid item>
          <Button
            size="large"
            variant="contained" 
            color="primary" 
            spacing= '10' 
            startIcon={<AddCircleIcon/>}
            onClick = {handleAdd}
          > {buttonText}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  </div>
}