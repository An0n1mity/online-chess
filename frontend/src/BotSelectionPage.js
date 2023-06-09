import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WorldFlag from 'react-world-flags';

import './BotSelectionPage.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import start_sound from './start.mp3';
import { backend_url } from './Url';

const white_color_selection = backend_url + '/images/white_color_selection.png';
const black_color_selection = backend_url + '/images/black_color_selection.png';
const random_color_selection = backend_url + '/images/random_color_selection.png';
const novice_knight = backend_url + '/images/knight.png/';
const strategic_bishop = backend_url + '/images/bishop.png/';
const grandmaster_queen = backend_url + '/images/queen.png/';

function randomColor() {
    const colors = ['w', 'b'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function BotsSelection() {
    const [selectedBot, setSelectedBot] = useState('1');
    const [selectedBotImage, setSelectedBotImage] = useState(novice_knight);
    const [selectedBotDescription, setSelectedBotDescription] = useState('Novice Knight, a young chess bot, strives to master the art of chess. With a natural talent for tactics, it learns the fundamentals of piece development and strategic positioning, ready to challenge opponents and prove its worth.');
    const [name, setName] = useState('Novice Knight');
    const [rating, setRating] = useState('800');
    const [flag, setFlag] = useState('US');
    const [timeControl, setTimeControl] = useState('5');
    const navigate = useNavigate();

    // Has the player clicked on choose 
    const [isChoosed, setChoosed] = useState(false);
    // Selected color 
    const [selectedColor, setSelectedColor] = useState('w');

    // Play sound when the player clicks on choose
    const startSound = new Audio(start_sound);

    const handleStartGame = async () => {
        if (selectedBot === '') {
            alert('Please select a bot difficulty.');
            return;
        }

        try {
            const botDifficulty = parseInt(selectedBot);  // Parse the selectedBot value to an integer
            const response = await axios.post(backend_url + '/api/create_game/', {
                bot_difficulty: botDifficulty,
                color: selectedColor,
                time_control: timeControl,
            }, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });
            startSound.play();
            navigate(`/game/${response.data.game_id}`);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // get currently hovered selection-option
    const Click = (bot, botImage, botDescription, botName, botRating, botFlag) => {
        setSelectedBot(bot);
        setSelectedBotImage(botImage);
        setSelectedBotDescription(botDescription);
        setName(botName);
        setRating(botRating)
        setFlag(botFlag);
    };

    const handleTimeControlChange = (event) => {
        setTimeControl(event.target.value);
    };

    const selectionComponent = () => {
        return (
            <div className='selection'>
                <div className='selection-title'>
                    <h1>Chess Club</h1>
                </div>
                <div className='selection-options'>
                    <button className='selection-option'
                        autoFocus
                        onMouseDown={() => Click('1', novice_knight, 'Novice Knight, a young chess bot, strives to master the art of chess. With a natural talent for tactics, it learns the fundamentals of piece development and strategic positioning, ready to challenge opponents and prove its worth.', 'Novice Knight', '800', 'US')}
                    >
                        <img src={novice_knight} alt='Novice Knight' />
                    </button>
                    <button className='selection-option'
                        onMouseDown={() => Click('2', strategic_bishop, "Strategic Bishop, a budding chess bot, embarks on a quest to conquer the realm of chess. Endowed with an innate knack for tactics, it diligently grasps the essence of piece progression and astute positioning. It fearlessly challenges rivals.", 'Strategic Bishop', '1200', 'GB')}
                    >
                        <img src={strategic_bishop} alt='Strategic Bishop' />
                    </button>
                    <button className='selection-option'
                        onMouseDown={() => Click('3', grandmaster_queen, "Grandmaster Queen, a formidable chess bot, aspires to reign supreme in the realm of chess. Blessed with exceptional strategic acumen, it relentlessly hones its mastery of the game. It orchestrates intricate maneuvers and anticipates opponents' tactics.", 'Grandmaster Queen', '1600', 'RU')}
                    >
                        <img src={grandmaster_queen} alt='Grandmaster Queen' />

                    </button>
                </div>
                <div className='selection-button'>
                    <button onClick={() => setChoosed(true)}>Choose</button>
                </div>
            </div >
        );
    }

    const settingComponent = () => {
        return (
            <>
                <div className='setting'>
                    <div className='settings-colors'>
                        <h1>I Play As</h1>
                        <button className='setting-color-option'
                            autoFocus
                            id='white'
                            onClick={() => setSelectedColor('w')}
                        ><img src={white_color_selection} alt='White' /></button>
                        <button className='setting-color-option'
                            onClick={() => setSelectedColor(randomColor())}
                            id='random'><img src={random_color_selection} alt='Random' /></button>
                        <button className='setting-color-option'
                            onClick={() => setSelectedColor('b')}
                            id='black'><img src={black_color_selection} alt='Black' /></button>
                    </div>
                    <div className='settings-time'>
                        <h1>Time Control</h1>
                        <select value={timeControl} onChange={handleTimeControlChange}>                            <option value='5'>5 Minutes</option>
                            <option value='10'>10 Minutes</option>
                            <option value='15'>15 Minutes</option>
                            <option value='30'>30 Minutes</option>
                            <option value='60'>60 Minutes</option>
                        </select>
                    </div>
                </div >
                <div className='start-button'>
                    <button onClick={handleStartGame}>Play</button>
                </div>
            </>
        );
    }

    return (
        <div className='container_'>
            <div className='current-bot'>
                <div className='current-bot-header'>
                    <button onClick={() => setChoosed(false)} style={{ visibility: isChoosed ? 'visible' : 'hidden' }}>
                        <FontAwesomeIcon icon={faArrowLeft} style={{ color: '#c1c1c0', width: '100%', height: '100%' }} />                    </button>
                    <h1>Play vs...</h1>
                </div>
                <div className='current-bot-image'>
                    <img src={selectedBotImage} alt='Novice Knight' />
                </div>
                <div className='current-bot-stats'>
                    <h1>{name}</h1>
                    <h2>{rating}</h2>
                    <WorldFlag className='current-bot-flag' code={flag} />
                </div>
                <div className='current-bot-paragraph'>
                    {!isChoosed && <p>{selectedBotDescription}</p>}
                </div>
            </div>
            {isChoosed ? settingComponent() : selectionComponent()}
        </div >

    );
}

export default BotsSelection;
