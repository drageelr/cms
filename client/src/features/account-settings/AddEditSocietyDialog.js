import React, {useState }from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Grid, TextField } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'

export default function AddEditSocietyDialog(isOpen) {
  const [open, setOpen] = useState(isOpen)

  const handleClose = () => {
    setOpen(false)
  };

  const handleSubmit = () => {
    alert("Society credentials changed or edited")
  }


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="draggable-dialog-title"
      >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Add-Edit Society Card
      </DialogTitle>

      <DialogContent >
        <Grid container direction = "column" justify = "center" alignItems = "center" style = {{width: 400}}>
          <Grid item style = {{width: 350}}>
              <TextField 
                  variant="outlined"
                  margin = "normal"
                  margin="normal"
                  required
                  label="Society Initial"
                  autoFocus
                > Initial </TextField>
          </Grid>

          <Grid item style = {{width: 350}}>
              <TextField 
                variant="outlined"
                margin = "normal"
                margin="normal"
                required
                label="Society Name"
                > Society Name  </TextField>
          </Grid>

          <Grid item style = {{width: 350}}>
              <TextField
                variant="outlined"
                margin = "normal"
                margin="normal"
                required
                label="Society Email ID"
              > Email ID </TextField>
          </Grid>

          <Grid item style = {{width: 350}}>
              <TextField 
                variant="outlined" 
                margin = "normal"
                required
                label="Password Initial"
                > Password </TextField>
          </Grid>

          <Grid item style = {{width: 350}}>
              <TextField 
              variant="outlined"
              margin = "normal"
              required
              label="President Email Address"
              > President Email Address </TextField>
          </Grid>

          <Grid item style = {{width: 350}}>
            <TextField 
              variant="outlined"
              margin = "normal"
              required
              label="Patron Email Address"              
            > Patron Email Address </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} onSubmit = {handleSubmit} color="primary">
          Add/Edit
        </Button>
      </DialogActions>
    </Dialog>
  )
}