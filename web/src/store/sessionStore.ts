import { create } from 'zustand'

export interface SessionInfo {
  sessionId: string
  startedAt: number
  duration: number
  currentPhase: 'preparation' | 'active' | 'integration' | 'complete'
  participantCount: number
  groupMetrics: {
    sessionId: string
    timestamp: number
    participantCount: number
    averageCoherence: number
    peakCoherence: number
    coherencePhase: 'low' | 'medium' | 'high'
    coherenceDistribution: {
      low: number
      medium: number
      high: number
    }
  }
  audioTrack: {
    id: string
    name: string
    duration: number
  }
}

interface SessionState {
  currentSession: SessionInfo | null
  isConnected: boolean
  personalCoherence: number
  heartRate: number | null
  audioElementRef: HTMLAudioElement | null
  setCurrentSession: (session: SessionInfo | null) => void
  setIsConnected: (connected: boolean) => void
  setPersonalCoherence: (coherence: number) => void
  setHeartRate: (rate: number | null) => void
  updateGroupMetrics: (metrics: SessionInfo['groupMetrics']) => void
  setAudioElementRef: (element: HTMLAudioElement | null) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  isConnected: false,
  personalCoherence: 0,
  heartRate: null,
  audioElementRef: null,
  setCurrentSession: (session) => set({ currentSession: session }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setPersonalCoherence: (coherence) => set({ personalCoherence: coherence }),
  setHeartRate: (rate) => set({ heartRate: rate }),
  updateGroupMetrics: (metrics) =>
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            groupMetrics: metrics,
            participantCount: metrics.participantCount,
          }
        : null,
    })),
  setAudioElementRef: (element) => set({ audioElementRef: element }),
}))

