import './App.css';
import './Board.css';
import './Player.css';
import './AuthPage.css';
import React from 'react';
import AuthPage from './AuthPage';
import Landing from './LandingPage';
import Home from './HomePage';
import BotsSelection from './BotSelectionPage';
import Game from './GamePage';

// Routing 
import {
  BrowserRouter as Router,
  Routes,
	Route,
  Navigate,
} from "react-router-dom";


const App = () => {
	return (
	    <Router>
	        <Routes>
				<Route path="/" element={<Landing isAuthenticated={hasToken()} />} />
				<Route path="/login" element={<AuthPage current_view="login" />} />
				<Route path="/signup" element={<AuthPage current_view="signup" />} />
				<Route path='/home' element={hasToken() ? <Home /> : <Navigate to="/login" replace />} />
				<Route path="/bots" element={hasToken() ? <BotsSelection /> : <Navigate to="/login" replace />} />
				<Route path="/game/:gameId" element={hasToken() ? <Game /> : <Navigate to="/login" replace />} />
				<Route path="*" element={< Navigate to="/" replace />} />
			</Routes>
	    </Router>
	);
}

const hasToken = () => {
    const token = localStorage.getItem('token');
    if (token){
	return true;
	}
    else{
	return false;
	}
};

export default App;
