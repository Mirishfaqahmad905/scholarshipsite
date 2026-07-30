import express from 'express';
import {
  getSeminars,
  getSeminarById,
  createSeminar,
  updateSeminar,
  deleteSeminar,
} from '../controllers/seminarController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getSeminars)
  .post(protect, admin, createSeminar);

router
  .route('/:id')
  .get(getSeminarById)
  .put(protect, admin, updateSeminar)
  .delete(protect, admin, deleteSeminar);

export default router;
