import React, { useState } from 'react';

export default function GameOverview({ onClose, weeks, gameTitle }) {
    const [selectedWeek, setSelectedWeek] = useState(null); // Store the selected week's data

    // Handle button click to display the selected week's summary
    const handleWeekClick = (week) => {
        setSelectedWeek(week); // Set the selected week's data
    };

    return (
        <div className="game-overview-modal bg-white p-6 rounded shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Game Overview: {gameTitle}</h2>

            {/* Display buttons for each week */}
            <div className="weeks-buttons grid grid-cols-3 gap-4 mb-6">
                {weeks.map((week, index) => (
                    <button
                        key={index}
                        onClick={() => handleWeekClick(week)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Week {week.weekNumber} {/* Updated to use `weekNumber` from the new data structure */}
                    </button>
                ))}
            </div>

            {/* Display the selected week's summary */}
            {selectedWeek && (
                <div className="week-summary bg-gray-100 p-4 rounded shadow-md">
                    <h3 className="text-xl font-bold mb-2">Week {selectedWeek.weekNumber}</h3>
                    <p>Discoveries made: {selectedWeek.discoveries?.join(', ') || 'None'}</p>
                    <p>Discussions held: {selectedWeek.discussions?.join(', ') || 'None'}</p>
                    <p>Projects started and completed: {selectedWeek.projects?.join(', ') || 'None'}</p>
                </div>
            )}

            {/* Clear Selection Button */}
            {selectedWeek && (
                <div className="mt-4">
                    <button
                        onClick={() => setSelectedWeek(null)} // Clear the selected week when clicked
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Clear Selection
                    </button>
                </div>
            )}

            {/* Close Button */}
            <div className="mt-6 text-right">
                <button
                    onClick={onClose}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Close
                </button>
            </div>
        </div>
    );
}