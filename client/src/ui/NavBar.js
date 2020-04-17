import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from '@material-ui/core/Drawer'
import ListAltIcon from '@material-ui/icons/ListAlt'
import EditIcon from '@material-ui/icons/Edit'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import SettingsIcon from '@material-ui/icons/Settings'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import Avatar from '@material-ui/core/Avatar'
import { blue } from '@material-ui/core/colors'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'


export default function NavBar() {

  const [drawerOpen, setDrawerOpen] = useState(false)
  
  function toggleDrawer() {
    setDrawerOpen(!drawerOpen)
  }

  function RoundLinkButton({ link, icon }) {
    const roundButtonStyle = {
      backgroundColor: blue[500],
      padding: 18,
      margin: 10
    }

    return (
    <Link to={link}>
      <IconButton color="secondary" onClick={toggleDrawer} style={roundButtonStyle}>
        {icon}
      </IconButton>
    </Link>
    )
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleDrawer} >
          <MenuIcon />
        </IconButton>
        <Drawer open={drawerOpen} onClose={toggleDrawer}>
          <br/>
          <br/>
          <br/>
          <RoundLinkButton link={'/'} icon={<VpnKeyIcon/>} />
          <RoundLinkButton link={'/task-manager'} icon={<PlaylistAddCheckIcon/>} />
          <RoundLinkButton link={'/form-viewer'} icon={<EditIcon/>} />
          <RoundLinkButton link={'/request-list'} icon={<ListAltIcon/>} />
        </Drawer>

        <Container style={{
            marginLeft: '75%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
          <Avatar
            style={{margin: 8}} 
            alt="User" 
            src="https://pbs.twimg.com/profile_images/1031129865590898689/AOratooC_400x400.jpg"
          />
          <Typography>
            {"Farrukh Rasool"}
          </Typography>
          <Link to='settings'>
            <IconButton color="secondary" edge="end" style={{padding: 10}}>
              <SettingsIcon/>
            </IconButton>
          </Link>
          <Link to='/'>
            <IconButton color="secondary" edge="end" style={{padding: 10}}>
              <ExitToAppIcon/>
            </IconButton>
          </Link>
        </Container>
      
      </Toolbar>
    </AppBar>
  )
}

