import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    console.log("toggleMenu");

    const navbar = document.querySelector('.navbar');
    if (!isMenuOpen) {
      navbar.style.width = '15%';
    } else {
      navbar.style.width = '5%';
    }

    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar" style={{ width: '15%' }}>
      <button className="navbar-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={isMenuOpen ? faCaretLeft : faCaretRight} />
      </button>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img className="logo-img" src={require('./logo.jpg')} alt="logo" />
          </Link>
        </div>
        <div className="navbar-buttons">
          <React.Fragment>
            <li>
              <Link className='signup-link' to="/bots">
                <button className="play-button">
                  <img className="play-button-img" src={require("./play-hand.png")} alt="play" />
                  {isMenuOpen ? 'Play' : ''}
                </button>
              </Link>
            </li>
          </React.Fragment>
          {isAuthenticated ? (
            <>
            </>
          ) : (
            <React.Fragment>
              <li>
                  <Link className='signup-link' to="/signup">
                    <button className="signup-button">Sign Up</button>
                  </Link>
                </li>
                <li>
                  <Link className='login-link' to="/login">
                    <button className="login-button">Log In</button>
                  </Link>
              </li>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav >
  );
};

export default Navbar;
