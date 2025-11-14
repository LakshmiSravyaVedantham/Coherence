# Sync Platform Architecture

## Overview

The Sync platform is a distributed system for real-time group coherence measurement and visualization. It consists of:

1. **iOS Client** - Mobile app with HealthKit integration
2. **Backend Server** - Node.js/TypeScript with WebSocket support
3. **Database** - PostgreSQL + TimescaleDB for time-series data
4. **ML/Analytics** - Python for advanced coherence calculation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        iOS Client                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ HealthKit    │  │ Coherence    │  │ Session      │     │
│  │ Service      │→ │ Service      │→ │ Service      │     │
│  └──────────────┘  └──────────────┘  └──────┬───────┘     │
│                                               │              │
│  ┌───────────────────────────────────────────▼──────────┐  │
│  │              SwiftUI Views                            │  │
│  │  - SessionView                                        │  │
│  │  - CoherenceVisualization                            │  │
│  │  - IntentionPicker                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ WebSocket + REST API
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Backend Server                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express HTTP Server                      │  │
│  │  - REST API endpoints                                │  │
│  │  - Health checks                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Socket.io WebSocket Server                 │  │
│  │  - Real-time session updates                         │  │
│  │  - Group metrics broadcasting                        │  │
│  │  - Participant management                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Session Manager                            │  │
│  │  - Rolling session system                            │  │
│  │  - Participant tracking                              │  │
│  │  - Group coherence calculation                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Data Collection Service                       │  │
│  │  - Anonymization                                      │  │
│  │  - Time-series storage                                │  │
│  │  - Research data export                               │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐  ┌────▼────┐  ┌──────▼────────┐
│ PostgreSQL   │  │ Redis   │  │ ML/Analytics  │
│ TimescaleDB  │  │ (Cache) │  │ (Python)      │
│              │  │         │  │               │
│ - Sessions   │  │ - Session│ │ - Advanced    │
│ - HRV metrics│  │   state  │ │   coherence   │
│ - Group      │  │ - Metrics│ │   calculation │
│   snapshots  │  │         │  │ - Sync        │
│ - Users      │  │         │  │   analysis    │
└──────────────┘  └─────────┘  └───────────────┘
```

## Data Flow

### 1. Session Join Flow

```
iOS Client                    Backend Server              Database
    │                              │                          │
    │─── GET /api/sessions/current │                          │
    │<── Session Info ─────────────│                          │
    │                              │                          │
    │─── WebSocket: join_session ──│                          │
    │                              │─── Store participant ────│
    │                              │                          │
    │<── session_joined ───────────│                          │
    │                              │                          │
```

### 2. Coherence Update Flow

```
iOS Client                    Backend Server              Database
    │                              │                          │
    │ HealthKit → HRV Data         │                          │
    │ Calculate Coherence          │                          │
    │                              │                          │
    │─── WebSocket: update_coherence│                         │
    │                              │                          │
    │                              │─── Update participant ───│
    │                              │─── Calculate group ──────│
    │                              │─── Store metrics ────────│
    │                              │                          │
    │<── group_metrics_update ─────│                          │
    │<── personal_feedback ────────│                          │
    │                              │                          │
```

### 3. Rolling Session System

```
Backend Server
    │
    │ Every 15 minutes:
    │
    ├─→ Create new session
    ├─→ Transition phases:
    │   - Preparation (30s)
    │   - Active (12.5 min)
    │   - Integration (2 min)
    │   - Complete
    │
    └─→ Cleanup old sessions
```

## Key Components

### iOS Client

**HealthKitService**
- Monitors heart rate and HRV
- Streams R-R intervals
- Handles authorization

**CoherenceService**
- Calculates personal coherence
- Maintains rolling window
- Updates every 5 seconds

**SessionService**
- WebSocket connection management
- Session state synchronization
- Real-time updates

**Views**
- `SessionView`: Active session UI
- `CoherenceVisualization`: Sacred geometry mandala
- `IntentionPickerView`: Intention selection

### Backend Server

**SessionManager**
- Manages rolling sessions
- Tracks participants
- Calculates group metrics

**WebSocket Handlers**
- Client connection management
- Real-time event broadcasting
- Participant synchronization

**Data Collection**
- Anonymization (SHA-256 hashing)
- Time-series storage
- Research data export

### Database Schema

**TimescaleDB Hypertables**
- `hrv_metrics`: Time-series HRV data
- `group_coherence_snapshots`: Group metrics over time

**PostgreSQL Tables**
- `sessions`: Session metadata
- `session_participants`: Participant records
- `users`: Anonymized user data
- `synchronization_pairs`: Pairwise sync (Phase 2)

## Coherence Calculation

### Individual Coherence

```
Coherence Score = (Peak Power 0.04-0.26 Hz) / (Total Power 0-0.4 Hz) × 100

Phases:
- Low: 0-40%
- Medium: 40-60%
- High: 60-100%
```

### Group Coherence

```
Average Coherence = Mean of all participant coherence scores
Peak Coherence = Maximum group coherence achieved
Distribution = Count of participants in each phase
```

## Scalability Considerations

### Current Design (MVP)

- In-memory session management
- Suitable for < 10,000 concurrent users
- Single server deployment

### Future Scaling (Phase 2+)

- Redis for distributed session state
- Horizontal scaling with load balancer
- Database sharding for time-series data
- CDN for audio asset delivery

## Security & Privacy

### Data Anonymization

- User IDs: SHA-256 hashed
- No PII stored
- Research consent tracking
- GDPR-compliant data export

### API Security

- CORS configuration
- Helmet.js security headers
- Rate limiting (future)
- Authentication (future)

## Performance Targets

- **WebSocket Latency**: < 200ms
- **API Response Time**: < 100ms
- **Database Queries**: < 50ms (p95)
- **Uptime**: 99%+

## Monitoring & Observability

### Metrics to Track

- Active sessions
- Concurrent participants
- WebSocket connections
- API response times
- Database query performance
- Coherence calculation latency

### Logging

- Session lifecycle events
- Participant join/leave
- Coherence updates
- Error tracking
- Research data exports

