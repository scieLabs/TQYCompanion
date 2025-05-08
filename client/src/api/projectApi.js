import axios from 'axios';

const projectAPI = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true,
  });

  export const getProjectsByGame = (game_id) => projectAPI.get(`/projects/${game_id}`);

  export const createProject = async (projectData) => {
    try {
      console.log('Sending project data to backend:', projectData); // Log the data being sent
      const response = await projectAPI.post('/projects', projectData);
      console.log('Project creation response:', response.data); // Log the response
      return response;
    } catch (error) {
      console.error('Error creating project:', error.response?.data || error.message);
      throw error;
    }
  };

  export const getOngoingProjects = (game_id) =>
    projectAPI.get(`/projects/${game_id}/ongoing`);
  
  export const getCompletedProjects = (game_id) =>
    projectAPI.get(`/projects/${game_id}/completed`);
  
  export const updateProjectWeeks = (project_id, { project_weeks, pp_weeks }) =>
    projectAPI.put(`/projects/${project_id}/weeks`, { project_weeks, pp_weeks });
  
  export const resolveProject = (project_id, {project_resolve, pp_resolve}) =>
    projectAPI.put(`/projects/${project_id}/resolve`, { project_resolve, pp_resolve });

  // export const updateProject = (projectId, updatedProject) => {
  //   return axios.put(`/projects/${projectId}`, updatedProject);
  // };

  export default projectAPI;