import express from 'express';
import {
  getAllGames,
  getLatestGame,
  getGameById,
  getGameByTitle,
  getGameByTitleAndWeek,
  createGameEntry,
  savePromptData,
  updateGameByTitle,
  deleteGameByTitle,
  updateGameEntry,
  deleteGameEntry
} from '../controllers/gameController.js';

const router = express.Router();

// Static and more specific routes first
router.get('/latest', getLatestGame); // Fetch the latest game
router.get('/title/:title/week/:week', getGameByTitleAndWeek); // Fetch by title and week
router.get('/title/:title', getGameByTitle); // Fetch by title
router.post('/title/:title/week/:week', savePromptData); // Save prompts by title and week
router.put('/title/:title', updateGameByTitle); // Update by title
router.delete('/title/:title', deleteGameByTitle); // Delete by title

// Dynamic routes last
router.get('/:id', getGameById); // Fetch by ID
router.put('/:id', updateGameEntry); // Update by ID
router.delete('/:id', deleteGameEntry); // Delete by ID

// General routes
router.get('/', getAllGames); // Fetch all games
router.post('/', createGameEntry); // Create a new game

export default router;
