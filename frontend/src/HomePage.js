import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './HomePage.css';
import ProfilePicture from "./profile_picture.svg";


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

