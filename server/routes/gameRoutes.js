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
router.post('/', createGameEntry);
router.put('/:id', updateGameEntry);
router.delete('/:id', deleteGameEntry);

export default router;
