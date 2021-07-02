import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import logo from './img/logo.svg';
import './styles/main.scss';

import Home from './views/Home';
import Browse from './views/Browse';
import Create from './views/Create';

function App() {
  return (
    <Router>
      <header className="header">
        <Link to="/" className="header__logo">
          <img src={logo} alt="logo" width="36" height="36" />
          Sudoku
        </Link>
        <Link to="/browse">Browse</Link>
        <Link to="/create">Create</Link>
      </header>

      <main className="main">
        <Switch>
          <Route path="/browse">
            <Browse />
          </Route>
          <Route path="/create">
            <Create />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
