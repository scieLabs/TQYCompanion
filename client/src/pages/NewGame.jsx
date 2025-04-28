//the page where a user sets up basic info about their game. leads to GameProgress//the page where a user sets up basic info about their game. leads to GameProgress

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {ORIGIN_URL} from '../config';

const newGameData = () => {
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [end, setEnding] = useState(null);
    const [abundance, setAbundance] = useState(null);
    const [scarcity, setScarcity] = useState(null);
    const [startSpring, setStartSpring] = useState(null);
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('');
    const [username, setUsername] = useState({});
    const {user} = useAuth();

    //Handle creating a new game:
    const handleCreateGame = async (e) => {
        e.preventDefault();
        setError();
        setSuccess();

        const inputData = new formData();
        inputData.append('title', title);
        inputData.append('description', description);
        inputData.append('end', end);
        inputData.append('abundance', abundance);
        inputData.append('scarcity', scarcity);

        try {
            //FIXME: check URL
            await axios.post(`${ORIGIN_URL}/api/v1/users/newGame`)
        }

    };
    

    const navigate = useNavigate ();
    const fileInputRef = useRef(null);

//




    useEffect(() => {
        axios.get('/user')
            .then((res) => {
                setUsername(res.data.username);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

// Store entered data into DB and start spring:
    const storeData(inputData)


    const handleStartSpring = async () => {
        title: 
        
        
        setStartSpring(e.target.value);
    }



    return (
        <div>
            <h1>New Game</h1>
        </div>
    );
};