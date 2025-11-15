# Deploy Full App to Render - Simple Guide

Deploy both frontend and backend in 3 easy steps!

## Prerequisites

- ✅ Render account: [render.com](https://render.com) (free tier works!)
- ✅ GitHub repo: Your code on GitHub
- ✅ Supabase project: Already set up

## 🚀 3-Step Deployment

### Step 1: Connect & Deploy

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect GitHub → Select your repo
4. Render auto-detects `render.yaml` and creates both services

**That's it for setup!** Render creates:
- `sync-backend` - Your API & WebSocket server
- `sync-frontend` - Your Next.js app

### Step 2: Add Environment Variables

You only need to add **4 variables** (Render handles the rest automatically):

#### Backend Service (`sync-backend`)
Go to service → **Environment** tab → Add:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Frontend Service (`sync-frontend`)
Go to service → **Environment** tab → Add:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**✨ Auto-configured (you don't set these):**
- `NEXT_PUBLIC_BACKEND_URL` - Auto-set from backend URL
- `NEXT_PUBLIC_WS_URL` - Auto-set as `wss://` from backend
- `CORS_ORIGIN` - Auto-set from frontend URL

### Step 3: Deploy & Done! 🎉

1. Click **"Save Changes"** on both services
2. Render automatically:
   - ✅ Builds both services
   - ✅ Links them together
   - ✅ Sets up WebSocket connections
   - ✅ Configures CORS

**Your URLs:**
- Frontend: `https://sync-frontend.onrender.com` ← **This is your main app URL!**
- Backend: `https://sync-backend.onrender.com` ← (Auto-connected, you don't need this)

**That's it!** Your app is live. Just use the frontend URL - everything is connected automatically.

## 📋 Quick Reference

### What You Set (4 variables total):

**Backend:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Frontend:**
- `NEXT_PUBLIC_SUPABASE_URL` (same as SUPABASE_URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### What Render Sets Automatically:
- ✅ `NEXT_PUBLIC_BACKEND_URL` → Backend URL
- ✅ `NEXT_PUBLIC_WS_URL` → `wss://` backend URL
- ✅ `CORS_ORIGIN` → Frontend URL
- ✅ `NODE_ENV` → `production`
- ✅ `PORT` → `3002`

**You only need to set 4 Supabase variables - Render does the rest!**

## Post-Deployment Checklist

- [ ] Both services are running (green status)
- [ ] Backend health check works: `https://sync-backend.onrender.com/health`
- [ ] Frontend loads correctly
- [ ] WebSocket connections work (check browser console)
- [ ] Audio files are accessible
- [ ] Can join a session and see real-time updates

## Troubleshooting

### Docker Error: "failed to read dockerfile"

**If you see this error:**
- Render detected a Dockerfile and is trying to use Docker instead of Node.js
- **Solution 1**: Delete the service and recreate from Blueprint (recommended)
- **Solution 2**: Manually set environment in Render dashboard:
  - Go to service → Settings → Environment → Select **"Node"**
  - Remove any Dockerfile path if shown
  - Save and redeploy
- **Solution 3**: The Dockerfile has been moved to `backend/Dockerfile.backup` to prevent auto-detection

### Build Failures

**Backend build fails:**
- Check Node.js version (should be 18+)
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors
- Verify `rootDir: backend` is correct

**Frontend build fails:**
- Verify Next.js version compatibility
- Check for missing environment variables
- Review build logs
- Verify `rootDir: web` is correct

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

