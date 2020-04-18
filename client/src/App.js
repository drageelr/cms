import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import 'typeface-montserrat'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'
import NavBar from './ui/NavBar'
import TaskManager from './features/task-management/TaskManager'
import FormMaker from './features/form-management/form-maker/FormMaker'
import RequestList from './features/request-management/request-list/RequestList'
import LoginPage from './features/account-settings/LoginPage'
import CCASettingsHome from './features/account-settings/CCASettingsHome'

const appTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      main: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'Montserrat',
    ].join(','),
    fontSize: 12,
  },
})

export default function App() {
  return (
    <Router>
      <ThemeProvider theme={appTheme}>
        <NavBar/>
          <Switch> 
            <Route path="/" exact component={LoginPage}/>
            <Route path="/form-maker" component={FormMaker}/>
            <Route path="/request-list" component={RequestList}/>
            <Route path="/task-manager" component={TaskManager}/>
            <Route path="/settings" component={CCASettingsHome}/>
          </Switch>
      </ThemeProvider>
    </Router>
  )
}
