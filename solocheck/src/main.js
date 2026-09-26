import { createApp } from './server.js';

const port = Number(process.env.PORT ?? 8080);
const app = createApp({ dbPath: process.env.DB_PATH ?? 'solocheck.db' });
await app.listen(port);
console.log(`solocheck listening on :${port}`);
