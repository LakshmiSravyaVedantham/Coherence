# Render Environment Variables - Simple Guide

**TL;DR**: You only need to set **4 variables** - Render handles the rest automatically!

## Backend Service (`sync-backend`)

### Required Variables

| Variable Name | Description | Example Value | Where to Get It |
|--------------|-------------|---------------|-----------------|
| `SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for backend operations) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase Dashboard → Settings → API → service_role key |
| `NODE_ENV` | Node environment | `production` | Set to `production` |
| `PORT` | Server port | `3002` | Auto-set by Render, but can override |

### Optional Variables

| Variable Name | Description | Default | Notes |
|--------------|-------------|---------|-------|
| `CORS_ORIGIN` | Allowed CORS origin | `*` | Auto-set from frontend service URL |
| `FRONTEND_URL` | Frontend URL (fallback for CORS) | - | Auto-set from frontend service |
| `REDIS_URL` | Redis connection URL (if using Redis) | - | Only if you add Redis service |

### How to Set in Render

1. Go to your **sync-backend** service
2. Navigate to **Environment** tab
3. Click **"Add Environment Variable"**
4. Add each variable above

**Note**: `CORS_ORIGIN` is automatically set by Render from the frontend service URL, so you don't need to set it manually.

---

## Frontend Service (`sync-frontend`)

### Required Variables

| Variable Name | Description | Example Value | Where to Get It |
|--------------|-------------|---------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase Dashboard → Settings → API → anon/public key |
| `NODE_ENV` | Node environment | `production` | Set to `production` |

### Auto-Set Variables (Don't Set Manually)

These are automatically configured by Render from the backend service:

| Variable Name | Description | Auto-Set From |
|--------------|-------------|---------------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `sync-backend` service URL |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL (secure) | `sync-backend` service URL (converted to `wss://`) |

### How to Set in Render

1. Go to your **sync-frontend** service
2. Navigate to **Environment** tab
3. Click **"Add Environment Variable"**
4. Add only the **Required Variables** listed above
5. **Do NOT** set `NEXT_PUBLIC_BACKEND_URL` or `NEXT_PUBLIC_WS_URL` - Render sets these automatically

---

## ✅ Simple Checklist (Only 4 Variables!)

### Backend Service (`sync-backend`)
- [ ] `SUPABASE_URL` = Your Supabase project URL
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key

### Frontend Service (`sync-frontend`)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL (same as above)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key

**That's it!** Render automatically sets:
- ✅ `NEXT_PUBLIC_BACKEND_URL` → Backend URL
- ✅ `NEXT_PUBLIC_WS_URL` → `wss://` Backend URL  
- ✅ `CORS_ORIGIN` → Frontend URL
- ✅ `NODE_ENV` → `production`
- ✅ `PORT` → `3002`

---

## Where to Find Supabase Keys

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. You'll see:
   - **Project URL** → Use for `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → Use for `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

---

## Example Values (Don't Use These - Get Your Own!)

### Backend
```
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NODE_ENV=production
PORT=3002
```

### Frontend
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMn0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NODE_ENV=production
```

---

## Important Notes

1. **Never commit these values** to Git - they're secrets!
2. **Service Role Key** is sensitive - only use in backend, never in frontend
3. **Anon Key** is safe for frontend - it's designed to be public
4. **Auto-set variables** - Don't manually set `NEXT_PUBLIC_BACKEND_URL` or `NEXT_PUBLIC_WS_URL` in Render
5. **WebSocket URL** - Render automatically converts backend URL to `wss://` (secure WebSocket)
6. **CORS** - Backend automatically allows requests from frontend URL

---

## Troubleshooting

### "Cannot connect to backend"
- Check that `NEXT_PUBLIC_BACKEND_URL` is set (should be auto-set)
- Verify backend service is running
- Check backend logs for errors

### "WebSocket connection failed"
- Verify `NEXT_PUBLIC_WS_URL` uses `wss://` (secure)
- Check backend WebSocket support is enabled
- Verify CORS allows frontend domain

### "Supabase connection error"
- Double-check `SUPABASE_URL` and keys are correct
- Verify keys match your Supabase project
- Check Supabase project is active

### "Environment variable not found"
- Ensure variable names match exactly (case-sensitive)
- Frontend variables must start with `NEXT_PUBLIC_`
- Restart services after adding variables

---

## Copy-Paste Ready List

### Backend (sync-backend)
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NODE_ENV=production
PORT=3002
```

### Frontend (sync-frontend)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NODE_ENV=production
```

Fill in the Supabase values from your Supabase dashboard!

