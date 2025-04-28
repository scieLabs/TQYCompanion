//the page where a user sets up basic info about their game. leads to GameProgress//the page where a user sets up basic info about their game. leads to GameProgress

import React, { useState, useContext} from 'react';
import { authContext } from '../authContext';
import NewGameHeader from '../components/NewGameHeader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {ORIGIN_URL} from '../config';
import { CreateGame } from '../api/gameApi.js';

const CreateNewGame = () => {

    // Authentication and user context
    const {user} = authContext;

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


// return (
//     <div>
//         <NewGameHeader />
//         <main className="new-game">
//         <div className=" game-details-left text-center mb-6">


//         <img
//                         src={quietYearImage}
//                         alt="The Quiet Year gameplay example"
//                         className="mx-auto"
//                     />
//             <section className="text-center">
//                 <img
//                     src={titleImage}
//                     alt="The Quiet Year Game Title"
//                     className="title-image mx-auto mb-6"
//                 />
//                 <h1 className="text-4xl font-bold mb-4">Welcome to The Quiet Year!</h1>
//                 <p className="mb-4">
//                     The Quiet Year is a map-drawing game about community, difficult choices, and the struggle to rebuild after the collapse of civilization.
//                 </p>
//             </section>

//             <section className="features grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
//                 <div className="feature-item">
//                     <p>
//                         Explore the challenges of rebuilding a community in the aftermath of a disaster. Make decisions that shape the future of your people.
//                     </p>
//                     <img
//                         src={quietYearImage}
//                         alt="The Quiet Year gameplay example"
//                         className="mx-auto"
//                     />
//                 </div>
//                 <div className="feature-item">
//                     <img
//                         src={quietYearImage}
//                         alt="The Quiet Year map example"
//                         className="mx-auto"
//                     />
//                     <p>
//                         Draw maps, tell stories, and create a unique narrative with your friends. Every game is a new adventure.
//                     </p>
//                 </div>
//                 <div className="feature-item">
//                     <p>
//                         Make tough decisions as the seasons change. Will your community thrive, or will it fall apart under the weight of its challenges?
//                     </p>
//                     <img
//                         src={quietYearImage}
//                         alt="The Quiet Year decision-making example"
//                         className="mx-auto"
//                     />
//                 </div>
//             </section>

//             <section className="cta text-center mt-8">
//                 {!user ? (
//                     <button
//                         onClick={handleLoginClick}
//                         className="login-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     >
//                         Get Started!
//                     </button>
//                 ) : (
//                     <a
//                         href="/new-game"
//                         className="new-game-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                     >
//                         New Game
//                     </a>
//                 )}
//             </section>

//             {showLogin && <Login onClose={handleCloseModal} />}
//         </main>
//     </div>
// );
// };

export default CreateNewGame;