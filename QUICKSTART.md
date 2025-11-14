# Quick Start Guide

Get the Sync platform running in 5 minutes.

## Prerequisites Check

```bash
node --version  # Should be 18+
python --version  # Should be 3.9+
psql --version  # PostgreSQL should be installed
```

## 1. Install Dependencies

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..

# Shared library
cd shared && npm install && cd ..
```

## 2. Set Up Database

```bash
# Create database
createdb sync_db

# Connect and enable TimescaleDB
psql sync_db -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"

# Run migrations
cd backend
npm run build
npm run migrate
cd ..
```

## 3. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

## 4. Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Sync backend server running on port 3000
📊 Session manager initialized
✅ Rolling session system started
```

## 5. Test Backend

```bash
# Health check
curl http://localhost:3000/health

# Get current session
curl http://localhost:3000/api/sessions/current
```

## 6. Set Up iOS App

1. Open Xcode
2. Create new iOS project (or use existing)
3. Copy files from `ios/Sync/` to your project
4. Add HealthKit capability
5. Install Socket.IO client via Swift Package Manager:
   - URL: `https://github.com/socketio/socket.io-client-swift`
6. Update backend URL in `SessionService.swift`
7. Build and run

## 7. Set Up ML Tools (Optional)

```bash
cd ml
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Next Steps

- See `SETUP.md` for detailed configuration
- See `PROJECT_STATUS.md` for current capabilities
- See `docs/ARCHITECTURE.md` for system design

## Troubleshooting

**Backend won't start:**
- Check if port 3000 is available
- Verify database connection in `.env`
- Check Node.js version

**Database errors:**
- Ensure PostgreSQL is running
- Verify TimescaleDB extension is installed
- Check database credentials

**iOS build errors:**
- Ensure HealthKit capability is enabled
- Check that all Swift files are added to target
- Verify Socket.IO dependency is installed

## Testing the Flow

1. Start backend server
2. Open iOS app
3. Authorize HealthKit
4. Join a session
5. Watch coherence metrics update in real-time

## Development Tips

- Backend auto-reloads on file changes (using `tsx watch`)
- Check console logs for session events
- Use WebSocket test client to debug connections
- Monitor database for data collection

