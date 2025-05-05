import axios from 'axios';

const projectAPI = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true,
  });

  export const getProjectsByGame = async (game_id) => projectAPI.get(`/projects/${game_id}`);
  
  export const createProject = async (data) => projectAPI.post('/projects', data);

  export const getOngoingProjects = (game_id) =>
    projectAPI.get(`/projects/${game_id}/ongoing`);
  
  export const getCompletedProjects = (game_id) =>
    projectAPI.get(`/projects/${game_id}/completed`);
  
  export const updateProjectWeeks = (project_id, weeks) =>
    projectAPI.put(`/projects/${project_id}/weeks`, { weeks });
  
  export const resolveProject = (project_id, resolution) =>
    projectAPI.put(`/projects/${project_id}/resolve`, { resolution });

  export default projectAPI;