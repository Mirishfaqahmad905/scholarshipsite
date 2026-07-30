import express from 'express';
import {
  getFellowships,
  getFellowshipById,
  createFellowship,
  updateFellowship,
  deleteFellowship,
} from '../controllers/fellowshipController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getFellowships)
  .post(protect, admin, createFellowship);

router
  .route('/:id')
  .get(getFellowshipById)
  .put(protect, admin, updateFellowship)
  .delete(protect, admin, deleteFellowship);

export default router;
