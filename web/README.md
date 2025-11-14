# Sync Web Application

Next.js web application for the Sync Collective Coherence Platform.

## Features

- Real-time session participation via WebSocket
- Sacred geometry mandala visualization
- Group coherence metrics display
- Personal coherence tracking
- Intention setting
- Responsive design

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Architecture

- **Next.js 14** with App Router
- **React** for UI components
- **Zustand** for state management
- **Socket.io Client** for WebSocket connections
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Supabase** for database (optional, for future features)

## Components

- `WelcomeView` - Landing page with join button
- `SessionView` - Active session interface
- `CoherenceVisualization` - Sacred geometry mandala
- `GroupMetrics` - Group coherence statistics
- `PersonalMetrics` - Individual metrics display
- `IntentionPicker` - Intention selection modal
- `HeartRateSimulator` - Simulated heart rate (for web demo)

## Web vs Mobile

The web app uses simulated heart rate data since browsers don't have direct access to HealthKit. For production:

- Use Web Bluetooth API for compatible heart rate monitors
- Integrate with fitness trackers via APIs
- Allow manual heart rate input
- Support camera-based HRV (PPG) detection

## Production Deployment

Build for production:

```bash
npm run build
npm start
```

Deploy to Vercel, Netlify, or any Node.js hosting platform.

