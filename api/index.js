import app from '../backend/server.js';
import { inMemoryStore } from '../backend/config/inMemoryStore.js';
import connectDB from '../backend/config/db.js';

app.locals.inMemoryStore = inMemoryStore;

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless DB connect notice:', err.message);
  }

  // Determine requested path across Vercel and serverless gateway environments
  let url =
    req.headers['x-forwarded-uri'] ||
    req.headers['x-original-url'] ||
    req.url ||
    '/api';

  // Strip serverless index.js file path if present while preserving query parameters
  url = url.replace(/\/api\/index\.js(\?.*)?$/, '$1');
  url = url.replace(/\/index\.js(\?.*)?$/, '$1');

  // Handle empty path or query-only string
  if (!url || url === '/' || url.startsWith('?')) {
    url = '/api' + url;
  }

  // Ensure request URL starts with /api
  if (!url.startsWith('/api')) {
    url = '/api' + (url.startsWith('/') ? '' : '/') + url;
  }

  req.url = url;
  return app(req, res);
}



