# Sync iOS App

iOS application for the Sync Collective Coherence Platform.

## Requirements

- iOS 15.0+
- Xcode 14.0+
- Swift 5.7+
- Apple Watch (for HRV monitoring) or iPhone camera (backup)

## Features

### MVP Features

1. **HealthKit Integration**
   - Continuous HRV monitoring
   - Heart rate streaming
   - Respiratory rate detection
   - Motion/posture tracking

2. **Real-time Coherence Calculation**
   - 5-second update intervals
   - Visual feedback
   - Historical tracking

3. **Live Group Sessions**
   - Join rolling sessions
   - Real-time group metrics
   - Personal intention setting

4. **Visualization**
   - Unified Field Mandala
   - Personal coherence wave
   - Group coherence indicators

## Project Structure

```
ios/
├── Sync/
│   ├── App/
│   │   ├── SyncApp.swift          # Main app entry
│   │   └── AppDelegate.swift
│   ├── Models/                    # Data models
│   ├── Services/                  # Business logic
│   │   ├── HealthKitService.swift
│   │   ├── CoherenceService.swift
│   │   └── SessionService.swift
│   ├── Views/                     # SwiftUI views
│   │   ├── SessionView.swift
│   │   ├── CoherenceVisualization.swift
│   │   └── IntentionView.swift
│   └── Resources/
└── SyncWatch Extension/           # Watch app
```

## Setup

1. Open `Sync.xcodeproj` in Xcode
2. Configure HealthKit capabilities
3. Set up Watch Connectivity
4. Configure backend URL in `Config.swift`

## HealthKit Permissions

The app requires the following HealthKit permissions:
- Heart Rate (read)
- Heart Rate Variability (read)
- Respiratory Rate (read)
- Workout (read/write)

## Backend Integration

The app connects to the backend via:
- REST API for session info
- WebSocket for real-time updates

