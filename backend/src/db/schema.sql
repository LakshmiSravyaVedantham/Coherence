-- PostgreSQL + TimescaleDB schema for Sync platform

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Users table (anonymized)
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY, -- Hashed/anonymized ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    experience_level INTEGER DEFAULT 0, -- Total sessions completed
    research_consent BOOLEAN DEFAULT FALSE,
    last_active TIMESTAMP WITH TIME ZONE
);

-- Sessions table
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL, -- seconds
    audio_track_id VARCHAR(255),
    peak_group_coherence DECIMAL(5,2),
    total_participants INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time-series table for HRV metrics (TimescaleDB hypertable)
CREATE TABLE hrv_metrics (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    session_id UUID,
    heart_rate DECIMAL(5,2),
    rmssd DECIMAL(8,2), -- HRV metric
    sdnn DECIMAL(8,2), -- HRV metric
    mean_rr DECIMAL(8,2), -- Mean R-R interval in ms
    coherence_score DECIMAL(5,2)
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('hrv_metrics', 'time');

-- Indexes for performance
CREATE INDEX idx_hrv_metrics_user_session ON hrv_metrics(user_id, session_id, time DESC);
CREATE INDEX idx_hrv_metrics_session_time ON hrv_metrics(session_id, time DESC);

-- Session participants
CREATE TABLE session_participants (
    session_id UUID NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL,
    left_at TIMESTAMP WITH TIME ZONE,
    intention_category VARCHAR(50),
    peak_coherence DECIMAL(5,2),
    time_in_coherence INTEGER, -- seconds
    PRIMARY KEY (session_id, user_id),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Group coherence snapshots (aggregated metrics over time)
CREATE TABLE group_coherence_snapshots (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    session_id UUID NOT NULL,
    participant_count INTEGER NOT NULL,
    average_coherence DECIMAL(5,2) NOT NULL,
    peak_coherence DECIMAL(5,2) NOT NULL,
    coherence_phase VARCHAR(10) NOT NULL, -- low, medium, high
    low_count INTEGER DEFAULT 0,
    medium_count INTEGER DEFAULT 0,
    high_count INTEGER DEFAULT 0
);

-- Convert to hypertable
SELECT create_hypertable('group_coherence_snapshots', 'time');

CREATE INDEX idx_group_coherence_session ON group_coherence_snapshots(session_id, time DESC);

-- Synchronization pairs (for Phase 2 features)
CREATE TABLE synchronization_pairs (
    session_id UUID NOT NULL,
    user_a VARCHAR(255) NOT NULL,
    user_b VARCHAR(255) NOT NULL,
    correlation DECIMAL(5,4),
    phase_sync_index DECIMAL(5,4),
    sync_strength DECIMAL(5,4),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (session_id, user_a, user_b),
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
);

-- Research data export log
CREATE TABLE research_exports (
    export_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_range_start TIMESTAMP WITH TIME ZONE,
    date_range_end TIMESTAMP WITH TIME ZONE,
    session_count INTEGER,
    user_count INTEGER,
    exported_by VARCHAR(255) -- Researcher identifier
);

-- Retention policy (optional - for data management)
-- Automatically drop data older than retention period
-- SELECT add_retention_policy('hrv_metrics', INTERVAL '1 year');
-- SELECT add_retention_policy('group_coherence_snapshots', INTERVAL '1 year');

