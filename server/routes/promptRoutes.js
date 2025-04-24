import express from 'express';
import {
  getAllPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  getNextPrompt
} from '../controllers/promptController.js';

const router = express.Router();

router.get('/', getAllPrompts);
router.get('/next', getNextPrompt);
router.get('/:id', getPromptById);
router.post('/', createPrompt);
router.put('/:id', updatePrompt);
router.delete('/:id', deletePrompt);

export default router;
