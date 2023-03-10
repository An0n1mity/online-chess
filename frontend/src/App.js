import logo from './logo.svg';
import './App.css';
import './Board.css';
import './Player.css';
import './AuthPage.css';
import React, {Component} from 'react';
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { EvalBar} from "chess-evaluation-bar";
import AuthPage from './AuthPage';
import Landing from './LandingPage';
import Home from './HomePage';

// Routing 
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
// Component to contain the chessboard 

const handleMove = (move) => {

    const csrfToken = getCookie('csrftoken');
    const headers = {
	'Content-Type': 'application/json',
	//'X-CSRFToken': csrfToken,
    };

    fetch('http://127.0.0.1:8000/api/make_move/', {
	method: 'POST',
	headers: headers,
	body: JSON.stringify({move}),
	})
    .then(response => response.json())
    .then(data => {
	console.log('Success:', data);
	})
    .catch((error) => {
	console.error('Error:', error);
	});
};

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

function onDrop(sourceSquare, targetSquare) {
      console.log("From: " + sourceSquare + " To: " + targetSquare);
      // Send message to the server 
      handleMove(sourceSquare + targetSquare);
      return true;
}

function Chessboard_container(props){
    console.log(props.player_color);
    return (
	<div id="chessboard-container">
	    <Chessboard position={"start"} boardOrientation={props.player_color} onPieceDrop={onDrop}/>
	</div>
    );
}

// Player username 
function Player_username(props){
	return (
	<div className="player-username">
	    {props.username}
	</div>
	);
}
// Player rating 
function Player_rating(props){
    return (
	<div className="player-rating">
	({props.rating})
	</div>
	);
}

// Player country flag
function getFlag(country) {
  switch (country) {
    case 'USA':
      return '🇺🇸';
    case 'UK':
      return '🇬🇧';
    case 'France':
      return '🇫🇷';
    case 'Germany':
      return '🇩🇪';
    case 'Japan':
      return '🇯🇵';
 }
}

function Player_flag(props){
    return (
	<div id="player-flag">
	    {getFlag(props.flag)}
	</div>
	);
}

// Component to contain player information 
function Player_info_container({username, rating, country}){
    return (
	<div id="player-info-container">
	    <Player_username username={username}/>
	    <Player_rating rating={rating}/>
	    <Player_flag flag={country}/>
	</div>
	);
}

// Evaluation bar
const EvaluationBar = ({player_color, white_percentage, black_percentage}) => {
    let percentage = 0;
    if (player_color == "white"){
	percentage = white_percentage;
	}
    else if (player_color == "black"){
	percentage = black_percentage;
	}
    console.log(percentage);

     if(player_color == "white"){
      return (
	<div className="evaluation-bar">
	       <div className={`black-bar ${player_color === 'black' ? 'highlighted' : ''}`} style={{ height: `${black_percentage}%` }}>
	  </div>
	  <div className={`white-bar ${player_color === 'white' ? 'highlighted' : ''}`} style={{ height: `${white_percentage}%` }}>
	  <div className="bottom-percentage"><span>{white_percentage}</span></div>
	  </div>
	</div> 
      );
 }
    else{
	return (
	<div className="evaluation-bar">
	  <div className={`white-bar ${player_color === 'white' ? 'highlighted' : ''}`} style={{ height: `${white_percentage}%` }}>
	    <div className="top-percentage"><span>{white_percentage}</span></div>
	  </div>
	  <div className={`black-bar ${player_color === 'black' ? 'highlighted' : ''}`} style={{ height: `${black_percentage}%` }}>
	  </div>
	</div>
	);
	}
};

// Component to contain the game : chessboard, player info, evaluation bar 
function Game_container({player, opponent, evaluation}){
    return (
	<div className="game-container">
	    <div className="board-container">
		<Player_info_container username={opponent.username} rating={opponent.rating} country={opponent.country}/>
		<Chessboard_container player_color={player.color}/>
		<Player_info_container username={player.username} rating={player.rating} country={player.country}/>
	    </div>
	    <div className="evaluation-container">
		<EvaluationBar player_color={player.color} white_percentage={evaluation.white} black_percentage={evaluation.black}/>
	    </div>
	</div>
	);
}

// App contains the chessboard component 
let player_ = {username: "Player", rating: 2000, country: "USA", color: "black"};
let opponent_ = {username: "Opponent", rating: 2000, country: "USA", color: "white"};

const App = () => {
    const isAuthenticated = false;
         /*return (
	<div className="App">
	    <Game_container player={player_} opponent={opponent_} evaluation={{white: 50, black: 50}}/>
	</div>
      );*/
	return (
	    <Router>
	        <Routes>
		    <Route path="/" element={<Landing isAuthenticated={hasToken()}/>}/>
		    <Route path="/login" element={<AuthPage currentView="logIn"/>}/>
		    <Route path="/signup" element={<AuthPage currentView="signUp"/>}/>
		    <Route path='/home' element={<AuthWrapperHome isAuthenticated={isAuthenticated}/>}/>
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
