import express from 'express';
import { submitContactInquiry, getContactInquiries } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', submitContactInquiry);
router.get('/', getContactInquiries);

export default router;
