import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ActionModal from '../components/ActionModal.jsx';
import GameStats from '../components/GameStats.jsx';
import { useNavigate } from 'react-router-dom';
import { getLatestGame, createGame, saveGameData, saveActionData } from '../api/gameApi.js';
import { getNextPrompt, createPrompt } from '../api/promptApi.js';
import { useAuthContext } from '../contexts/authContext.jsx'; //adjust if needed
import { handleApiError } from '../utils/errorHandler.js';
import { useSeason } from '../contexts/seasonContext.jsx'; // Import the season context

export default function GameProgress() {
  const { user } = useContext(useAuthContext); // get the logged-in user
  const { currentSeason = 'Spring', setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context
  const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black'}; // Get the theme based on the current season
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
  // const [season, setSeason] = useState('Spring');
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

      // Fetch prompt based on the current season
      fetchPrompt(week, game.season || 'Spring'); 
    } catch (err) {
      handleApiError(error, 'fetchCurrentGameState');
    }
  };
  

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
      const selectedPrompt = availablePrompts[0];
      setPrompt(selectedPrompt);

      // setSeason(season); // update the current season
      setCurrentSeason(selectedPrompt.season || 'Spring'); // Update the current season in context

      setShownPrompts(prev => [...prev, selectedPrompt._id]); // Track shown prompt IDs
      setSeasonPrompts(availablePrompts); // Store the list of available prompts for the season
    } catch (err) {
      handleApiError(error, 'fetchPrompt');
    }
  };

  // Switch to the next season once all prompts for the current season have been exhausted
  const switchSeason = () => {
    const currentSeasonIndex = seasons.indexOf(season);
    const nextSeason = seasons[(currentSeasonIndex + 1) % seasons.length]; // determine the next season; Loop back to Spring after Winter
    // setSeason(nextSeason); //update season again
    setCurrentSeason(nextSeason); //update season in context
    fetchPrompt(currentWeek, nextSeason); // Fetch prompts for the next season
  };
  
  const handleNextWeek = async () => {
    try {
        // Save data into the current week
        await saveGameData(gameTitle, currentWeek, {
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


  return (
    <div className={`min-h-screen p-4 ${theme.bodyBg || 'bg-white'} ${theme.bodyText || 'text-black'}`}> 
      <div className={`flex`}> 
        <div className={`w-1/4 pr-4`}>
          <GameStats 
            formData={formData} 
            setFormData={setFormData}
            gameTitle={gameTitle}
            currentSeason={currentSeason} 
              //pass the dynamic game title and data to GameStats + season
            />
        </div>
        <div className={`w-3/4 ${theme}`}>
          <h2 className="text-2xl font-bold mb-2">Week {currentWeek}, {currentSeason}</h2>
          {prompt && (
            <div>
              <h3 className="text-xl font-semibold">{prompt.prompt_title}</h3>
              <p className="mb-4">{prompt.prompt}</p>
              <ActionModal 
                prompt={prompt} 
                formData={formData} 
                setFormData={setFormData} 
                // seasonTheme={seasonThemes[currentSeason]}
                currentSeason={currentSeason} // Pass currentSeason as a prop
                currentWeek={currentWeek} // Pass currentWeek as a prop
                gameTitle={gameTitle} // Pass gameTitle as a prop
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
