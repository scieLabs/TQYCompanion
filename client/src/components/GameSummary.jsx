import React, { useState, useEffect } from 'react';
import GameHeader from './GameHeader.jsx';
import GameOverview from '../pages/modals/GameOverview.jsx';
import Login from '../pages/modals/Login.jsx';
import { useAuthContext } from '../contexts/authContext.jsx';
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

    if (!stats || stats.length === 0) {
        return <p>No stats data available.</p>;
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


    // TODO: Old version with some added functionalities; removed for now, to be revisited later
    //    return (
    //        <div
    //            className={`modal-wrapper fixed inset-0 flex justify-center items-center rounded-lg`}
    //        >
    //            <div
    //                className={`modal-content w-4/5 max-w-4xl h-4/5 max-h-4xl p-8 rounded-lg`}
    //                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    //            >
    //                {user ? (
    //                    <div
    //                        className={`game-summary-container w-full h-full
    //                    ${theme.bodyBg} ${theme.bodyText}
    //                    flex flex-col p-6 shadow-lg w-full
    //                    `}
    //                    >
    //                        <div className={`game-summary-content items-center justify-center`}>
    //                            <div
    //                                className={`game-summary-header flex items-center justify-center mb-4
    //                                ${theme.headerBg} ${theme.headerText}
    //                                `}
    //                            >
    //
    //                                {/* Header */}
    //                                <header className={`p-4 text-center ${theme.headerBg} ${theme.headerText}`}>
    //                                    <h3
    //                                        className={`font-bold text-lg mb-4`}>
    //                                        {game.title}
    //                                    </h3>
    //                                </header>
    //
    //                                {/* Body */}
    //                            </div>
    //                            <p className="block font-bold mb-1">Weeks before Winter came: {currentWeek}</p>
    //                            <p className="block font-bold mb-1">Projects completed: {totalProjects}</p>
    //                            <p className="block font-bold mb-1">Discoveries made: {totalDiscoveries}</p>
    //                            <p className="block font-bold mb-1">Discussions held: {totalDiscussions}</p>
    //                            {/*Probably broke because I changed the stats object to an array
    //                            <p>Abundances enjoyed: {stats.abundance || 'None'}</p>
    //                            <p>Scarcities endured: {stats.scarcity || 'None'}</p>
    //                            <p>Contempt within the Community: {stats.contempt || 0}</p>
    //                            */}
    //                            <div
    //                                className='game-summary-actions flex flex-col items-center justify-center gap-4'
    //                            >
    //                                <button
    //                                    onClick={() => setShowOverview((prev) => !prev)} // Toggle-woggle
    //                                    className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
    //                                >
    //                                    {showOverview ? 'Close Overview' : 'Revisit the Year'}
    //                                </button>
    //                                {showOverview && (
    //                                    <GameOverview
    //                                        className="bg-white p-6 rounded-lg shadow-lg w-full"
    //                                        weeks={weeks}
    //                                        gameTitle={game.title || 'Unknown Game'}
    //                                    />
    //                                )}
    //                            </div>
    //                        </div>
    //
    //                        <div className="homepage-button-container mt-auto flex justify-center">
    //                            {/*<button
    //                                    onClick={handleNewGameClick}
    //                                    className={`new-game-button gap-1 mt-4
    //                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
    //                            py-2 px-4 rounded hover:cursor-pointer`}
    //                                >
    //                                    New Game
    //                                </button>
    //                                */}
    //                            <a
    //                                href="/"
    //                                className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
    //                            >
    //                                Homepage
    //                            </a>
    //                            {/*
    //                                <button
    //                                    onClick={onClose}
    //                                    className={`close-button gap-1 mt-4
    //                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
    //                            py-2 px-4 rounded hover:cursor-pointer`}
    //                                >
    //                                    Close
    //                                </button>
    //                                 */}
    //                        </div>
    //
    //                    </div>
    //                ) : (
    //                    <div className="game-summary-container">
    //                        <p>You need to be logged in to view the summary.</p>
    //                        <a
    //                            href="/"
    //                            className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
    //                        >
    //                            Return to Homepage
    //                        </a>
    //                        {/* Login button not necessarily necessary - will think about it after lunch
    //                            <button
    //                            onClick={handleLoginClick}
    //                            className={`login-button flex justify-center items-center mt-4
    //                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
    //                            py-2 px-4 rounded hover:cursor-pointer`}
    //                        >
    //                                Login
    //                            </button>*/}
    //                    </div>
    //                )}
    //            </div>
    //        </div>
    //    );
    //};


    return (
        <dialog id="gameSummaryModal" className="modal modal-open">
            <div
                className={`modal-box p-0 w-11/12 max-w-7xl h-5/6 max-h-[65vh] ${theme.bodyBg} ${theme.bodyText} flex flex-col`}
            >
                {/* Header */}
                <header className={`p-4 text-center ${theme.headerBg} ${theme.headerText}`}>
                    <h3 className="font-bold text-lg mb-4">{game.title}</h3>
                </header>

                {/* Body */}
                <div className={`p-6 flex-grow ${theme.bodyBg} ${theme.bodyText} overflow-y-auto`}>
                    <p className="block font-bold mb-1">Weeks before Winter came: {currentWeek}</p>
                    <p className="block font-bold mb-1">Projects completed: {totalProjects}</p>
                    <p className="block font-bold mb-1">Discoveries made: {totalDiscoveries}</p>
                    <p className="block font-bold mb-1">Discussions held: {totalDiscussions}</p>

                    <div className="game-summary-actions flex flex-col items-center justify-center gap-4 mt-4">
                        <button
                            onClick={() => setShowOverview((prev) => !prev)}
                            className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                        >
                            {showOverview ? 'Close Overview' : 'Revisit the Year'}
                        </button>
                        {showOverview && (
                            <GameOverview
                                className="bg-white p-6 rounded-lg shadow-lg w-full"
                                weeks={weeks}
                                gameTitle={game.title || 'Unknown Game'}
                            />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className={`modal-action p-6 ${theme.bodyBg} ${theme.bodyText} mt-auto`}>
                    <a
                        href="/"
                        className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                    >
                        Homepage
                    </a>
                    <button
                        onClick={onClose}
                        className={`btn border-none shadow-md bg-white ${theme.bodyText} hover:bg-gray-200`}
                        type="button"
                    >
                        Close
                    </button>
                </div>
            </div>
        </dialog>
    );
};



export default GameSummary;

