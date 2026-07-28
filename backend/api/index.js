import app from '../server.js';
import { inMemoryStore } from '../config/inMemoryStore.js';

app.locals.inMemoryStore = inMemoryStore;

export default app;
