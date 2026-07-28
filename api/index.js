import app from '../backend/server.js';
import { inMemoryStore } from '../backend/config/inMemoryStore.js';

app.locals.inMemoryStore = inMemoryStore;

export default app;
