import React, { useState, useEffect } from 'react';
import GameHeader from './GameHeader.jsx';
import GameOverview from '../pages/modals/GameOverview.jsx';
import Login from '../pages/modals/Login.jsx';
import { useAuthContext } from '../contexts/authContext.jsx';

const GameSummary = ({ game, stats, projects, currentWeek, loading, errorMessage, onClose }) => {
    const [showOverview, setShowOverview] = useState(false);
    const { user } = useAuthContext();

    if (loading) {
        return <p className="loading-message text-blue-500 font-bold">Loading game summary...</p>;
    }

    if (errorMessage) {
        return <p className="error-message text-red-500 font-bold">{errorMessage}</p>;
    }

    if (!game || !stats || !projects) {
        return <p>No game data available.</p>;
    }

    // Combine and count the stats
    const weeks = projects.reduce((acc, project) => {
        const week = acc.find((w) => w.weekNumber === project.stats_week) || {
            weekNumber: project.stats_week,
            discoveries: [stats.discovery, stats.p_discovery].filter(Boolean),
            discussions: [stats.discussion, stats.p_discussion].filter(Boolean),
            abundance: stats.abundance,
            scarcity: stats.scarcity,
            contempt: stats.contempt,
            projects: [],
        };
        week.projects.push({
            title: project.project_title || project.pp_title,
            description: project.project_desc || project.pp_desc,
            weeksRemaining: project.project_weeks || project.pp_weeks,
            resolution: project.project_resolve || project.pp_resolve,
        });
        if (!acc.includes(week)) acc.push(week);
        return acc;
    }, []);

    const totalProjects = weeks.reduce((count, week) => count + week.projects.length, 0);
    const totalDiscussions = weeks.reduce((count, week) => count + week.discussions.length, 0);
    const totalDiscoveries = weeks.reduce((count, week) => count + week.discoveries.length, 0);

    return (
        <div
            className="modal-wrapper fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
            onClick={onClose} // Close modal when clicking outside
        >
            <div
                className="modal-content bg-white p-6 rounded shadow-md"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <GameHeader />
                {user ?
                    (<div className="game-summary-container">
                        <div className="game-summary-content">
                            <h2>{game.title}</h2>
                            <p>Weeks before Winter came: {currentWeek}</p>
                            <p>Projects completed: {totalProjects}</p>
                            <p>Discoveries made: {totalDiscoveries}</p>
                            <p>Discussions held: {totalDiscussions}</p>
                            <p>Abundances enjoyed: {stats.abundance || 'None'}</p>
                            <p>Scarcities endured: {stats.scarcity || 'None'}</p>
                            <p>Contempt within the Community: {stats.contempt || 0}</p>
                            <button
                                onClick={() => setShowOverview(true)}
                                className="show-overview-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Revisit a chosen week/Revisit the Year week by week
                            </button>
                            {/* TODO: Show the GameOverview modal when the button is clicked - will require some additions, but need to see it first*/}
                            {showOverview && (
                                <GameOverview
                                    className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                                    onClose={() => setShowOverview(false)}
                                    weeks={weeks}
                                    gameTitle={game.title || 'Unknown Game'}
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
                        <button
                            onClick={onClose}
                            className="close-button bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Close
                        </button>
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
                            {/* Login button not necessarily necessary - will think about it after lunch
                            <button
                            onClick={handleLoginClick}
                            className={`login-button flex justify-center items-center mt-4
                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                            py-2 px-4 rounded hover:cursor-pointer`}
                        >
                                Login
                            </button>*/}
                        </div>
                    )};
            </div>
        </div>
    );
};


export default GameSummary;

