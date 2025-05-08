import React, { useState, useEffect } from 'react';
import GameHeader from '../components/GameHeader';
import GameOverview from './modals/GameOverview';
import Login from './modals/Login.jsx';

const GameSummary = ({ game, stats, projects, currentWeek }) => {
    const [showOverview, setShowOverview] = useState(false);

    if (!game || !stats || !projects) {
        return <p>No game data available.</p>;
    }

    // Combine and count the stats
    const weeks = projects.reduce((acc, project) => {
        const week = acc.find((w) => w.weekNumber === project.stats_week) || {
            weekNumber: project.stats_week,
            projects: [],
            discussions: [],
            discoveries: [],
        };
        week.projects.push(project.project_title);
        if (!acc.includes(week)) acc.push(week);
        return acc;
    }, []);

    const totalProjects = weeks.reduce((count, week) => count + week.projects.length, 0);
    const totalDiscussions = weeks.reduce((count, week) => count + week.discussions.length, 0);
    const totalDiscoveries = weeks.reduce((count, week) => count + week.discoveries.length, 0);


    if (loading) {
        return <p className="loading-message text-blue-500 font-bold">Loading game summary...</p>;
    }

    if (errorMessage) {
        return <p className="error-message text-red-500 font-bold">{errorMessage}</p>;
    }

    if (!gameData || !gameData.weeks) {
        return <p>No game data available.</p>;
    }

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
                        {/* TODO: Show the GameOverview modal when the button is clicked - will require some additions, but need to see it first*/}
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

