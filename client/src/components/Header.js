import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import logo from '../img/wordmark_checker.svg';

import UserHandle from './UserHandle';

export default function Header(props) {
   const { theme } = props;
   const isLoggedIn = useSelector(state => state.auth.isAuthenticated);

   return (
      <header className={`header header_theme-${theme}`}>

         <div className="header__container">
            <Link to="/" className="header__logo">
               <img src={logo} alt="Sudoku Checker logo" width="280" height="36" className="header__logo-icon" />
            </Link>
            <Link to="/browse" className="link link_style-text">Browse</Link>
            <Link to="/about" className="link link_style-text">About</Link>
            { isLoggedIn && <Link to="/create" className="link link_style-text">Create</Link> }
         </div>

         <UserHandle />

      </header>
   )
}