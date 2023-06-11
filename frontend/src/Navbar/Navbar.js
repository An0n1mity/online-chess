import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

import './Navbar.css';

const Navbar = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    console.log("toggleMenu");

    const navbar = document.querySelector('.navbar');
    if (!isMenuOpen) {
      navbar.style.width = '10%';
    } else {
      navbar.style.width = '5%';
    }

    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar" style={{ width: '10%' }}>
      <button className="navbar-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={isMenuOpen ? faCaretLeft : faCaretRight} />
      </button>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img className="logo-img" src={require('../images/logo.jpg')} alt="logo" />
          </Link>
        </div>
        <div className="navbar-buttons">
          <React.Fragment>
            <li>
              <Link className='link' to="/home">
                <button className="home-button">
                  <FontAwesomeIcon className='button-img' icon={faHouse} beat />
                  {isMenuOpen ? <p className='button-text'>Home</p> : ''}
                </button>
              </Link>
              <Link className='link' to="/bots">
                <button className="play-button">
                  <img className="button-img" src={require("../images/play-hand.png")} alt="play" />
                  {isMenuOpen ? <p className='button-text'>Play</p> : ''}
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
