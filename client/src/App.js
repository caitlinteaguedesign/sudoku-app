import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { setCurrentUser, logoutUser } from './actions/authActions';
import PrivateRoute from './util/PrivateRoute';

import { Provider } from 'react-redux';
import store from './store';

import './styles/main.scss';

import About from './views/About';
import Entry from './views/Entry';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Browse from './views/Browse';
import Create from './views/Create';
import Puzzle from './views/Puzzle';
import Settings from './views/Settings';

// check for token
if(localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));

  // check for expired token
  const currentTime = Date.now() / 1000; // milliseconds
  if(decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = './login';
  }
}

class App extends Component {
  render() {

    return (
      <Provider store={store}>
        <Router>
          <div className="app">

            <Switch>

              <Route path={['/register', '/login']}>
                <Entry />
              </Route>

              <Route path={['/', '/browse', '/about', '/puzzle/:id', '/dashboard', '/create', '/dashboard', '/settings']}>

                <Header theme="default" />

                <main className="main">
                  <Switch>
                    <PrivateRoute path="/settings">
                      <Settings />
                    </PrivateRoute>
                    <PrivateRoute path="/create">
                      <Create />
                    </PrivateRoute>
                    <PrivateRoute path="/dashboard">
                      <Dashboard />
                    </PrivateRoute>
                    <Route path="/puzzle/:id">
                      <Puzzle />
                    </Route>
                    <Route path="/about">
                      <About />
                    </Route>
                    <Route path={['/', '/browse']}>
                      <Browse />
                    </Route>
                  </Switch>
                </main>

              </Route>

            </Switch>

          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;