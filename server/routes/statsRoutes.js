import express from 'express';
import { getStatsByGameAndWeek,
    createStatsEntry,
    saveActionData,
    updateStatsByGameAndWeek }
from '../controllers/statsController.js';

const router = express.Router();

router.get('/:game_id/week/:week', getStatsByGameAndWeek);
router.post('/', createStatsEntry);
router.post('/:game_id/week/:week/actions', saveActionData);
// router.put('/:game_id/week/:week', saveActionData);
// router.post('/save-action', saveActionData);

router.put('/:game_id/week/:week', updateStatsByGameAndWeek);

export default router;