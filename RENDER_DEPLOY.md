# Deploy Full App to Render - Quick Guide

This guide will help you deploy both the frontend and backend to Render in one go.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com) (free tier available)
2. **GitHub Repository**: Your code should be on GitHub
3. **Supabase Project**: Already set up (see SETUP.md)

## Step-by-Step Deployment

### 1. Connect GitHub to Render

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select your repository: `LakshmiSravya123/Coherence`

### 2. Render Auto-Detects Configuration

Render will automatically detect the `render.yaml` file in your repository root and create both services:
- **sync-backend** (Node.js backend)
- **sync-frontend** (Next.js frontend)

### 3. Add Environment Variables

Before deploying, add these environment variables in Render dashboard:

#### For Backend Service (sync-backend):

1. Go to your backend service settings
2. Navigate to **"Environment"** tab
3. Add these variables:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NODE_ENV=production
PORT=3002
```

#### For Frontend Service (sync-frontend):

1. Go to your frontend service settings
2. Navigate to **"Environment"** tab
3. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NODE_ENV=production
```

**Note**: `NEXT_PUBLIC_BACKEND_URL` and `NEXT_PUBLIC_WS_URL` are automatically set by Render from the backend service URL.

### 4. Deploy

1. Click **"Apply"** or **"Save Changes"** on both services
2. Render will automatically:
   - Build both services
   - Deploy them
   - Link frontend to backend URLs
   - Set up WebSocket connections

### 5. Get Your URLs

After deployment completes:

1. **Backend URL**: `https://sync-backend.onrender.com` (or your custom domain)
2. **Frontend URL**: `https://sync-frontend.onrender.com` (or your custom domain)

The frontend will automatically use the backend URL for API and WebSocket connections.

## Environment Variables Summary

### Backend (`sync-backend`)
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
PORT=3002
CORS_ORIGIN=https://sync-frontend.onrender.com (auto-set)
```

### Frontend (`sync-frontend`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BACKEND_URL=https://sync-backend.onrender.com (auto-set)
NEXT_PUBLIC_WS_URL=wss://sync-backend.onrender.com (auto-set)
NODE_ENV=production
```

## Post-Deployment Checklist

- [ ] Both services are running (green status)
- [ ] Backend health check works: `https://sync-backend.onrender.com/health`
- [ ] Frontend loads correctly
- [ ] WebSocket connections work (check browser console)
- [ ] Audio files are accessible
- [ ] Can join a session and see real-time updates

## Troubleshooting

### Build Failures

**Backend build fails:**
- Check Node.js version (should be 18+)
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

**Frontend build fails:**
- Verify Next.js version compatibility
- Check for missing environment variables
- Review build logs

### WebSocket Connection Issues

- Ensure backend service has WebSocket support enabled (Render does this automatically)
- Check that `NEXT_PUBLIC_WS_URL` uses `wss://` (secure WebSocket)
- Verify CORS settings allow your frontend domain

### Environment Variables Not Working

- Variables must be set in Render dashboard, not just in `render.yaml`
- Frontend variables must start with `NEXT_PUBLIC_` to be accessible in browser
- Restart services after adding new variables

### Services Not Linking

- Check that service names match in `render.yaml`
- Verify `fromService` references are correct
- Ensure both services are in the same Render account

## Custom Domains

You can add custom domains in Render:

1. Go to service settings
2. Navigate to **"Custom Domains"**
3. Add your domain
4. Update DNS records as instructed

## Free Tier Limitations

Render free tier:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Perfect for development/testing
- Upgrade to paid plan for always-on services

## Cost

- **Free Tier**: Both services can run on free tier
- **Starter Plan**: $7/month per service (always-on)
- **Recommended**: Start with free tier, upgrade if needed

## Support

- Render Docs: [render.com/docs](https://render.com/docs)
- Render Community: [community.render.com](https://community.render.com)
- Check service logs in Render dashboard for errors

## Next Steps

After successful deployment:
1. Test all features
2. Set up custom domain (optional)
3. Configure monitoring/alerts
4. Set up CI/CD for automatic deployments

