import express from 'express';
import { subscribeEmail, getSubscribers } from '../controllers/subscriberController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', subscribeEmail);
router.get('/', protect, admin, getSubscribers);

export default router;
