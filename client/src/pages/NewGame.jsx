//the page where a user sets up basic info about their game. leads to GameProgress//the page where a user sets up basic info about their game. leads to GameProgress

import React, { useState, useContext } from 'react';
import { authContext } from '../authContext';
import NewGameHeader from '../components/NewGameHeader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ORIGIN_URL } from '../config';
import { CreateGame } from '../api/gameApi.js';

export default function CreateNewGame() {

    // Authentication and user context
    const { user } = authContext;

    // State variables
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [end, setEnding] = useState(null);
    const [abundance, setAbundance] = useState(null);
    const [scarcity, setScarcity] = useState(null);
    const [startSpring, setStartSpring] = useState(null);
    const [error, setError] = useState('');

    // Navigation
    const navigate = useNavigate();

    //Handle creating a new game:
    const handleCreateGame = async (e) => {
        const formData = new formData();
        formData.append('title', gameTitle);
        formData.append('description', description);
        formData.append('end', end);
        formData.append('abundance', abundance);
        formData.append('scarcity', scarcity);

        try {
            // Send the data to the server
            const res = await axios.post(`${ORIGIN_URL}/game, inputData`)
            //TODO: const res = await createGame(inputData)
            return res.data;
        } catch (err) {
            console.error('Error creating game:', err);
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
            const gameData = await handleCreateGame(e);
            setStartSpring(gameData.startSpring); // Assuming the server returns the startSpring value
            navigate('/gameProgress'); // Navigate to the game progress page
        } catch (err) {
            console.error('Error starting the game:', err);
        }
        // Send the start spring data to the server
        setStartSpring(e.target.value);
    };

    //


    return (
        <div>
            <NewGameHeader />
            <div className={`min-h-screen p-4 ${theme}`}>
                <div className={`flex ${theme}`}>
                    <div className={`w-1/4 pr-4 ${theme}`}>
                        <h2 className="text-2xl font-bold mb-2">Name your game:</h2>
                        <input
                            type="text"
                            placeholder="Enter a title for this game"
                            className="input input-bordered w-full mb-4"
                            value={formData.gameTitle}
                            onChange={(e) => setTitle(e.target.value)} />
                        <h2 className="text-2xl font-bold mb-2">Description:</h2>
                        <textarea
                            className="textarea textarea-bordered w-full mb-4"
                            placeholder="Enter a description for this game"
                            value={formData.description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                        <h2 className="text-2xl font-bold mb-2">End:</h2>
                        <textarea
                            type="text"
                            placeholder="Enter an ending for this game"
                            className="textarea textarea-bordered w-full mb-4"
                            value={formData.end}
                            onChange={(e) => setEnding(e.target.value)}
                        ></textarea>
                        <h2 className="text-2xl font-bold mb-2">Abundance:</h2>
                        <textarea
                            type="text"
                            placeholder="Enter an abundance for this game"
                            className="textarea textarea-bordered w-full mb-4"
                            value={formData.abundance}
                            onChange={(e) => setAbundance(e.target.value)}
                        ></textarea>
                        <h2 className="text-2xl font-bold mb-2">Scarcity:</h2>
                        <textarea
                            type="text"
                            placeholder="Enter a scarcity for this game"
                            className="textarea textarea-bordered w-full mb-4"
                            value={formData.scarcity}
                            onChange={(e) => setScarcity(e.target.value)}
                        ></textarea>
                        <div className="flex items-center justify-between">
                            <button
                                className="btn btn-primary mt-6"
                                onClick={handleStartSpring}
                            >Start Spring</button>
                            {error && <p className="text-red-500">{error}</p>}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
