import React from 'react'
import {addCCAAccount} from '../ccaPanelSlice'
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'


function AddEditCCADialog({dispatch}) {
  const [open, setOpen] = React.useState(false); //state to check if dialof box open or close

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSave = ()=> {
    dispatch(addCCAAccount({
      memberName: "zozo khan",
      memberEmail: "zk@lums.edu.pk",
      role: "admin",
      userPicture: "/static/images/avatar/1.jpg"
    }))
    console.log("CCA mem added")
  }
  
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add/Edit Card
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Card Information
        </DialogTitle>
        <DialogContent>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default connect()(AddEditCCADialog)