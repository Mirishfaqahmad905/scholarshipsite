import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB, { getDbStatus } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import scholarshipRoutes from './routes/scholarshipRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import fellowshipRoutes from './routes/fellowshipRoutes.js';
import seminarRoutes from './routes/seminarRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import adRoutes from './routes/adRoutes.js';
import userRoutes from './routes/userRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import seoRoutes from './routes/seoRoutes.js';

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

// File Upload API endpoint (Returns Base64 Data URL for serverless/Vercel compatibility)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const mimeType = req.file.mimetype || 'image/jpeg';
  const base64String = req.file.buffer.toString('base64');
  const base64Url = `data:${mimeType};base64,${base64String}`;

  return res.json({
    filePath: base64Url,
    url: base64Url,
    base64: base64Url,
    filename: req.file.originalname,
    mimetype: mimeType,
    size: req.file.size,
  });
});

// API Routes (Mounted at both /api/path and /path for maximum serverless gateway compatibility)
const apiRoutesMap = [
  ['/auth', authRoutes],
  ['/scholarships', scholarshipRoutes],
  ['/internships', internshipRoutes],
  ['/fellowships', fellowshipRoutes],
  ['/seminars', seminarRoutes],
  ['/blogs', blogRoutes],
  ['/ads', adRoutes],
  ['/users', userRoutes],
  ['/settings', settingRoutes],
  ['/subscribers', subscriberRoutes],
  ['/contact', contactRoutes],
  ['/seo', seoRoutes],
];

apiRoutesMap.forEach(([routePath, routeHandler]) => {
  app.use(`/api${routePath}`, routeHandler);
  app.use(routePath, routeHandler);
});

// Direct SEO Public Endpoints
app.get('/robots.txt', (req, res, next) => {
  req.url = '/robots.txt';
  return seoRoutes(req, res, next);
});

app.get('/sitemap.xml', (req, res, next) => {
  req.url = '/sitemap.xml';
  return seoRoutes(req, res, next);
});

// API Status & Health Check Endpoints
app.get('/api', async (req, res) => {
  const dbStatus = await getDbStatus();
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.json({
    message: 'Scholarship Portal API is active and running',
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', async (req, res) => {
  const dbStatus = await getDbStatus();
  const commitSha = process.env.GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.RENDER_GIT_COMMIT || process.env.RAILWAY_GIT_COMMIT_SHA || 'latest';
  const deployedAt = process.env.DEPLOYED_AT || new Date().toISOString();

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.json({
    status: 'ok',
    service: 'Scholarship Portal API',
    version: process.env.npm_package_version || '1.0.0',
    commitSha,
    deployedAt,
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
  });
});

app.get('/api/version', (req, res) => {
  const commitSha = process.env.GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.RENDER_GIT_COMMIT || process.env.RAILWAY_GIT_COMMIT_SHA || 'latest';
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.json({
    version: process.env.npm_package_version || '1.0.0',
    commitSha,
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/db-status', async (req, res) => {
  const dbStatus = await getDbStatus();
  res.json(dbStatus);
});

if (process.env.RUN_STANDALONE === 'true') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Standalone backend server running on port ${PORT}`);
  });
}

export default app;

