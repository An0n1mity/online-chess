import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
	    <Link to="/">
		<img className="logo-img" src={require('./logo.jpg')} alt="logo" />
	    </Link>
        </div>
        <div className="navbar-buttons">
          <Link to="/play">
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

const OnlineGameBlock = () => {
  return (
      <div className="online-game-block">
	  <div className="online-game-block-board-img">
	    <img className="board-img" src={require("./board.png")} alt="board" />
	  </div>
	  <div className="online-game-block-info">
	    <h1 className="online-game-block-info-title">Play Chess <br/>Online !</h1>
	    <div className="online-game-block-info-buttons">
		<Link to="/play" style={{ textDecoration: 'none' }}>
		    <button className="online-game-block-info-buttons-play-online">
			<div className="online-game-block-info-buttons-play-online-img">
			    <icon className="online-game-block-info-online-icon">🌍</icon>
			</div>
			<div className="online-game-block-info-buttons-play-online-text">
			    <h1 className="online-game-block-info-buttons-play-online-text-title">Play Online</h1>
			    <h2 className="online-game-block-info-buttons-play-online-text-subtitle">Play against the world</h2>
			</div>
		    </button>
		</Link>
		<Link to="/play" style={{ textDecoration: 'none' }}>
		    <button className="online-game-block-info-buttons-play-bots">
			<div className="online-game-block-info-buttons-play-bots-img">
			    <icon className="online-game-block-info-bots-icon">🤖</icon>
			</div>
			<div className="online-game-block-info-buttons-play-bots-text">
			    <h1 className="online-game-block-info-buttons-play-bots-text-title">Play Bots</h1>
			    <h2 className="online-game-block-info-buttons-play-bots-text-subtitle">Play with the computer</h2>
			</div>
		    </button>
		</Link>
		    
	    </div>
	  </div>
      </div>
  );
};

const HomeMainLayout = () => {
  return (
      <div className="home-main-layout">
	<OnlineGameBlock />
      </div>
    );
};

const Home = () => {
  return (
      <div className="home">
	<Navbar />
	<HomeMainLayout />
      </div>
  );
};

export default Home;

