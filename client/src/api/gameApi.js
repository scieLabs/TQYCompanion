import axios from 'axios';

const gameAPI = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true,
  });

// export const getLatestGame = () => gameAPI.get(`/games/latest?user_id=${userId}`);
export const getLatestGame = (user_id, title) =>
    gameAPI.get(`/game/latest`, { params: { user_id, title } });
export const getAllGames = () => gameAPI.get('/game');
export const getGameById = (id) => gameAPI.get(`/game/${id}`);
export const getGameByTitle = (title) => gameApi.get(`/game/title/${title}`);
export const getGameByTitleAndWeek = (title, week) =>
    gameAPI.get(`/game/title/${title}/week/${week}`);
export const createGame = (data) => gameAPI.post('/game', data);
export const updateGame = (id, data) => gameAPI.put(`/game/${id}`, data);
export const updateGameByWeek = (gameTitle, week, data) =>
    gameAPI.put(`/game/title/${gameTitle}/week/${week}`, data);
export const deleteGame = (id) => gameAPI.delete(`/game/${id}`);
export const deleteGameByTitle = (title) => gameApi.delete(`/game/title/${title}`);

// Default export for direct use of Axios instance
export default gameAPI;
