# Deployment Guide

This guide covers deploying the Sync platform to production.

## Architecture Overview

- **Frontend (Web App)**: Next.js app deployed on Vercel
- **Backend (API + WebSocket)**: Node.js server deployed on Railway/Render/Fly.io
- **Database**: Supabase (already hosted)

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project**: Already set up (see SETUP.md)
3. **Backend Hosting**: Choose one:
   - Railway (recommended for WebSocket support)
   - Render
   - Fly.io

## Step 1: Deploy Backend

The backend needs to be deployed first since the frontend connects to it.

### Option A: Railway (Recommended)

1. Sign up at [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Add a new service → "Deploy from GitHub repo"
5. Select the `backend` directory
6. Set environment variables:
   ```
   PORT=3002
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_key
   REDIS_URL=your_redis_url (optional)
   NODE_ENV=production
   ```
7. Railway will auto-detect Node.js and deploy
8. Note the deployment URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Sign up at [render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables (same as Railway)
6. Enable "WebSocket Support" in settings
7. Deploy and note the URL

### Option C: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. In `backend/` directory, run: `fly launch`
4. Follow prompts and set environment variables
5. Deploy: `fly deploy`

## Step 2: Deploy Frontend to Vercel

### Method 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Navigate to project root:
   ```bash
   cd /path/to/coherence_cursor
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow prompts:
   - Set root directory: `web`
   - Framework: Next.js (auto-detected)
   - Build command: `npm run build`
   - Output directory: `.next`

6. Set environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add NEXT_PUBLIC_BACKEND_URL
   vercel env add NEXT_PUBLIC_WS_URL
   ```

### Method 2: Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `web`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `NEXT_PUBLIC_BACKEND_URL`: Your backend URL (from Step 1)
   - `NEXT_PUBLIC_WS_URL`: Your WebSocket URL (wss://your-backend-url)
6. Click "Deploy"

## Step 3: Update CORS Settings

In your backend deployment, ensure CORS allows your Vercel domain:

```typescript
// backend/src/index.ts
const corsOptions = {
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:3001', // for local dev
  ],
  credentials: true,
}
```

## Step 4: Update WebSocket URL

After deployment, update the WebSocket URL in your frontend environment variables:

- For Railway: `wss://your-app.railway.app`
- For Render: `wss://your-app.onrender.com`
- For Fly.io: `wss://your-app.fly.dev`

## Environment Variables Summary

### Frontend (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app
```

### Backend (Railway/Render/Fly.io)
```
PORT=3002
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_service_role_key
REDIS_URL=your_redis_url (optional)
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app
```

## Post-Deployment Checklist

- [ ] Backend is accessible and WebSocket connections work
- [ ] Frontend can connect to backend
- [ ] Supabase connection is working
- [ ] Audio files are accessible (check `/audio/` paths)
- [ ] WebSocket connections use `wss://` (secure) in production
- [ ] CORS is configured correctly
- [ ] Environment variables are set in both deployments

## Troubleshooting

### WebSocket Connection Issues
- Ensure backend supports WebSockets (Railway/Render/Fly.io all do)
- Use `wss://` (secure WebSocket) in production, not `ws://`
- Check CORS settings allow your frontend domain

### Build Failures
- Check Node.js version (should be 18+)
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

### Environment Variables Not Working
- Vercel: Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart deployment after adding new variables
- Check variable names match exactly (case-sensitive)

## Continuous Deployment

Both Vercel and Railway/Render support automatic deployments:
- Push to `main` branch → auto-deploy
- Pull requests → preview deployments (Vercel)

## Cost Estimates

- **Vercel**: Free tier (hobby) is sufficient for most use cases
- **Railway**: ~$5-20/month depending on usage
- **Render**: Free tier available, paid plans start at $7/month
- **Supabase**: Free tier available, scales as needed

## Alternative: Monorepo Deployment

If you want to deploy both frontend and backend from one repo:

1. Use Vercel for frontend (as above)
2. Use Railway/Render for backend (as above)
3. Both can connect to the same GitHub repo
4. Set different root directories in each platform

## Support

For deployment issues:
- Check platform-specific documentation
- Review build logs
- Test locally first with production environment variables

