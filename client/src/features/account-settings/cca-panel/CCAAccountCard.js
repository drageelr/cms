import React from 'react'
import AddEditCCADialog from './AddEditCCADialog'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';



const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
  },
  avatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
  },
  credentials: {
      marginLeft: 30,
  }
}));
  

export default function CCAAccountCard() {
  const classes = useStyles();
  // const [expanded, setExpanded] = React.useState(false);
  return (
    <div style = {styles.container}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
          <Avatar aria-label="member" className={classes.avatar} src = "/static/images/avatar/1.jpg"/>
          }
          action={
          <IconButton aria-label="settings"> 
              <MoreVertIcon />
          </IconButton>
          }
          title="Hamza Farooq"
          subheader="hamzafarooq.lums@gmail.com"
        />
        <div className= {classes.credentials}>
          <h1>Hamza Farooq</h1>
        </div>
        <AddEditCCADialog/>
      </Card>
        
    </div>
  )
}


const styles = {
  container: {
    marginBottom: 10,
    marginRight: 10
}
}