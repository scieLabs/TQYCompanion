import axios from 'axios';

const promptApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true,
  });

export const getAllPrompts = () => promptApi.get('/prompts');
export const getPromptById = (id) => promptApi.get(`/prompts/${id}`);
export const getNextPrompt = (week) => promptApi.get(`/prompts/next?week=${week}`);
export const createPrompt = (data) => promptApi.post('/prompts', data);
export const updatePrompt = (id, data) => promptApi.put(`/prompts/${id}`, data);
export const deletePrompt = (id) => promptApi.delete(`/prompts/${id}`);

export default promptApi;