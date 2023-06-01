import "./GamePage.css";
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";

import Chess from "chess.js";

import drop_audio from "./drop.mp3";

function to_color(color) {
    if (color === "w") {
        return "white";
    } else {
        return "black";
    }
}

function level_to_name(level) {
    if (level === 1) {
        return 'Novice Knight';
    } else if (level === 2) {
        return 'Strategic Bishop';
    } else {
        return 'Grandmaster Queen';
    }
}

function level_to_elo(level) {
    if (level === 1) {
        return '800';
    } else if (level === 2) {
        return '1200';
    } else {
        return '1600';
    }
}

function level_to_avatar(level) {
    if (level === 1) {
        return 'http://127.0.0.1:8000/images/knight.png/'
    } else if (level === 2) {
        return 'http://127.0.0.1:8000/images/bishop.png/'
    } else {
        return 'http://127.0.0.1:8000/images/queen.png/'
    }
}

// Convert a second int to a date to manage clock 
function time_seconds_to_date(time) {
    const date = new Date(null);
    date.setSeconds(time);
    return date;
}

function time_to_string(time) {
    return time.toISOString().substr(14, 5);
}


// component for the stats and timer of the game 
function Stats(props) {
    // Stats for player or bot based on id 
    const [type, setType] = useState(props.id === "player-stats" ? "player" : "bot");
    const [remainingTime, setRemainingTime] = useState(time_seconds_to_date(props.remainingTime));

    // use effect hook to handle resize of the board
    useEffect(() => {
        const handleResize = () => {
            const boardContainer = document.getElementsByClassName("board-container")[0];
            if (boardContainer) {
                const width = boardContainer.offsetWidth;
                document.getElementById(props.id).style.width = width + "px";
            }
            else {
                console.log("board container not found");
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, [props.id]);

    // If props remaining time changes, update the remaining time
    useEffect(() => {
        setRemainingTime(time_seconds_to_date(props.remainingTime));
    }, [props.remainingTime]);

    // If stop clock is true, stop the clock, else start the clock using remainingTime
    useEffect(() => {
        let timer = null;

        if (!props.stopClock) {
            timer = setInterval(() => {
                const time = new Date(remainingTime.getTime() - 1000);
                setRemainingTime(time);
            }, 1000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [props.stopClock, remainingTime]);

    return (
        <div
            className="stats"
            id={props.id}
        >
            <img src={props.avatar} alt="avatar" />
            <p class='name'>{props.name}</p>
            <p class='elo'>({props.elo})</p>
            <div class='timer'>
                <p>{time_to_string(remainingTime)}</p>
            </div>
        </div>
    );
}

function Game() {
    // Get the game id from the url
    const { gameId } = useParams();
    const [game, setGame] = useState();
    const [gameOver, setGameOver] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const [botDifficulty, setBotDifficulty] = useState("");
    // Player color
    const [playerColor, setPlayerColor] = useState();
    // player name
    const [playerName, setPlayerName] = useState();
    // player elo
    const [playerElo, setPlayerElo] = useState();
    // player avatar
    const [playerAvatar, setPlayerAvatar] = useState();
    // Has game started
    const [gameStarted, setGameStarted] = useState(false);
    // Time related states
    const [stopPlayerClock, setStopPlayerClock] = useState(false);
    const [stopBotClock, setStopBotClock] = useState(false);
    const [playerRemainingTime, setPlayerRemainingTime] = useState();
    const [botRemainingTime, setBotRemainingTime] = useState();

    //drop 
    const dropSound = new Audio(drop_audio);
    // When the component mounts, fetch the fen from the backend
    useEffect(() => {
        const fetchGameState = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/game/${gameId}/state`, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();

                // If game doesn't exist, redirect to home
                if (data.detail === "Not found.") {
                    window.location.href = "/";
                }
                console.log(data);

                // Get the player color
                setPlayerColor(data.color);
                // Get the bot difficulty
                setBotDifficulty(data.bot);
                // Get the player name
                setPlayerName(data.player_username);
                // Get the player elo
                setPlayerElo(data.player_elorating);
                // Get the player avatar
                setPlayerAvatar('http://127.0.0.1:8000' + data.player_avatar);
                // Get the player remaining time
                setPlayerRemainingTime(data.player_remaining_time);
                // Get the bot remaining time
                setBotRemainingTime(data.bot_remaining_time);
                // Start the clock of first player to play
                if (playerColor === 'w') {
                    setStopPlayerClock(true);
                } else {
                    setStopBotClock(true);
                }
                const copy_game = new Chess(data.state);
                setGame(copy_game);
                if (copy_game.in_checkmate() || copy_game.in_stalemate()) {
                    setGameOver(true);
                    setShowPopup(true);
                    setStopBotClock(true);
                    setStopPlayerClock(true);
                }

                // Check if it is the player's turn to play
                if (copy_game.turn() === playerColor) {
                    // Player's turn
                } else {
                    // Bot's turn
                    if (!gameStarted) {
                        makeBotMove();
                        setGameStarted(true);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const makeBotMove = async () => {
            try {
                const response = await axios.post(`http://localhost:8000/api/game/${gameId}/move/`, {
                    start_game: true,
                }, {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.data;
                console.log(data);
                const game_copy = new Chess(data.state);
                setGame(game_copy);
                dropSound.currentTime = 0;
                dropSound.play();
                setStopBotClock(true);
                setStopPlayerClock(false);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchGameState();
    }, []);

    // Make a move
    const sendMove = async (move) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/game/${gameId}/move/`, move, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });

            const data = await response.data;
            console.log(data);
            const game_copy = new Chess(data.state);
            setGame(game_copy);
            dropSound.currentTime = 0;
            dropSound.play();

            setBotRemainingTime(data.bot_remaining_time);
            setPlayerRemainingTime(data.player_remaining_time);
            setStopPlayerClock(false);
            setStopBotClock(true);

            if (game_copy.in_checkmate() || game_copy.in_stalemate()) {
                setGameOver(true);
                setShowPopup(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    function makeMove(move) {
        const gameCopy = { ...game };
        const result = gameCopy.move(move);
        setGame(gameCopy);
        setStopPlayerClock(true);
        setStopBotClock(false);
        return result; // null if the move was illegal, the move object if the move was legal
    }

    function onDrop(sourceSquare, targetSquare) {
        const move = makeMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q", // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) {
            return false;
        }
        else {
            dropSound.play();
            // send move to backend
            sendMove(move);
            return true;
        }
    }

    const Popup = () => {
        return (
            <div className="popup">
                <div className="popup-content">
                    <h2>Game Over</h2>
                    <p>{game.in_checkmate() ? "Checkmate" : "Stalemate"}</p>
                    <button onClick={() => setShowPopup(false)}>Close</button>
                </div>
            </div>
        );
    };

    if (!game) {
        return <div>Loading...</div>;
    }
    else {
        console.log(botDifficulty);

        return (
            < div className="container" >
                {gameOver && showPopup && <Popup />}
                <Stats id="bot-stats" avatar={level_to_avatar(botDifficulty)} name={level_to_name(botDifficulty)} elo={level_to_elo(botDifficulty)} remainingTime={botRemainingTime} stopClock={stopBotClock} />
                <div className="board-container">
                    {game && <Chessboard position={game.fen()} onPieceDrop={onDrop} boardOrientation={to_color(playerColor)} />}
                </div>
                <Stats id="player-stats" avatar={playerAvatar} name={playerName} elo={playerElo} remainingTime={playerRemainingTime} stopClock={stopPlayerClock} />
            </div >
        );
    }

}

export default Game;