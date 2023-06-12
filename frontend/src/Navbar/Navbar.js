import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

import './Navbar.css';
import { useEffect } from 'react';

const Navbar = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMenuOpen2, setIsMenuOpen2] = useState(true);    

  const toggleMenu = () => {
    console.log("toggleMenu");

    const navbar = document.querySelector('.navbar');
    if (!isMenuOpen) {
      // If window size is less than 600px, set width to 100%
      if (window.innerWidth < 750)
        navbar.style.width = '100%';

      else
        navbar.style.width = '10%';
      navbar.style.backgroundColor = '#272522';


    } else {
      if (window.innerWidth < 750) {
        navbar.style.width = '10%';
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0)';
      }
      else
        navbar.style.width = '5%';

    }

    setIsMenuOpen(!isMenuOpen);
    setIsMenuOpen2(!isMenuOpen2);
    console.log('toggleMenu');
  };

  useEffect(() => {
    toggleMenu();
  }, []);

  return (
    <nav className="navbar">
      <button className="navbar-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={isMenuOpen ? faCaretLeft : faCaretRight} />
      </button>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img className={`logo-img ${isMenuOpen2 ? '' : 'hidden'}`} src={require('../images/logo.jpg')} alt="logo" />
          </Link>
        </div>
        <div className="navbar-buttons">
          <React.Fragment>
            <Link className={`link ${isMenuOpen2 ? '' : 'hidden'}`} to="/home" >
                <button className="home-button">
                  <FontAwesomeIcon className='button-img' icon={faHouse} beat />
                  {isMenuOpen ? <p className='button-text'>Home</p> : ''}
                </button>
              </Link>
            <Link className={`link ${isMenuOpen2 ? '' : 'hidden'}`} to="/bots">
                <button className="play-button">
                  <img className="button-img" src={require("../images/play-hand.png")} alt="play" />
                  {isMenuOpen ? <p className='button-text'>Play</p> : ''}
                </button>
            </Link>
                <Link className={`link ${isMenuOpen2 ? '' : 'hidden'}`} to="/signup">
                    <button className="signup-button"><p>Sign Up</p></button>
                </Link>
                <Link className={`link ${isMenuOpen2 ? '' : 'hidden'}`} to="/login">
                    <button className="login-button"><p>Log In</p></button>
                </Link>
            </React.Fragment>
        </div>
      </div>
    </nav >
  );
};

export default Navbar;
