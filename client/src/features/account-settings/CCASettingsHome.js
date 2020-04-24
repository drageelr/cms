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
      <Grid item style = {{marginTop: 30, marginBottom: 30}}>
        <Grid container direction="row" justify = "flex-start" alignItems="center">
          <Grid item>
            <LockIcon/>
          </Grid>
          <Grid item>
            <Link to={"/change-password"}>
            <Button size = "large" variant = "contained" style = {{marginLeft: 10}}> Change Password </Button>
            </Link>  
          </Grid>
        </Grid>

        <Grid item style = {{marginTop: 30, marginBottom: 30}}>
        <Grid container direction="row" justify = "flex-start" alignItems="center">
          <Grid item>
            <PersonIcon/>
          </Grid>
          <Grid item>
            <Link to={"/cca-panel"}>
              <Button size = "large" variant = "contained" style = {{marginLeft: 10}}> CCA Panel </Button>
            </Link>
          </Grid>

          </Grid>
        </Grid>

        <Grid item style = {{marginTop: 30, marginBottom: 30}}>
        <Grid container direction="row" justify = "flex-start" alignItems="center">
          <Grid item>
            <PeopleAltIcon/>
          </Grid>
          <Grid item>
            <Link to={"/society-panel"}>
              <Button size = "large" variant = "contained" style = {{marginLeft: 10}}> Society Panel </Button>
            </Link>
          </Grid>

          </Grid>
        </Grid>

        <Grid item style = {{marginTop: 30, marginBottom: 30}}>
        <Grid container direction="row" justify = "flex-start" alignItems="center">
          <Grid item>
            <FormatListBulletedIcon/>
          </Grid>
          <Grid item>
            <Link to={"/task-status-panel"}>
              <Button size = "large" variant = "contained" style = {{marginLeft: 10}}> Task Status Panel </Button>
            </Link>
          </Grid>

          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}