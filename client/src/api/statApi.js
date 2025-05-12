import axios from 'axios';
import gameAPI from './gameApi'; 

const statAPI = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true,
  });

  export const getStatsByGameAndWeek = async (game_id, week) =>
    statAPI.get(`/stats/${game_id}/week/${week}`);

  export const createStatsEntry = async (data) => statAPI.post('/stats', data);

  // export const saveActionData = async (game_id, week, data) =>
  //   statAPI.put(`/stats/${game_id}/week/${week}`, data);

  export const saveActionData = async (game_id, stats_week, data) => {
    return gameAPI.post('/stats/save-action', {
      game_id,
      stats_week,
      ...data,
    });
  };

  export const updateStatsByGameAndWeek = (game_id, week, data) =>
    statAPI.put(`/stats/${game_id}/week/${week}`, data);

  export const getStatsByGameId = async (game_id) => {
  try {
    const response = await statAPI.get(`/stats/latest/${game_id}`);
    return response.data; // Return the stats for the game
  } catch (error) {
    console.error('Error fetching stats by game ID:', error.response?.data || error.message);
    throw error;
  }
};

  export const getStatsByGame = async (game_id) => {
    try {
    const response = await statAPI.get(`/stats/gameover/${game_id}`);
    return response.data; // Return the final stats for the game
  } catch (error) {
    console.error('Error fetching stats for this game:', error.response?.data || error.message);
    throw error;
  }
  };

  export default statAPI;