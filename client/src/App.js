import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import 'typeface-montserrat'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'
import NavBar from './ui/NavBar'
import TaskManager from './features/task-management/TaskManager'
import FormViewer from './features/form-management/form-viewer/FormViewer'
import RequestList from './features/request-management/request-list/RequestList'
import LoginPage from './features/account-settings/LoginPage'
import CCASettingsHome from './features/account-settings/CCASettingsHome'


import CCAAccountsPanel from './features/account-settings/cca-panel/CCAAccountsPanel'
import SocietyAccountsPanel from './features/account-settings/SocietyAccountsPanel'
import TaskStatusPanel from './features/account-settings/task-status-panel/TaskStatusPanel'
import ChangePassword from './features/account-settings/ChangePassword'

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
        <div>
          <NavBar/>
          <br />
          <Switch> 
            <Route path="/" exact component={LoginPage}/>
            <Route path="/form-viewer" component={FormViewer}/>
            <Route path="/request-list" component={RequestList}/>
            <Route path="/task-manager" component={TaskManager}/>
            <Route path="/settings" component={CCASettingsHome}/>
            <Route path="/ccapanel" exact component={CCAAccountsPanel}/>
            <Route path="/changepassword" exact component={ChangePassword}/>
            <Route path="/societypanel" exact component={SocietyAccountsPanel}/>
            <Route path="/taskstatuspanel" exact component={TaskStatusPanel}/>          
          </Switch>
        </div>
      </ThemeProvider>
    </Router>
  )
}
