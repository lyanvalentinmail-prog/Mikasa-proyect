import http from 'http';
import { app } from './app.js';
import { env } from '@mikasa/config';
import { SocketService } from './services/socketService.js';
import { seedDemoData } from '@mikasa/database';

const server = http.createServer(app);

// Initialize Socket.io
SocketService.init(server);

// Seed initial demo data
seedDemoData();

const PORT = parseInt(process.env.PORT || env.PORT || '4000', 10);
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 Mikasa API Server running on http://${HOST}:${PORT}`);
  console.log(`📡 WebSocket Gateway ready on ws://${HOST}:${PORT}`);
});
