import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './HomePage.css';
import ProfilePicture from "./profile_picture.svg";
import axios from 'axios';
import { useState, useEffect } from 'react';

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

const HomeBaseHeaderUserInfo = ({username, country}) => {
    return (
	<div className="home-base-header-user-info">
	    <img className="home-base-header-user-info-profile-img" src={ProfilePicture} alt="user" />
	    <h1 className="home-base-header-user-info-username">{username}</h1>
	    <icon className="home-base-header-user-info-country-icon">{country}</icon>
	</div>
	);
};
	

const HomeBase = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
	const fetchData = async () => {
	    const token = localStorage.getItem('token');
	    const data = await getUserData(token);
	    setUserData(data);
	};
	fetchData();
	}, []);
	       return (
	<div className="home-base-component">
	    <header className="home-base-component-header">
		<HomeBaseHeaderUserInfo username="username" country="🇫🇷"/>
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

