import logo from './logo.svg';
import './App.css';
import './Board.css';
import './Player.css';
import './AuthPage.css';
import React, {Component} from 'react';
import { useState } from "react";
import { Chessboard } from "react-chessboard";
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
  Link,
  Navigate,
} from "react-router-dom";

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== ''){
	const cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++){
	    const cookie = cookies[i].trim();
	    if (cookie.substring(0, name.length + 1) === name + '='){
		cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		break;}
	}
    }
    return cookieValue;
};

const App = () => {
	const isAuthenticated = false;
	return (
	    <Router>
	        <Routes>
				<Route path="/" element={<Landing isAuthenticated={hasToken()} />} />
				<Route path="/login" element={<AuthPage currentView="logIn" />} />
				<Route path="/register" element={<AuthPage currentView="signUp" />} />
				<Route path='/home' element={<AuthWrapperHome isAuthenticated={isAuthenticated} />} />
				<Route path="/bots" element={<BotsSelection />} />
				<Route path="/game/:gameId" element={<Game />} />
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

const AuthWrapperHome = ({isAuthenticated}) => {
    hasToken() ? isAuthenticated = true : isAuthenticated = false;
    return isAuthenticated ? (
	<Home/>
	) : (
	<Navigate to="/login" replace />
	);
};

export default App;
