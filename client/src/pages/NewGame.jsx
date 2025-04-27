//the page where a user sets up basic info about their game. leads to GameProgress//the page where a user sets up basic info about their game. leads to GameProgress

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NewGame() {
    const [title, setTitle] = useState({});
    const [description, setDescription] = useState({});
    const [abundance, setAbundance] = useState({});
    const [scarcity, setScarcity] = useState({});
    const [startSpring, setStartSpring] = useState({});
    const [username, setUsername] = useState({});

    useEffect(() => {
        axios.get('/api/user')
            .then((res) => {
                setUsername(res.data.username);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleStartSpring = (e) => {
        setStartSpring(e.target.value);
    }



    return (
        <div>
            <h1>New Game</h1>
        </div>
    );
};