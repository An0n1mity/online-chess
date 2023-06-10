import React from 'react';
import Navbar from './Navbar';
import './HomePage.css';
import ProfilePicture from "./profile_picture.svg";
import axios from 'axios';
import { useState, useEffect } from 'react';

import WorldFlag from 'react-world-flags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { faSquareMinus } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Chessboard } from 'react-chessboard';
import { backend_url } from './Url';

const getUserData = async (token) => {
    try {
		const response = await axios.get(backend_url + '/api/user_info', {
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
		const response = await axios.get(backend_url + '/api/chess_stats', {
			headers: {
				Authorization: `Token ${token}`
			}
		});
		return response.data;
	} catch (error) {
		// If code 401 Unhautorized remove token from local storage and redirect to login page
		if (error.response && error.response.status === 401) {
			localStorage.removeItem('token');
			<Navigate to="/login" replace />
		}
		console.log(error);
	}
};


const HomeBaseHeaderUserInfo = ({username, country}) => {

	const [status, setStatus] = useState(null);
	// button to show status input field
	const [showStatusInput, setShowStatusInput] = useState(false);


	// fetch status from backend
	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem('token');
			const response = await axios.get(backend_url + '/api/user_info', {
				headers: {
					Authorization: `Token ${token}`
				}
			});
			// If code 401 Unhautorized remove token from local storage and redirect to login page
			if (response && response.status === 401) {
				localStorage.removeItem('token');
				<Navigate to="/login" replace />
			}
			setStatus(response.data.status);
		};
		fetchData();
	}, []);

	// handle submit of status input field
	function handleSubmit(event) {
		event.preventDefault();
		// Get the value of the input field
		const status = document.getElementById("status").value;
		// Clear the input field
		document.getElementById("status").value = "";
		setStatus(status);
		// Set the status in the input field
		document.getElementById("status").placeholder = status;
		setShowStatusInput(false);
		// Send the status to the backend
		const token = localStorage.getItem('token');
		const response = axios.post(backend_url + '/api/user_update', {
			status: status
		}, {
			headers: {
				Authorization: `Token ${token}`
			}
		});

		// If code 401 Unhautorized remove token from local storage and redirect to login page
		if (response && response.status === 401) {
			localStorage.removeItem('token');
			<Navigate to="/login" replace />
		}
	}


    return (
	<div className="home-base-header-user-info">
	    <img className="home-base-header-user-info-profile-img" src={ProfilePicture} alt="user" />
			<button className="home-base-header-user-info-edit-profile-img-button"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
			<div className="home-base-header-user-info-block">
				<div className="home-base-header-user-info-username-and-flag">
					<h1 className="home-base-header-user-info-username">{username}</h1>
					<WorldFlag className="home-base-header-user-info-flag" code={country} />
				</div>
				{showStatusInput && (
					<form className='home-base-header-user-info-status' onSubmit={handleSubmit}>
						<input className="home-base-header-user-info-status-input" type="text" id="status" name="status" placeholder="Enter your status here..." />
					</form>
				)}
				{!showStatusInput && (
					<div className="home-base-header-user-info-status">
						<p className="home-base-header-user-info-status-text">{status}</p>
						<i class="fa fa-pencil-square-o" aria-hidden="true" onClick={() => setShowStatusInput(true)}></i>
					</div>
				)}
			</div>
		</div>
	);
};

// Component for the statistics of played chess games
const HomeCompletedGames = () => {

	const [moves, setMoves] = useState(null);
	const [date, setDate] = useState(null);
	// Username of the player
	const [playerTop, setPlayerTop] = useState(null);
	// Color of the player
	const [colorTop, setColorTop] = useState(null);
	// Result of the player
	const [resultTop, setResultTop] = useState(null);
	// Username of the opponent
	const [playerBottom, setPlayerBottom] = useState(null);
	// Color of the opponent
	const [colorBottom, setColorBottom] = useState(null);
	// Result of the opponent
	const [resultBottom, setResultBottom] = useState(null);
	// Completed game array 
	const [completedGames, setCompletedGames] = useState([]);
	// Current selected game index
	const [selectedGameIndex, setSelectedGameIndex] = useState(0);
	// Square color 
	const [squareColor, setSquareColor] = useState(null);
	const [swipeDirection, setSwipeDirection] = useState(null);

	// Fetch completed games
	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem('token');
			const response = await axios.get(backend_url + '/api/user_info', {
				headers: {
					Authorization: `Token ${token}`
				}
			});
			// If code 401 Unhautorized remove token from local storage and redirect to login page
			if (response && response.status === 401) {
				localStorage.removeItem('token');
				<Navigate to="/login" replace />
			}

			setCompletedGames(response.data.games);
			// if no games are played, set the statistics of the last played chess game for testing purposes
			if (response.data.games.length === 0) {
				return;
			}
			// Set the username of the player and the opponent
			setPlayerTop(response.data.username);
			switch (response.data.games[0].bot_difficulty) {
				case 1:
					setPlayerBottom("Novice Knight");
					break;
				case 2:
					setPlayerBottom("Strategic Bishop");
					break;
				case 3:
					setPlayerBottom("Grandmaster Queen");
					break;
			}
			// Set the color of the player and the opponent
			if (response.data.games[0].color === 'w') {
				setColorTop("#ffffff");
				setColorBottom("#565352");
			} else {
				setColorTop("#565352");
				setColorBottom("#ffffff");
			}

			// Set the result of the player and the opponent
			if (response.data.games[0].is_won) {
				setResultTop(1);
				setResultBottom(0);
				setSquareColor("#00ff00");
			} else {
				setResultTop(0);
				setResultBottom(1);
				setSquareColor("#ff0000");
			}

			// Set the number of moves of the game
			setMoves(response.data.games[0].moves);

			// Set date of the game
			setDate(response.data.games[0].start_time.slice(0, 10));

			console.log(completedGames);
		};
		fetchData();
	}, []);

	// Handle click to switch between completed games
	const handleClick = (index) => {
		// check if the index is valid
		if (index < 0 || index >= completedGames.length) {
			return;
		}
		setSelectedGameIndex(index);
		console.log(index);
		// Set the username of the player and the opponent
		switch (completedGames[index].bot_difficulty) {
			case 1:
				setPlayerBottom("Novice Knight");
				break;
			case 2:
				setPlayerBottom("Strategic Bishop");
				break;
			case 3:
				setPlayerBottom("Grandmaster Queen");
				break;
		}
		// Set the color of the player and the opponent
		if (completedGames[index].color === 'w') {
			setColorTop("#ffffff");
			setColorBottom("#565352");
		} else {
			setColorTop("#565352");
			setColorBottom("#ffffff");
		}

		// Set the result of the player and the opponent
		if (completedGames[index].is_won) {
			setResultTop(1);
			setResultBottom(0);
			setSquareColor("#00ff00");
		} else {
			setResultTop(0);
			setResultBottom(1);
			setSquareColor("#ff0000");
		}

		// Set the number of moves of the game
		setMoves(completedGames[index].moves);

		// Set date of the game
		setDate(completedGames[index].start_time.slice(0, 10));
	}

	const handleSwipeLeft = () => {
		setSwipeDirection('swipe-left');
		setTimeout(() => {
			setSwipeDirection(null);
		}, 300); // Adjust the delay to match the transition duration
	};

	const handleSwipeRight = () => {
		setSwipeDirection('swipe-right');
		setTimeout(() => {
			setSwipeDirection(null);
		}, 300); // Adjust the delay to match the transition duration
	};


	const [showPopup, setShowPopup] = useState(false);
	const [showPopup_, setShowPopup_] = useState(false);
	const [clickCount, setClickCount] = useState(0);

	// Popup render to show chess board 
	const gameCompletedPopup = () => {
		// if no games are played, return null
		if (completedGames.length === 0) {
			return null;
		}
		const gameState = completedGames[selectedGameIndex].state;
		return (
			<div className="home-completed-games-popup">
				{gameState && <Chessboard position={gameState}></Chessboard>}
			</div>
		);
	}

	// if hover on the table row, show the popup
	const handleMouseEnter = () => {
		setShowPopup(true);
	}

	// if hover out of the table row, hide the popup
	const handleMouseLeave = () => {
		setShowPopup(false);
	}

	// if click on the table row, show the popup
	const handleMouseClick = () => {
		// update click count
		setClickCount(clickCount + 1);
		// if click count is odd, show the popup
		if (clickCount % 2 === 0) {
			setShowPopup_(true);
			// Set focus on table row 
			document.getElementsByClassName('home-completed-games-table-row')[0].classList.toggle('active')
			// Keep active class forever

		}
		// if click count is even, hide the popup
		else {
			setShowPopup_(false);
			// Remove focus on table row
			document.getElementsByClassName('home-completed-games-table-row')[0].classList.remove('active')
		}
	}

	// Delete game
	const handleDeleteGame = () => {
		// Verify that selectedGameIndex is valid
		if (selectedGameIndex < 0 || selectedGameIndex >= completedGames.length) {
			return;
		}
		// Delete game from database 
		const reponse = axios.delete(backend_url + `/api/games/${completedGames[selectedGameIndex].id}/delete`, {
			headers: {
				Authorization: `Token ${localStorage.getItem('token')}`
			}
		}).then((response) => {
			console.log(response);
		}).catch((error) => {
			// If code 401 Unhautorized remove token from local storage and redirect to login page
			if (error.response && error.response.status === 401) {
				localStorage.removeItem('token');
				<Navigate to="/login" replace />
			}
			console.log(error);
		});

		// Delete game from the list
		const newCompletedGames = [...completedGames];
		newCompletedGames.splice(selectedGameIndex, 1);
		setCompletedGames(newCompletedGames);

		//update table 
		handleClick(selectedGameIndex - 1);
	}


	const [isHoveredLeft, setIsHoveredLeft] = useState(false);
	const [isHoveredRight, setIsHoveredRight] = useState(false);

	return (
		<div className="home-completed-games">
			<div className="home-completed-games-header">
				<span className="home-completed-games-header-text">Completed Games</span>
			</div>
			<div className={`home-completed-games-table ${swipeDirection}`}>
				{(showPopup || showPopup_) ? gameCompletedPopup() : null}

				<table>
					<tr>
						<th>Players</th>
						<th>Result</th>
						<th>Moves</th>
						<th>Date</th>
					</tr>
					<tr className='home-completed-games-table-row' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseClick}>
						<td>
							<div className="home-completed-games-table-players">
								<div className="home-completed-games-table-player-top">
									<div className='home-completed-games-table-player-icon-top'>
										{completedGames.length === 0 ? null : <FontAwesomeIcon icon={faSquare} color={colorTop} />}
									</div>
									{playerTop}
								</div>
								<div className="home-completed-games-table-player-bottom">
									<div className='home-completed-games-table-player-icon-bottom'>
										{completedGames.length === 0 ? null : <FontAwesomeIcon icon={faSquare} color={colorBottom} />}
									</div>
									{completedGames.length === 0 ? null : playerBottom}
								</div>
							</div>
						</td>
						<td>
							<div className="home-completed-games-table-result">
								<div className="home-completed-games-table-results">
									<p className="home-completed-games-table-result-top">
										{completedGames.length === 0 ? null : resultTop}
									</p>
									<p className="home-completed-games-table-result-bottom">
										{completedGames.length === 0 ? null : resultBottom}
									</p>
								</div>
								<div className="home-completed-games-table-result-icon">
									{completedGames.length === 0 ? null : <FontAwesomeIcon icon={faSquareMinus} color={squareColor} />}
								</div>
							</div>
						</td>
						<td>{moves}</td>
						<td>{date}</td>
					</tr>
				</table>
			</div>
			<div className="home-completed-games-selection">
				<div className="home-completed-games-selection-left">
					{completedGames.length === 0 ? null : <FontAwesomeIcon icon={faChevronLeft} color={isHoveredLeft ? '#ffffff' : '#787876'} onClick={() => handleClick(selectedGameIndex - 1)} onMouseEnter={() => setIsHoveredLeft(true)} onMouseLeave={() => setIsHoveredLeft(false)} />}
				</div>
				<div className="home-completed-games-selection-number-container">
					{completedGames.slice(0, 5).map((_, index) => (
						<span
							key={index}
							className={`home-completed-games-selection-number ${selectedGameIndex === index ? 'active' : ''
								}`}
							onClick={() => handleClick(index)}
						>
							{index + 1}
						</span>
					))}
				</div>
				<div className="home-completed-games-selection-right">
					{completedGames.length === 0 ? null : <FontAwesomeIcon icon={faChevronRight} color={isHoveredRight ? '#ffffff' : '#787876'} onClick={() => handleClick(selectedGameIndex + 1)} onMouseEnter={() => setIsHoveredRight(true)} onMouseLeave={() => setIsHoveredRight(false)} />}
				</div>
				<div className="home-completed-games-selection-view">
					{completedGames.length === 0 ? null : <FontAwesomeIcon icon={faEye} color='#787876' />}
				</div>
				<div className='home-completed-games-selection-trash'>
					{completedGames.length === 0 ? null : < FontAwesomeIcon icon={faTrash} color='#787876' onClick={handleDeleteGame} />}
				</div>
			</div>

		</div >
	);
};

// Component to manage the statistics of the user Highest elo/ Current elo/ Games played/ Wins/ Losses/ Draws
const HomeBaseHeaderUserStatistics = () => {

	// Fetch statistics from the server 
	const [userStatistics, setUserStatistics] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			axios.get(backend_url + '/api/chess_stats', {
				headers: {
					Authorization: `Token ${localStorage.getItem('token')}`
				}
			}).then((response) => {
				console.log(response.data);
				setUserStatistics(response.data);
			}).catch((error) => {
				// If code 401 Unhautorized remove token from local storage and redirect to login page
				if (error.response && error.response.status === 401) {
					localStorage.removeItem('token');
					<Navigate to="/login" replace />
				}
				console.log(error);
			});
		};
		fetchData();
	}, []);

	return (
		<div className="home-base-header-user-statistics">
			<table className="home-base-header-user-statistics-table">
				<tr>
					<th>Highest elo</th>
					<th>Current elo</th>
					<th>Games</th>
					<th>W/D/L</th>
				</tr>
				<tr>
					<td>{userStatistics ? userStatistics.highest_elo_rating : "Loading..."}</td>
					<td>{userStatistics ? userStatistics.elo_rating : "Loading..."}</td>
					<td>{userStatistics ? userStatistics.games_played : "Loading..."}</td>
					<td className='td-w-d-l'>{userStatistics ? <p id="wins">{userStatistics.games_won}</p> : "Loading..."}<p>/</p>{userStatistics ? <p id="draws">{userStatistics.games_drawn}</p> : "Loading..."}<p>/</p>{userStatistics ? <p id="losses">{userStatistics.games_lost}</p> : "Loading..."}</td>
				</tr>
			</table>
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
					   <HomeCompletedGames />
					   <HomeBaseHeaderUserStatistics />
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

