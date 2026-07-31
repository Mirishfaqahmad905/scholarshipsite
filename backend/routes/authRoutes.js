import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  changeAdminCredentials,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/change-credentials', protect, changeAdminCredentials);

export default router;

