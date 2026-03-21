import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Logo from "../img/wordmark_checker.svg?react";

import UserHandle from "./UserHandle";

export default function Header(props) {
  const { theme } = props;
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  return (
    <header className={`header header_theme-${theme}`}>
      <div className="header__container">
        <Link to="/" className="header__logo">
          <Logo
            alt="Sudoku Checker logo"
            width="280"
            height="36"
            className="header__logo-icon"
          />
        </Link>

        <div className="header__nav">
          <Link to="/browse" className="link link_style-text">
            Browse
          </Link>
          {isLoggedIn && (
            <Link to="/create" className="link link_style-text">
              Create
            </Link>
          )}
          <Link to="/about" className="link link_style-text">
            About
          </Link>
        </div>
      </div>

      {isLoggedIn && <UserHandle />}
    </header>
  );
}
