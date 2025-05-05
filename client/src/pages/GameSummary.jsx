import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../path/to/authContext';
import gameAPI from '../api/gameApi.js';
import GameHeader from '../components/GameHeader';
import GameOverview from './modals/GameOverview';
import GameProgress from './GameProgress.jsx';
import GameStats from '../components/GameStats.jsx';

const GameSummary = () => {
    const { user } = useAuthContext();
    //const { gameData } = ???; //I straight up have no way of importing this without creating gameContext; 
    // local storage sounds really dumb; 
    // and installing some weird library would be a bit wild just for this;
    //Maybe as props?
    //would have to turn GameSummary into a shild component of GameProgress, though
    //and that doesn't work if I want to be able to access the history from other places, too, like GameHistory.jsx
    // it always boils down to GameContext

    const [showOverview, setShowOverview] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    //TODO: CHECK IF THIS WORKS
    //This below checks gameData for the number of projects, discussions and discoveries, counts them, and returns the total number of each
    //and whenever anything goes wrong, it just defaults to 0, which is why we have so many 0 here
    //I really have no clue if this works, but eh
    const totalProjects = gameData?.weeks?.reduce((count, week) => count + (week.projects?.length || 0), 0) || 0;
    const totalDiscussions = gameData?.weeks?.reduce((count, week) => count + (week.discussions?.length || 0), 0) || 0;
    const totalDiscoveries = gameData?.weeks?.reduce((count, week) => count + (week.discoveries?.length || 0), 0) || 0;


    useEffect(() => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        if (!gameData) {
            setTimeout(() => {
                setErrorMessage('Failed to load game data. Please try again later.');
                setLoading(false);
            }, 1000);
        } else {
            setTimeout(() => {
                setSuccessMessage('Game data loaded successfully!');
                setLoading(false);
            }, 1000);
        }
    }, [gameData]);

    return (
        <div>
            <GameHeader />
            {user ? (
                <div className="game-summary-container">
                    {loading ? (
                        <div className="loading-message text-blue-500 font-bold">
                            <p>Loading game data...</p>
                        </div>
                    ) : errorMessage ? (
                        <div className="error-message text-red-500 font-bold">
                            <p>{errorMessage}</p>
                        </div>
                    ) : (
                        <>
                            {successMessage && (
                                <div className="success-message text-green-500 font-bold">
                                    <p>{successMessage}</p>
                                </div>
                            )}
                            <div className="game-summary-content">
                                {/*I also need to adjust the stuff below in the modals/GameOverview.jsx file, so that it actually shows the correct data*/}
                                <h2>{gameData.gameTitle}</h2>
                                {/* Going to have to pull the correct data one by one, checking what it is called in the database */}
                                <p>Weeks before Winter came: {gameData.currentWeek}</p> {/*correct - I hope*/}
                                <p>Projects completed: {totalProjects}</p> {/*need to check if this works - see line~15*/}
                                <p>Discoveries made: {totalDiscussions}</p> {/*need to check if this works - see line~15*/}
                                <p>Discussions held: {totalDiscoveries}</p> {/*need to check if this works - see line~15*/}
                                <p>Abundances enjoyed: {gameData.stats.abundance}</p> {/*Or maybe without stats - will have to see*/}
                                <p>Scarcities endured: {gameData.stats.scarcity}</p>{/*Or maybe without stats - will have to see*/}
                                <p>Contempt within the Community: {gameData.stats.contempt}</p>{/*Or maybe without stats - will have to see*/}
                                <button
                                    onClick={() => setShowOverview(true)}
                                    className="show-overview-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Revisit a chosen week/Revisit the Year week by week
                                </button>


                                {/*I'll probably have to move this one around a bit, just like the modals from the header - we will see in the final version
                    {showLogin && (
                        <div
                            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Login onClose={handleCloseModal} handleRegisterClick={handleRegisterClick} />
                        </div>
                    )}
                                Freshly stolen from LandingPage, just needs adjustments; replaces the current showOverview, at least in aprt*/}
                                {showOverview && (
                                    <GameOverview
                                        onClose={() => setShowOverview(false)}
                                        weeks={gameData.currentWeek} // Pass weeks data
                                        gameTitle={gameData.gameTitle} // Pass game title
                                    />
                                )}
                            </div>
                            <a
                                href="/new-game"
                                className="new-game-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                New Game
                            </a>
                            <a
                                href="/"
                                className="about-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Homepage
                            </a>
                        </>
                    )}
                </div>
            ) : (
                <div className="game-summary-container">
                    <p>You need to be logged in to view the summary.</p>
                    <a
                        href="/"
                        className="login-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Return to Homepage
                    </a>
                </div>
            )}
        </div>
    );
};

export default GameSummary;

