import app from '../backend/server.js';
import { inMemoryStore } from '../backend/config/inMemoryStore.js';

app.locals.inMemoryStore = inMemoryStore;

export default function handler(req, res) {
  // Determine requested path across Vercel and serverless gateway environments
  let targetUrl =
    req.headers['x-forwarded-uri'] ||
    req.headers['x-real-url'] ||
    req.headers['x-original-url'] ||
    req.url ||
    '/api';

  // Strip serverless filename prefix if rewritten
  if (targetUrl.includes('/api/index.js')) {
    targetUrl = targetUrl.replace('/api/index.js', '');
  } else if (targetUrl.includes('/index.js')) {
    targetUrl = targetUrl.replace('/index.js', '');
  }

  // Handle empty or root path after strip
  if (!targetUrl || targetUrl === '' || targetUrl === '/') {
    targetUrl = '/api';
  }

  // Ensure request path starts with /api for backend route matching
  if (!targetUrl.startsWith('/api')) {
    targetUrl = '/api' + (targetUrl.startsWith('/') ? '' : '/') + targetUrl;
  }

  req.url = targetUrl;
  return app(req, res);
}


