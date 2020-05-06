import React from 'react'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import {Menu, MenuItem, IconButton} from '@material-ui/core'

export default function MoreButton({menusList, horizontal}) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  
  function handleClick(e) {
    setAnchorEl(e.currentTarget)
  }
    
  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton size="small" onClick={handleClick}>
        {
          (horizontal !== undefined) 
          ? <MoreVertIcon/>
          : <MoreHorizIcon fontSize="large"/>
        }
      </IconButton>
      <Menu
        id="form-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
      {
        menusList.map((menu, index) => {
          
          return <MenuItem key={index} onClick={menu.onClick}>
            { //overriding style and fontSize props to icon passed
              React.cloneElement(menu.icon, {fontSize:'small', style:{marginRight: 5}})
            } 
            {menu.text}
          </MenuItem>
        })
      }
      </Menu>
    </div>
  )
}
