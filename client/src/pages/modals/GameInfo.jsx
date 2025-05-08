import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { deleteGame } from '../../api/gameApi'; // Import the deleteGame function
const GameInfo = ({ game, onClose, onGameDeleted }) => {
    const navigate = useNavigate();

    const handleContinueGame = () => {
        navigate(`/game/${game._id}/week/${game.currentWeek}`);
    };

    const handleDeleteGame = async () => {
        try {
            await deleteGame(game.id), 
            onGameDeleted(game._id); // Notify parent to remove the deleted game
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    };

    return (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4">{game.title}</h2>
                <p>{game.description}</p>
                <p>Week: {game.currentWeek}</p>
                <p>Season: {game.currentSeason}</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        onClick={handleContinueGame}
                        className="btn btn-primary"
                    >
                        Continue Game
                    </button>
                    <button
                        onClick={handleDeleteGame}
                        className="btn btn-danger"
                    >
                        Delete Game
                    </button>
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameInfo;