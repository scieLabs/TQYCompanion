import axios from 'axios';
import { handleApiError } from '../utils/errorHandler.js'; 

const gameAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
});

// Fetch the latest game for a specific user and title
export const getLatestGame = (user_id) =>
  gameAPI.get(`/game/latest`, { params: { user_id } });

// Fetch all games
export const getAllGames = () => gameAPI.get('/game');

// Fetch a game by its ID
export const getGameById = (id) => gameAPI.get(`/game/${id}`);

// Fetch all games for the active user
// export const getGamesByUserId = async () => {
//   try {
//     const token = localStorage.getItem('token'); // Retrieve the JWT token
//     const response = await axios.get(`${API_BASE_URL}/game/user`, {
//       headers: { Authorization: `Bearer ${token}` }, // Include the token in the request
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching games by user ID:', error.response?.data || error.message);
//     throw error;
//   }
// };

// export const getGamesByUserId = async (user_id) => {
//   try {
//     // const token = localStorage.getItem('token'); // Retrieve the JWT token
//     const response = await gameAPI.get(`/game/user`, {
//       params: { user_id }, // Send user_id as a query parameter
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching games by user ID:', error.response?.data || error.message);
//     throw error;
//   }
// };

export const getGamesByUserId = async (user_id) => {
  try {
    const response = await gameAPI.get('/users/active-games', {
      params: { user_id }, // Send user_id as a query parameter
    });
    return response.data; // Return the list of active games
  } catch (error) {
    console.error('Error fetching games by user ID:', error.response?.data || error.message);
    throw error;
  }
};

// // Fetch all active games
// export const getActiveGames =  () => gameAPI.get(`/active`);

// Fetch a game by its title
export const getGameByTitle = (title) => gameAPI.get(`/game/title/${title}`);

// Fetch a game by its title and week
export const getGameByTitleAndWeek = async (gameTitle, week) => {
  try {
    const response = await gameAPI.get(`/game/title/${encodeURIComponent(gameTitle)}/week/${week}`);
    return response.data;
  } catch (err) {
    console.error('Error in getGameByTitleAndWeek:', err.response?.data || err.message);
    throw err;
  }
};

// Create a new game
export const createGameEntry = (data, config) => gameAPI.post('/game', data, config);

// Update a game by its ID
// export const updateGame = (id, data) => gameAPI.put(`/game/${id}`, data);

// Update a game by its id:
export const updateGame = async (gameId, updates) => {
  try {
    const response = await axios.put(
      `/game/${gameId}`,
      updates,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating game:', error.response?.data || error.message);
    throw error;
  }
};

// Update a game by its title and week
export const updateGameByWeek = (gameTitle, week, data) =>
  gameAPI.put(`/game/title/${gameTitle}/week/${week}`, data);

// Save game data for a specific title and week
export const saveGameData = async (gameTitle, week, data) => {
  try {
    await gameAPI.put(`/game/title/${gameTitle}/week/${week}`, data);
  } catch (error) {
    handleApiError(error, 'saveGameData');
    throw error; // Re-throw the error for handling in the calling function
  }
};

export const saveActionData = async (gameTitle, week, data) => {
  try {
    const response = await gameAPI.put(`/game/title/${encodeURIComponent(gameTitle)}/week/${week}`, data);
    return response.data;
  } catch (err) {
    console.error('Error in saveActionData:', err.response?.data || err.message);
    throw err;
  }
};

// Delete a game by its ID
export const deleteGame = (id) => gameAPI.delete(`/game/${id}`);

// Delete a game by its title
export const deleteGameByTitle = (title) => gameAPI.delete(`/game/title/${title}`);

export const getProjectsByTitle = (title) =>
  gameAPI.get(`/game/title/${title}/projects`);

export const getCompletedProjects = (title) =>
  gameAPI.get(`/game/title/${title}/completed`);

export const resolveProject = (title, projectTitle, type, resolution) =>
  gameAPI.put(`/game/title/${title}/projects/${projectTitle}/${type}/resolve`, { resolution });



// Default export for direct use of Axios instance
export default gameAPI;
