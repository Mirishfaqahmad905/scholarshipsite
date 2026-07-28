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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/subscribers', subscriberRoutes);

// Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Scholarship Portal API</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
          .card { background: #1e293b; border: 1px solid #334155; padding: 2.5rem; border-radius: 1rem; max-width: 480px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          h1 { color: #d4af37; font-size: 1.5rem; margin-top: 0; }
          p { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; }
          .status { display: inline-block; background: #064e3b; color: #34d399; font-size: 0.75rem; font-weight: bold; padding: 0.25rem 0.75rem; border-radius: 9999px; margin-bottom: 1rem; border: 1px solid #059669; }
          code { background: #0f172a; color: #f59e0b; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.85rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="status">✓ API ONLINE</div>
          <h1>Scholarship Portal Backend Service</h1>
          <p>The backend server is running successfully and ready to process requests.</p>
          <p>Endpoints are available under <code>/api/*</code></p>
        </div>
      </body>
    </html>
  `);
});

app.get('/api', (req, res) => {
  res.json({ message: 'Scholarship Portal API is active and running', status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Scholarship Portal API' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
