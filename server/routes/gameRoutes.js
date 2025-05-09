import express from 'express';
import {
  getAllGames,
  getLatestGame,
  getGameById,
  getGameByTitle,
  getGameByTitleAndWeek,
  getActiveGames,
  getGamesByUserId,
  createGameEntry,
  saveActionData,
  updateGameByTitle,
  updateGameByWeek,
  deleteGameByTitle,
  updateGameEntry,
  deleteGameEntry,
  getAllProjectsByTitle,
  getCompletedProjects,
  resolveProject
} from '../controllers/gameController.js';

const router = express.Router();
//import { authenticateUser } from '../middleware/authMiddleware.js';

// Game routes
router.get('/', getAllGames); // Get all games
router.get('/latest', getLatestGame); // Get the latest game for a user
router.get('/game/title/:title/week/:week', getGameByTitleAndWeek);
router.get('/:id', getGameById); // Get a game by ID
router.get('/title/:title', getGameByTitle); // Get a game by title
// Fetch all games for the active user
router.get('/user', getGamesByUserId);
// Fetch all active games for the logged-in user
router.get('/active', getActiveGames);
router.get('/title/:title/projects', getAllProjectsByTitle);
router.get('/title/:title/completed', getCompletedProjects);

router.post('/', createGameEntry); // Create a new game entry
// router.post('/:title/:week/actions', saveActionData); // Save action data for a game

router.put('/:title/:week', updateGameByWeek); // Update a game by title and week
router.put('/title/:title', updateGameByTitle); // Update a game by title
router.put('/:id', updateGameEntry); // Update a game by ID
router.put('/title/:title/projects/:projectTitle/:type/resolve', resolveProject);
router.put('/game/title/:title/week/:week', saveActionData);

router.delete('/title/:title', deleteGameByTitle); // Delete a game by title
router.delete('/:id', deleteGameEntry); // Delete a game by ID

export default router;


//FIXME: Old version
// Static and more specific routes first
// router.get('/latest', getLatestGame); // Fetch the latest game
// router.get('/title/:title/week/:week', getGameByTitleAndWeek); // Fetch by title and week
// router.get('/title/:title', getGameByTitle); // Fetch by title
// router.post('/title/:title/week/:week', saveActionData); // Save prompts by title and week
// router.put('/title/:title', updateGameByTitle); // Update by title
// router.delete('/title/:title', deleteGameByTitle); // Delete by title

// // Dynamic routes last
// router.get('/:id', getGameById); // Fetch by ID
// router.put('/:id', updateGameEntry); // Update by ID
// router.delete('/:id', deleteGameEntry); // Delete by ID

// // General routes
// router.get('/', getAllGames); // Fetch all games
// router.post('/', createGameEntry); // Create a new game

// export default router;
