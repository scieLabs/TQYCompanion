import React, { useState } from 'react';
import { useSeason } from '../../contexts/seasonContext.jsx'; // Import the season context

export default function GameOverview({ onClose, weeks, gameTitle, season }) {
    const [selectedWeek, setSelectedWeek] = useState(null);

        const { currentSeason = 'Spring', setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context
        const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black'}; // Get the theme based on the current season

    const handleWeekClick = (week) => {
        setSelectedWeek(week);
    };

    //I forgot how I thought this would work, I only know it doesn't work
    //Was supposed to colour the buttons in the same way as the seasons in the game
    //why that week.weeknumber key? Game Over, Man, Game Over
    const getButtonForSeason = (week) => {
        switch (season) {
            case 'Spring':
                return (
                    <button
                        key={week.weekNumber}
                        onClick={() => handleWeekClick(week)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {week.weekNumber}
                    </button>
                );
            case 'Summer':
                return (
                    <button
                        key={week.weekNumber}
                        onClick={() => handleWeekClick(week)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {week.weekNumber}
                    </button>
                );
            case 'Autumn':
                return (
                    <button
                        key={week.weekNumber}
                        onClick={() => handleWeekClick(week)}
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {week.weekNumber}
                    </button>
                );
            case 'Winter':
                return (
                    <button
                        key={week.weekNumber}
                        onClick={() => handleWeekClick(week)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {week.weekNumber}
                    </button>
                );
            default:
                return (
                    <button
                        key={week.weekNumber}
                        onClick={() => handleWeekClick(week)}
                        className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                    >
                        {week.weekNumber}
                    </button>
                );
        }
    };

return (
        <div className="game-overview p-6 w-[85%] mx-auto">
            <h2 className="text-2xl font-bold mb-4">Game Overview: {gameTitle}</h2>
            <div className="weeks-buttons grid grid-cols-13 gap-4 mb-6">
                {weeks.map((week) => getButtonForSeason(week))}
            </div>
            {selectedWeek && (
                <div className={`week-summary ${theme.statsBg} p-4 rounded shadow-md`}>
                    <h3 className="text-xl font-bold mb-2">Week {selectedWeek.weekNumber}</h3>
                    <p>Discoveries made: {selectedWeek.discoveries.join(', ') || 'None'}</p>
                    <p>Discussions held: {selectedWeek.discussions.join(', ') || 'None'}</p>
                    <h4 className="text-lg font-bold mt-4">Projects:</h4>
                    {selectedWeek.projects.length > 0 ? (
                        selectedWeek.projects.map((project, index) => (
                            <div key={index} className="project-summary mb-4">
                                <p>Title: {project.title}</p>
                                <p>Description: {project.description}</p>
                                <p>Weeks Remaining: {project.weeksRemaining}</p>
                                <p>Resolution: {project.resolution || 'Not completed yet'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No projects for this week.</p>
                    )}
                </div>
            )}
            {selectedWeek && (
                <div className="mt-4">
                    <button
                        onClick={() => setSelectedWeek(null)}
                        className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                    >
                        Clear Selection
                    </button>
                </div>
            )}
        </div>
    );
}


        // TODO: Old version with some added functionalities; removed for now, to be revisited later

//    return (
//        <div className={`game-overview-modal bg-white p-6 rounded shadow-md w-full max-w-4xl mx-auto max-h-60 break-words overflow-y-auto`}>
//            <h2 className="text-2xl font-bold mb-4">Game Overview: {gameTitle}</h2>
//            <div className="weeks-buttons grid grid-cols-3 gap-4 mb-6">
//                {weeks.map((week) => getButtonForSeason(week))}
//            </div>
//            {selectedWeek && (
//                <div className="week-summary bg-gray-100 p-4 rounded shadow-md">
//                    <h3 className="text-xl font-bold mb-2">Week {selectedWeek.weekNumber}</h3>
//                    <p>Discoveries made: {selectedWeek.discoveries.join(', ') || 'None'}</p>
//                    <p>Discussions held: {selectedWeek.discussions.join(', ') || 'None'}</p>
//                    {/*<p>Abundance: {selectedWeek.abundance || 'None'}</p>
//                    <p>Scarcity: {selectedWeek.scarcity || 'None'}</p>
//                    <p>Contempt: {selectedWeek.contempt}</p>
//                    Probably stopped displaying data because I changed the stats object to an array*/} 
//                    <h4 className="text-lg font-bold mt-4">Projects:</h4>
//                    {selectedWeek.projects.length > 0 ? (
//                        selectedWeek.projects.map((project, index) => (
//                            <div key={index} className="project-summary mb-4">
//                                <p>Title: {project.title}</p>
//                                <p>Description: {project.description}</p>
//                                <p>Weeks Remaining: {project.weeksRemaining}</p>
//                                <p>Resolution: {project.resolution || 'Not completed yet'}</p>
//                            </div>
//                        ))
//                    ) : (
//                        <p>No projects for this week.</p>
//                    )}
//                </div>
//            )}
//            {selectedWeek && (
//                <div className="mt-4">
//                    <button
//                        onClick={() => setSelectedWeek(null)}
//                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                    >
//                        Clear Selection
//                    </button>
//                </div>
//            )}
//            {/* <div className="mt-6 text-right">
//                <button
//                    onClick={onClose}
//                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                >
//                    Close
//                </button>
//            </div>*/}
//        </div>
//    );
//}