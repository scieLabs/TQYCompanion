import express from 'express';
import { 
    getProjectsByGame,
    createProject, 
    getOngoingProjects, 
    getCompletedProjects, 
    updateProjectWeeks, 
    resolveProject,
    updateProjectResolution
 } from '../controllers/projectController.js';

const router = express.Router();

router.get('/:game_id', getProjectsByGame);
router.post('/', createProject);
router.get('/:game_id/ongoing', getOngoingProjects);
router.get('/:game_id/completed', getCompletedProjects);
router.put('/:project_id/weeks', updateProjectWeeks);
router.put('/:project_id/resolve', resolveProject);
router.put('/:id', updateProjectResolution);

export default router;