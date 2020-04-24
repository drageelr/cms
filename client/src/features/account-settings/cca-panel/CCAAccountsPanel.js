import React from 'react'
import CCAAccountCard from './CCAAccountCard'
import AddEditCCADialog from './AddEditCCADialog'


//material UI
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';


const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
    },
}));

export default function CCAAccountPanel() {
  const classes = useStyles();
  function handleClick(event){
      // event.preventDefault();
      return(
          <AddEditCCADialog/>
      )
  }
  return (
    <div>
      <div style = {styles.addButton}>
        <Fab 
        color="#0004F" 
        aria-label="add" 
        className={classes.margin} 
        variant="extended"
        color="primary"
        >
            <favicon onClick={handleClick}> Add account</favicon>
        </Fab>
      </div>
      <div style = {styles.container}>
      <h1 style = {{textAlign: 'center'}}>CCAAccountPanel</h1>
      <CCAAccountCard/>
      </div>
        
    </div>
  )
}

const styles = {
  container: {
      backgroundColor: "#D3D3D3",
      borderRadius: 3,
      width: '100%',
      padding: 8,
      marginRight: 8
  },
  addButton:{
      marginTop: 10,
      float: 'right' //to move button to extreme right
  }
}