import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../../style/Header.css';

const Header = ({ openLogin, openRegister, userRole, onLogout, username }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <h1>Postoria</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          {userRole === 'guest' ? (
            <>
              <li><button onClick={openLogin}>Login</button></li>
              <li><button onClick={openRegister}>Register</button></li>
            </>
          ) : (
            <li className="user-menu">
              <button onClick={toggleDropdown} className="user-icon">
                <FontAwesomeIcon icon={faUser} />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <span>{username}</span>
                  <button onClick={() => {
                    onLogout();
                    setDropdownOpen(false);
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