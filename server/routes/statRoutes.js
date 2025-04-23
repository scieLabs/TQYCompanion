import express from 'express';
import {
  getAllStats,
  createStats,
  getStatsById,
  updateStats,
  deleteStats,
} from '../controllers/statController.js';

const router = express.Router();

router.get('/', getAllStats);
router.post('/', createStats);
router.get('/:id', getStatsById);
router.put('/:id', updateStats);
router.delete('/:id', deleteStats);

export default router;