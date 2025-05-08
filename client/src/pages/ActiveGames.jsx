import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GameInfo from './modals/GameInfo';
import { getActiveGames } from '../api/gameApi';
import HomeHeader from '../components/HomeHeader';

const ActiveGames = () => {
    const [activeGames, setActiveGames] = useState([]);// List of active games
    const [selectedGame, setSelectedGame] = useState(null); // Game selected for the modal

    // Fetch all active games for the logged-in user
    useEffect(() => {
        const fetchActiveGames = async () => {
            try {
                const response = await getActiveGames(`/active`);            
                setActiveGames(response.data);
            } catch (error) {
                console.error('Error fetching active games:', error);
            }
        };

        if (user) {
            fetchActiveGames();
        }
    }, [user]);

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
                            onClick={() => setSelectedGame(game)} // Open modal with game details
                        >
                            <h2 className="text-lg font-semibold">{game.title}</h2>
                            <p>Week: {game.currentWeek}</p>
                            <p>Season: {game.currentSeason}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for selected game */}
            {selectedGame && (
                <GameInfo
                    game={selectedGame}
                    onClose={() => setSelectedGame(null)} // Close the modal
                    onGameDeleted={(deletedGameId) =>
                        setActiveGames((prevGames) => prevGames.filter((game) => game._id !== deletedGameId))
                    }
                />
            )}
        </>
    );
};

export default ActiveGames;





//     const [finishedGames, setFinishedGames] = useState([]); 
//     const [game, setGame] = useState(null); 
//     const [stats, setStats] = useState(null);
//     const [projects, setProjects] = useState([]); // Game selected for the modal
//     const navigate = useNavigate();

//     const fetchAllGames = async () => {
//         try {
//             const gameResponse = await getGameById(game_id);
//             const statsResponse = await getStatsByGameAndWeek(game_id, currentWeek);
//             const response = await projectAPI.getProjectsByGame(game_id);
//             // console.log('Response from backend:', response);
//             const allProjects = response.data;
//             setProjects(allProjects);

//             const allActiveGames = response.data.filter((game) => game.isActive === true);
//             const allFinishedGames = response.data.filter((game) => game.isActive === false);
//             setActiveGames(allActiveGames);
//             setFinishedGames(allFinishedGames);
//             setGame(gameResponse.data);
//             setStats(statsResponse.data);

//             fetchAllGames();

//         } catch (error) {
//             console.error('Error fetching projects:', error);
//             if (error.response?.status === 404) {
//                 console.warn('No data found.');
//                 setProjects([]);
//             } else {
//                 console.error('Error fetching game data:', error);
//             }
//         }
//     };


//     const handleDeleteGame = async (gameId) => {
//         try {
//             await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/game/${gameId}`, {
//                 withCredentials: true,
//             });
//             setActiveGames((prevGames) => prevGames.filter((game) => game._id !== gameId));
//             setSelectedGame(null); // Close the modal
//         } catch (error) {
//             console.error('Error deleting game:', error);
//         }
//     };

//     const handleContinueGame = (gameId, currentWeek) => {
//         navigate(`/game/${gameId}/week/${currentWeek}`);
//     };

//     return (
//         <>
//             <HomeHeader />
//             <div className="active-games-page p-6">
//                 <h1 className="text-2xl font-bold mb-4">My Active Games</h1>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {activeGames.map((game) => (
//                         <div
//                             key={game._id}
//                             className="game-card bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg"
//                             onClick={() => handleContinueGame(game._id, game.currentWeek)}
//                         >
//                             <h2 className="text-lg font-semibold">{game.title}</h2>
//                             <p> Week: {game.currentWeek}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {selectedGame && (
//                 <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white p-6 rounded shadow-lg text-center">
//                         <h2 className="text-xl font-bold mb-4">{selectedGame.title}</h2>
//                         <p>Week: {selectedGame.currentWeek}</p>
//                         <div className="flex justify-center space-x-4 mt-4">
//                             <button
//                                 onClick={() => handleContinueGame(selectedGame._id, selectedGame.currentWeek)}
//                                 className="btn btn-primary"
//                             >
//                                 Continue Game
//                             </button>
//                             <button
//                                 onClick={() => handleDeleteGame(selectedGame._id)}
//                                 className="btn btn-danger"
//                             >
//                                 Delete Game
//                             </button>
//                             <button
//                                 onClick={() => setSelectedGame(null)}
//                                 className="btn btn-secondary"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default ActiveGames;