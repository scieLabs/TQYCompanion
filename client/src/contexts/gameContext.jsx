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
  const { game_id, week } = useParams();
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
  const hasFetchedPrompt = useRef(false);

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

  // Fetch game data
  const fetchGameData = async () => {
    try {
      const gameResponse = await gameAPI.getGameById(game_id);
      const statsResponse = await statAPI.getStatsByGameAndWeek(game_id, currentWeek);

      setGame(gameResponse.data);
      setStats(statsResponse.data);

      await fetchProjects();
    } catch (err) {
      console.error('Error fetching game data:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

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
  const fetchPrompt = async () => {
    if (loadingPrompt) return;
    setLoadingPrompt(true);

    try {
      const response = await getNextPrompt(game_id);
      const { prompt: nextPrompt } = response.data;

      if (nextPrompt._id === GAME_OVER_PROMPT_ID) {
        setPrompt(nextPrompt);
        return;
      }

      setPrompt(nextPrompt);

    // Update the season in seasonContext if it has changed
    if (season !== currentSeason) {
        console.log(`Season changed from ${currentSeason} to ${season}`);
        setCurrentSeason(season); // Update seasonContext
    }
    } catch (err) {
      console.error('Error fetching prompt:', err.response?.data || err.message);
    } finally {
      setLoadingPrompt(false);
    }
  };

  // Handle next week
  const handleNextWeek = async () => {
    try {
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

      const nextWeek = currentWeek + 1;
      await statAPI.createStatsEntry({
        game_id,
        week: nextWeek,
        abundance: stats.abundance,
        scarcity: stats.scarcity,
        contempt: stats.contempt,
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

      setCurrentWeek(nextWeek);
      fetchGameData();
      await fetchPrompt();
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
        game,
        stats,
        projects,
        ongoingProjects,
        completedProjects,
        currentWeek,
        currentSeason,
        prompt,
        loading,
        formData,
        setFormData,
        handleNextWeek,
        theme,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};