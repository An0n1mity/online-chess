import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import Navbar from './Navbar';
import { frontend_url, backend_url } from './Url';

const OnlineGameBlock = () => {
  return (
      <div className="online-game-block">
	  <div className="online-game-block-board-img">
			  <img className="board-img" src={backend_url + "/images/board.png/"} alt="board" />
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
				  <Link to="/bots" style={{ textDecoration: 'none' }}>
		    <button className="online-game-block-info-buttons-play-bots">
			<div className="online-game-block-info-buttons-play-bots-img">
			    <icon className="online-game-block-info-bots-icon">🤖</icon>
			</div>
			<div className="online-game-block-info-buttons-play-bots-text">
							  <h1 className="online-game-block-info-buttons-play-bots-text-title">Play &nbsp;&nbsp;Bots&nbsp;&nbsp;</h1>
			    <h2 className="online-game-block-info-buttons-play-bots-text-subtitle">Play with the computer</h2>
			</div>
		    </button>
		</Link>
		    
	    </div>
	  </div>
      </div>
  );
};

const LandingMainLayout = () => {
  return (
      <div className="landing-main-layout">
	<OnlineGameBlock />
      </div>
    );
};

const Landing = ({isAuthenticated}) => {
  return (
      <div className="home">
	<Navbar isAuthenticated={isAuthenticated} />
	<LandingMainLayout />
      </div>
  );
};

export default Landing;

