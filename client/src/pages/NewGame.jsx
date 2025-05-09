//the page where a user sets up basic info about their game. leads to GameProgress//the page where a user sets up basic info about their game. leads to GameProgress

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/authContext';
import GameHeader from '../components/GameHeader.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSeason } from '../contexts/seasonContext.jsx'; 


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

    const { currentSeason = 'Spring', seasonThemes = {} } = useSeason();
    const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' };

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

    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (section) => {
      setExpandedSection((prev) => (prev === section ? null : section));
    };


  return (
    <div>
      <GameHeader />
      <div className={`min-h-screen p-6 flex gap-6 ${theme.bodyBg}`}>
        {/* Left Column */}
        <div
          className={`w-1/3 p-6 rounded-lg text-center ${theme.statsBg} ${theme.statsText}`}
        >
          <h2 className="text-xl font-bold mb-4">Setting Up Your Game</h2>
            <div>
              <p className={`text-sm mb-2`}>To play the game, you need only three things: </p>
              <div className="flex items-center justify-center mb-4">
                <ul className={`text-sm list-disc list-inside mb-4 text-left`}>
                  <li>A place to draw your map, be it digital or a piece of paper.</li>
                  <li>This companion app.</li>
                  <li>Imagination!</li>
                </ul>
              </div>
            </div>

          {/* Who We Are Section */}
            <div className={`flex flex-col items-center justify-center text-center mt-8`}>
              <h2 className="text-xl font-bold mb-4">Before You Play</h2>
              <p className={`text-sm mb-8`}>Make sure to read the following:</p>

              <div
                className={`cursor-pointer p-4 uppercase font-lg font-bold ${theme.statsText} ${theme.statsTextHover}`}
                onClick={() => toggleSection('whoWeAre')}
              >
                ❯❯ Who We Are ❮❮
              </div>
              {expandedSection === 'whoWeAre' && (
                <div className={`p-4 text-sm text-justify ${theme.bodyInputBg} ${theme.bodyInputText} rounded-b-lg shadow-md`}>
                  <p className={`mb-2`}>
                  We all have two roles to play in this game. The first is to represent the community at a bird’s eye level, and to care about its fate. The second is to dispassionately introduce dilemmas, as scientists conducting an experiment. <em>The Quiet Year</em> asks us to move in and out of these two roles.
                  </p>
                  <p className={`mb-2`}>
                    We don’t embody specific characters nor act out scenes. Instead, we represent currents of thought within the community. When we speak or take action, we might be representing a single person or a great many. If we allow ourselves to care about the fate of these people, <em>The Quiet Year</em> becomes a richer experience and serves as a lens for understanding communities in conflict.
                   </p>
                  <p className={`mb-2`}> 
                    We’ll also be presented with opportunities to introduce new issues for the community to deal with. This will often happen when we draw cards or use the <em>Discover Something New</em> action. By dispassionately introducing dilemmas, and then returning to our other role as representatives of the community, we create tension and make the community’s successes feel real. If there’s an issue you struggle with in real life (like whether violence is ever justified), introduce situations that call it into question.
                  </p>
                    
                </div>
              )}
            </div>

            {/* Sketching Terrain Section */}
            <div className={`flex flex-col items-center justify-center text-center mt-2`}>
              <div
                className={`cursor-pointer p-4 uppercase font-lg font-bold ${theme.statsText} ${theme.statsTextHover}`}
                onClick={() => toggleSection('sketchingTerrain')}
              >
                ❯❯ Sketching Terrain ❮❮
              </div>
              {expandedSection === 'sketchingTerrain' && (
                <div className={`p-4 text-sm text-justify  ${theme.bodyInputBg} ${theme.bodyInputText} rounded-b-lg shadow-md`}>
                  <p className={`mb-2`}>
                    Before the game begins, we must establish some facts about the community and what its surroundings are like. We begin with a brief discussion (taking two minutes at most) of the general terrain and habitat of the area. This can be as simple as someone saying, “how about a community in a rocky desert?” and everyone else nodding in agreement. At this point, each of us should introduce one detail about the local terrain. When we introduce our detail, we then sketch our contribution onto the map. These sketches should be rough and simple, leaving lots of blank space for additions during play. The community itself should be fairly large on the map, perhaps occupying a third of the sheet. Unless otherwise stated, assume that our community has 60-80 members.
                  </p>
                  <p className={`mb-2`}>
                    As an example, a group might decide to set their game in a forest. The first player introduces the detail: “Alright, the forest is full of young, spindly trees.” The next player adds, “And it’s nestled within a steep mountain range.” The third player adds, “We’ve taken up residence in an old mining camp.” The final player says, “And the trees in this area have all been clearcut.” As details are added, the players draw them on the map.
                  </p>
                  <p className={`mb-2 italic`}>
                    Everyone should introduce a detail and draw it on the map before proceeding.
                  </p>
                    
                </div>
              )}
            </div>

            {/* Starting Resources Section */}
            <div className={`flex flex-col items-center justify-center text-center mt-2`}>
              <div
                className={`cursor-pointer p-4 uppercase font-lg font-bold ${theme.statsText} ${theme.statsTextHover}`}
                onClick={() => toggleSection('startingResources')}
              >
                ❯❯ Starting Resources ❮❮
              </div>
              {expandedSection === 'startingResources' && (
                <div className={`p-4 text-sm text-justify  ${theme.bodyInputBg} ${theme.bodyInputText} rounded-b-lg shadow-md`}>
                  <p className={`mb-2`}>
                    Next, we each declare an important resource for the community, something which we might have in either abundance or scarcity. Some examples are:
                  </p>
                  <ul className={`text-sm list-disc list-inside mb-2`}>
                    <li>clean drinking water</li>
                    <li>a source of energy</li>
                    <li>protection from predators</li>
                    <li>adequate shelter</li>
                    <li>food</li>
                  </ul>
                  <p className={`mb-2`}>
                    Choosing a resource makes it important, if it wasn’t already. If you pick ‘gasoline,’ it becomes something that your community wants and needs.
                  </p>
                  <p className={`mb-2`}>
                    As a group, we now choose one of those resources to be in Abundance. It gets listed under Abundances, and whoever called it now draws an abundance of this resource on the map. The other resources get listed as Scarcities, and the players who called them draw their absence or scarcity on the map somehow. Remember that symbols and symbolic representations are fine, but words should be avoided.
                  </p>
                  <p className={`mb-2 italic`}>
                    Have everyone declare a resource and decide which one is in Abundance. Update the map to reflect before proceeding.
                  </p>
                </div>
              )}
            </div>


        </div>

        {/* Right Column */}
        <div
          className={`w-2/3 p-6 rounded-lg ${theme.bodyBg} ${theme.bodyText}`}
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Create a New Game</h2>
          <form onSubmit={handleStartSpring}>
            <div className="mb-4">
              <label className="block font-bold mb-1" htmlFor="gameTitle">
                Name your game:
              </label>
              <input
                type="text"
                id="gameTitle"
                maxLength="30"
                placeholder="This is how your community will be remembered."
                className={`input input-bordered w-full ${theme.bodyInputBg} ${theme.bodyInputText}`}
                value={gameTitle}
                onChange={(e) => {
                  setGameTitle(e.target.value);
                  updateSuccess('gameTitle', e.target.value);
                }}
              />
              {success.gameTitle && <span className="text-[#97be5a]">✔</span>}
            </div>

            <div className="my-8">
              <label className="block font-bold mb-1" htmlFor="description">
                Description:
              </label>
              <textarea
                id="description"
                placeholder="Describe your setting: your world, your community, your goals."
                className={`textarea textarea-bordered w-full ${theme.bodyInputBg} ${theme.bodyInputText}`}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  updateSuccess('description', e.target.value);
                }}
              ></textarea>
              {success.description && <span className="text-[#97be5a]">✔</span>}
            </div>

            <div className="my-8 flex gap-6">
              <div className="w-1/2">
                <label className="block font-bold mb-1" htmlFor="abundance">
                  Abundance:
                </label>
                <textarea
                  id="abundance"
                  placeholder="Only one resource can be abundant. Enter it here."
                  className={`textarea textarea-bordered w-full ${theme.bodyInputBg} ${theme.bodyInputText}`}
                  value={abundance}
                  onChange={(e) => {
                    setAbundance(e.target.value);
                    updateSuccess('abundance', e.target.value);
                  }}
                ></textarea>
                {success.abundance && <span className="text-[#97be5a]">✔</span>}
              </div>

              <div className="w-1/2">
                <label className="block font-bold mb-1" htmlFor="scarcity">
                  Scarcities:
                </label>
                <textarea
                  id="scarcity"
                  placeholder="The rest of your resources are scarce. Enter them here."
                  className={`textarea textarea-bordered w-full ${theme.bodyInputBg} ${theme.bodyInputText}`}
                  value={scarcity}
                  onChange={(e) => {
                    setScarcity(e.target.value);
                    updateSuccess('scarcity', e.target.value);
                  }}
                ></textarea>
                {success.scarcity && <span className="text-[#97be5a]">✔</span>}
              </div>
            </div>

            <div className="flex flex-col items-center justify-between mt-10">
              <button
                type="submit"
                className={`btn btn-primary border-none shadow-md ${theme.nextWeekBtnBg} ${theme.nextWeekBtnText} ${theme.nextWeekBtnBgHover}`}
              >
                Start Spring
              </button>
              {error && <p className="text-[#d44747]">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
//     <div>
//       <GameHeader />
//       <div className="min-h-screen p-4">
//         <div className="flex">
//           <div className="w-1/4 pr-4">
//             <h2 className="text-2xl font-bold mb-2">Name your game:</h2>
//             <input
//               type="text"
//               placeholder="Enter a title for this game"
//               className="input input-bordered w-full mb-4"
//               value={gameTitle}
//               onChange={(e) => {
//                 setGameTitle(e.target.value);
//                 updateSuccess('title', e.target.value);
//               }}
//             />
//             {success.gameTitle && <span className="text-green-500">✔</span>}

//             <h2 className="text-2xl font-bold mb-2">Description:</h2>
//             <textarea
//               className="textarea textarea-bordered w-full mb-4"
//               placeholder="Enter a description for this game"
//               value={description}
//               onChange={(e) => {
//                 setDescription(e.target.value);
//                 updateSuccess('description', e.target.value);
//               }}
//             ></textarea>
//             {success.description && <span className="text-green-500">✔</span>}
//             <h2 className="text-2xl font-bold mb-2">Abundance:</h2>
//             <textarea
//               className="textarea textarea-bordered w-full mb-4"
//               placeholder="Enter an abundance for this game"
//               value={abundance}
//               onChange={(e) => {
//                 setAbundance(e.target.value);
//                 updateSuccess('abundance', e.target.value);
//               }}
//             ></textarea>
//             {success.abundance && <span className="text-green-500">✔</span>}

//             <h2 className="text-2xl font-bold mb-2">Scarcity:</h2>
//             <textarea
//               className="textarea textarea-bordered w-full mb-4"
//               placeholder="Enter a scarcity for this game"
//               value={scarcity}
//               onChange={(e) => {
//                 setScarcity(e.target.value);
//                 updateSuccess('scarcity', e.target.value);
//               }}
//             ></textarea>
//             {success.scarcity && <span className="text-green-500">✔</span>}

//             <div className="flex items-center justify-between">
//               <button className="btn btn-primary mt-6" onClick={handleStartSpring}>
//                 Start Spring
//               </button>
//               {error && <p className="text-red-500">{error}</p>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }