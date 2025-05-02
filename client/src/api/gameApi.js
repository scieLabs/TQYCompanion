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

// Fetch a game by its title
export const getGameByTitle = (title) => gameAPI.get(`/game/title/${title}`);

// Fetch a game by its title and week
export const getGameByTitleAndWeek = (title, week) =>
  gameAPI.get(`/game/title/${title}/week/${week}`);

// Create a new game
export const createGameEntry = (data) => gameAPI.post('/game', data);

// Update a game by its ID
export const updateGame = (id, data) => gameAPI.put(`/game/${id}`, data);

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
    await gameAPI.post(`/game/title/${gameTitle}/week/${week}`, data); // Removed '/prompts'
  } catch (error) {
    handleApiError(error, 'saveActionData');
    throw error;
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
