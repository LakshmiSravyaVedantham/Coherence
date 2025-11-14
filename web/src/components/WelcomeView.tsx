'use client'

import { useState } from 'react'
import { useSession } from '@/contexts/SessionContext'
import IntentionPicker from './IntentionPicker'
import ChantSelector from './ChantSelector'
import { useSessionStore } from '@/store/sessionStore'
import { Chant } from '@/lib/chants'
import GlobalStats from './GlobalStats'
import AnimatedPattern from './AnimatedPattern'

export default function WelcomeView() {
  const { joinSession } = useSession()
  const { isConnected } = useSessionStore()
  const [showChantSelector, setShowChantSelector] = useState(false)
  const [showIntentionPicker, setShowIntentionPicker] = useState(false)
  const [selectedChant, setSelectedChant] = useState<Chant | null>(null)

  const handleChantSelect = (chant: Chant) => {
    setSelectedChant(chant)
    setShowChantSelector(false)
    setShowIntentionPicker(true)
  }

  const handleJoin = async (intention?: { category: string; note?: string }) => {
    // Store intention for session history
    if (intention) {
      localStorage.setItem('sync_last_intention', intention.category)
    }
    
    // Mark user interaction immediately (before async operations)
    localStorage.setItem('sync_user_interacted', 'true')
    
    // Join session
    joinSession(intention, selectedChant?.id)
    setShowIntentionPicker(false)
    setSelectedChant(null)
    
    // Trigger autoplay immediately after user interaction
    // This is within the user interaction context, so browsers will allow it
    setTimeout(async () => {
      const { triggerGlobalAudioPlay } = await import('@/components/ChantPlayer')
      await triggerGlobalAudioPlay()
    }, 200)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center relative">
      {/* Animated Pattern Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <AnimatedPattern width={600} height={600} />
      </div>

      <div className="relative z-10">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Sync
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          Collective Coherence Platform
        </p>
        <p className="text-lg text-purple-300 mb-12">
          🕉️ Chant Together. Heal Together. 🕉️
        </p>

      {!isConnected ? (
        <div className="text-yellow-400">
          Connecting to server...
        </div>
      ) : (
        <button
          onClick={() => setShowChantSelector(true)}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold text-lg transition-colors"
        >
          Join Chanting Session
        </button>
      )}

      {showChantSelector && (
        <ChantSelector
          onSelect={handleChantSelect}
          onCancel={() => setShowChantSelector(false)}
        />
      )}

      {showIntentionPicker && (
        <IntentionPicker
          onSelect={handleJoin}
          onCancel={() => {
            setShowIntentionPicker(false)
            setSelectedChant(null)
          }}
        />
      )}

      <div className="mt-12 text-sm text-gray-400 max-w-md">
        <p>
          Join thousands of people in synchronized chanting sessions. Chant together
          in harmony and experience the power of collective coherence. Your participation
          helps advance research on group consciousness and healing.
        </p>
      </div>

      {/* Global Stats */}
      <div className="mt-8 w-full max-w-2xl relative z-10">
        <GlobalStats />
      </div>
      </div>
    </div>
  )
}

