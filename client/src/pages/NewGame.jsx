//the page where a user sets up basic info about their game. leads to GameProgress//the page where a user sets up basic info about their game. leads to GameProgress

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/authContext';
import GameHeader from '../components/GameHeader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const gameAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
});

export default function CreateNewGame() {
    // Authentication and user context
    const { user, loading } = useAuthContext();
    // console.log('CreateNewGame user:', user);
    // const token = user?.token; // Assuming the token is stored in the user object
    
    // Redirecting to login if not authenticated
    const navigate = useNavigate();

    useEffect(() => {
      if (loading) {
        console.log('AuthContext is still loading...');
        return;
      }
      if (!loading && !user) {
        console.error('User is not logged in.');
        navigate('/login');
      } else {
        console.log('User object in NewGame:', user); // Debugging: Log the full user object
        console.log('User ID:', user._id); // Debugging: Log the user ID
      }
    }, [loading, user, navigate]);

  
    // State variables
    const [gameTitle, setGameTitle] = useState('');
    const [description, setDescription] = useState('');
    const [abundance, setAbundance] = useState('');
    const [scarcity, setScarcity] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState({ 
        gameTitle: false, 
        description: false, 
        abundance: false, 
        scarcity: false 
    });

    //Handle creating a new game:

    const handleCreateGame = async () => {
        if (!gameTitle || !description || !abundance || !scarcity) {
          setError('All fields are required to create a game.');
          throw new Error('Validation failed: Missing required fields.');
        }

        try {

          // console.log('Calling axios.post directly with:', {
          //   user_id: user?._id,
          //   title: gameTitle,
          //   description,
          //   abundance,
          //   scarcity,
          // });

          // Create the game entry
          const response = await gameAPI.post('/game',
            {
              user_id: user?._id,
              title: gameTitle,
              description,
              abundance,
              scarcity,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              withCredentials: true, // Include credentials if needed
            }
          );

          // console.log('Game created:', response.data.game);
          // console.log('Initial stats created:', response.data.stats);

          return response.data; // Return the data object directly
        } catch (err) {
          console.error('Error creating game:', err.response?.data || err.message);
          setError(err.response?.data?.error || 'Failed to create the game. Please try again.');
          throw err;
        }
      };

    //Handle submit and start spring:   
    const handleStartSpring = async (e) => {
        e.preventDefault();
        if (!gameTitle || !description || !abundance || !scarcity) {
          setError('Please fill in all fields before starting the game.');
          return;
        }
        try {
          // console.log('Starting spring with game data...');
          const { game } = await handleCreateGame();
          // console.log('Navigating to game progress page for game:', game);

          // Navigate to the game progress page
          navigate(`/game/${game._id}/week/1`);

          //FIXME: yet another old version
          // const newGame = await handleCreateGame();
          // console.log('Navigating to game:', newGame.title); // Debugging: Log the game title
          // navigate(`/game/${newGame.title}`); // Navigate to the GameProgress page with the game title
          //FIXME: Old version
          // const gameData =await handleCreateGame();
          // navigate('/game/${newGame.title}', { state: { game: gameData, user } }); // Navigate to the game progress page
        } catch (err) {
          console.error('Error creating game:', err.response?.data || err.message);
          setError(err.response?.data?.error || 'Failed to create the game. Please try again.');
          throw err;
        }
      };

  // Update success state for checkmarks
  const updateSuccess = (field, value) => {
    setSuccess((prev) => ({ ...prev, [field]: !!value }));
  };
//   const updateSuccess = (field, value) => {
//     switch (field) {
//       case 'title':
//         setSuccess((prev) => ({ ...prev, title: !!value }));
//         break;
//       case 'description':
//         setSuccess((prev) => ({ ...prev, description: !!value }));
//         break;
//       case 'abundance':
//         setSuccess((prev) => ({ ...prev, abundance: !!value }));
//         break;
//       case 'scarcity':
//         setSuccess((prev) => ({ ...prev, scarcity: !!value }));
//         break;
//       default:
//         break;
//     }
//   };

  return (
    <div>
      <GameHeader />
      <div className="min-h-screen p-4">
        <div className="flex">
          <div className="w-1/4 pr-4">
            <h2 className="text-2xl font-bold mb-2">Name your game:</h2>
            <input
              type="text"
              placeholder="Enter a title for this game"
              className="input input-bordered w-full mb-4"
              value={gameTitle}
              onChange={(e) => {
                setGameTitle(e.target.value);
                updateSuccess('title', e.target.value);
              }}
            />
            {success.gameTitle && <span className="text-green-500">✔</span>}

            <h2 className="text-2xl font-bold mb-2">Description:</h2>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              placeholder="Enter a description for this game"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                updateSuccess('description', e.target.value);
              }}
            ></textarea>
            {success.description && <span className="text-green-500">✔</span>}
            <h2 className="text-2xl font-bold mb-2">Abundance:</h2>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              placeholder="Enter an abundance for this game"
              value={abundance}
              onChange={(e) => {
                setAbundance(e.target.value);
                updateSuccess('abundance', e.target.value);
              }}
            ></textarea>
            {success.abundance && <span className="text-green-500">✔</span>}

            <h2 className="text-2xl font-bold mb-2">Scarcity:</h2>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              placeholder="Enter a scarcity for this game"
              value={scarcity}
              onChange={(e) => {
                setScarcity(e.target.value);
                updateSuccess('scarcity', e.target.value);
              }}
            ></textarea>
            {success.scarcity && <span className="text-green-500">✔</span>}

            <div className="flex items-center justify-between">
              <button className="btn btn-primary mt-6" onClick={handleStartSpring}>
                Start Spring
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}