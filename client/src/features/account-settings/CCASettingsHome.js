import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Box, Typography} from '@material-ui/core'
import LockIcon from '@material-ui/icons/Lock'
import PersonIcon from '@material-ui/icons/Person'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import { makeStyles, Container, Card } from '@material-ui/core'

/**
  The CCASettingsHome constitutes buttons for the following: Change Password, CCA Accounts,
  Society Accounts, and Task Status Panel.
 */
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  ccaSettingsTitle: {
    padding: theme.spacing(2),
    marginTop: 10,
    color: theme.palette.text.primary
  },
  settingsBoxText: {
    color: theme.palette.secondary.main,
    fontWeight: 500
  }
}))


export default function CCASettingsHome() {
  const classes = useStyles()
  const image = 'https://images.vexels.com/media/users/3/148166/isolated/preview/488f0787445ac3d5e112561829ec5467-abstract-orange-square-background-by-vexels.png'
  // const image = 'https://img.freepik.com/free-vector/abstract-colorful-transparent-polygonal-background_1055-5149.jpg?size=338&ext=jpg'
  function SettingsLinkBox({text, bgImage, link, icon}){
    return(
      <Grid item>
          <Link to={link} style={{ textDecoration: 'none' }}>
            <Card style={{
              width: 150,
              height: 100,
              border: 30,
              padding: 40,
              margin: 20,
              borderRadius: '10%',
              backgroundImage:bgImage,
              backgroundPosition:'50%',
            }}
            > 
            <Box color="secondary.main" style={{ fontSize: 34 }} clone>
              {icon}
            </Box>
            
            <Typography variant='h5' className={classes.settingsBoxText}>
              {text}
            </Typography>
            </Card>
          </Link>
      </Grid>
    )    
  }

  return (
    <Container >
      <Typography variant="h4" className={classes.ccaSettingsTitle}>
        <Box fontWeight={700} textAlign="center">
          CCA Settings
        </Box>
      </Typography>
      
      <Grid container direction="row" justify="center" alignItems="center">

        <SettingsLinkBox 
        text="CCA Accounts" 
        bgImage={`linear-gradient(to bottom, #FF6BAF70, #FF917C), url(${image})`}
        link="/cca-panel"
        icon={<PersonIcon/>}
        />

        <SettingsLinkBox 
        text="Society Accounts" 
        link="/society-panel"
        bgImage={`linear-gradient(to bottom, #FFA40080, #FFC65F),url(${image})`}

        icon={<PeopleAltIcon/>}
        />
      </Grid>

      <Grid container direction="row" justify="center" alignItems="center">
        
        <SettingsLinkBox 
        text="Change Password" 
        link="/change-password"
        bgImage={`linear-gradient(to bottom, #3578FA70, #736BE8),url(${image})`}
        icon={<LockIcon/>}
        />
        
        <SettingsLinkBox 
        text="Task Status Panel" 
        bgImage={`linear-gradient(to bottom, #008A6470, #22C197),url(${image})`}
        link="/task-status-panel"
        icon={<FormatListBulletedIcon/>}
        />
      
      </Grid>
      
    </Container>
  )
}