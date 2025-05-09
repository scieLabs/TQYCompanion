import express from 'express';
import {
    getStatsByGameAndWeek,
    createStatsEntry,
    saveActionData,
    updateStatsByGameAndWeek,
    getStatsByGameId
}
    from '../controllers/statsController.js';

const router = express.Router();

router.get('/:game_id/week/:week', getStatsByGameAndWeek);
router.get('/latest/:game_id', getStatsByGameId);
router.post('/', createStatsEntry);
// router.put('/:game_id/week/:week', saveActionData);
router.post('/save-action', saveActionData);
router.put('/:game_id/week/:week', updateStatsByGameAndWeek);

export default router;