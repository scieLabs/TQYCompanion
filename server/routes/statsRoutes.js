import express from 'express';
import { getStatsByGameAndWeek,
    createStatsEntry,
    saveActionData,
    updateStatsByGameAndWeek,
    getStatsByGame,
    getStatsByGameId 
 }
from '../controllers/statsController.js';

const router = express.Router();

router.get('/:game_id/week/:week', getStatsByGameAndWeek);
router.get('/latest/:game_id', getStatsByGameId);
router.get('/:game_id', getStatsByGame); //used to fetch all weeks of a game for the GameSummary component
router.post('/', createStatsEntry);
// router.put('/:game_id/week/:week', saveActionData);
router.post('/save-action', saveActionData);
router.put('/:game_id/week/:week', updateStatsByGameAndWeek);

export default router;