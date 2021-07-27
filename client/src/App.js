import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import PrivateRoute from './util/PrivateRoute';
import { Provider } from 'react-redux';
import store from './store';

import logo from './img/logo.svg';
import './styles/main.scss';

import Login from './views/Login';
import Register from './views/Register';
import UserHandle from './components/UserHandle';
import Dashboard from './views/Dashboard';
import Browse from './views/Browse';
import Create from './views/Create';

function App() {
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
                    <img src={logo} alt="logo" width="36" height="36" />
                    Sudoku
                  </Link>
                  <Link to="/dashboard" className="link link_style-text">Dashboard</Link>
                  <Link to="/browse" className="link link_style-text">Browse</Link>
                  <Link to="/create" className="link link_style-text">Create</Link>
                </div>

                <UserHandle />

              </header>

              <main className="main">
                <Switch>
                  <Route path="/browse">
                    <Browse />
                  </Route>
                  <Route path="/create">
                    <Create />
                  </Route>
                  <Route path="/dashboard">
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

export default App;