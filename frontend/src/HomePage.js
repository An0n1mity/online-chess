import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './HomePage.css';
import ProfilePicture from "./profile_picture.svg";
import axios from 'axios';
import { useState, useEffect } from 'react';

import WorldFlag from 'react-world-flags';

const getUserData = async (token) => {
    try {
	const response = await axios.get('http://localhost:8000/api/user_info', {
	    headers: {
		Authorization: `Token ${token}`
	    }
	});
	return response.data;
	} catch (error) {
	    console.log(error);
	}
};

const getChessStats = async (token) => {
	try {
		const response = await axios.get('http://localhost:8000/api/chess_stats', {
			headers: {
				Authorization: `Token ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

const HomeBaseHeaderUserInfo = ({username, country}) => {
    return (
	<div className="home-base-header-user-info">
	    <img className="home-base-header-user-info-profile-img" src={ProfilePicture} alt="user" />
	    <h1 className="home-base-header-user-info-username">{username}</h1>
			<WorldFlag className="home-base-header-user-info-flag" code={country} />
	</div>
	);
};
	


const HomeBase = () => {
	const [userDataResponse, setUserData] = useState(null);
	const [chessStatsResponse, setChessStats] = useState(null);

    useEffect(() => {
	const fetchData = async () => {
	    const token = localStorage.getItem('token');
		const userDataResponse = await getUserData(token);
		const chessStatsResponse = await getChessStats(token);
		setUserData(userDataResponse);
		setChessStats(chessStatsResponse);
	};
	fetchData();
	}, []);
	       return (
	<div className="home-base-component">
	    <header className="home-base-component-header">
					   <HomeBaseHeaderUserInfo
						   username={userDataResponse ? userDataResponse.username : "Loading..."}
						   country={userDataResponse ? userDataResponse.country : "Loading..."}
					   />
					   {chessStatsResponse && (
						   <div className=".home-chess-stats">
							   <p className="games-played">Games played: {chessStatsResponse.games_played}</p>
							   <p className="games-won">Games won: {chessStatsResponse.games_won}</p>
							   <p className="games-lost">Games lost: {chessStatsResponse.games_lost}</p>
							   <p className="games-drawn">Games drawn: {chessStatsResponse.games_drawn}</p>
							   <p className="elo-rating">Elo rating: {chessStatsResponse.elo_rating}</p>
						   </div>
					   )}
	    </header>
	</div>
	);
};

const Home = () => {
    return (
	<div className="home">
	    <Navbar isAuthenticated={true} />
	    <HomeBase />
	</div>
	);
};

export default Home;

