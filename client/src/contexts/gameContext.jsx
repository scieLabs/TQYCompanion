import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as gameAPI from '../api/gameApi.js';
import * as projectAPI from '../api/projectApi.js';
import * as statAPI from '../api/statApi.js';
import { getNextPrompt } from '../api/promptApi.js';
import { handleApiError } from '../utils/errorHandler.js';
import { useSeason } from './seasonContext.jsx';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const { game_id: paramGameId, week } = useParams();
  const [game_id, setGameId] = useState(paramGameId || null);
  const navigate = useNavigate();
  const { currentSeason, setCurrentSeason, seasonThemes } = useSeason(); // Access seasonContext
  const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' };

  const [game, setGame] = useState(null);
  const [stats, setStats] = useState({ abundance: '', scarcity: '', contempt: 0 });
  const [projects, setProjects] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(parseInt(week, 10) || 1);

  const [prompt, setPrompt] = useState(null);
  const [isProject, setIsProject] = useState(false);
  const [isDiscussion, setIsDiscussion] = useState(false);
  const [isDiscovery, setIsDiscovery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingPrompt, setLoadingPrompt] = useState(false);

  const [formData, setFormData] = useState({
    discussion: '',
    discovery: '',
    project_title: '',
    project_desc: '',
    project_weeks: 1,
    isDiscussion: false,
    isDiscovery: false,
    isProject: false,
  });

  const GAME_OVER_PROMPT_ID = '6809feda210f991dba3d9c70';

  useEffect(() => {
    console.log('paramGameId:', paramGameId);
    console.log('game_id before update:', game_id);
  
    if (paramGameId) {
      setGameId(paramGameId);
      console.log('game_id updated to:', paramGameId);
    } else {
      console.warn('paramGameId is undefined. Ensure the route includes :game_id.');
    }
  }, [paramGameId]);

  const hasFetchedPrompt = useRef(false);

//   useEffect(() => {
//     if (paramGameId) {
//       setGameId(paramGameId);
//     }
//     if (paramWeek) {
//       setCurrentWeek(parseInt(paramWeek, 10));
//     }
//   }, [paramGameId, paramWeek]);

    // Fetch the current stats and prompt
    const fetchGameData = async () => {

        console.log('Fetching game data for game_id:', game_id, 'and week:', currentWeek);
        try {
            if (!game_id) {
                console.error('Game ID is not available.');
                return;
            }

          const statsResponse = await statAPI.getStatsByGameAndWeek(game_id, currentWeek);
          if (statsResponse.data) {
            // setStats(statsResponse.data); // Update stats in the context
            setStats({
                abundance: statsResponse.data.abundance || 'No data available',
                scarcity: statsResponse.data.scarcity || 'No data available',
                contempt: statsResponse.data.contempt || 0,
              });
            //   console.log('Fetched stats:', statsResponse.data);

            const response = await gameAPI.getGameById(game_id);
            const gameData = response.data;

            setCurrentSeason(gameData.currentSeason); // Ensure currentSeason is updated
            // setShownPrompts(gameData.shownPrompts || []);
            // setOngoingProjects(gameData.ongoingProjects || []);
            // setCompletedProjects(gameData.completedProjects || []); // Update completed projects

                // Set action flags based on the current prompt
            // const currentPrompt = gameData.currentPrompt;
            setPrompt(gameData.currentPrompt);
            setIsProject(gameData.currentPrompt?.isProject || false);
            setIsDiscussion(gameData.currentPrompt?.isDiscussion || false);
            setIsDiscovery(gameData.currentPrompt?.isDiscovery || false);
            console.log('Game data fetched:', gameData);
          } else {
            console.warn('No stats data found for the current game and week.');
          }

        //   await fetchProjects(); 
    
          if (!hasFetchedPrompt.current) {
            await fetchPrompt();
            hasFetchedPrompt.current = true;
          }
        } catch (err) {
          console.error('Error fetching game data:', err.response?.data || err.message);
        } finally {
          setLoading(false);
        }
      };

//   useEffect(() => {
//     console.log('useEffect triggered: game_id, currentSeason, currentWeek');

//     const fetchInitialData = async () => {
//       // Prevent duplicate calls caused by React's Strict Mode
//       if (hasFetchedPrompt.current) return;

//       hasFetchedPrompt.current = true; // Mark as fetched immediately to prevent duplicate calls

//       await fetchGameData();

//       // Fetch the first prompt only if it's the first week and hasn't been fetched yet
//       if (currentWeek === 1) {
//         console.log('Fetching the first prompt for the game');
//         await fetchPrompt();
//         // hasFetchedPrompt.current = true; // Mark as fetched
//       }
//     };

//     fetchInitialData();
//   }, [game_id, currentSeason, currentWeek]);

//   // Fetch game data
//   const fetchGameData = async () => {
//     try {
//       const gameResponse = await gameAPI.getGameById(game_id);
//       const statsResponse = await statAPI.getStatsByGameAndWeek(game_id, currentWeek);

//       setGame(gameResponse.data);
//       setStats(statsResponse.data);

//       await fetchProjects();
//     } catch (err) {
//       console.error('Error fetching game data:', err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getProjectsByGame(game_id);
      const allProjects = response.data;

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
    }
  };

  // Fetch prompt

  const fetchPrompt = async (overrideGameId = null) => {
    const idToUse = overrideGameId || game_id; // Use the passed game_id or fallback to context
    console.log('game_id passed to fetchPrompt:', overrideGameId);
    if (loadingPrompt || !idToUse) {
      console.warn('Cannot fetch prompt: game_id is not set.');
      return;
    }
    setLoadingPrompt(true);
  
    try {
      console.log('Fetching prompt for game_id:', idToUse, 'and season:', currentSeason);
  
      const response = await getNextPrompt(idToUse, currentSeason);
      const { prompt: nextPrompt, season: updatedSeason } = response.data;
  
      if (nextPrompt._id === GAME_OVER_PROMPT_ID) {
        setPrompt(nextPrompt);
        setIsProject(false);
        setIsDiscussion(false);
        setIsDiscovery(false);
        return;
      }
  
      setPrompt(nextPrompt);
      setIsProject(nextPrompt.isProject || false);
      setIsDiscussion(nextPrompt.isDiscussion || false);
      setIsDiscovery(nextPrompt.isDiscovery || false);

      console.log('isProject:', nextPrompt.isProject, 'isDiscussion:', nextPrompt.isDiscussion, 'isDiscovery:', nextPrompt.isDiscovery);
  
        // Update the season if it has changed
        if (updatedSeason !== currentSeason) {
            console.log(`Season changed from ${currentSeason} to ${updatedSeason}`);
            setCurrentSeason(updatedSeason);
        }
    } catch (err) {
      console.error('Error fetching prompt:', err.response?.data || err.message);
    } finally {
      setLoadingPrompt(false);
    }
  };
//   const fetchPrompt = async () => {
//     if (loadingPrompt || !game_id) {
//         console.warn('Cannot fetch prompt: game_id is not set.');
//         return;
//       }
//       setLoadingPrompt(true);

//     try {
//         console.log('game_id:', game_id);
//       const response = await getNextPrompt(game_id, currentSeason);
//       const { prompt: nextPrompt } = response.data;

//       if (nextPrompt._id === GAME_OVER_PROMPT_ID) {
//         setPrompt(nextPrompt);
//         return;
//       }

//       setPrompt(nextPrompt);

//     // Update the season in seasonContext if it has changed
//     if (nextPrompt.season !== currentSeason) {
//         console.log(`Season changed from ${currentSeason} to ${season}`);
//         setCurrentSeason(nextPrompt.season); // Update seasonContext
//     }
//     } catch (err) {
//       console.error('Error fetching prompt:', err.response?.data || err.message);
//     } finally {
//       setLoadingPrompt(false);
//     }
//   };

  // Handle next week
  const handleNextWeek = async () => {
    try {

        console.log('Handling next week...');
        console.log('Current week:', currentWeek);
        console.log('Prompt:', prompt);
        
      if (prompt._id === GAME_OVER_PROMPT_ID) {
        const data = { end: formData.end };
        await gameAPI.updateGame(game_id, data);
        navigate(`/${game_id}/summary`);
        return;
      }

      await Promise.all(
        ongoingProjects.map((proj) =>
          projectAPI.updateProjectWeeks(proj._id, {
            project_weeks: proj.project_weeks || 0,
            pp_weeks: proj.pp_weeks || 0,
          })
        )
      );

      await statAPI.saveActionData(game_id, currentWeek, {
        game_id, // Ensure game_id is included
        prompt_id: prompt._id,
        // week: currentWeek, 
        stats_week: currentWeek, // Ensure stats_week is included
        abundance: stats.abundance,
        scarcity: stats.scarcity,
        contempt: stats.contempt,
        discovery: formData.discovery,
        discussion: formData.discussion,
        project_title: formData.project_title,
        project_desc: formData.project_desc,
        project_weeks: formData.project_weeks,
      });

      const nextWeek = currentWeek + 1;

        // Fetch the next prompt
        const response = await getNextPrompt(game_id, currentSeason);
        const nextPrompt = response.data.prompt;


      await statAPI.createStatsEntry({
        game_id,
        week: nextWeek,
        abundance: stats.abundance,
        scarcity: stats.scarcity,
        contempt: stats.contempt,
        prompt_id: nextPrompt?._id, // Save the next prompt's _id
      });

      setFormData({
        discussion: '',
        discovery: '',
        project_title: '',
        project_desc: '',
        project_weeks: 1,
        isDiscussion: false,
        isDiscovery: false,
        isProject: false,
      });

      setPrompt(nextPrompt); // Update the prompt in context
      setCurrentWeek(nextWeek);
      await fetchGameData();
      await fetchProjects();
    //   await fetchPrompt();
      navigate(`/game/${game_id}/week/${nextWeek}`);
    } catch (err) {
      handleApiError(err, 'handleNextWeek');
    }
  };

  useEffect(() => {
    if (!hasFetchedPrompt.current) {
      hasFetchedPrompt.current = true;
      fetchGameData();
      if (currentWeek === 1) fetchPrompt();
    }
  }, [game_id, currentWeek]);

  return (
    <GameContext.Provider
      value={{
        // gameId,
        game_id,
        setGameId,
        game,
        setGame,
        stats,
        setStats,
        projects,
        setProjects,
        ongoingProjects,
        setOngoingProjects,
        completedProjects,
        setCompletedProjects,
        fetchProjects,
        currentWeek,
        setCurrentWeek,
        currentSeason,
        fetchPrompt,
        prompt,
        setPrompt,
        loading,
        setLoading,
        formData,
        setFormData,
        handleNextWeek,
        theme,
        GAME_OVER_PROMPT_ID,
        isProject,
        setIsProject,
        isDiscussion,
        setIsDiscussion,
        isDiscovery,
        setIsDiscovery,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};