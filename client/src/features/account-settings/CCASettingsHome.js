import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Grid, Button, Box, Typography} from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import PersonIcon from '@material-ui/icons/Person'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import bubbles from "./bubbles.png"
import { Paper, makeStyles, Fab} from '@material-ui/core'
import { Spring } from 'react-spring/renderprops';
/**
  The CCASettingsHome constitutes buttons for the following: Change Password, CCA Accounts,
  Society Accounts, and Task Status Panel.
 */
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

export default function CCASettingsHome() {
  const classes = useStyles()
  return (
    <div>
      
      <div className={classes.root}>
        <Paper elevation={3} square variant="outlined" className={classes.propertiesPaper} zIndex={10}>
          <Grid container elevation={3} direction="row" justify="space-between"alignItems="center">
            <Grid item elevation={3}>
              <Typography variant="h4" elevation={3}>
                <Box fontWeight={700}>
                  CCA Settings
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </div>

      
    <Grid container spacing={3}>
    <Spring 
      form = {{opacity: 0, marginTop:-500}}
      to = {{opacity: 1, marginTop: 0}}
      config = {{delay: 1000, duration:1000}}
    >
      {props =>(
          <Grid item sm={3} style = {{marginLeft: 300, props}}>
          <Link to={"/change-password"} style={{ textDecoration: 'none' }}>
            <Box style = {{
              width: 170,
              height: 100,
              backgroundColor: '#EEEEEE',
              border: 30,
              padding: 50,
              margin: 20,
              boxShadow: '100%',
              borderRadius: '10%',
              // backgroundImage: <img src={bubbles}/>,
              backgroundImage: `linear-gradient(to right bottom, #1c67d960, #1c67d9), url(${bubbles})`,
              backgroundPosition:'50%',
              marginRight: 900,
            }}
            > 
            <Typography style = {{color: "#FFFFFF"}} align = "center" variant = 'title'>Change Password</Typography>
            
            </Box>
          </Link>  
        </Grid>
      )}

    </Spring>
              
      <Grid item sm={3}> 
          <Link to={"/cca-panel"} style={{ textDecoration: 'none' }}>
          <Box style = {{
            width: 170,
            height: 100,
            backgroundColor: '#EEEEEE',
            border: 30,
            padding: 50,
            margin: 20,
            boxShadow: '100%',
            borderRadius: '10%',
            backgroundImage: `linear-gradient(to right bottom, #d3279260, #d32792),url(${bubbles})`,
            marginRight: 900,
            
          }}
          > 
          {/* <LockIcon style = {{transform: 1.8}}/> */}
          <Typography style = {{color: "#FFFFFF"}} align = "center" variant = 'title'>CCA Accounts</Typography>
          </Box>
          </Link>
      </Grid>

      <Grid item md={3} style = {{marginLeft: 300}}>
          <Link to={"/society-panel"} style={{ textDecoration: 'none' }}>
          <Box style = {{
            width: 170,
            height: 100,
            backgroundColor: '#EEEEEE',
            border: 30,
            padding: 50,
            margin: 20,
            boxShadow: '100%',
            borderRadius: '10%',
            backgroundImage: `linear-gradient(to right bottom, #df555599, #df5555),url(${bubbles})`,
            marginRight: 900,
          }}
          >
            <Typography style = {{color: "#FFFFFF"}} align = "center" variant = 'title'>Society Accounts</Typography>
          
          </Box>
          
          </Link>
      </Grid>

      <Grid item md={3}> 
          <Link to={"/task-status-panel"} style={{ textDecoration: 'none' }}>
          <Box style = {{
            width: 170,
            height: 100,
            backgroundColor: '#EEEEEE',
            border: 30,
            padding: 50,
            margin: 20,
            boxShadow: '100%',
            borderRadius: '10%',
            backgroundImage: `linear-gradient(to right bottom,#FFC55E60, #e19a1b),url(${bubbles})`,
            marginRight: 900,
          }}
          > <Typography style = {{color: "#FFFFFF"}} align = "center" variant = 'title'>Task Status Panel</Typography>
          </Box>
          
          </Link>
      </Grid>
    </Grid>
    </div>
  )
}