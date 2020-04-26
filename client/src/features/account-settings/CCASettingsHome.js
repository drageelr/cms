import React from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button} from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import PersonIcon from '@material-ui/icons/Person'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'

export default function CCASettingsHome() {
  return (
    <Grid container direction="column" justify = "space-between" alignItems="center" style = {{fontSize: 20}}>
      <h1>CCA Settings</h1>
      <Grid item style={{marginTop: 30}}>
        <Link to={"/change-password"} style={{ textDecoration: 'none' }}>
          <Button size="large" variant = "contained" startIcon={<LockIcon/>}
          style = {{marginLeft: 10}}> Change Password </Button>
        </Link>  
      </Grid>

      <Grid item style = {{marginTop: 30}}>
          <Link to={"/cca-panel"} style={{ textDecoration: 'none' }}>
            <Button size = "large" variant = "contained" startIcon={<PersonIcon/>}
            style = {{marginLeft: 10}}> CCA Accounts </Button>
          </Link>
      </Grid>

      <Grid item style = {{marginTop: 30}}>
          <Link to={"/society-panel"} style={{ textDecoration: 'none' }}>
            <Button size = "large" variant = "contained" startIcon={<PeopleAltIcon/>}
            style = {{marginLeft: 10}}> Society Accounts </Button>
          </Link>
      </Grid>

      <Grid item style = {{marginTop: 30}}>
          <Link to={"/task-status-panel"} style={{ textDecoration: 'none' }}>
            <Button size = "large" variant = "contained" startIcon={<FormatListBulletedIcon/>}
            style = {{marginLeft: 10}}> Task Status Panel </Button>
          </Link>
      </Grid>
    </Grid>
  )
}