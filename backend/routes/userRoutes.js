import express from 'express';
import {
  getUsers,
  getUserStats,
  updateUserRole,
  deleteUser,
  addCategory,
  addCountry,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getUserStats);
router.post('/categories', protect, admin, addCategory);
router.post('/countries', protect, admin, addCountry);

router.route('/').get(protect, admin, getUsers);

router
  .route('/:id')
  .put(protect, admin, updateUserRole)
  .delete(protect, admin, deleteUser);

export default router;
