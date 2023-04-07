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
					   <HomeBaseHeaderUserInfo
						   username={userData ? userData.username : "Loading..."}
						   country={userData ? userData.country : "Loading..."}
					   />
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

