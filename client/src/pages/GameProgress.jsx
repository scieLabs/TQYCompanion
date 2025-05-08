import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ActionModal from '../components/ActionModal.jsx';
import GameStats from '../components/GameStats.jsx';
import { getGameById, updateGame } from '../api/gameApi.js';
import * as projectAPI from '../api/projectApi.js';
import { getStatsByGameAndWeek, createStatsEntry, saveActionData } from '../api/statApi.js';
import { getNextPrompt, createPrompt } from '../api/promptApi.js';
import { createProject } from '../api/projectApi.js';
import { useAuthContext } from '../contexts/authContext.jsx'; //adjust if needed
import { handleApiError } from '../utils/errorHandler.js';
import { useSeason } from '../contexts/seasonContext.jsx'; // Import the season context
import GameHeader from '../components/GameHeader.jsx'; // Import the GameHeader component
import GameSummary from '../components/GameSummary.jsx'; // Import the GameSummary component



export default function GameProgress() {
  const { game_id, week } = useParams(); // Get the game title from the URL parameters
  const { user } = useAuthContext(); // get the logged-in user
  const { currentSeason, setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context //FIXME: removed currentSeason = 'Spring',
  const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' }; // Get the theme based on the current season

  const [showGameSummary, setShowGameSummary] = useState(false);

  const [game, setGame] = useState(null);
  const [stats, setStats] = useState({ abundance: '', scarcity: '', contempt: 0 });
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

  const [currentWeek, setCurrentWeek] = useState(parseInt(week, 10) || 1);
  const [prompt, setPrompt] = useState(null);
  const [shownPrompts, setShownPrompts] = useState([]); // To keep track of shown prompts
  const [seasonPrompts, setSeasonPrompts] = useState([]); // To store current season's prompts
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const navigate = useNavigate();
  const GAME_OVER_PROMPT_ID = '6809feda210f991dba3d9c70';

  const validSeasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

  useEffect(() => {
    console.log('Current season updated:', currentSeason);
  }, [currentSeason]);

  useEffect(() => {
    if (game_id) {
      fetchProjects();
    }
  }, [game_id, currentWeek]); // Call fetchProjects whenever game_id or currentWeek changes

  useEffect(() => {
    console.log('Updated ongoingProjects:', ongoingProjects);
  }, [ongoingProjects]);

  useEffect(() => {
    console.log('Updated completedProjects:', completedProjects);
  }, [completedProjects]);

  // useEffect(() => {
  //   // console.log('Game ID:', game_id);
  //   console.log('useEffect triggered: game_id, currentSeason, currentWeek');
  //   fetchGameData();
  // }, [game_id, currentSeason, currentWeek]);

  const fetchProjects = async () => {
    try {
      console.log(`Fetching all projects for game_id: ${game_id}`);
      const response = await projectAPI.getProjectsByGame(game_id);
      // console.log('Response from backend:', response);
      const allProjects = response.data;

      // console.log('All projects:', allProjects);
      // Sort projects into ongoing and completed
      const ongoing = allProjects.filter(
        (proj) => proj.project_weeks > 0 || proj.pp_weeks > 0
      );

      const completed = allProjects.filter(
        (proj) =>
          (proj.project_weeks === 0 || proj.pp_weeks === 0) &&
          (proj.project_resolve || proj.pp_resolve)
      );

      // console.log('Ongoing projects:', ongoing);
      // console.log('Completed projects:', completed);

      setProjects(allProjects);
      setOngoingProjects(ongoing);
      setCompletedProjects(completed);
      console.log('Fetched projects:', { ongoing, completed });
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

  const hasFetchedPrompt = useRef(false);

  // useEffect(() => {
  //   console.log('useEffect triggered: game_id, currentSeason, currentWeek');

  //   const fetchInitialData = async () => {
  //     await fetchGameData();

  //     // Fetch the first prompt only if it's the first week and hasn't been fetched yet
  //     if (currentWeek === 1 && !hasFetchedPrompt.current) {
  //       console.log('Fetching the first prompt for the game');
  //       await fetchPrompt();
  //       hasFetchedPrompt.current = true; // Mark as fetched
  //     }
  //   };

  //   fetchInitialData();
  // }, [game_id, currentSeason, currentWeek]);

  useEffect(() => {
    console.log('useEffect triggered: game_id, currentSeason, currentWeek');

    const fetchInitialData = async () => {
      // Prevent duplicate calls caused by React's Strict Mode
      if (hasFetchedPrompt.current) return;

      hasFetchedPrompt.current = true; // Mark as fetched immediately to prevent duplicate calls

      await fetchGameData();

      // Fetch the first prompt only if it's the first week and hasn't been fetched yet
      if (currentWeek === 1) {
        console.log('Fetching the first prompt for the game');
        await fetchPrompt();
        // hasFetchedPrompt.current = true; // Mark as fetched
      }
    };

    fetchInitialData();
  }, [game_id, currentSeason, currentWeek]);

  useEffect(() => {
    if (game_id) {
      fetchProjects();
    }
  }, [game_id, currentWeek]); // Call fetchProjects whenever currentWeek changes

  const fetchGameData = async () => {
    try {
      const gameResponse = await getGameById(game_id);
      const statsResponse = await getStatsByGameAndWeek(game_id, currentWeek);

      setGame(gameResponse.data);
      setStats(statsResponse.data);
      // console.log('Fetched game:', gameResponse.data, 'Fetched stats:', statsResponse.data);

      // Fetch the latest projects
      await fetchProjects();

      // Fetch the first prompt if it's the first week
      // if (currentWeek === 1) {
      //   console.log('Fetching the first prompt for the game');
      //   await fetchPrompt();
      // }

      // fetchPrompt();
    } catch (err) {
      console.error('Error fetching game data:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };


  // Fetch prompts based on the current season and ensure non-repeating prompts

  const fetchPrompt = async () => {
    console.log('fetchPrompt called');
    if (loadingPrompt) return; // Prevent multiple calls
    setLoadingPrompt(true);

    try {
      const response = await getNextPrompt(game_id, currentSeason);
      const { prompt: nextPrompt, season } = response.data;

      console.log('Backend response:', response.data);

      if (nextPrompt._id === GAME_OVER_PROMPT_ID) {
        console.warn('Game over prompt encountered.');
        setPrompt(nextPrompt);
        return;
      }

      setPrompt(nextPrompt);

      // Update the season globally only if it has changed
      if (season !== currentSeason) {
        console.log(`Season changed from ${currentSeason} to ${season}`);
        setCurrentSeason(season);
      }

      // console.log('Applied theme:', seasonThemes[currentSeason]);

      // setShownPrompts((prev) => [...prev, nextPrompt._id]); // Track shown prompts
    } catch (err) {
      console.error('Error fetching prompt:', err.response?.data || err.message);
    } finally {
      setLoadingPrompt(false); // Reset loading state
    }
  };


  const handleNextWeek = async () => {
    console.log('handleNextWeek called');
    try {

      if (prompt._id === GAME_OVER_PROMPT_ID) {
        // Save the "fate of the community" to the database
        const data = { end: formData.end }; // Assuming `formData.end` contains the epilogue
        await updateGame(game_id, data);
        console.log('Game Over data saved:', data);
        
        // Show the game summary modal
        setShowGameSummary(true);
        return; // Exit early since the game is over
      }

      // Save the updated projects to the database
      await Promise.all(
        ongoingProjects.map((proj) =>
          projectAPI.updateProjectWeeks(proj._id, {
            project_weeks: proj.project_weeks || 0,
            pp_weeks: proj.pp_weeks || 0,
          })
        )
      );

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

      await fetchGameData(); //refresh game state

      // Fetch the next prompt explicitly
      await fetchPrompt();

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
            game_id={game_id}
            currentWeek={currentWeek}
            currentSeason={currentSeason}
            stats={stats}
            setStats={setStats}
            ongoingProjects={ongoingProjects}
            completedProjects={completedProjects}
            setOngoingProjects={setOngoingProjects}
            setCompletedProjects={setCompletedProjects}
            fetchProjects={fetchProjects}
          />
        </div>

        <div className={`w-3/4`}>
          <h2 className="text-2xl font-bold mb-6 text-center">Week {currentWeek}, {currentSeason}</h2>
          {prompt && prompt._id && (
            <div>
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold">{prompt.prompt_title}</h3>
                <p
                  className="mb-8 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: prompt.prompt }}
                ></p>
              </div>

              <ActionModal
                prompt={prompt}
                game_id={game_id}
                stats={stats}
                setStats={setStats}
                formData={formData}
                setFormData={setFormData}
                currentSeason={currentSeason}
                currentWeek={currentWeek}
                isDiscussion={prompt?.isDiscussion || false}
                isDiscovery={prompt?.isDiscovery || false}
                isProject={prompt?.isProject || false}
                fetchProjects={fetchProjects}
                setOngoingProjects={setOngoingProjects}
              />


              <div className="text-center">
                <button
                  className={`btn mt-6 shadow-md border-none ${theme.nextWeekBtnBg} ${theme.nextWeekBtnText} ${theme.nextWeekBtnBgHover}`}
                  onClick={handleNextWeek}
                >
                  {prompt._id.toString() === GAME_OVER_PROMPT_ID ? 'Game Over' : 'Next Week'}
                </button>
                {showGameSummary && (
                  <GameSummary
                    className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                    onClose={() => setShowGameSummary(false)}
                    game={game}
                    stats={stats}
                    projects={projects}
                    currentWeek={currentWeek}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}