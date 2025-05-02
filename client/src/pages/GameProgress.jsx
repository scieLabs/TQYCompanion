import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ActionModal from '../components/ActionModal.jsx';
import GameStats from '../components/GameStats.jsx';
import { useNavigate } from 'react-router-dom';
import { getLatestGame, createGameEntry, saveGameData, saveActionData } from '../api/gameApi.js';
import { getNextPrompt, createPrompt } from '../api/promptApi.js';
import { useAuthContext } from '../contexts/authContext.jsx'; //adjust if needed
import { handleApiError } from '../utils/errorHandler.js';
import { useSeason } from '../contexts/seasonContext.jsx'; // Import the season context

export default function GameProgress() {
  // const { state } = useLocation(); // Access the passed state
  // const { gametitle } = useParams(); // Get the game title from the URL parameters
  const { user } = useAuthContext(); // get the logged-in user

  // const game = state?.game; // Get the game data from the passed state
  const { currentSeason = 'Spring', setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context
  const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black'}; // Get the theme based on the current season
  const [game, setGame] = useState(null);
  const [gameTitle, setGameTitle] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
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
  // const [season, setSeason] = useState('Spring');
  const [shownPrompts, setShownPrompts] = useState([]); // To keep track of shown prompts
  const [seasonPrompts, setSeasonPrompts] = useState([]); // To store current season's prompts
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const navigate = useNavigate();
  const GAME_OVER_PROMPT_ID = '6809feda210f991dba3d9c70';

  // Season order and prompt fetching logic
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];


  useEffect(() => {
    if (!user) {
      console.error('User is not logged in.');
      return;
    }
    console.log('User ID:', user._id); // Debugging: Log the user ID
    fetchCurrentGameState();
  }, [user]);

  // Fetch the current game state and prompts
  const fetchCurrentGameState = async () => {
    try {
      //FIXME: should removed gameTitle from after user._id
      console.log('Fetching game for user:', user._id);

      const res = await getLatestGame(user._id); // Fetch the latest game for the user
      console.log('API Response:', res.data); // Log the full response

      const game = res.data;
      console.log('Fetched game:', game); // Debugging: Log the fetched game

      if (!game || typeof game.week === 'undefined') {
        throw new Error('Week is not defined in the fetched game data.');
      }

      setGame(game);
      // setGameTitle(game.title); //should also be removed or?
      setCurrentWeek(game.week || 1); // Set the current week from the game data

      const season = game.season || 'Spring'; // Default to Spring if season is undefined
      console.log('Fetching prompt for season:', season);
      // Fetch prompt based on the current season
      fetchPrompt(season)
    } catch (err) {
      if (err.response?.status === 404) {
        console.error('Game not found:', err.response.data.message);
        setGame(null); // Clear the game state
      } else {
        console.error('Error in fetchCurrentGameState:', err.message);
        console.error('Stack Trace:', err.stack); // Log the stack trace
        handleApiError(err, 'fetchCurrentGameState');
      }
    }
  };
  

  // Fetch prompts based on the current season and ensure non-repeating prompts
  
  const fetchPrompt = async (season) => {
    if (loadingPrompt) return; // Prevent multiple calls
    setLoadingPrompt(true); // Set loading to true

    try {
      console.log('Fetching prompt for season:', season);
      const res = await getNextPrompt(season); // Pass season to API call
      const selectedPrompt = res.data;

      if (selectedPrompt.message === 'Game over.') {
        console.warn('Game over prompt encountered.');
        setPrompt(selectedPrompt.prompt); // Set the Game Over prompt
        // setGameOver(true); // Trigger the Game Over state
        return;
      }
  
      // Set the prompt for this week
      setPrompt(selectedPrompt);

      // setSeason(season); // update the current season
      setCurrentSeason(selectedPrompt.season || 'Spring'); // Update the current season in context
      setShownPrompts(prev => [...prev, selectedPrompt._id]); // Track shown prompt IDs
      // setSeasonPrompts(availablePrompts); // Store the list of available prompts for the season
      console.log('Fetching random prompt for season:', season);
      console.log('Fetched random prompt:', selectedPrompt);
      console.log('API Response:', res.data);
      console.log('Fetched prompt ID:', selectedPrompt._id);
    } catch (err) {
      console.error('Error in fetchPrompt:', err.response?.data?.message || err.message || err);
      handleApiError(err, 'fetchPrompt');
      // if (err.response?.status === 404) {
      //   const nextSeason = err.response.data?.nextSeason;
      //   if (nextSeason) {
      //     console.warn(`No prompts found for ${season}. Switching to ${nextSeason}.`);
      //     setCurrentSeason(nextSeason); // Update the season to the next one
      //     fetchPrompt(nextSeason); // Fetch a prompt for the next season
      //     console.log('Fetched prompt ID:', selectedPrompt._id);
      //   } else {
      //     console.error('No prompts available. Game over.');
      //     // setGameOver(true); // Trigger the Game Over state
      //   }
      // } else {
      //   console.error('Error in fetchPrompt:', err.response?.data?.message || err.message || err);
      //   handleApiError(err, 'fetchPrompt');
      // }
    } finally {
      setLoadingPrompt(false); // Reset loading state
    }
  };

  // Switch to the next season once all prompts for the current season have been exhausted
  // const switchSeason = () => {
  //   const currentSeasonIndex = seasons.indexOf(season);
  //   const nextSeason = seasons[(currentSeasonIndex + 1) % seasons.length]; // determine the next season; Loop back to Spring after Winter
  //   // setSeason(nextSeason); //update season again
  //   setCurrentSeason(nextSeason); //update season in context
  //   fetchPrompt(currentWeek, nextSeason); // Fetch prompts for the next season
  // };
  
  const handleNextWeek = async () => {
    try {
        // Save data into the current week
        await saveGameData(game.title, currentWeek, { //FIXME: instead of gameTitle
          // ...formData, --- to avoid overwriting
          prompt_id: prompt._id.toString(), // Include the prompt_id for the current week
          discovery: formData.discovery, // Save discovery field
          discussion: formData.discussion, // Save discussion field
          project_title: formData.project_title, // Save project title
          project_desc: formData.project_desc, // Save project description
          project_weeks: formData.project_weeks, // Save project weeks
        });
        await saveActionData(gameTitle, currentWeek, formData); // Save the current week's prompt data

        // Create a new game entry for the next week
        const nextWeek = currentWeek + 1; // Increment the week number
        await createGameEntry({
          user_id: user._id, // Copy user_id
          title: game.title, // Copy game title //FIXME: instead of gameTitle
          description: game.description || 'No description provided.', // Copy game description
          week: nextWeek, // Set the next week
          abundance: game.abundance, //FIXME: removed formData.abundance etc from all
          scarcity: game.scarcity,
          contempt: game.contempt,
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
      handleApiError(err, 'handleNextWeek');
    }
  };


  return (
    <div className={`min-h-screen p-4 ${theme.bodyBg || 'bg-white'} ${theme.bodyText || 'text-black'}`}> 
      <div className={`flex`}> 
        <div className={`w-1/4 pr-4`}>
          <GameStats 
            formData={formData} 
            setFormData={setFormData}
            gameTitle={game?.title} //FIXME: changed from gameTitle
            abundance={game?.abundance} 
            scarcity={game?.scarcity} 
            contempt={game?.contempt}
            currentSeason={currentSeason} 
              //pass the dynamic game title and data to GameStats + season
            />
        </div>
        <div className={`w-3/4 ${theme}`}>
          <h2 className="text-2xl font-bold mb-2">Week {currentWeek}, {currentSeason}</h2>
          {prompt && prompt._id && (
            <div>
              <h3 className="text-xl font-semibold">{prompt.prompt_title}</h3>
              <p
              className="mb-4"
              dangerouslySetInnerHTML={{ __html: prompt.prompt }}
              ></p>
              <ActionModal 
                action={prompt} 
                formData={formData} 
                setFormData={setFormData} 
                // seasonTheme={seasonThemes[currentSeason]}
                currentSeason={currentSeason} // Pass currentSeason as a prop
                currentWeek={currentWeek} // Pass currentWeek as a prop
                gameTitle={game?.Title} // Pass gameTitle as a prop //FIXME: from just gameTitle
                // Pass the prompt, form data, and seasonal themAction
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


//TODO: CHECK THE FOLLOWING PIECE OF CODE SUGGESTED FROM COPILOT:

// import { useLocation } from 'react-router-dom';
// import { useAuthContext } from '../contexts/authContext';

// export default function GameProgress() {
//   const { state } = useLocation(); // Access the passed state
//   const { user } = useAuthContext(); // Access the logged-in user from authContext

//   const game = state?.game; // Get the game data from the passed state

//   return (
//     <div>
//       <h1>Welcome, {user?.username}</h1>
//       <h2>Game Progress for: {game?.title}</h2>
//       <p>Description: {game?.description}</p>
//       <p>Abundance: {game?.abundance}</p>
//       <p>Scarcity: {game?.scarcity}</p>
//     </div>
//   );
// }