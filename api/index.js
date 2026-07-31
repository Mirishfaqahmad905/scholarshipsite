import app from '../backend/server.js';
import { inMemoryStore } from '../backend/config/inMemoryStore.js';

app.locals.inMemoryStore = inMemoryStore;

export default function handler(req, res) {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
}

