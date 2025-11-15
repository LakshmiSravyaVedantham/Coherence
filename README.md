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

### 🚀 Deploy to Render (3 Steps!)

1. **Connect**: Go to [render.com](https://render.com) → Create Blueprint → Connect GitHub
2. **Configure**: Add 4 Supabase variables (see [RENDER_ENV_VARS.md](./RENDER_ENV_VARS.md))
3. **Deploy**: Click deploy - Render handles the rest!

**That's it!** Render automatically:
- ✅ Creates both frontend & backend services
- ✅ Links them together
- ✅ Sets up WebSocket connections
- ✅ Configures all URLs

📖 **Quick guides**: 
- [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) - Step-by-step deployment
- [RENDER_ENV_VARS.md](./RENDER_ENV_VARS.md) - Environment variables (only 4 needed!)

### Alternative: Deploy Separately

**Option 1: Vercel (Frontend) + Railway (Backend)**
- Frontend: Deploy to Vercel (see DEPLOYMENT.md)
- Backend: Deploy to Railway (see DEPLOYMENT.md)

**Option 2: Render (Both)**
- Use the `render.yaml` configuration
- Both services deploy automatically

📖 **Full deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Research Focus

This platform is designed as a research instrument to study:
- Group physiological synchronization
- Collective coherence patterns
- Optimal group sizes and dynamics
- Network effects in meditation practice

