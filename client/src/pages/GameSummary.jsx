import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../path/to/authContext';
import gameAPI from '../api/gameApi.js';
import GameHeader from '../components/GameHeader';
import GameOverview from './modals/GameOverview';
import { useParams } from 'react-router-dom';
import Login from './modals/Login.jsx';

const GameSummary = () => {
    const { user } = useAuthContext();
    const [showLogin, setShowLogin] = useState(false);
    const [stats, setStats] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [showOverview, setShowOverview] = useState(false);
    const { game_id } = useParams();

    const onLoginClick = () => {
        setShowLogin(true);
    };

    const [gameData, setGameData] = useState({
        gameTitle: '',
        currentWeek: 0,
        stats: { abundance: '', scarcity: '', contempt: 0 },
        weeks: [],
    });

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                setLoading(true);
                setErrorMessage('');

                // Fetch game details
                const gameResponse = await gameAPI.get(`/game/${game_id}`);
                const game = gameResponse.data;

                // Fetch stats
                const statsResponse = await gameAPI.get(`/stats/${game_id}`);
                const stats = statsResponse.data;

                // Fetch projects
                const projectsResponse = await gameAPI.get(`/projects/${game_id}`);
                const projects = projectsResponse.data;

                // Combine data into the expected structure
                const weeks = stats.map((stat) => {
                    const weekProjects = projects.filter((project) => project.stats_week === stat.week);
                    return {
                        weekNumber: stat.week,
                        projects: weekProjects.map((project) => project.project_title),
                        discussions: stat.discussion ? [stat.discussion] : [],
                        discoveries: stat.discovery ? [stat.discovery] : [],
                    };
                });

                setGameData({
                    gameTitle: game.title,
                    currentWeek: stats.length,
                    stats: {
                        abundance: stats[stats.length - 1]?.abundance || 'None',
                        scarcity: stats[stats.length - 1]?.scarcity || 'None',
                        contempt: stats[stats.length - 1]?.contempt || 0,
                    },
                    weeks,
                });
            } catch (error) {
                console.error('Error fetching game data:', error.message);
                setErrorMessage(`Failed to load game data. Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchGameData();
    }, [game_id]);

    if (loading) {
        return <p className="loading-message text-blue-500 font-bold">Loading game data...</p>;
    }

    if (errorMessage) {
        return <p className="error-message text-red-500 font-bold">{errorMessage}</p>;
    }

    if (!gameData || !gameData.weeks) {
        return <p>No game data available.</p>;
    }

    const { gameTitle, currentWeek, stats: gameStats, weeks } = gameData || {};
    const totalProjects = weeks?.reduce((count, week) => count + (week.projects?.length || 0), 0) || 0;
    const totalDiscussions = weeks?.reduce((count, week) => count + (week.discussions?.length || 0), 0) || 0;
    const totalDiscoveries = weeks?.reduce((count, week) => count + (week.discoveries?.length || 0), 0) || 0;

    return (
        <div>
            <GameHeader />
            {user ?
                (<div className="game-summary-container">
                    <div className="game-summary-content">
                        <h2>{gameTitle}</h2>
                        <p>Weeks before Winter came: {currentWeek}</p>
                        <p>Projects completed: {totalProjects}</p>
                        <p>Discoveries made: {totalDiscoveries}</p>
                        <p>Discussions held: {totalDiscussions}</p>
                        <p>Abundances enjoyed: {gameData?.stats?.abundance || 'None'}</p>
                        <p>Scarcities endured: {gameData?.stats?.scarcity || 'None'}</p>
                        <p>Contempt within the Community: {gameData?.stats?.contempt || 0}</p>
                        <button
                            onClick={() => setShowOverview(true)}
                            className="show-overview-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Revisit a chosen week/Revisit the Year week by week
                        </button>
                        {showOverview && gameData && (
                            <GameOverview
                                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                                onClose={() => setShowOverview(false)}
                                weeks={gameData.weeks || []}
                                gameTitle={gameData.gameTitle || 'Unknown Game'}
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
                </div>
                ) : (
                    <div className="game-summary-container">
                        <p>You need to be logged in to view the summary.</p>
                        <a
                            href="/"
                            className="about-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Return to Homepage
                        </a>
                        <button
                            onClick={onLoginClick}
                            className="login-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Login
                        </button>
                    </div>
                )};
        </div>
    );
};


export default GameSummary;

