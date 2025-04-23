import express from 'express';
import {
  getAllPrompts,
  createPrompt,
  getPromptById,
  updatePrompt,
  deletePrompt,
} from '../controllers/promptController.js';

const router = express.Router();

router.get('/', getAllPrompts);
router.post('/', createPrompt);
router.get('/:id', getPromptById);
router.put('/:id', updatePrompt);
router.delete('/:id', deletePrompt);

export default router;
