-- Supabase schema for Sync platform
-- Run this in your Supabase SQL editor

-- Enable TimescaleDB extension (if available in your Supabase instance)
-- Note: Supabase may not have TimescaleDB by default, but the schema will work without it
-- CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Users table (anonymized)
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) PRIMARY KEY, -- Hashed/anonymized ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    experience_level INTEGER DEFAULT 0, -- Total sessions completed
    research_consent BOOLEAN DEFAULT FALSE,
    last_active TIMESTAMP WITH TIME ZONE
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL, -- seconds
    audio_track_id VARCHAR(255),
    peak_group_coherence DECIMAL(5,2),
    total_participants INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time-series table for HRV metrics
CREATE TABLE IF NOT EXISTS hrv_metrics (
    time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    user_id VARCHAR(255) NOT NULL,
    session_id UUID,
    heart_rate DECIMAL(5,2),
    rmssd DECIMAL(8,2), -- HRV metric
    sdnn DECIMAL(8,2), -- HRV metric
    mean_rr DECIMAL(8,2), -- Mean R-R interval in ms
    coherence_score DECIMAL(5,2)
);

-- Convert to hypertable if TimescaleDB is available
-- SELECT create_hypertable('hrv_metrics', 'time');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hrv_metrics_user_session ON hrv_metrics(user_id, session_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_hrv_metrics_session_time ON hrv_metrics(session_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_hrv_metrics_time ON hrv_metrics(time DESC);

-- Session participants
CREATE TABLE IF NOT EXISTS session_participants (
    session_id UUID NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    intention_category VARCHAR(50),
    peak_coherence DECIMAL(5,2),
    time_in_coherence INTEGER, -- seconds
    PRIMARY KEY (session_id, user_id),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Group coherence snapshots (aggregated metrics over time)
CREATE TABLE IF NOT EXISTS group_coherence_snapshots (
    time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    session_id UUID NOT NULL,
    participant_count INTEGER NOT NULL,
    average_coherence DECIMAL(5,2) NOT NULL,
    peak_coherence DECIMAL(5,2) NOT NULL,
    coherence_phase VARCHAR(10) NOT NULL, -- low, medium, high
    low_count INTEGER DEFAULT 0,
    medium_count INTEGER DEFAULT 0,
    high_count INTEGER DEFAULT 0,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- Convert to hypertable if TimescaleDB is available
-- SELECT create_hypertable('group_coherence_snapshots', 'time');

CREATE INDEX IF NOT EXISTS idx_group_coherence_session ON group_coherence_snapshots(session_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_group_coherence_time ON group_coherence_snapshots(time DESC);

-- Synchronization pairs (for Phase 2 features)
CREATE TABLE IF NOT EXISTS synchronization_pairs (
    session_id UUID NOT NULL,
    user_a VARCHAR(255) NOT NULL,
    user_b VARCHAR(255) NOT NULL,
    correlation DECIMAL(5,4),
    phase_sync_index DECIMAL(5,4),
    sync_strength DECIMAL(5,4),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (session_id, user_a, user_b),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- Research data export log
CREATE TABLE IF NOT EXISTS research_exports (
    export_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_range_start TIMESTAMP WITH TIME ZONE,
    date_range_end TIMESTAMP WITH TIME ZONE,
    session_count INTEGER,
    user_count INTEGER,
    exported_by VARCHAR(255) -- Researcher identifier
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrv_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_coherence_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE synchronization_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_exports ENABLE ROW LEVEL SECURITY;

-- Create policies for service role (backend access)
-- These policies allow the backend service role to access all data
CREATE POLICY "Service role can access all users" ON users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all sessions" ON sessions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all hrv_metrics" ON hrv_metrics
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all session_participants" ON session_participants
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all group_coherence_snapshots" ON group_coherence_snapshots
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all synchronization_pairs" ON synchronization_pairs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all research_exports" ON research_exports
    FOR ALL USING (auth.role() = 'service_role');

-- Create a function to get current session stats (useful for real-time subscriptions)
CREATE OR REPLACE FUNCTION get_session_stats(session_uuid UUID)
RETURNS TABLE (
    participant_count BIGINT,
    avg_coherence DECIMAL,
    peak_coherence DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT sp.user_id)::BIGINT as participant_count,
        AVG(hm.coherence_score)::DECIMAL as avg_coherence,
        MAX(hm.coherence_score)::DECIMAL as peak_coherence
    FROM session_participants sp
    LEFT JOIN hrv_metrics hm ON sp.user_id = hm.user_id AND sp.session_id = hm.session_id
    WHERE sp.session_id = session_uuid
    GROUP BY sp.session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

