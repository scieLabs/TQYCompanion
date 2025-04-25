import express from 'express';
import {
  getAllGames,
  getLatestGame,
  getGameById,
  createGameEntry,
  updateGameEntry,
  deleteGameEntry
} from '../controllers/gameController.js';

const router = express.Router();

router.get('/', getAllGames);
router.get('/latest', getLatestGame);
router.get('/:id', getGameById);
router.get('/title/:title', getGameByTitle); // New route for fetching by title
router.get('/title/:title/week/:week', getGameByTitleAndWeek);
router.post('/', createGameEntry);
router.post('/title/:title/prompts', savePromptData); // New route for saving prompts by title
router.put('/:id', updateGameEntry);
router.put('/title/:title', updateGameByTitle); // New route for updating by title
router.delete('/title/:title', deleteGameByTitle); // New route for deleting by title
router.delete('/:id', deleteGameEntry);

export default router;
