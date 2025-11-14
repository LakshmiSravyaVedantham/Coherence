# Sync Platform Setup Guide

Complete setup instructions for the Sync Collective Coherence Platform.

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Supabase account (free tier works)
- Redis (optional, for caching)
- Xcode 14+ (for iOS development - optional)
- Apple Watch (for HRV monitoring) or iPhone camera (backup - optional)

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Supabase Setup

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

**Quick Setup:**

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and service role key
3. Run the SQL schema from `backend/src/db/supabase-schema.sql` in Supabase SQL Editor
4. Configure environment variables (see below)

### 3. Configure Environment

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
ENABLE_RESEARCH_COLLECTION=true
```

Create `web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3000`

## ML/Analytics Setup

### 1. Create Virtual Environment

```bash
cd ml
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Test Coherence Calculator

```python
from coherence_calculator import CoherenceCalculator

calculator = CoherenceCalculator()
rr_intervals = [850, 860, 855, 870, 865] * 10  # Sample data
result = calculator.calculate_coherence(rr_intervals)
print(result)
```

## Web App Setup

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and add your Supabase credentials (see above).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 4. Features

- Real-time session participation
- Sacred geometry visualization
- Group coherence metrics
- Personal coherence tracking
- Intention setting

**Note**: The web app uses simulated heart rate data. For production, integrate with:
- Web Bluetooth API for compatible heart rate monitors
- Fitness tracker APIs
- Camera-based HRV detection (PPG)

## iOS App Setup

### 1. Open Project

```bash
cd ios
open Sync.xcodeproj  # Or create Xcode project if not exists
```

### 2. Configure Capabilities

In Xcode:
1. Select the project target
2. Go to "Signing & Capabilities"
3. Add:
   - HealthKit
   - Background Modes (Background fetch, Background processing)

### 3. Configure Backend URL

Update `Config.swift` (create if needed):

```swift
struct Config {
    static let backendURL = "http://localhost:3000"
    static let websocketURL = "ws://localhost:3000"
}
```

### 4. Install Dependencies

For WebSocket support, you'll need to add Socket.IO client:
- Add via Swift Package Manager: `https://github.com/socketio/socket.io-client-swift`

### 5. Build and Run

1. Connect iPhone/Simulator
2. Select target device
3. Build and run (Cmd+R)

## Shared Library Setup

```bash
cd shared
npm install
npm run build
```

## Development Workflow

### Running All Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Web App:**
```bash
cd web
npm run dev
```

**Terminal 3 - ML (if needed):**
```bash
cd ml
source venv/bin/activate
python your_script.py
```

**Terminal 4 - iOS (optional):**
- Build and run from Xcode

### Testing

**Backend API:**
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/sessions/current
```

**WebSocket Test:**
Use a WebSocket client or the iOS app to connect to `ws://localhost:3000`

## Database Management

### View Data

```bash
psql sync_db

# View recent sessions
SELECT * FROM sessions ORDER BY started_at DESC LIMIT 10;

# View HRV metrics
SELECT * FROM hrv_metrics ORDER BY time DESC LIMIT 100;

# View group coherence
SELECT * FROM group_coherence_snapshots ORDER BY time DESC LIMIT 100;
```

### Export Research Data

```bash
curl http://localhost:3000/api/research/export?start=2024-01-01&end=2024-12-31
```

## Troubleshooting

### Backend Issues

- **Port already in use**: Change `PORT` in `.env`
- **Supabase connection failed**: Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- **Database errors**: Verify schema was run in Supabase SQL Editor

### iOS Issues

- **HealthKit not working**: Check capabilities and permissions
- **WebSocket connection failed**: Verify backend URL and CORS settings
- **Build errors**: Ensure all dependencies are installed

### ML Issues

- **Import errors**: Activate virtual environment
- **FFT errors**: Ensure scipy is installed correctly

## Next Steps

1. **Test MVP Features:**
   - Join a session
   - Monitor HRV
   - Calculate coherence
   - View group metrics

2. **Add Audio Assets:**
   - Place audio files in `audio/assets/`
   - Update audio track configuration

3. **Configure Production:**
   - Set up production database
   - Configure environment variables
   - Set up SSL/TLS
   - Configure app store deployment

## Architecture Overview

```
┌─────────────┐
│  iOS App    │
│  (Swift)    │
└──────┬──────┘
       │ WebSocket + REST
       │
┌──────▼──────────────────┐
│  Backend (Node.js)      │
│  - Session Manager      │
│  - WebSocket Server     │
│  - REST API             │
└──────┬──────────────────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
┌──────▼──────┐  ┌───▼────┐  ┌──────▼──────┐
│ PostgreSQL  │  │ Redis  │  │   ML/Analytics│
│ TimescaleDB │  │ (Cache)│  │   (Python)   │
└─────────────┘  └────────┘  └──────────────┘
```

## Support

For issues or questions, refer to:
- Backend: `backend/README.md`
- ML: `ml/README.md`
- iOS: `ios/README.md`

