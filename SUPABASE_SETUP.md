# Supabase Setup Guide

This guide will help you set up Supabase as the database for the Sync platform.

## Why Supabase?

- **PostgreSQL-based**: Full PostgreSQL compatibility
- **Real-time subscriptions**: Built-in real-time features
- **Managed service**: No need to manage your own database
- **Free tier**: Generous free tier for development
- **Easy setup**: Get started in minutes

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `sync-coherence`
   - Database password: (save this securely)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be provisioned (~2 minutes)

## Step 2: Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **service_role key** (keep this secret!)
   - **anon key** (for client-side use)

## Step 3: Run Database Migration

### Option A: Using SQL Editor (Recommended)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `backend/src/db/supabase-schema.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. Verify tables were created in **Table Editor**

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push schema
supabase db push
```

## Step 4: Configure Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Add your Supabase credentials:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 5: Configure Web App

1. Copy `web/.env.example` to `web/.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 6: Verify Setup

### Test Backend Connection

```bash
cd backend
npm run dev
```

You should see:
```
✅ Supabase connected
```

### Test Web App

```bash
cd web
npm run dev
```

The app should load without database errors.

## Database Schema Overview

The schema includes:

- **users**: Anonymized user records
- **sessions**: Session metadata
- **hrv_metrics**: Time-series HRV data
- **session_participants**: Participant records
- **group_coherence_snapshots**: Group metrics over time
- **synchronization_pairs**: Pairwise sync data (Phase 2)
- **research_exports**: Export audit log

## Row Level Security (RLS)

RLS is enabled on all tables. The backend uses the `service_role` key which bypasses RLS. For client-side access, you'll need to set up appropriate policies.

## Real-time Features (Future)

Supabase supports real-time subscriptions. You can subscribe to changes:

```typescript
const subscription = supabase
  .channel('group_metrics')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'group_coherence_snapshots' },
    (payload) => {
      console.log('New snapshot:', payload.new)
    }
  )
  .subscribe()
```

## Backup & Recovery

Supabase automatically backs up your database:
- **Free tier**: Daily backups (7-day retention)
- **Pro tier**: Point-in-time recovery

## Monitoring

Monitor your database in Supabase dashboard:
- **Database** → **Reports**: Query performance
- **Database** → **Logs**: Database logs
- **Settings** → **Usage**: Resource usage

## Troubleshooting

### Connection Errors

- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check that your IP is not blocked (Supabase allows all IPs by default)
- Ensure project is not paused (free tier pauses after inactivity)

### Migration Errors

- Check SQL syntax in Supabase SQL editor
- Verify you have the correct permissions
- Check Supabase logs for detailed error messages

### RLS Policy Issues

- Service role key bypasses RLS (for backend use)
- Anon key requires RLS policies (for client-side use)
- Check policies in **Authentication** → **Policies**

## Next Steps

1. Set up database indexes for performance
2. Configure backup schedules (Pro tier)
3. Set up monitoring alerts
4. Review and adjust RLS policies as needed

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Discord](https://discord.supabase.com)

