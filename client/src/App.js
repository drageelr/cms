import React, {useState} from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import 'typeface-montserrat'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
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

function App({ user }) {
  const { id, isLoggedIn, userType, name, picture, themeColor, darkMode } = user
  
  document.body.style = darkMode ? 'background: #424242' : 'background: #ffffff' 

  const appTheme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: themeColor !== undefined ? themeColor : '#3578fa',
      },
      secondary: {
        main: '#ffffff',
      },
      text: {
        secondary: darkMode ? '#ffffff': '#6f7eaa'
      }
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


  return (
    <Router>
      <ThemeProvider theme={appTheme}>
        <div>
          { 
            isLoggedIn &&
            <NavBar name={name} userType={userType} picture={picture} 
              darkMode={darkMode} ccaId={id} userThemeColor={themeColor}/>
          }
          <Switch>
            <Route path="/" exact component={isLoggedIn ? (userType === "CCA" ? TaskManager : SocietyDashboard) : LoginPage}/>
            <Route path="/review/:type" component={FormViewer}/>
            <Route path="/form-viewer" exact component={isLoggedIn ? FormViewer : LoginPage}/>
            <Route path="/form-viewer/:mode/:id" component={isLoggedIn ? FormViewer : LoginPage}/>
            <Route path="/change-password" exact component={isLoggedIn ? ChangePassword : LoginPage}/>
            <Route path="/settings" exact component={isLoggedIn ? CCASettingsHome : LoginPage}/>
            <Route path="/request-list" exact component={isLoggedIn ? RequestList : LoginPage}/>
            <Route path="/task-status-panel" exact component={isLoggedIn ? TaskStatusPanel : LoginPage}/>
            <Route path="/cca-panel" exact component={isLoggedIn ? CCAAccountsPanel : LoginPage}/>
            <Route path="/society-panel" exact exact component={isLoggedIn ? SocietyAccountsPanel : LoginPage}/>
            <Route path="/form-maker" exact component={isLoggedIn ? FormMaker : LoginPage}/>
            <Route path="/form-maker/:id" exact component={isLoggedIn ? FormMaker : LoginPage}/>
            <Route path="/forms" exact component={isLoggedIn ? FormList : LoginPage}/>

          </Switch>
        </div>

      </ThemeProvider>
    </Router>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps) (App)