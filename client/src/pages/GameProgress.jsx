import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import PromptModal from '../components/PromptModal.jsx';
import GameStats from '../components/GameStats.jsx';
import { useNavigate } from 'react-router-dom';
import { getLatestGame, createGame, saveGameData, getAllGames, getGameByTitleAndWeek } from '../api/gameApi.js';
import { getNextPrompt, savePromptData, createPrompt } from '../api/promptApi.js';
import { authContext } from '../context/authContext.jsx'; //adjust if needed
import { handleApiError } from '../utils/errorHandler.js';
  

export default function GameProgress() {
  const { user } = useContext(authContext); // get the logged-in user
  const [gameTitle, setGameTitle] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [formData, setFormData] = useState({
    discussion: '',
    discovery: '',
    project_title: '',
    project_desc: '',
    project_weeks: 1, // Start at 1, max 6
    showDiscussionModal: false,
    showDiscoveryModal: false,
    showProjectModal: false,
  });

  const [currentWeek, setCurrentWeek] = useState(1);
  const [season, setSeason] = useState('Spring');
  const [shownPrompts, setShownPrompts] = useState([]); // To keep track of shown prompts
  const [seasonPrompts, setSeasonPrompts] = useState([]); // To store current season's prompts
  const navigate = useNavigate();
  const GAME_OVER_PROMPT_ID = '6809feda210f991dba3d9c70';

  // Season order and prompt fetching logic
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];


  useEffect(() => {
    fetchCurrentGameState();
  }, []);

  // Fetch the current game state and prompts
  const fetchCurrentGameState = async () => {
    try {
      const res = await getLatestGame(user._id, gameTitle); // Fetch the latest game for the user and title
      const game = res.data;
      setGameTitle(game.title);
      const week = res.data.week;
      setCurrentWeek(week);
      fetchPrompt(week, game.season || 'Spring'); // Fetch prompt based on the current season
    } catch (err) {
      handleApiError(error, 'fetchCurrentGameState');
    }
  };
  
  // const fetchPrompt = async (week) => {
  //   try {
  //     const res = await getNextPrompt(week);
  //     setPrompt(res.data);
  //     setSeason(res.data.season);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // Fetch prompts based on the current season and ensure non-repeating prompts
  
  const fetchPrompt = async (week, season) => {
    try {
      const res = await getNextPrompt(week, season); // Pass season to API call
      const newPrompts = res.data;

      // Filter out prompts that have already been shown
      const availablePrompts = newPrompts.filter(prompt => !shownPrompts.includes(prompt._id));

      if (availablePrompts.length === 0) {
        // If no prompts are available for the current season, move to the next season
        switchSeason();
        return;
      }

      // Set the prompt for this week
      setPrompt(availablePrompts[0]);
      setSeason(season); // update the current season
      setShownPrompts(prev => [...prev, availablePrompts[0]._id]); // Track shown prompt IDs
      setSeasonPrompts(availablePrompts); // Store the list of available prompts for the season
    } catch (err) {
      handleApiError(error, 'fetchPrompt');
    }
  };

  // Switch to the next season once all prompts for the current season have been exhausted
  const switchSeason = () => {
    const currentSeasonIndex = seasons.indexOf(season);
    const nextSeason = seasons[(currentSeasonIndex + 1) % seasons.length]; // determine the next season; Loop back to Spring after Winter
    setSeason(nextSeason); //update season again
    fetchPrompt(currentWeek, nextSeason); // Fetch prompts for the next season
  };
  
  const handleNextWeek = async () => {
    try {
        // Save data into the current week
        await saveGameData(gameTitle, currentWeek, {
          ...formData,
          prompt_id: prompt._id, // Include the prompt_id for the current week
          discovery: formData.discovery, // Save discovery field
          discussion: formData.discussion, // Save discussion field
          project_title: formData.project_title, // Save project title
          project_desc: formData.project_desc, // Save project description
          project_weeks: formData.project_weeks, // Save project weeks
        });
        await savePromptData(gameTitle, currentWeek, formData); // Save the current week's prompt data

        // Create a new game entry for the next week
        const nextWeek = currentWeek + 1; // Increment the week number
        await createGame({
          user_id: user._id, // Copy user_id
          title: gameTitle, // Copy game title
          description: formData.description || 'No description provided.', // Copy game description
          week: nextWeek, // Set the next week
          abundance: formData.abundance || '', // Copy abundance
          scarcity: formData.scarcity || '', // Copy scarcity
          contempt: formData.contempt || 0, // Copy contempt
        });      

      //reset form data for new week
      setFormData({
        discussion: '',
        discovery: '',
        project_title: '',
        project_desc: '',
        project_weeks: 1, // Reset project week to 1
        showDiscussionModal: false,
        showDiscoveryModal: false,
        showProjectModal: false,
      });

      // Update the current week state
      setCurrentWeek(nextWeek);

      fetchCurrentGameState(); //refresh game state
    } catch (err) {
      handleApiError(error, 'handleNextWeek');
    }
  };
  
// define colour themes for each season, idk if I'm doing it right
  const seasonThemes = {
    Spring: 'bg-green-100 text-green-900',
    Summer: 'bg-yellow-100 text-yellow-900',
    Autumn: 'bg-orange-100 text-orange-900',
    Winter: 'bg-blue-100 text-blue-900',
  };

  const theme = seasonThemes[season] || '';


  return (
    <div className={`min-h-screen p-4 ${theme}`}>
      <div className={`flex ${theme}`}>
        <div className={`w-1/4 pr-4 ${theme}`}>
          <GameStats 
            formData={formData} 
            setFormData={setFormData}
            gameTitle={gameTitle} 
              //pass the dynamic game title and data to GameStats
            />
        </div>
        <div className={`w-3/4 ${theme}`}>
          <h2 className="text-2xl font-bold mb-2">Week {currentWeek}, {season}</h2>
          {prompt && (
            <div>
              <h3 className="text-xl font-semibold">{prompt.prompt_title}</h3>
              <p className="mb-4">{prompt.prompt}</p>
              <PromptModal 
                prompt={prompt} 
                formData={formData} 
                setFormData={setFormData} 
                seasonTheme={seasonThemes[season]} 
                currentWeek={currentWeek} // Pass currentWeek as a prop
                gameTitle={gameTitle} // Pass gameTitle as a prop
                // Pass the prompt, form data, and seasonal theme to PromptModal
                />
              <button className="btn btn-primary mt-6" onClick={handleNextWeek}>
                {prompt._id.toString() === GAME_OVER_PROMPT_ID ? 'Game Over' : 'Next Week'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// return (
//   <div className={`min-h-screen p-4 ${theme}`}>
//     <div className={`flex ${theme}`}>
//       <div className={`w-1/4 pr-4 ${theme}`}>
//         <GameStats formData={formData} setFormData={setFormData} />
//       </div>
//       <div className={`w-3/4 ${theme}`}>
//         <h2 className="text-2xl font-bold mb-2">Week {currentWeek}, {season}</h2>
//         {prompt && (
//           <div>
//             <h3 className="text-xl font-semibold">{prompt.prompt_title}</h3>
//             <p className="mb-4">{prompt.prompt}</p>
//             <PromptModal prompt={prompt} formData={formData} setFormData={setFormData} />

//             <div className="mt-6">
//               <div className="flex space-x-4">
//                 {/* Discover Something New Form */}
//                 <div className="w-1/3">
//                   <h4 className="font-semibold">Discover Something New</h4>
//                   <textarea
//                     value={formData.discovery}
//                     onChange={(e) => setFormData({ ...formData, discovery: e.target.value })}
//                     className="w-full p-2 mt-2 border border-gray-300 rounded"
//                     rows={3}
//                   ></textarea>
//                 </div>

//                 {/* Hold a Discussion Form */}
//                 <div className="w-1/3">
//                   <h4 className="font-semibold">Hold a Discussion</h4>
//                   <textarea
//                     value={formData.discussion}
//                     onChange={(e) => setFormData({ ...formData, discussion: e.target.value })}
//                     className="w-full p-2 mt-2 border border-gray-300 rounded"
//                     rows={3}
//                   ></textarea>
//                 </div>

//                 {/* Start a Project Form */}
//                 <div className="w-1/3">
//                   <h4 className="font-semibold">Start a Project</h4>
//                   <input
//                     type="text"
//                     placeholder="Project Title"
//                     value={formData.project_title}
//                     onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
//                     className="w-full p-2 mt-2 border border-gray-300 rounded"
//                   />
//                   <textarea
//                     placeholder="Project Description"
//                     value={formData.project_desc}
//                     onChange={(e) => setFormData({ ...formData, project_desc: e.target.value })}
//                     className="w-full p-2 mt-2 border border-gray-300 rounded"
//                     rows={3}
//                   ></textarea>
//                   <div className="mt-2 flex items-center">
//                     <label className="mr-2">Weeks:</label>
//                     <input
//                       type="number"
//                       min="1"
//                       max="6"
//                       value={formData.project_weeks}
//                       onChange={(e) => setFormData({ ...formData, project_weeks: e.target.value })}
//                       className="w-16 p-2 border border-gray-300 rounded"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Next Week Button */}
//               <button
//                 className="btn btn-primary mt-6"
//                 onClick={handleNextWeek}
//               >
//                 {prompt._id === GAME_OVER_PROMPT_ID ? 'Game Over' : 'Next Week'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );
// }

// export default function GameProgress() {
//   const [formData, setFormData] = useState({
//     discovery: '',
//     discussion: '',
//     project_title: '',
//     project_desc: '',
//     project_weeks: 1,
//     showDiscussionModal: false,
//     showDiscoveryModal: false,
//     showProjectModal: false,
//     currentPromptIndex: 0,  // Tracks the index of the current prompt
//     currentSeason: 'spring' // Starts with the "spring" season
//   });

//   const [prompts, setPrompts] = useState([]);
//   const [seasonPrompts, setSeasonPrompts] = useState([]);
//   const [seasonExhausted, setSeasonExhausted] = useState(false);

//   // Function to fetch prompts based on the current season
//   const fetchPromptsForSeason = async (season) => {
//     try {
//       const response = await gameAPI.get(`/prompts?season=${season}`);
//       const newPrompts = response.data;  // Assuming API returns a list of prompts
//       setSeasonPrompts(newPrompts);
//       setPrompts(newPrompts);  // Initialize prompts with the new prompts for the season
//       setSeasonExhausted(false);  // Reset season exhausted flag
//     } catch (error) {
//       console.error(`Error fetching ${season} prompts:`, error);
//     }
//   };

//   // Update formData's current season when the prompts for the current season are exhausted
//   const handleSeasonExhausted = () => {
//     setSeasonExhausted(true);
//     // Change season and fetch new prompts when one season is exhausted
//     const nextSeason = {
//       spring: 'summer',
//       summer: 'autumn',
//       autumn: 'winter',
//       winter: 'spring'
//     };

//     const nextSeasonName = nextSeason[formData.currentSeason];
//     setFormData(prevState => ({ ...prevState, currentSeason: nextSeasonName }));
//   };

//   useEffect(() => {
//     if (prompts.length === 0) {
//       // Only fetch new prompts if the list is empty (when season prompts are exhausted)
//       fetchPromptsForSeason(formData.currentSeason);
//     }
//   }, [formData.currentSeason, prompts]);

//   // Handle when all prompts for the current season are exhausted
//   useEffect(() => {
//     if (seasonExhausted && seasonPrompts.length > 0) {
//       handleSeasonExhausted();
//     }
//   }, [seasonExhausted, seasonPrompts]);

//   // Function to handle when a prompt is completed (e.g., a prompt is resolved or a modal is closed)
//   const completePrompt = () => {
//     // Logic for completing a prompt
//     setFormData(prev => ({ ...prev, currentPromptIndex: prev.currentPromptIndex + 1 }));
//     if (formData.currentPromptIndex >= seasonPrompts.length) {
//       // If all prompts for the current season are completed, move to the next season
//       handleSeasonExhausted();
//     }
//   };

//   // Get the current prompt based on the index
//   const currentPrompt = prompts[formData.currentPromptIndex];

//   return (
//     <div>
//       {currentPrompt && (
//         <PromptModal
//           prompt={currentPrompt}
//           formData={formData}
//           setFormData={setFormData}
//           onComplete={completePrompt} // Pass the completePrompt function to handle prompt completion
//         />
//       )}

//       {/* Optionally, render a message when all prompts are completed */}
//       {seasonExhausted && (
//         <div className="text-center mt-4">
//           <p>All {formData.currentSeason} prompts are completed. Moving to the next season...</p>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import GameStats from './components/GameStats';
// import PromptModal from './components/PromptModal';


// export default function GameProgress() {
//   const [gameData, setGameData] = useState(null);
//   const [prompt, setPrompt] = useState(null);
//   const [season, setSeason] = useState('spring');
//   const [formData, setFormData] = useState({});
//   const [week, setWeek] = useState(1);

//   useEffect(() => {
//     fetchPrompt();
//   }, []);

//   const fetchPrompt = async () => {
//     const usedPromptIds = gameData?.prompts?.map(p => p.prompt_id) || [];
//     const response = await axios.get(`/prompts`, { params: { season, exclude: usedPromptIds } });
//     if (response.data.length === 0) {
//       const nextSeason = getNextSeason(season);
//       setSeason(nextSeason);
//       fetchPrompt();
//     } else {
//       const selected = response.data[Math.floor(Math.random() * response.data.length)];
//       setPrompt(selected);
//     }
//   };

//   const getNextSeason = (current) => {
//     const order = ['spring', 'summer', 'autumn', 'winter'];
//     const index = order.indexOf(current);
//     return order[Math.min(index + 1, order.length - 1)];
//   };

//   const handleFormChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleNextWeek = async () => {
//     const newGameEntry = {
//       week,
//       title: 'Game Title',
//       description: 'Game Description',
//       user_id: 'USER_ID_PLACEHOLDER',
//       prompts: [{ prompt_id: prompt._id }],
//       season,
//       ...formData,
//     };

//     await axios.post('/api/games', newGameEntry);
//     setWeek(prev => prev + 1);
//     setFormData({});
//     fetchPrompt();
//   };

//   const seasonColors = {
//     spring: 'bg-green-100',
//     summer: 'bg-yellow-100',
//     autumn: 'bg-orange-100',
//     winter: 'bg-blue-100'
//   };

//   return (
//     <div className={`min-h-screen p-4 ${seasonColors[season]}`}>
//       <div className="flex">
//         <GameStats formData={formData} setFormData={setFormData} />
//         <div className="flex-1 ml-4">
//           <h2 className="text-xl font-bold">Week {week}, {season.charAt(0).toUpperCase() + season.slice(1)}</h2>
//           {prompt && (
//             <div className="mt-4">
//               <h3 className="text-lg font-semibold">{prompt.prompt_title}</h3>
//               <p className="mb-4">{prompt.prompt}</p>
//               <PromptModal prompt={prompt} formData={formData} setFormData={setFormData} />
//             </div>
//           )}
//           <button onClick={handleNextWeek} className="btn btn-primary mt-6">Next Week</button>
//         </div>
//       </div>
//     </div>
//   );
// }
