'use client'

import { useSessionStore } from '@/store/sessionStore'

export default function CoherenceInsights() {
  const { currentSession, personalCoherence } = useSessionStore()

  if (!currentSession) return null

  const groupAvg = currentSession.groupMetrics.averageCoherence
  const personal = personalCoherence
  const difference = personal - groupAvg

  const getInsight = () => {
    if (difference > 10) {
      return {
        message: "You're helping lift the collective field!",
        emoji: '✨',
        color: 'text-green-400',
      }
    } else if (difference < -10) {
      return {
        message: 'The group is supporting your coherence',
        emoji: '🤲',
        color: 'text-blue-400',
      }
    } else {
      return {
        message: 'You are in harmony with the group',
        emoji: '🕉️',
        color: 'text-purple-400',
      }
    }
  }

  const insight = getInsight()

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-500/30">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{insight.emoji}</div>
        <div className="flex-1">
          <div className={`font-semibold ${insight.color}`}>{insight.message}</div>
          <div className="text-sm text-gray-400 mt-1">
            Your coherence: {Math.round(personal)}% • Group average: {Math.round(groupAvg)}%
          </div>
        </div>
      </div>
    </div>
  )
}

