import React, { useState, useEffect } from 'react';
import GameHeader from './GameHeader.jsx';
import GameOverview from '../pages/modals/GameOverview.jsx';
import Login from '../pages/modals/Login.jsx';
import { useAuthContext } from '../contexts/authContext';
import { useSeason } from '../contexts/seasonContext.jsx';
import HomeHeader from './HomeHeader.jsx';

const GameSummary = ({ game, stats, projects, currentWeek, loading, errorMessage, onClose }) => {
    const [showOverview, setShowOverview] = useState(false);
    const { user } = useAuthContext();

    const { currentSeason = 'Spring', setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context
    const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' }; // Get the theme based on the current season

    const handleNewGameClick = () => {
        setCurrentSeason('Spring');
        navigate('/new-game'); // Navigate to the NewGame page
    };

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
    const weeks = Array.isArray(stats)
        ? stats.map((stat) => ({
            weekNumber: stat.week,
            discoveries: [stat.discovery, stat.p_discovery].filter(Boolean),
            discussions: [stat.discussion, stat.p_discussion].filter(Boolean),
            abundance: stat.abundance || 'None',
            scarcity: stat.scarcity || 'None',
            contempt: stat.contempt || 0,
            projects: projects
                .filter((project) => project.stats_week === stat.week)
                .map((project) => ({
                    title: project.project_title || project.pp_title,
                    description: project.project_desc || project.pp_desc,
                    weeksRemaining: project.project_weeks || project.pp_weeks,
                    resolution: project.project_resolve || project.pp_resolve,
                })),
        }))
        : [];

    const totalProjects = weeks.reduce((count, week) => count + week.projects.length, 0);
    const totalDiscussions = weeks.reduce((count, week) => count + week.discussions.length, 0);
    const totalDiscoveries = weeks.reduce((count, week) => count + week.discoveries.length, 0);

    return (
        <div
            className={`modal-wrapper fixed inset-0 flex justify-center items-center`}
            onClick={onClose} // Close modal when clicking outside
        >
            <div
                className={`modal-content`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/*<HomeHeader />*/}
                {user ?
                    (<div className={`
                    game-summary-container w-full h-full
                    ${theme.bodyBg} ${theme.bodyText}
                    flex flex-col p-6 shadow-lg w-full
                    `}>
                        <div className={`game-summary-content items-center justify-center`}>
                            <div
                                className={`game-summary-header flex items-center justify-center mb-4
                                ${theme.headerBg} ${theme.headerText}
                                `}
                            >
                                <h2
                                    className={`game-title text-2xl font-bold mb-4`}
                                >
                                    {game.title}
                                </h2>
                            </div>
                            <p>Weeks before Winter came: {currentWeek}</p>
                            <p>Projects completed: {totalProjects}</p>
                            <p>Discoveries made: {totalDiscoveries}</p>
                            <p>Discussions held: {totalDiscussions}</p>
                            <p>Abundances enjoyed: {stats.abundance || 'None'}</p>
                            <p>Scarcities endured: {stats.scarcity || 'None'}</p>
                            <p>Contempt within the Community: {stats.contempt || 0}</p>
                            <div
                                className='game-summary-actions flex flex-col items-center justify-center gap-4'
                            >
                                <button
                                    onClick={() => setShowOverview(true)}
                                    className={`show-overview-button flex justify-center mt-4
                                    ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                                    py-2 px-4 rounded hover:cursor-pointer`}
                                >
                                    Revisit a chosen week/Revisit the Year week by week
                                </button>
                                {/* TODO: Show the GameOverview modal when the button is clicked - will require some additions, but need to see it first*/}
                                {showOverview && (
                                    <GameOverview
                                        className="bg-white p-6 rounded-lg shadow-lg w-full"
                                        onClose={() => setShowOverview(false)}
                                        weeks={weeks}
                                        gameTitle={game.title || 'Unknown Game'}
                                    />
                                )}
                            </div>
                            <div className="game-summary-actions flex items-center justify-center gap-4">
                                <button
                                    onClick={handleNewGameClick}
                                    className={`new-game-button gap-1 mt-4
                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                            py-2 px-4 rounded hover:cursor-pointer`}
                                >
                                    New Game
                                </button>
                                <a
                                    href="/"
                                    className={`home-button gap-1 mt-4
                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                            py-2 px-4 rounded hover:cursor-pointer`}
                                >
                                    Homepage
                                </a>
                                <button
                                    onClick={onClose}
                                    className={`close-button gap-1 mt-4
                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                            py-2 px-4 rounded hover:cursor-pointer`}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
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
                    )}
            </div>
        </div>
    );
};


export default GameSummary;

