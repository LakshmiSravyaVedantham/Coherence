'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface CoachTip {
  id: string
  message: string
  category: 'chanting' | 'focus' | 'posture' | 'intention' | 'timing'
  priority: 'high' | 'medium' | 'low'
}

const TIPS_LIBRARY: Record<string, string[]> = {
  chanting: [
    'Chant with full voice and clear pronunciation',
    'Match the rhythm and tempo of the group',
    'Feel the vibration of the chant in your body',
    'Let the chant resonate from your heart center',
  ],
  focus: [
    'Focus on the sound and meaning of the chant',
    'Let go of distracting thoughts',
    'Visualize your intention as you chant',
    'Feel the collective energy of the group',
  ],
  posture: [
    'Sit with your spine straight and relaxed',
    'Keep your shoulders relaxed for better resonance',
    'Allow your body to be comfortable yet alert',
    'Open your chest to allow full breath for chanting',
  ],
  intention: [
    'Hold your intention gently in your awareness',
    'Feel the collective intention of the group',
    'Let your intention resonate with the chant',
    'Chant with devotion and sincerity',
  ],
  timing: [
    'Sync your chanting with the group rhythm',
    'Feel the collective pulse of the session',
    'Align your internal rhythm with the group',
    'Match the tempo of the chant recording',
  ],
}

export default function CoherenceCoach() {
  const { currentSession, personalCoherence } = useSessionStore()
  const [currentTip, setCurrentTip] = useState<CoachTip | null>(null)
  const [tipsHistory, setTipsHistory] = useState<CoachTip[]>([])

  useEffect(() => {
    if (!currentSession) return

    const analyzeAndSuggest = () => {
      let category: CoachTip['category'] = 'chanting'
      let priority: CoachTip['priority'] = 'medium'
      let message = ''

      // Analyze chant coherence and suggest tips
      if (personalCoherence < 30) {
        priority = 'high'
        if (Math.random() > 0.5) {
          category = 'chanting'
          message = TIPS_LIBRARY.chanting[Math.floor(Math.random() * TIPS_LIBRARY.chanting.length)]
        } else {
          category = 'focus'
          message = TIPS_LIBRARY.focus[Math.floor(Math.random() * TIPS_LIBRARY.focus.length)]
        }
      } else if (personalCoherence < 50) {
        priority = 'medium'
        const categories: CoachTip['category'][] = ['posture', 'intention', 'timing']
        category = categories[Math.floor(Math.random() * categories.length)]
        message = TIPS_LIBRARY[category][Math.floor(Math.random() * TIPS_LIBRARY[category].length)]
      } else if (personalCoherence >= 70) {
        priority = 'low'
        message = 'Excellent chant coherence! Your voice is in perfect harmony with the group.'
        category = 'focus'
      } else {
        // Good coherence, provide encouragement
        priority = 'low'
        message = 'You are in a good state of chant coherence. Continue chanting with intention.'
        category = 'intention'
      }

      const tip: CoachTip = {
        id: `tip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message,
        category,
        priority,
      }

      setCurrentTip(tip)
      setTipsHistory((prev) => [tip, ...prev].slice(0, 10))
    }

    // Analyze every 30 seconds
    const interval = setInterval(analyzeAndSuggest, 30000)
    analyzeAndSuggest() // Initial analysis

    return () => clearInterval(interval)
  }, [currentSession, personalCoherence])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-900/20'
      case 'medium':
        return 'border-yellow-500 bg-yellow-900/20'
      default:
        return 'border-green-500 bg-green-900/20'
    }
  }

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'chanting':
        return '🕉️'
      case 'focus':
        return '🎯'
      case 'posture':
        return '🧘'
      case 'intention':
        return '💫'
      case 'timing':
        return '⏱️'
      default:
        return '💡'
    }
  }

  if (!currentSession) return null

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-2xl">🤖</div>
        <div>
          <h3 className="text-lg font-semibold">Coherence Coach</h3>
          <p className="text-sm text-gray-400">AI-powered guidance for optimal coherence</p>
        </div>
      </div>

      {currentTip && (
        <div
          className={`p-4 rounded-lg border-2 mb-4 ${getPriorityColor(currentTip.priority)}`}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">{getCategoryEmoji(currentTip.category)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-white capitalize">
                  {currentTip.category}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300 capitalize">
                  {currentTip.priority}
                </span>
              </div>
              <div className="text-sm text-gray-200">{currentTip.message}</div>
            </div>
          </div>
        </div>
      )}

      {tipsHistory.length > 1 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Recent Tips</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {tipsHistory.slice(1, 4).map((tip) => (
              <div
                key={tip.id}
                className="p-2 rounded border border-gray-700 bg-gray-900/50"
              >
                <div className="flex items-center gap-2">
                  <span>{getCategoryEmoji(tip.category)}</span>
                  <span className="text-xs text-gray-300 flex-1">{tip.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
        <div className="text-xs text-gray-300">
          <strong>AI Analysis:</strong> The coach analyzes your chant coherence patterns and
          provides personalized tips to help you achieve optimal states of harmony and
          synchronization with the group while chanting.
        </div>
      </div>
    </div>
  )
}

