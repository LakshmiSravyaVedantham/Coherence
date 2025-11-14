# Sync - Collective Coherence Platform

A research-enabled group healing app that measures and visualizes physiological synchronization in real-time group chanting sessions. Chant together in harmony and experience the power of collective coherence.

## Architecture

- **Backend**: Node.js + TypeScript with WebSocket support
- **Database**: Supabase (PostgreSQL-based) for time-series data
- **Web App**: Next.js + React with real-time visualization
- **iOS App**: Swift with HealthKit integration
- **ML/Analytics**: Python for coherence calculation and data processing
- **Real-time**: Socket.io for live session synchronization

## Project Structure

```
coherence_cursor/
├── backend/              # Node.js backend API
├── web/                  # Next.js web application
├── ios/                  # iOS app (Swift)
├── shared/               # Shared TypeScript libraries
├── ml/                   # Python ML and coherence calculation
├── audio/                # Audio assets and processing
└── docs/                 # Documentation
```

## Features (All Phases Complete ✅)

### Core Features
1. ✅ HRV monitoring & coherence calculation
2. ✅ Synchronized chanting sessions with audio playback
3. ✅ Multiple chant options (Om, Gayatri, Buddhist mantras, etc.)
4. ✅ Group and personal metrics
5. ✅ Sacred geometry visualization
6. ✅ Data collection infrastructure
7. ✅ Personal intention setting
8. ✅ Real-time group coherence tracking

### Advanced Features
- ✅ Session history & analytics
- ✅ Audio equalizer & spatial audio
- ✅ Settings & personalization
- ✅ Advanced insights (AI-powered)
- ✅ Data export (CSV, JSON, PDF)
- ✅ Research dashboard
- ✅ Social features (leaderboards, sharing, community)
- ✅ Error handling & offline support
- ✅ Keyboard shortcuts & accessibility
- ✅ Performance optimizations

**See [PHASES_COMPLETE.md](./PHASES_COMPLETE.md) for complete feature list.**

## Getting Started

See individual README files in each directory for setup instructions.

## Deployment

**Quick Deploy to Vercel:**

1. **Deploy Backend** (choose one):
   - **Railway** (recommended): Connect GitHub repo, select `backend` directory, add env vars
   - **Render**: Create web service, set root to `backend`, enable WebSockets
   - **Fly.io**: `cd backend && fly launch`

2. **Deploy Frontend to Vercel**:
   ```bash
   npm i -g vercel
   vercel login
   vercel --cwd web
   ```
   Or use Vercel dashboard: Import repo → Set root to `web` → Deploy

3. **Set Environment Variables**:
   - Frontend: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_WS_URL`
   - Backend: `SUPABASE_URL`, `SUPABASE_KEY`, `PORT`, `CORS_ORIGIN`

📖 **Full deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Research Focus

This platform is designed as a research instrument to study:
- Group physiological synchronization
- Collective coherence patterns
- Optimal group sizes and dynamics
- Network effects in meditation practice

