//the page where a user sets up basic info about their game. leads to GameProgress//the page where a user sets up basic info about their game. leads to GameProgress

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {ORIGIN_URL} from '../config';
import { CreateGame } from '../api/gameApi.js';

const CreateNewGame = () => {

    // Authentication and user context
    const [username, setUsername] = useState({});
    const {user} = useAuth();

    // State variables
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [end, setEnding] = useState(null);
    const [abundance, setAbundance] = useState(null);
    const [scarcity, setScarcity] = useState(null);
    const [startSpring, setStartSpring] = useState(null);
    const [error, setError] = useState('');

    // Navigation
    const navigate = useNavigate ();

    //Handle creating a new game:
    const handleCreateGame = async (e) => {
        const inputData = new formData();
        inputData.append('title', title);
        inputData.append('description', description);
        inputData.append('end', end);
        inputData.append('abundance', abundance);
        inputData.append('scarcity', scarcity);

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
            <h1>New Game</h1>
        </div>
    );
};