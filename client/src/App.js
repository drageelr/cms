import React from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
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
    primary: {
      main: '#3578fa',
    },
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
  const { isLoggedIn, userType, name, picture } = user

  var userDetails = JSON.parse(localStorage.getItem("localUser"))
  console.log(userDetails)
  
  return (
    <Router>
      <ThemeProvider theme={appTheme}>
        { isLoggedIn ?
        <div>
          <NavBar name={name} userType={userDetails.userType} picture={picture}/>
          <Switch>
            <Route path="/" exact component={userDetails.userType === "CCA" ? TaskManager : SocietyDashboard}/>
            {
              userDetails.userType === "CCA" ? (
                <Route path="/settings" exact component={CCASettingsHome}/>
                ) : (
                  <Route path="/" exact component={SocietyDashboard}/>
                )
            }
            {
              userDetails.userType === "CCA" ? (
                <Route path="/request-list" exact component={RequestList}/>
                ) : (
                  <Route path="/" component={SocietyDashboard}/>
                )
            }
            {
              userDetails.userType === "CCA" ? (
                <Route path="/task-status-panel" exact component={TaskStatusPanel}/>
                ) : (
                  <Route path="/" component={SocietyDashboard}/>
                )
            }
            {
              userDetails.userType === "CCA" ? (
                <Route path="/cca-panel" exact component={CCAAccountsPanel}/>
              ) : (
                <Route path="/" component={SocietyDashboard}/>
              )
            }
            {
              userDetails.userType === "CCA" ? (
                <Route path="/society-panel" exact exact component={SocietyAccountsPanel}/>
              ) : (
                <Route path="/" component={SocietyDashboard}/>
              )
            }
            {
              userDetails.userType === "CCA" ? (
                <Route path="/form-maker" exact component={FormMaker}/>
              ) : (
                <Route path="/" component={SocietyDashboard}/>
              )
            }
            {
              userDetails.userType === "CCA" ? (
                <Route path="/form-maker/:id" exact component={FormMaker}/>
              ) : (
                <Route path="/" component={SocietyDashboard}/>
              )
            }
            {
              userDetails.userType === "CCA" ? (
                <Route path="/forms" exact component={FormList}/>
              ) : (
                <Route path="/" component={SocietyDashboard}/>
              )
            }
            <Route path="/form-viewer" exact component={FormViewer}/>
            <Route path="/form-viewer/:id" component={FormViewer}/>
            <Route path="/change-password" exact component={ChangePassword}/>

            <Route path="*" component={LoginPage}/>

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