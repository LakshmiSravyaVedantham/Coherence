import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { sessionManager } from './session/sessionManager';
import { setupRoutes } from './routes';
import { setupSocketHandlers } from './socket/handlers';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize Supabase (if configured)
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    const { getSupabaseClient } = require('./db/supabase');
    getSupabaseClient();
    console.log('✅ Supabase connected');
  } catch (error) {
    console.warn('⚠️  Supabase not configured, data collection disabled');
  }
}

// Routes
setupRoutes(app);

// Socket.io handlers
setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Sync backend server running on port ${PORT}`);
  console.log(`📊 Session manager initialized`);
  
  // Start rolling session system
  sessionManager.startRollingSessions();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  sessionManager.stopRollingSessions();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

