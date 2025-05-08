import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/HomeHeader';

const ActiveGames = () => {
    const [activeGames, setActiveGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null); // Game selected for the modal
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActiveGames = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/game/active`, {
                    withCredentials: true,
                });
                setActiveGames(response.data);
            } catch (error) {
                console.error('Error fetching active games:', error);
            }
        };

        fetchActiveGames();
    }, []);

    
    const handleDeleteGame = async (gameId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/game/${gameId}`, {
                withCredentials: true,
            });
            setActiveGames((prevGames) => prevGames.filter((game) => game._id !== gameId));
            setSelectedGame(null); // Close the modal
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    };

    const handleContinueGame = (gameId, currentWeek) => {
        navigate(`/game/${gameId}/week/${currentWeek}`);
    };

    return (
        <>
        <HomeHeader />
        <div className="active-games-page p-6">
            <h1 className="text-2xl font-bold mb-4">My Active Games</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeGames.map((game) => (
                    <div
                        key={game._id}
                        className="game-card bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg"
                        onClick={() => handleContinueGame(game._id, game.currentWeek)}
                    >
                        <h2 className="text-lg font-semibold">{game.title}</h2>
                        <p> Week: {game.currentWeek}</p>
                    </div>
                ))}
            </div>
        </div>

            {selectedGame && (
                <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg text-center">
                        <h2 className="text-xl font-bold mb-4">{selectedGame.title}</h2>
                        <p>Week: {selectedGame.currentWeek}</p>
                        <div className="flex justify-center space-x-4 mt-4">
                            <button
                                onClick={() => handleContinueGame(selectedGame._id, selectedGame.currentWeek)}
                                className="btn btn-primary"
                            >
                                Continue Game
                            </button>
                            <button
                                onClick={() => handleDeleteGame(selectedGame._id)}
                                className="btn btn-danger"
                            >
                                Delete Game
                            </button>
                            <button
                                onClick={() => setSelectedGame(null)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActiveGames;