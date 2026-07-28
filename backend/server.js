import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import scholarshipRoutes from './routes/scholarshipRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import adRoutes from './routes/adRoutes.js';
import userRoutes from './routes/userRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';

import upload from './middleware/uploadMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static uploads and assets
const uploadDir = path.join(process.cwd(), 'uploads');
const backendUploadDir = path.join(process.cwd(), 'backend', 'uploads');
const backendAssetsDir = path.join(process.cwd(), 'backend', 'assets');

app.use('/uploads', express.static(uploadDir));
app.use('/uploads', express.static(backendUploadDir));
app.use('/backend/assets', express.static(backendAssetsDir));
app.use('/assets', express.static(backendAssetsDir));

// File Upload API endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const filePath = `/uploads/${req.file.filename}`;
  return res.json({
    filePath,
    url: filePath,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/subscribers', subscriberRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Scholarship Portal API' });
});

export default app;
