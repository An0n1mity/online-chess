import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import Navbar from '../Navbar/Navbar';
import Chess from 'chess.js';
import { Chessboard } from "react-chessboard";
import { useState, useEffect } from 'react';

import drop_audio from "../sfx/drop.mp3";
import take_audio from "../sfx/take.mp3";
import end_audio from "../sfx/end.mp3";

function BoardRandomMoving() {
	const [game, setGame] = useState(new Chess());
	const [dropSound] = useState(new Audio(drop_audio));
	const [takeSound] = useState(new Audio(take_audio));
	const [endSound] = useState(new Audio(end_audio));

	function makeAMove(move) {
		const gameCopy = new Chess(game.fen()); // Create a copy of the game
		const result = gameCopy.move(move);
		setGame(gameCopy);
		if (result.captured) {
			//takeSound.play();
		} else {
			//dropSound.play();
		}
		return result; // null if the move was illegal, the move object if the move was legal
	}

	function makeRandomMove() {
		const possibleMoves = game.moves();
		if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
			//endSound.play();
			setGame(new Chess()); // Reset the game
			return; // Exit if the game is over
		}

		const randomIndex = Math.floor(Math.random() * possibleMoves.length);
		makeAMove(possibleMoves[randomIndex]);
	}

	useEffect(() => {
		// Start making random moves when the component mounts
		const intervalId = setInterval(makeRandomMove, 1000);

		return () => {
			// Clean up the interval when the component unmounts
			clearInterval(intervalId);
		};
	}, [game]); // Empty dependency array to run the effect only once

	return <Chessboard position={game.fen()}></Chessboard>
}



const OnlineGameBlock = () => {
	//		 <div className="online-game-block-board-img">
	//<img className="board-img" src={backend_url + "/images/board.png/"} alt="board" />
	///</div >
	return (
		<div className="online-game-block">
			<div className="board-img">
				<BoardRandomMoving />
			</div>
			<div className="online-game-block-info">
				<h1 className="online-game-block-info-title">Play Chess <br />Online !</h1>
				<div className="online-game-block-info-buttons">
					<Link to="/" style={{ textDecoration: 'none' }}>
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

const LandingMainLayout = () => {
	return (
		<div className="landing-main-layout">
			<OnlineGameBlock />
		</div>
	);
};

const Landing = ({ isAuthenticated }) => {
	return (
		<div className="home">
			<Navbar isAuthenticated={isAuthenticated} />
			<LandingMainLayout />
		</div>
	);
};

export default Landing;

