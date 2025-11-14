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
import IntentionResonance from './IntentionResonance'
import EEGIntegration from './EEGIntegration'
import EMFieldMeasurement from './EMFieldMeasurement'
import QuantumEntanglement from './QuantumEntanglement'
import Leaderboard from './Leaderboard'
import SessionSharing from './SessionSharing'
import CommunityFeed from './CommunityFeed'
import AudioEqualizer from './AudioEqualizer'
import AdvancedInsights from './AdvancedInsights'
import AudioDebug from './AudioDebug'
import P5Visualization from './P5Visualization'
import ParticipantIndicators from './ParticipantIndicators'
import { getChantById } from '@/lib/chants'

export default function SessionTabs() {
  const { currentSession, personalCoherence, heartRate } = useSessionStore()
  const [activeTab, setActiveTab] = useState<'coherence' | 'analytics' | 'social' | 'research'>('coherence')

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
    { id: 'social' as const, label: 'Social', emoji: '👥' },
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
                        console.log('🎵 Audio element ready in SessionTabs, userInteracted:', userInteracted, 'readyState:', element.readyState)
                        
                        if (userInteracted) {
                          // Try playing immediately when element is ready
                          const tryPlay = async () => {
                            try {
                              if (element.readyState >= 2) {
                                await element.play()
                                console.log('🎉 Autoplay from SessionTabs callback - SUCCESS!')
                              } else {
                                // Wait for ready state
                                element.addEventListener('canplay', async () => {
                                  try {
                                    await element.play()
                                    console.log('🎉 Autoplay from SessionTabs (canplay) - SUCCESS!')
                                  } catch (e: any) {
                                    console.log('⚠️ Autoplay from canplay blocked:', e.message)
                                  }
                                }, { once: true })
                              }
                            } catch (e: any) {
                              console.log('⚠️ Autoplay from callback blocked:', e.name, e.message)
                              // Retry after a delay
                              setTimeout(async () => {
                                try {
                                  await element.play()
                                  console.log('🎉 Autoplay from SessionTabs (retry) - SUCCESS!')
                                } catch (e2: any) {
                                  console.log('⚠️ Autoplay retry also blocked:', e2.message)
                                }
                              }, 500)
                            }
                          }
                          tryPlay()
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

                {/* Audio Equalizer */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <AudioEqualizer />
                </div>

                {/* Audio Debug (development only) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <AudioDebug />
                  </div>
                )}
              </>
            )}

            {/* Chant Coherence Visualization - P5.js Pattern */}
            <div className="bg-gray-800 rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-lg font-semibold mb-4 text-center text-purple-300">
                Collective Chant Coherence
              </h3>
              <div className="relative w-full aspect-square max-w-2xl mx-auto">
                <P5Visualization className="w-full h-full" />
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-center">
                  <div className="text-sm text-purple-300 font-semibold mb-1">Chant Coherence Visualization</div>
                  <div className="text-xs text-gray-400">Animated pattern reflects collective harmony</div>
                </div>
                <ParticipantIndicators />
              </div>
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
            <AdvancedInsights />
            <IntentionResonance />
            {currentSession.participantCount > 1 && (
              <>
                <SynchronizationNetwork />
                <PairwiseSyncAnalysis />
              </>
            )}
            {currentSession.participantCount > 3 && <HubDetection />}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            <Leaderboard />
            <SessionSharing />
            <CommunityFeed />
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

