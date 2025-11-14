'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { getChantById } from '@/lib/chants'

export default function ChantRhythm() {
  const { currentSession } = useSessionStore()
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'chant' | 'pause'>('chant')
  const [cycleCount, setCycleCount] = useState(0)

  useEffect(() => {
    if (!currentSession?.audioTrack) return

    const chant = getChantById(currentSession.audioTrack.id)
    // Chant rhythm: typically 4-6 seconds per cycle
    const cycleDuration = 5000 // 5 seconds default
    const chantDuration = cycleDuration * 0.7 // 70% of cycle is chanting
    const pauseDuration = cycleDuration * 0.3 // 30% is pause/breath

    let phaseStart = Date.now()
    setCurrentPhase('chant')

    const interval = setInterval(() => {
      const elapsed = Date.now() - phaseStart

      if (currentPhase === 'chant' && elapsed >= chantDuration) {
        setCurrentPhase('pause')
        phaseStart = Date.now()
      } else if (currentPhase === 'pause' && elapsed >= pauseDuration) {
        setCurrentPhase('chant')
        setCycleCount((prev) => prev + 1)
        phaseStart = Date.now()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [currentSession, currentPhase])

  if (!currentSession?.audioTrack) return null

  const getPhaseInfo = () => {
    switch (currentPhase) {
      case 'chant':
        return { text: 'Chant Now', emoji: '🕉️', color: 'text-purple-400', bg: 'bg-purple-900/30' }
      case 'pause':
        return { text: 'Breathe', emoji: '💨', color: 'text-blue-400', bg: 'bg-blue-900/30' }
      default:
        return { text: 'Chant', emoji: '🕉️', color: 'text-gray-400', bg: 'bg-gray-900/30' }
    }
  }

  const phaseInfo = getPhaseInfo()

  return (
    <div className={`rounded-lg p-6 border-2 border-purple-500/50 ${phaseInfo.bg} transition-all`}>
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">{phaseInfo.emoji}</div>
        <div className={`text-2xl font-bold mb-2 ${phaseInfo.color}`}>{phaseInfo.text}</div>
        <div className="text-sm text-gray-400">
          Cycle {cycleCount} • Follow the rhythm of the chant
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Chant with the group • Feel the collective vibration
        </div>
      </div>
    </div>
  )
}

