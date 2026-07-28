import express from 'express';
import {
  getAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
} from '../controllers/adController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAds).post(protect, admin, createAd);

router
  .route('/:id')
  .get(getAdById)
  .put(protect, admin, updateAd)
  .delete(protect, admin, deleteAd);

export default router;
