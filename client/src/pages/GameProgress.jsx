import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ActionModal from '../components/ActionModal.jsx';
import GameStats from '../components/GameStats.jsx';
import {getGameById} from '../api/gameApi.js';
import * as projectAPI from '../api/projectApi.js';
import { getStatsByGameAndWeek, createStatsEntry, saveActionData } from '../api/statApi.js';
import { getNextPrompt, createPrompt } from '../api/promptApi.js';
import { createProject } from '../api/projectApi.js';
import { useAuthContext } from '../contexts/authContext.jsx'; //adjust if needed
import { handleApiError } from '../utils/errorHandler.js';
import { useSeason } from '../contexts/seasonContext.jsx'; // Import the season context

export default function GameProgress() {
  const { game_id, week } = useParams(); // Get the game title from the URL parameters
  const { user } = useAuthContext(); // get the logged-in user
  const { currentSeason, setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context //FIXME: removed currentSeason = 'Spring',
  const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black'}; // Get the theme based on the current season
  const [game, setGame] = useState(null);


  const [stats, setStats] = useState({ abundance: '', scarcity: '', contempt: 0 });
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    discussion: '',
    discovery: '',
    project_title: '',
    project_desc: '',
    project_weeks: 1, // Start at 1, max 6
    isDiscussion: false,
    isDiscovery: false,
    isProject: false,
  });

  const [projects, setProjects] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      console.log(`Fetching all projects for game_id: ${game_id}`);
      const response = await projectAPI.getProjectsByGame(game_id);
      console.log('Response from backend:', response);
      const allProjects = response.data;
  
      console.log('All projects:', allProjects);
  
      // Sort projects into ongoing and completed
      const ongoing = allProjects.filter(
        (proj) => proj.project_weeks > 0 || proj.pp_weeks > 0
      );
      const completed = allProjects.filter(
        (proj) =>
          proj.project_weeks === 0 &&
          proj.pp_weeks === 0 &&
          (proj.project_resolve || proj.pp_resolve)
      );
  
      setProjects(allProjects);
      setOngoingProjects(ongoing);
      setCompletedProjects(completed);
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (error.response?.status === 404) {
        console.warn('No projects found for this game.');
        setProjects([]);
        setOngoingProjects([]);
        setCompletedProjects([]);
      } else {
        console.error('Error fetching projects:', error);
      }
    }
  };

  const [currentWeek, setCurrentWeek] = useState(parseInt(week, 10) || 1);
  // const [season, setSeason] = useState('Spring');
  const [shownPrompts, setShownPrompts] = useState([]); // To keep track of shown prompts
  const [seasonPrompts, setSeasonPrompts] = useState([]); // To store current season's prompts
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const navigate = useNavigate();
  const GAME_OVER_PROMPT_ID = '6809feda210f991dba3d9c70';

  // // Season order and prompt fetching logic
  // const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

  useEffect(() => {
    console.log('Current season updated:', currentSeason);
  }, [currentSeason]);

  useEffect(() => {
    console.log('Game ID:', game_id);
    fetchGameData(); //TODO: currently not using fetchCurrentGameStats
  }, [game_id, currentWeek]);

  const fetchGameData = async () => {
    try {
      const gameResponse = await getGameById(game_id);
      const statsResponse = await getStatsByGameAndWeek(game_id, currentWeek);

      setGame(gameResponse.data);
      setStats(statsResponse.data);
      console.log('Fetched game:', gameResponse.data, 'Fetched stats:', statsResponse.data);

      // Fetch the latest projects
      await fetchProjects();

      // const season = statsResponse.data.season || 'Spring';
      fetchPrompt(currentSeason);
    } catch (err) {
      console.error('Error fetching game data:', err.response?.data || err.message);
    } finally {
      setLoading(false);
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

      //FIXME: whatever this is
      if (selectedPrompt._id === GAME_OVER_PROMPT_ID) {
        console.warn('Game over prompt encountered.');
        setPrompt(selectedPrompt); // Set the Game Over prompt
        // setGameOver(true); // Trigger the Game Over state
        return;
      }
  
      // Set the prompt for this week
      setPrompt(selectedPrompt);

      // setSeason(season); // update the current season
      setCurrentSeason(selectedPrompt.season || season); // Update the current season in context
      setShownPrompts(prev => [...prev, selectedPrompt._id]); // Track shown prompt IDs
      // setSeasonPrompts(availablePrompts); // Store the list of available prompts for the season
      console.log('Fetching random prompt for season:', season);
      console.log('Fetched random prompt:', selectedPrompt);
      console.log('API Response:', res.data);
      console.log('Fetched prompt ID:', selectedPrompt._id);
    } catch (err) {
      if (err.response?.status === 404) {
        const nextSeasonIndex = (validSeasons.indexOf(season) + 1) % validSeasons.length;
        const nextSeason = validSeasons[nextSeasonIndex];
  
        console.warn(`No prompts found for ${season}. Switching to ${nextSeason}.`);
        setCurrentSeason(nextSeason); // Update the season to the next one
        fetchPrompt(nextSeason); // Fetch a prompt for the next season
      } else {
        console.error('Error in fetchPrompt:', err.response?.data?.message || err.message || err);
        handleApiError(err, 'fetchPrompt');
      }
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
      await saveActionData(game_id, currentWeek, {
        prompt_id: prompt._id,
        week: currentWeek,
        abundance: stats.abundance,
        scarcity: stats.scarcity,
        contempt: stats.contempt,
        discovery: formData.discovery,
        discussion: formData.discussion,
        project_title: formData.project_title,
        project_desc: formData.project_desc,
        project_weeks: formData.project_weeks,
      });

        // Create a new game entry for the next week
        const nextWeek = currentWeek + 1; // Increment the week number
        await createStatsEntry({
          game_id,
          week: nextWeek,
          abundance: stats.abundance,
          scarcity: stats.scarcity,
          contempt: stats.contempt,
        }); 

      // //reset form data for new week
      setFormData({
        discussion: '',
        discovery: '',
        project_title: '',
        project_desc: '',
        project_weeks: 1, // Reset project week to 1
        isDiscussion: false,
        isDiscovery: false,
        isProject: false,
      });
      // Update the current week state
      setCurrentWeek(nextWeek);
      // fetchPrompt(currentSeason);

      fetchGameData(); //refresh game state //TODO: not currentstate function

      // Redirect to the next week's URL
      navigate(`/game/${game_id}/week/${nextWeek}`);
    } catch (err) {
      handleApiError(err, 'handleNextWeek');
    }
  };


  return (
    <div className={`min-h-screen p-4 ${theme.bodyBg || 'bg-white'} ${theme.bodyText || 'text-black'}`}> 
      <div className={`flex`}> 
        <div className={`w-1/4 pr-4`}>
          <GameStats 
            // formData={formData} 
            // setFormData={setFormData}
            game_id={game_id}
            currentWeek={currentWeek}
            // abundance={stats?.abundance} 
            // scarcity={stats?.scarcity} 
            // contempt={stats?.contempt}
            currentSeason={currentSeason}
            stats={stats}
            setStats={setStats} 
            ongoingProjects={ongoingProjects}
            completedProjects={completedProjects}
            setOngoingProjects={setOngoingProjects}
            setCompletedProjects={setCompletedProjects}
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
                prompt={prompt} //FIXME: action or prompt?
                game_id={game_id}
                stats={stats}
                setStats={setStats}  
                formData={formData} 
                setFormData={setFormData} 
                // seasonTheme={seasonThemes[currentSeason]}
                currentSeason={currentSeason} // Pass currentSeason as a prop
                currentWeek={currentWeek} // Pass currentWeek as a prop
                isDiscussion={prompt?.isDiscussion || false}
                isDiscovery={prompt?.isDiscovery || false}
                isProject={prompt?.isProject || false}
                // gameTitle={game?.Title} // Pass gameTitle as a prop //FIXME: from just gameTitle
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