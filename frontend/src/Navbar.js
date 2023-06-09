import {Link} from 'react-router-dom';
import './Navbar.css';


const AuthenticatedNavbar = () => {
    return (
	<div className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
	    <Link to="/">
		<img className="logo-img" src={require('./logo.jpg')} alt="logo" />
	    </Link>
        </div>
        <div className="navbar-buttons">
            <Link to="/bots">
            <button className="play-button">
		<img className="play-button-img" src={require("./play-hand.png")} alt="play" />
		Play 
	    </button>
          </Link>
        </div>
      </div>
    </div>
  );
};


const NonAuthenticatedNavbar = () => {
     return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
	    <Link to="/">
		<img className="logo-img" src={require('./logo.jpg')} alt="logo" />
	    </Link>
        </div>
        <div className="navbar-buttons">
             <Link to="/bots">
            <button className="play-button">
		<img className="play-button-img" src={require("./play-hand.png")} alt="play" />
		Play 
	    </button>
          </Link>
          <Link className='signup-link' to="/signup">
            <button className="signup-button">Sign Up</button>
          </Link>
          <Link className='login-link' to="/login">
            <button className="login-button">Log In</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({isAuthenticated}) => {
    return (
	isAuthenticated ? <AuthenticatedNavbar /> : <NonAuthenticatedNavbar />
	);
};

export default Navbar;
