# Sync Backend

Node.js/TypeScript backend for the Sync Collective Coherence Platform.

## Features

- Real-time WebSocket server for live sessions
- REST API for session management
- Rolling session system (new session every 15 minutes)
- Group coherence calculation
- Data collection and anonymization pipeline
- Research data export

## API Endpoints

### REST API

- `GET /health` - Health check
- `GET /api/sessions/current` - Get current active session
- `GET /api/sessions/:sessionId` - Get specific session
- `GET /api/sessions` - Get all active sessions
- `GET /api/research/export` - Export research data (requires auth)
- `GET /api/research/stats` - Get aggregate statistics

### WebSocket Events

**Client → Server:**
- `join_session` - Join current session
- `update_coherence` - Update personal coherence score
- `leave_session` - Leave current session

**Server → Client:**
- `session_joined` - Confirmation of session join
- `group_metrics_update` - Updated group coherence metrics
- `participant_update` - Participant count change
- `personal_feedback` - Personal contribution feedback

## Session System

Sessions run continuously with:
- **Duration**: 15 minutes
- **Rolling**: New session starts every 15 minutes
- **Phases**: Preparation (30s) → Active → Integration (last 2 min) → Complete

## Development

```bash
npm install
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Run production build
npm run migrate  # Run database migrations
```

## Environment Variables

See `.env.example` for required variables.

## Architecture

- **Express**: HTTP server
- **Socket.io**: WebSocket server
- **PostgreSQL + TimescaleDB**: Time-series data storage
- **Redis**: Session caching (optional)

## Data Flow

1. Client connects via WebSocket
2. Client joins session
3. Client sends HRV/coherence updates every 5 seconds
4. Server calculates group metrics
5. Server broadcasts updates to all session participants
6. Data stored in database (if enabled)

