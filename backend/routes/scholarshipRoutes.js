import express from 'express';
import {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getScholarshipMeta,
} from '../controllers/scholarshipController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/meta/options', getScholarshipMeta);

router
  .route('/')
  .get(getScholarships)
  .post(protect, admin, createScholarship);

router
  .route('/:id')
  .get(getScholarshipById)
  .put(protect, admin, updateScholarship)
  .delete(protect, admin, deleteScholarship);

export default router;
