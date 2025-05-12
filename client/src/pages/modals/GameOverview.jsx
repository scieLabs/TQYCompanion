import React, { useState } from 'react';

export default function GameOverview({ onClose, weeks, gameTitle, season }) {
    const [selectedWeek, setSelectedWeek] = useState(null);

    const handleWeekClick = (week) => {
        setSelectedWeek(week);
    };

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
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {week.weekNumber}
                    </button>
                );
        }
    };

    return (
        <div className="game-overview-modal bg-white p-6 rounded shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Game Overview: {gameTitle}</h2>
            <div className="weeks-buttons grid grid-cols-3 gap-4 mb-6">
                {weeks.map((week) => getButtonForSeason(week))}
            </div>
            {selectedWeek && (
                <div className="week-summary bg-gray-100 p-4 rounded shadow-md">
                    <h3 className="text-xl font-bold mb-2">Week {selectedWeek.weekNumber}</h3>
                    <p>Discoveries made: {selectedWeek.discoveries.join(', ') || 'None'}</p>
                    <p>Discussions held: {selectedWeek.discussions.join(', ') || 'None'}</p>
                    <p>Abundance: {selectedWeek.abundance || 'None'}</p>
                    <p>Scarcity: {selectedWeek.scarcity || 'None'}</p>
                    <p>Contempt: {selectedWeek.contempt}</p>
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
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Clear Selection
                    </button>
                </div>
            )}
            <div className="mt-6 text-right">
                <button
                    onClick={onClose}
                    className={`${theme.bodyText}bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                >
                    Close
                </button>
            </div>
        </div>
    );
}