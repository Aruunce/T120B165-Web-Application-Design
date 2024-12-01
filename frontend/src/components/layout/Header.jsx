import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSignOutAlt, 
  faBars, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import '../../style/Header.css';
import { Link } from 'react-router-dom';

const Header = ({ openLogin, openRegister, userRole, onLogout, username }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <h1>Postoria</h1>
      <button className="hamburger-menu" onClick={toggleMobileMenu}>
        <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
      </button>
      <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul>
          <li><a href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
          {userRole === 'admin' && (
            <li>
              <Link 
                to="/users" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="nav-link"
              >
                Users
              </Link>
            </li>
          )}
          {userRole === 'guest' ? (
            <>
              <li><button onClick={() => {
                openLogin();
                setIsMobileMenuOpen(false);
              }}>Login</button></li>
              <li><button onClick={() => {
                openRegister();
                setIsMobileMenuOpen(false);
              }}>Register</button></li>
            </>
          ) : (
            <li className="user-menu">
              <button onClick={toggleDropdown} className="user-icon">
                <FontAwesomeIcon icon={faUser} />
                <span className="username">{username}</span>
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => {
                    onLogout();
                    setDropdownOpen(false);
                    setIsMobileMenuOpen(false);
                  }}>
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;