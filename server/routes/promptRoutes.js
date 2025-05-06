import express from 'express';
import {
  getAllPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  getNextPrompt,
  getPromptsBySeason
} from '../controllers/promptController.js';

const router = express.Router();

// Specific routes first
router.post('/next', getNextPrompt); // Fetch the next available prompt
router.get('/season/:season', getPromptsBySeason); // Fetch prompts by season

// Dynamic routes
router.get('/:id', getPromptById); // Fetch a prompt by its ID
router.put('/:id', updatePrompt); // Update a prompt by its ID
router.delete('/:id', deletePrompt); // Delete a prompt by its ID

// General routes
router.get('/', getAllPrompts); // Fetch all prompts
router.post('/', createPrompt); // Create a new prompt

export default router;
