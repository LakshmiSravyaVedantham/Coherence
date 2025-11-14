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

export default function SessionView() {
  const { leaveSession, updateCoherence } = useSession()
  const { currentSession, personalCoherence, heartRate } = useSessionStore()
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!currentSession) return

    const updateTimer = () => {
      const elapsed = Date.now() - currentSession.startedAt
      const remaining = Math.max(0, currentSession.duration - elapsed)
      setTimeRemaining(Math.floor(remaining / 1000))
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [currentSession])

  if (!currentSession) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Provide default values if groupMetrics is undefined
  const groupMetrics = currentSession.groupMetrics || {
    sessionId: currentSession.sessionId,
    timestamp: Date.now(),
    participantCount: currentSession.participantCount || 0,
    averageCoherence: 0,
    peakCoherence: 0,
    coherencePhase: 'low' as const,
    coherenceDistribution: {
      low: 0,
      medium: 0,
      high: 0,
    },
  }

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

      {/* Chant Info */}
      <div className="mb-4">
        <ChantInfo chantId={currentSession.audioTrack.id} />
      </div>

      {/* Chant Lyrics */}
      <div className="mb-4">
        <ChantLyrics chantId={currentSession.audioTrack.id} />
      </div>

      {/* Breath Guidance */}
      <div className="mb-6">
        <BreathGuidance />
      </div>

      {/* Chant Player */}
      <div className="mb-6">
        <ChantPlayer
          audioTrackId={currentSession.audioTrack.id}
          audioTrackName={currentSession.audioTrack.name}
          onAudioElementReady={setAudioElement}
        />
        {audioElement && (
          <AudioSyncController
            audioElement={audioElement}
            sessionStartTime={currentSession.startedAt}
          />
        )}
      </div>

      {/* Group Metrics */}
      <GroupMetrics metrics={groupMetrics} />

      {/* Main Visualization */}
      <div className="my-8">
        <CoherenceVisualization
          personalCoherence={personalCoherence}
          groupCoherence={groupMetrics.averageCoherence}
          coherencePhase={groupMetrics.coherencePhase}
        />
      </div>

      {/* Coherence Insights */}
      <div className="mb-6">
        <CoherenceInsights />
      </div>

      {/* Intention Awareness */}
      <div className="mb-6">
        <IntentionAwareness />
      </div>

      {/* Coherence Comparison */}
      <div className="mb-6">
        <CoherenceComparison />
      </div>

      {/* Real-time Stats */}
      <div className="mb-6">
        <RealTimeStats />
      </div>

      {/* Personal Metrics */}
      <PersonalMetrics
        heartRate={heartRate}
        coherence={personalCoherence}
        coherencePhase={
          personalCoherence < 40
            ? 'low'
            : personalCoherence < 60
            ? 'medium'
            : 'high'
        }
      />

      {/* Synchronization Network */}
      {currentSession.participantCount > 1 && (
        <div className="mt-6">
          <SynchronizationNetwork />
        </div>
      )}

      {/* Achievements */}
      <div className="mt-6">
        <CoherenceAchievements />
      </div>

      {/* Heart Rate Simulator (for web - since we don't have HealthKit) */}
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
                  history.push({
                    sessionId: currentSession.sessionId,
                    date: new Date(startData.startedAt).toISOString(),
                    duration: Date.now() - startData.startedAt,
                    peakCoherence: groupMetrics.peakCoherence,
                    averageCoherence: groupMetrics.averageCoherence,
                    participantCount: currentSession.participantCount,
                    chantName: startData.audioTrack.name,
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

