//the page where a user sets up basic info about their game. leads to GameProgress//the page where a user sets up basic info about their game. leads to GameProgress

import React, { useState, useContext } from 'react';
import { authContext } from '../authContext';
import NewGameHeader from '../components/NewGameHeader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ORIGIN_URL } from '../config';

export default function CreateNewGame() {
    // Authentication and user context
    const { user } = useContext(authContext);
    const token = user?.token; // Assuming the token is stored in the user object
    
    // Redirecting to login if not authenticated
    const navigate = useNavigate();
    useEffect(() => {
      if (!user) {
        navigate('/login');
      }
    }, [user, navigate]);

  
    // State variables
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [end, setEnding] = useState('');
    const [abundance, setAbundance] = useState('');
    const [scarcity, setScarcity] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState({ 
        title: false, 
        description: false, 
        end: false, 
        abundance: false, 
        scarcity: false 
    });

    //Handle creating a new game:
    const handleCreateGame = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('end', end);
        formData.append('abundance', abundance);
        formData.append('scarcity', scarcity);

        try {
            // Send the data to the server
            const res = await axios.post(`${ORIGIN_URL}/game`, formData, {
                headers: { Authorization: `Bearer ${token}` },
              });
            return res.data;
          } catch (err) {
            console.error('Error creating game:', err);
            setError('Failed to create the game. Please try again.');
            throw err;
          }
        };

    //Handle submit and start spring:   
    const handleStartSpring = async (e) => {
        e.preventDefault();
        if (!title || !description || !end || !abundance || !scarcity) {
          setError('Please fill in all fields before starting the game.');
          return;
        }
        try {
          const gameData = await handleCreateGame();
          navigate('/gameProgress'); // Navigate to the game progress page
        } catch (err) {
          console.error('Error starting the game:', err);
        }
      };

  // Update success state for checkmarks
  const updateSuccess = (field, value) => {
    switch (field) {
      case 'title':
        setSuccess((prev) => ({ ...prev, title: !!value }));
        break;
      case 'description':
        setSuccess((prev) => ({ ...prev, description: !!value }));
        break;
      case 'end':
        setSuccess((prev) => ({ ...prev, end: !!value }));
        break;
      case 'abundance':
        setSuccess((prev) => ({ ...prev, abundance: !!value }));
        break;
      case 'scarcity':
        setSuccess((prev) => ({ ...prev, scarcity: !!value }));
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <NewGameHeader />
      <div className="min-h-screen p-4">
        <div className="flex">
          <div className="w-1/4 pr-4">
            <h2 className="text-2xl font-bold mb-2">Name your game:</h2>
            <input
              type="text"
              placeholder="Enter a title for this game"
              className="input input-bordered w-full mb-4"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                updateSuccess('title', e.target.value);
              }}
            />
            {success.title && <span className="text-green-500">✔</span>}

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

            <h2 className="text-2xl font-bold mb-2">End:</h2>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              placeholder="Enter an ending for this game"
              value={end}
              onChange={(e) => {
                setEnding(e.target.value);
                updateSuccess('end', e.target.value);
              }}
            ></textarea>
            {success.end && <span className="text-green-500">✔</span>}

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