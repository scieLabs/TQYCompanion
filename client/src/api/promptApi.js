import axios from 'axios';

const promptApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });

export const getAllPrompts = () => promptApi.get('/prompts');
export const getPromptById = (id) => promptApi.get(`/prompts/${id}`);
// export const getNextPrompt = (season) => promptApi.get(`/prompts/next`, { params: { season } });
export const getNextPrompt = (game_id, currentSeason) => {
  return promptApi.post('/prompts/next', { game_id, currentSeason});
};
export const createPrompt = (data) => promptApi.post('/prompts', data);
export const updatePrompt = (id, data) => promptApi.put(`/prompts/${id}`, data);
export const deletePrompt = (id) => promptApi.delete(`/prompts/${id}`);

export default promptApi;