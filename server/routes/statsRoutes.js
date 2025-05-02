import express from 'express';
import { getStatsByGameAndWeek,
    createStatsEntry,
    saveActionData,
    updateStatsByGameAndWeek }
from '../controllers/statsController.js';

const router = express.Router();

router.get('/:game_id/week/:week', getStatsByGameAndWeek);
router.post('/', createStatsEntry);
router.put('/:game_id/week/:week', saveActionData);
router.put('/:game_id/week/:week', updateStatsByGameAndWeek);

export default router;