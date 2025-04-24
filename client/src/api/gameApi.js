import axios from 'axios';

const gameAPI = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true,
  });

export const getLatestGame = () => gameAPI.get('/game/latest');
export const getAllGames = () => gameAPI.get('/game');
export const getGameById = (id) => gameAPI.get(`/game/${id}`);
export const createGame = (data) => gameAPI.post('/game', data);
export const updateGame = (id, data) => gameAPI.put(`/game/${id}`, data);
export const deleteGame = (id) => gameAPI.delete(`/game/${id}`);

// Default export for direct use of Axios instance
export default gameAPI;
