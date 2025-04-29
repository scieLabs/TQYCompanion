import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../path/to/authContext';
import gameAPI from '../api/gameApi.js';
import GameHeader from '../components/GameHeader';
import GameOverview from './modals/GameOverview';
import GameStats from '../components/GameStats.jsx';    
    //fetchCurrentGameState from GameProgress.jsx!!!!!!!!!!!!!!!!!!!!!!!!
    //fetchCurrentGameState from GameProgress.jsx!!!!!!!!!!!!!!!!!!!!!!!!
    //fetchCurrentGameState from GameProgress.jsx!!!!!!!!!!!!!!!!!!!!!!!!

const GameSummary = () => {
    const [gameSummary, setGameSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOverview, setShowOverview] = useState(false); // State to control the modal visibility
    const { user } = useAuthContext();
    
    //Do I even need this? If the user came this far, the user should be logged in, 
    // and it would also allow to easily share game summaries with friends - no need to login or anything, 
    // just click link, look up result of game
    //also the game is over, there are no further prompts for the player to interact with, nothing can change anymore
    //yeah, don't need it
    //Actually, I DO NEED IT!!!!!!
    //!!!!!!!!!!!!!!


    //fetchCurrentGameState from GameProgress.jsx!!!!!!!!!!!!!!!!!!!!!!!!
    //Fetching game state from the backend
    const fetchGameSummary = async () => {
        try {
            const response = await gameAPI.get(`/game/title/${gameTitle}/week/${currentWeek}`);
            //identical to current GameStats.jsx 
            // Adjust the endpoint - should there be /stats at the end? - scie
            // Fetch for the given week - scie
            //we can just take the "current" week, as it is also the final week, 
            //which, if I understood it right, should include all the data from the previous weeks
            //as we need to have those very same stats present in the ongoing game
            //Have to check if the final prompt kicks the player directly to the summary page

            //honestly, don't want to fetch myself, let's use import GameStats
            setGameSummary(response.data);
        } catch (err) {
            setError('Failed to load game summary. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGameSummary();
    }, []);

    return (
        <div>
            <GameHeader />
            <div className="game-summary-container">
                {loading && <p>Loading...</p>} {/* will need to find some nice and fitting animation for loading, maybe snowflakes or so */}
                {error && <p>{error}</p>}
                {gameSummary && (
                    <div className="game-summary-content">
                        <h2>{gameSummary.gameTitle}</h2>
                        <p>Weeks before Winter came: {gameSummary.currentWeek}</p>
                        <p>Projects completed: {gameSummary.completedProjects}</p>
                        <p>Abundances enjoyed: {gameSummary.abundance}</p>
                        <p>Scarcities endured: {gameSummary.scarcity}</p>
                        <p>Contempt within the Community: {gameSummary.abundances}</p>
                        <p>Discoveries made: {gameSummary.discovery}</p>
                        <p>Discussions held: {gameSummary.discussion}</p>
                        <button
                            onClick={() => setShowOverview(true)}
                            className="show-overview-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Revisit a chosen week/Revisit the Year week by week
                        </button>
                    </div>
                )}
                {showOverview && (
                    <GameOverview
                        onClose={() => setShowOverview(false)}
                        weeks={gameSummary.weeks} // Pass weeks data
                        gameTitle={gameSummary.gameTitle} // Pass game title
                    />
                )}
                <a
                    href="/new-game"
                    className="new-game-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    New Game
                </a>
                <a href="/about"
                    className="about-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Homepage
                </a>
            </div>
        </div>
    );
};

export default GameSummary;

