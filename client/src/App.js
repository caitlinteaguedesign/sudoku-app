import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { setCurrentUser, logoutUser } from './actions/authActions';
import PrivateRoute from './util/PrivateRoute';

import { Provider } from 'react-redux';
import store from './store';

import logo from './img/wordmark.svg';
import './styles/main.scss';

import Login from './views/Login';
import Register from './views/Register';
import UserHandle from './components/UserHandle';
import Dashboard from './views/Dashboard';
import Browse from './views/Browse';
import Create from './views/Create';
import Puzzle from './views/Puzzle';

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
              
              <Route path="/register">
                <Register />
              </Route>

              <Route path="/login">
                <Login />
              </Route>

              <PrivateRoute path="/">
              
                <header className="header">

                  <div className="header__container">
                    <Link to="/" className="header__logo">
                      <img src={logo} alt="Sudoku Maker logo" width="180" height="36" />
                    </Link>
                    <Link to="/browse" className="link link_style-text">Browse</Link>
                    <Link to="/create" className="link link_style-text">Create</Link>
                  </div>

                  <UserHandle />

                </header>

                <main className="main">
                  <Switch>
                    <Route path="/puzzle/:id">
                      <Puzzle />
                    </Route>
                    <Route path="/browse">
                      <Browse />
                    </Route>
                    <Route path="/create">
                      <Create />
                    </Route>
                    <Route path="/">
                      <Dashboard />
                    </Route>
                  </Switch>
                </main>
              </PrivateRoute>

            </Switch>

          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;