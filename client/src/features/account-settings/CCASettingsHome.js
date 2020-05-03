import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Grid, Button, Box, Typography} from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import PersonIcon from '@material-ui/icons/Person'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import bubbles from "./bubbles.png"
/**
  The CCASettingsHome constitutes buttons for the following: Change Password, CCA Accounts,
  Society Accounts, and Task Status Panel.
 */

export default function CCASettingsHome() {
  return (
    <div>
    <h1>CCA Settings</h1>
    <Grid container spacing={3}>
      <Grid item sm={3} style = {{marginLeft: 300}}>
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
            backgroundImage: `linear-gradient(to right bottom, #3274f3, #82b4ff70), url(${bubbles})`,
            backgroundPosition:'50%',
            marginRight: 900,
          }}
          > 
          <Typography style = {{color: "#FFFFFF"}} align = "center" variant = 'title'>Change Password</Typography>
          
          </Box>
        </Link>  
      </Grid>
      
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
            backgroundImage: `linear-gradient(to right bottom,#FFC55E, #82b4ff60),url(${bubbles})`,
            marginRight: 900,
            
          }}
          > 
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
            backgroundImage: `linear-gradient(to right bottom, #D669E1, #8C9CEE60),url(${bubbles})`,
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
            backgroundImage: `linear-gradient(to right bottom, #BD4693, #C3BB4D60),url(${bubbles})`,
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