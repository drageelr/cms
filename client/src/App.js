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
import FormList from './features/form-management/form-list/FormList'
import FormViewer from './features/form-management/form-viewer/FormViewer'
import CCAAccountsPanel from './features/account-settings/CCAAccountsPanel'
import SocietyAccountsPanel from './features/account-settings/SocietyAccountsPanel'
import TaskStatusPanel from './features/account-settings/TaskStatusPanel'
import ChangePassword from './features/account-settings/ChangePassword'
import SocietyDashboard from './ui/SocietyDashboard'
import { connect } from 'react-redux'

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
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        fontSize: 13
      }
    }
  }
})

function App({ user }) {
  const { isLoggedIn, role, nameInitials, name, picture } = user

  return (
    <Router>
      <ThemeProvider theme={appTheme}>
        { isLoggedIn ?
        <div>
          <NavBar nameInitials={nameInitials} name={name} role={role} picture={picture}/>
          <Switch> 
            <Route path="/" exact component={role === "CCA" ? TaskManager : SocietyDashboard}/>
            <Route path="/form-viewer" exact component={FormViewer}/>
            <Route path="/form-viewer/:id" component={FormViewer}/>
            <Route path="/forms" component={FormList}/>
            <Route path="/form-maker" exact component={FormMaker}/>
            <Route path="/form-maker/:id" component={FormMaker}/>
            <Route path="/request-list" component={RequestList}/>
            <Route path="/settings" component={CCASettingsHome}/>
            <Route path="/cca-panel" exact component={CCAAccountsPanel}/>
            <Route path="/change-password" exact component={ChangePassword}/>
            <Route path="/society-panel" exact component={SocietyAccountsPanel}/>
            <Route path="/task-status-panel" exact component={TaskStatusPanel}/>          
          </Switch>
        </div>
        : <LoginPage/>
        }
      </ThemeProvider>
    </Router>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps) (App)