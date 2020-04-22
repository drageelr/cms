import React from 'react'
import { Grid, Typography, Box, Button, InputBase, IconButton } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import {useDispatch} from 'react-redux'

const useStyles = makeStyles((theme) => ({
  propertiesPaper: {
    padding: theme.spacing(2),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    width: '100%',
  },
  searchIcon: {
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    display: 'flex',
  },
  inputInput: {
    paddingLeft: '2em',
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  primaryIcon: {
    color: theme.palette.primary.main,
  }
}))

export default function FormListBar() {
  const classes = useStyles()
  const dispatch = useDispatch()

  return (
    <div className={classes.root}>
      <Paper square variant="outlined" className={classes.propertiesPaper}>
        <Grid container direction="row" justify="space-between" alignItems="center">

              <Grid item>
                <Button startIcon={<AddCircleIcon className={classes.primaryIcon}/>}>
                  <Typography variant="h6"> 
                    <Box fontWeight={600}>
                      Create a New Form
                    </Box>
                  </Typography>
                </Button>
              </Grid>

              <Grid item>
                <Box className={classes.search}>
                  <Box className={classes.searchIcon}>
                    <SearchIcon />
                  </Box>
                  <InputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    classes={{ root: classes.inputRoot, input: classes.inputInput,}}
                  />
                </Box>
              </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
