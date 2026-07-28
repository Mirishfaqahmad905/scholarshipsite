import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import backendApp from './backend/server.js';
import { inMemoryStore } from './backend/config/inMemoryStore.js';

dotenv.config();

const PORT = 3000;

// Ensure uploads directory exists and has sample SVG/JPG images
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Generate default SVG images if missing
const createSampleImage = (filename: string, title: string, bgColor: string, txtColor: string) => {
  const filePath = path.join(uploadDir, filename);
  if (!fs.existsSync(filePath)) {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      <circle cx="700" cy="80" r="120" fill="rgba(255,255,255,0.05)"/>
      <circle cx="100" cy="380" r="160" fill="rgba(255,255,255,0.04)"/>
      <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="${txtColor}" font-family="system-ui, sans-serif" font-size="32" font-weight="bold">${title}</text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="${txtColor}" opacity="0.8" font-family="system-ui, sans-serif" font-size="18">Scholarship Portal Verification Stamp</text>
    </svg>`;
    fs.writeFileSync(filePath, svgContent);
  }
};

createSampleImage('csc-china.svg', 'CSC Scholarship China', '#0F172A', '#F59E0B');
createSampleImage('fulbright-usa.svg', 'Fulbright USA Program', '#1E3A8A', '#60A5FA');
createSampleImage('finland-govt.svg', 'Finland Excellence Grant', '#0284C7', '#E0F2FE');
createSampleImage('chevening-uk.svg', 'Chevening UK Scholarship', '#0F766E', '#5EEAD4');
createSampleImage('daad-germany.svg', 'DAAD Masters Germany', '#334155', '#F8FAFC');
createSampleImage('vanier-canada.svg', 'Vanier Canada PhD', '#991B1B', '#FCA5A5');
createSampleImage('default-scholarship.jpg', 'Scholarship Award', '#1E293B', '#F59E0B');
createSampleImage('default-blog.jpg', 'Education & Career Guide', '#0F172A', '#38BDF8');
createSampleImage('ad-ielts.svg', 'IELTS 30% Student Discount', '#B45309', '#FEF3C7');
createSampleImage('ad-admission.svg', 'University Application Review', '#4338CA', '#E0E7FF');

async function startServer() {
  const app = express();

  // Attach store to express app locals and backendApp locals
  app.locals.inMemoryStore = inMemoryStore;
  backendApp.locals.inMemoryStore = inMemoryStore;

  // Mount backend API and static middleware
  app.use(backendApp);

  // Development Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Scholarship Portal app running on http://localhost:${PORT}`);
  });
}

startServer();

