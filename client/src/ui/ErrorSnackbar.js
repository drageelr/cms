import React from 'react'
import {IconButton, Snackbar} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useDispatch } from 'react-redux'

export default function ErrorSnackbar({stateError, clearError}) {
  const dispatch = useDispatch()
  
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
      open={stateError != null}
      autoHideDuration={5000}
      onClose={() => dispatch(clearError())}
      message={stateError}
      action={
      <IconButton size="small" aria-label="close" color="inherit"
      onClick={() => dispatch(clearError())}>
          <CloseIcon fontSize="small" />
      </IconButton>
      }
    />
  )
}
