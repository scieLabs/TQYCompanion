import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GameInfo from './modals/GameInfo.jsx';
import { getAllGames, getGamesByUserId } from '../api/gameApi.js';
import { getStatsByGameId } from '../api/statApi.js';
import HomeHeader from '../components/HomeHeader.jsx';
import { useAuthContext } from '../contexts/authContext.jsx';
import { useSeason } from '../contexts/seasonContext.jsx'; 


const ActiveGames = () => {
    const [activeGames, setActiveGames] = useState([]);// List of active games
    const [selectedGame, setSelectedGame] = useState(null); // Game selected for the modal
    const [gameStats, setGameStats] = useState(null); // Stats for the selected game
    const [gameTitle, setGameTitle] = useState('');
    const [gameDescription, setGameDescription] = useState('');
    const { currentSeason, seasonThemes } = useSeason(); // Access season context
    const theme = seasonThemes[currentSeason] || {};
    const { user } = useAuthContext();
    const navigate = useNavigate();

    // Fetch all active games for the logged-in user
    // useEffect(() => {
    //     const fetchActiveGames = async () => {
    //         try {
    //             const response = await getGamesByUserId(); // Fetch all games for the user
    //             console.log('Response from backend:', response);
    //             setActiveGames(response);
    //         } catch (error) {
    //             console.error('Error fetching active games:', error);
    //         }
    //     };

    //     if (user) {
    //         fetchActiveGames();
    //     }
    // }, [user]);

            useEffect(() => {
            const fetchActiveGames = async () => {
            try {
                if (!user?._id) {
                console.error('User ID is missing.');
                return;
                }
                const games = await getGamesByUserId(user._id); // Pass user_id to the API
                setActiveGames(games);
                } catch (error) {
                    console.error('Error fetching active games:', error);
                }
                };
                
                if (user) {

                    fetchActiveGames();
                }

                // fetchActiveGames();
            }, [user]);

          // Fetch stats for the selected game
            useEffect(() => {
                const fetchGameStats = async () => {
                if (!selectedGame) return;

                try {
                    const stats = await getStatsByGameId(selectedGame._id); // Fetch stats for the selected game
                    setGameStats(stats);
                } catch (error) {
                    console.error('Error fetching game stats:', error);
                }
                };

                fetchGameStats();
            }, [selectedGame]);

            const handleContinueGame = () => {
                if (selectedGame && gameStats) {
                navigate(`/game/${selectedGame._id}/week/${gameStats.week}`, {
                state: { fromActiveGames: true }, // Pass state to indicate entry point
                });
            }
            };

    return (
        <>
            <HomeHeader />
            <div className={`p-6 ${theme.bodyBg} active-games-page min-h-screen`}>
                <h1 className={`text-2xl text-center font-bold mb-4 ${theme.bodyBg} ${theme.bodyText} mb-8`}>My Active Games</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeGames.map((game) => (
                            <div
                                key={game._id}
                                className={`p-4 ${theme.statsBg} game-card shadow-md rounded p-4 cursor-pointer hover:shadow-lg`}
                                onClick={() => setSelectedGame(game)} // Open modal with game details
                            >
                                <h2 className={`font-semibold ${theme.headerText}`}>{game.title}</h2>
                                <p>{game.description}</p>
                                {/* <p>Week: {gameStats?.week}</p> */}
                                {/* <p>Season: {game.currentSeason}</p> */}
                            </div>
                        ))}
                </div>
            </div>

            {/* Modal for selected game */}
            {selectedGame && (
                <dialog id="gameModal" className="modal modal-open">
                <div className="modal-box p-0">
                    <header className={`p-4 text-center ${theme.headerBg} ${theme.headerText}`}>
                    <h3 className="font-bold text-lg mb-4 uppercase">{selectedGame.title}</h3>
                    </header>

                    <div className={`p-6 ${theme.bodyBg} ${theme.bodyText}`}>
                    <div className={`max-h-120 break-words overflow-y-auto rounded-lg pr-4 ${theme.bodyInputBg} ${theme.bodyInputText}`}>
                        <p className="mb-4 p-4">{selectedGame.description || 'No description available.'}</p>
                    </div>
                    <div className="flex justify-center space-x-4 mt-4">
                        <p className="mb-4 text-centre"><strong>Current week</strong>: {gameStats?.week || 'Loading...'}</p>
                    </div>
                    <div className="modal-action">
                        <button
                            className={`btn ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                            onClick={handleContinueGame}
                            >
                            Continue
                        </button>
                        <button
                            className={`btn border-none shadow-md bg-white ${theme.bodyText} hover:bg-gray-200`}
                            onClick={() => setSelectedGame(null)} // Close the modal
                        >
                        Close
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
      )}
    </>
  );
};

//             {/* Modal for selected game */}
//             {selectedGame && (
//                 <dialog id="gameModal" className="modal modal-open">
//                     <div className="modal-box p-0">
//                         <header className={`p-4 text-center max-h-120 break-words overflow-y-auto ${theme.headerBg} ${theme.headerText}`}>
//                             <h3 className="font-bold text-lg mb-4 uppercase">{gameTitle}</h3>
//                         </header>

//                         <div className={`p-6 ${theme.bodyBg} ${theme.bodyText}`}>
//                             <div className="max-h-120 break-words overflow-y-auto pr-4">
//                                 <p>{gameDescription || 'No description available.'}</p>
//                             </div>
//                             <div className="modal-action">
//                                 <button
//                                     className="btn border-none shadow-md bg-white text-grey-600 hover:bg-gray-200"
//                                     onClick={() => setSelectedGame(false)} // Close the modal
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>

//                         <GameInfo
//                             game={selectedGame}
//                             onClose={() => setSelectedGame(null)} // Close the modal
//                             onGameDeleted={(deletedGameId) =>
//                                 setActiveGames((prevGames) => prevGames.filter((game) => game._id !== deletedGameId))
//                             }
//                         />
//                     </div>
//                 </dialog>
//             )}

//             {/* {selectedGame && (
//                 <GameInfo
//                     game={selectedGame}
//                     onClose={() => setSelectedGame(null)} // Close the modal
//                     onGameDeleted={(deletedGameId) =>
//                         setActiveGames((prevGames) => prevGames.filter((game) => game._id !== deletedGameId))
//                     }
//                 />
//             )} */}
//         </>
//     );
// };

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