'use client'

import { useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import ChantPlayer from './ChantPlayer'
import ChantInfo from './ChantInfo'
import ChantLyrics from './ChantLyrics'
import ChantRhythm from './ChantRhythm'
import CoherenceVisualization from './CoherenceVisualization'
import GroupMetrics from './GroupMetrics'
import PersonalMetrics from './PersonalMetrics'
import RealTimeStats from './RealTimeStats'
import CoherenceInsights from './CoherenceInsights'
import CoherenceComparison from './CoherenceComparison'
import IntentionAwareness from './IntentionAwareness'
import SynchronizationNetwork from './SynchronizationNetwork'
import PairwiseSyncAnalysis from './PairwiseSyncAnalysis'
import HubDetection from './HubDetection'
import AudioEnhancements from './AudioEnhancements'
import CoherenceAchievements from './CoherenceAchievements'
import CoherenceCoach from './CoherenceCoach'
import NonLocalCorrelation from './NonLocalCorrelation'
import IntentionInfluence from './IntentionInfluence'
import EEGIntegration from './EEGIntegration'
import EMFieldMeasurement from './EMFieldMeasurement'
import QuantumEntanglement from './QuantumEntanglement'
import { getChantById } from '@/lib/chants'

export default function SessionTabs() {
  const { currentSession, personalCoherence, heartRate } = useSessionStore()
  const [activeTab, setActiveTab] = useState<'coherence' | 'analytics' | 'research'>('coherence')

  if (!currentSession) return null

  const groupMetrics = currentSession.groupMetrics || {
    sessionId: currentSession.sessionId,
    timestamp: Date.now(),
    participantCount: currentSession.participantCount || 0,
    averageCoherence: 0,
    peakCoherence: 0,
    coherencePhase: 'low' as const,
    coherenceDistribution: { low: 0, medium: 0, high: 0 },
  }

  const tabs = [
    { id: 'coherence' as const, label: 'Chant & Coherence', emoji: '🕉️' },
    { id: 'analytics' as const, label: 'Analytics', emoji: '📊' },
    { id: 'research' as const, label: 'Research', emoji: '🔬' },
  ]

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className="mr-2">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[60vh]">
        {activeTab === 'coherence' && (
          <div className="space-y-6">
            {/* Chant Player - Main Focus */}
            {currentSession.audioTrack && (
              <>
                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-6 border-2 border-purple-500/50">
                  <h3 className="text-xl font-bold mb-4 text-center text-purple-300">
                    🕉️ Chant Together • Measure Collective Coherence
                  </h3>
                  <ChantPlayer
                    audioTrackId={currentSession.audioTrack.id}
                    audioTrackName={currentSession.audioTrack.name}
                    autoPlay={true}
                    onAudioElementReady={(element) => {
                      // Audio element is ready - try to play immediately
                      if (element) {
                        const userInteracted = localStorage.getItem('sync_user_interacted') === 'true'
                        if (userInteracted) {
                          // Try playing immediately when element is ready
                          element.play()
                            .then(() => {
                              console.log('🎉 Autoplay from SessionTabs callback!')
                            })
                            .catch((e: any) => {
                              console.log('⚠️ Autoplay from callback blocked:', e.message)
                            })
                        }
                      }
                    }}
                  />
                  <div className="mt-4 text-center text-sm text-gray-400">
                    Join the collective chant • Your voice contributes to group coherence
                  </div>
                </div>

                {/* Chant Info and Lyrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <ChantInfo chantId={currentSession.audioTrack.id} />
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <ChantLyrics chantId={currentSession.audioTrack.id} />
                  </div>
                </div>

                {/* Chant Rhythm and Audio Enhancements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <ChantRhythm />
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <AudioEnhancements
                      chantFrequency={
                        (() => {
                          const chant = getChantById(currentSession.audioTrack?.id || '')
                          return chant?.frequency || 432
                        })()
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {/* Chant Coherence Visualization */}
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-lg font-semibold mb-4 text-center text-purple-300">
                Collective Chant Coherence
              </h3>
              <CoherenceVisualization
                personalCoherence={personalCoherence}
                groupCoherence={groupMetrics.averageCoherence}
                coherencePhase={groupMetrics.coherencePhase}
              />
            </div>

            {/* Group & Personal Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GroupMetrics metrics={groupMetrics} />
              <PersonalMetrics
                heartRate={heartRate}
                coherence={personalCoherence}
                coherencePhase={
                  personalCoherence < 40 ? 'low' : personalCoherence < 60 ? 'medium' : 'high'
                }
              />
            </div>

            <CoherenceInsights />
            <RealTimeStats />
            <CoherenceComparison />
            <IntentionAwareness />
            {currentSession.participantCount > 1 && (
              <>
                <SynchronizationNetwork />
                <PairwiseSyncAnalysis />
              </>
            )}
            {currentSession.participantCount > 3 && <HubDetection />}
            <CoherenceAchievements />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <RealTimeStats />
            <CoherenceInsights />
            <CoherenceComparison />
            <IntentionAwareness />
            {currentSession.participantCount > 1 && (
              <>
                <SynchronizationNetwork />
                <PairwiseSyncAnalysis />
              </>
            )}
            {currentSession.participantCount > 3 && <HubDetection />}
          </div>
        )}

        {activeTab === 'research' && (
          <div className="space-y-6">
            <CoherenceCoach />
            {currentSession.participantCount > 1 && (
              <>
                <NonLocalCorrelation />
                <QuantumEntanglement />
              </>
            )}
            <IntentionInfluence />
            <EEGIntegration />
            <EMFieldMeasurement />
          </div>
        )}
      </div>
    </div>
  )
}

