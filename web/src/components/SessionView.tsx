'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/contexts/SessionContext'
import { useSessionStore } from '@/store/sessionStore'
import CoherenceVisualization from './CoherenceVisualization'
import GroupMetrics from './GroupMetrics'
import PersonalMetrics from './PersonalMetrics'
import HeartRateSimulator from './HeartRateSimulator'
import ChantPlayer from './ChantPlayer'
import ChantInfo from './ChantInfo'
import AudioSyncController from './AudioSyncController'
import SynchronizationNetwork from './SynchronizationNetwork'
import CoherenceInsights from './CoherenceInsights'
import SessionTimer from './SessionTimer'
import RealTimeStats from './RealTimeStats'
import ChantLyrics from './ChantLyrics'
import BreathGuidance from './BreathGuidance'
import CoherenceAchievements from './CoherenceAchievements'
import IntentionAwareness from './IntentionAwareness'
import SessionNotifications from './SessionNotifications'
import CoherenceComparison from './CoherenceComparison'
import PairwiseSyncAnalysis from './PairwiseSyncAnalysis'
import HubDetection from './HubDetection'
import AudioEnhancements from './AudioEnhancements'
import SessionTabs from './SessionTabs'

export default function SessionView() {
  const { leaveSession, updateCoherence } = useSession()
  const { currentSession, personalCoherence, heartRate } = useSessionStore()
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  if (!currentSession) return null

  return (
    <div className="max-w-6xl mx-auto">
      <SessionNotifications />
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">
          {currentSession.participantCount || 0} people chanting with you
        </h2>
        <p className="text-gray-400 mb-4">
          Phase: <span className="capitalize">{currentSession.currentPhase}</span>
        </p>
        <SessionTimer
          startTime={currentSession.startedAt}
          duration={currentSession.duration}
        />
      </div>

      {/* Main Content with Tabs */}
      <SessionTabs />

      {/* Heart Rate Simulator (for web - since we don't have HealthKit) */}
      <div className="mt-6">
        <HeartRateSimulator
          onHeartRateChange={(rate) => {
            // Simulate coherence calculation based on heart rate variability
            // In production, this would come from actual HRV data
            const simulatedCoherence = Math.min(
              100,
              Math.max(0, 50 + (rate - 70) * 0.5 + Math.random() * 10 - 5)
            )
            updateCoherence(simulatedCoherence)
          }}
        />
      </div>

      {/* Audio Sync Controller */}
      {audioElement && currentSession.audioTrack && (
        <AudioSyncController
          audioElement={audioElement}
          sessionStartTime={currentSession.startedAt}
        />
      )}

      {/* Leave Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            // Save session to history before leaving
            if (currentSession) {
              try {
                const stored = localStorage.getItem('sync_session_history') || '[]'
                const history = JSON.parse(stored)
                const sessionStart = localStorage.getItem('sync_current_session')
                
                if (sessionStart) {
                  const startData = JSON.parse(sessionStart)
                  const groupMetrics = currentSession.groupMetrics || {
                    peakCoherence: 0,
                    averageCoherence: 0,
                  }
                  history.push({
                    sessionId: currentSession.sessionId,
                    date: new Date(startData.startedAt).toISOString(),
                    duration: Date.now() - startData.startedAt,
                    peakCoherence: groupMetrics.peakCoherence,
                    averageCoherence: groupMetrics.averageCoherence,
                    participantCount: currentSession.participantCount,
                    chantName: startData.audioTrack?.name || 'Unknown Chant',
                    intention: localStorage.getItem('sync_last_intention') || undefined,
                  })
                  localStorage.setItem('sync_session_history', JSON.stringify(history))
                  localStorage.removeItem('sync_current_session')
                }
              } catch (error) {
                console.error('Error saving session history:', error)
              }
            }
            leaveSession()
          }}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
        >
          Leave Session
        </button>
      </div>
    </div>
  )
}

