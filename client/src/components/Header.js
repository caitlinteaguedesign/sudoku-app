import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import logo from '../img/wordmark.svg';

import UserHandle from './UserHandle';

export default function Header() {
   const isLoggedIn = useSelector(state => state.auth.isAuthenticated);

   return (
      <header className="header">

         <div className="header__container">
            <Link to="/" className="header__logo">
               <img src={logo} alt="Sudoku Maker logo" width="180" height="36" />
            </Link>
            <Link to="/browse" className="link link_style-text">Browse</Link>
            { isLoggedIn && <Link to="/create" className="link link_style-text">Create</Link> }
            { isLoggedIn && <Link to="/dashboard" className="link link_style-text">Dashboard</Link> }
         </div>

         <UserHandle />

      </header>
   )
}