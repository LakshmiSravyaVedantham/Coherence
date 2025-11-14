'use client'

import { useEffect, useState } from 'react'

export default function BreathGuidance() {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const cycle = [
      { phase: 'inhale' as const, duration: 5 },
      { phase: 'hold' as const, duration: 2 },
      { phase: 'exhale' as const, duration: 5 },
      { phase: 'pause' as const, duration: 2 },
    ]

    let currentIndex = 0
    let currentCountdown = cycle[0].duration

    const interval = setInterval(() => {
      setPhase(cycle[currentIndex].phase)
      setCountdown(currentCountdown)

      currentCountdown--
      if (currentCountdown < 0) {
        currentIndex = (currentIndex + 1) % cycle.length
        currentCountdown = cycle[currentIndex].duration
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getPhaseInfo = () => {
    switch (phase) {
      case 'inhale':
        return { text: 'Breathe In', emoji: '⬆️', color: 'text-blue-400' }
      case 'hold':
        return { text: 'Hold', emoji: '⏸️', color: 'text-purple-400' }
      case 'exhale':
        return { text: 'Breathe Out', emoji: '⬇️', color: 'text-green-400' }
      case 'pause':
        return { text: 'Pause', emoji: '⏸️', color: 'text-gray-400' }
    }
  }

  const phaseInfo = getPhaseInfo()

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
      <div className="text-4xl mb-2">{phaseInfo.emoji}</div>
      <div className={`text-2xl font-bold mb-2 ${phaseInfo.color}`}>{phaseInfo.text}</div>
      <div className="text-4xl font-bold text-purple-400">{countdown}</div>
      <div className="text-sm text-gray-400 mt-2">Follow the rhythm while chanting</div>
    </div>
  )
}

