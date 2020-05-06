import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import ListAltIcon from '@material-ui/icons/ListAlt'
import EditIcon from '@material-ui/icons/Edit'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import SettingsIcon from '@material-ui/icons/Settings'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import DonutSmallIcon from '@material-ui/icons/DonutSmall'
import LockIcon from '@material-ui/icons/Lock'
import { makeStyles } from '@material-ui/core/styles'
import {AppBar, Toolbar, IconButton, Drawer, Avatar, Typography, Box, Grid, Button, 
  FormControl, FormGroup, FormControlLabel, Switch} from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { logout } from '../features/account-settings/userSlice'


const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    backgroundColor: theme.palette.primary.main,
  },
  roundButton: {
    padding: 18,
    margin: 10,
  },
  appBar: {
    height: 45, 
    // boxShadow: "none", 
    background: theme.palette.type === 'dark' ? 'linear-gradient(to bottom, #424242, #424242)' :'linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(246,246,246,1) 82%,rgba(237,237,237,1) 100%)'
  }
}))

export default function NavBar({name, userType, picture, setDarkMode, darkMode}) {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const dispatch = useDispatch()

  function toggleDrawer() {
    setDrawerOpen(!drawerOpen)
  }

  function handleDarkModeChange() {
    setDarkMode(!darkMode)
  }

  function RoundLinkButton({ link, icon, title }) {
    return (
      <Grid container direction='column' alignItems='center' style={{paddingBottom: 16}}>
        <Grid item xs> 
          <Link to={link}>
            <IconButton color='primary' onClick={toggleDrawer} classes={classes.roundButton} style={{backgroundColor: 'white'}}>
              {icon}
            </IconButton>
          </Link>
        </Grid>
        <Grid item>
          <Typography color='secondary' variant="h6">
            <Box fontSize={12} m={1} marginTop={0.2}>
              {title}
            </Box>
          </Typography>
        </Grid>
      </Grid>
    )
  }

  return (
    <div>
      <AppBar position="static" className={classes.appBar} >
        <Toolbar style={{minHeight: 30}} >
          <Grid container direction='row' justify="space-between" alignItems="center">
            
            <Grid item>
            { userType === "CCA" &&
              <IconButton edge="start" onClick={toggleDrawer} >
                <MenuIcon />
              </IconButton>
              }
            </Grid>
          
            <Grid item style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
              <Grid container>
                <Grid item>
                  <DonutSmallIcon color="primary" fontSize='large' style={{marginTop: 4, paddingRight: 5}}/>
                </Grid>
                <Grid item>
                  <Typography>
                    <Box color="text.primary" fontSize={26} fontWeight={600}>
                      {"CMS"}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item style={{ display: 'flex', alignItems: 'center'}}>
              <Avatar
                style={{margin: 5, width: 35, height: 35}} 
                alt={name} 
                src={picture}
                className={classes.blue}
              />
              <Typography>
                <Box color="text.primary" fontWeight={600} m={1}>
                  {name}
                </Box>
              </Typography>
              {      
              userType==="CCA" ? 
              <Link to='settings'>
                <IconButton edge="end" style={{padding: 10, marginRight: 5}}>
                  <SettingsIcon/>
                </IconButton>
              </Link>
              : <Grid item style={{marginTop: 30}}>
                  <Link to={"/change-password"} style={{ textDecoration: 'none' }}>
                    <IconButton edge="end" style={{padding: 10, marginRight: 5, marginTop: -35}}>
                      <SettingsIcon/>
                    </IconButton>
                  </Link>  
                </Grid>
              }
              <br/>
              <Link to='/'>
                <IconButton  edge="end" style={{padding: 10}} onClick={()=>dispatch(logout())}>
                  <ExitToAppIcon />
                </IconButton>
              </Link>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={toggleDrawer} classes={{paper: classes.drawerPaper}}>
        <br/>
        <br/>
        <br/>
        <Grid container direction="column" justify="space-evenly">
          <Grid item>
            <RoundLinkButton link={'/'} icon={<PlaylistAddCheckIcon fontSize='large'/>} title={'Task Manager'}/>
            <RoundLinkButton link={'/forms'} icon={<EditIcon fontSize='large'/>} title={'Form Maker'}/>
            <RoundLinkButton link={'/request-list'} icon={<ListAltIcon fontSize='large'/>} title={'Request List'}/>
          </Grid>

          <Grid item>
          <FormControlLabel
            style={{marginLeft: 10, color: "white"}}
            control={<Switch color="secondary" size="small" checked={darkMode} onChange={handleDarkModeChange} name="darkMode"/>}
            label="Dark Mode"
          />
          </Grid>
        </Grid>
      </Drawer>
    </div>
  )
}

