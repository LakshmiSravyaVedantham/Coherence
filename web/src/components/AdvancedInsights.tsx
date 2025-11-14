'use client'

import { useState, useEffect } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface Insight {
  type: 'prediction' | 'recommendation' | 'trend' | 'milestone'
  title: string
  description: string
  confidence?: number
  action?: string
}

export default function AdvancedInsights() {
  const { currentSession, personalCoherence } = useSessionStore()
  const [insights, setInsights] = useState<Insight[]>([])

  useEffect(() => {
    // Generate insights based on current session and coherence
    const generateInsights = (): Insight[] => {
      const newInsights: Insight[] = []

      // Prediction insights
      if (personalCoherence > 70) {
        newInsights.push({
          type: 'prediction',
          title: 'Peak Coherence Likely',
          description: `Based on your current ${Math.round(personalCoherence)}% coherence, you're likely to reach peak coherence in the next 2-3 minutes.`,
          confidence: 85,
        })
      }

      // Recommendation insights
      if (personalCoherence < 40) {
        newInsights.push({
          type: 'recommendation',
          title: 'Focus on Breathing',
          description: 'Your coherence is below optimal. Try focusing on deep, rhythmic breathing to match the chant tempo.',
          action: 'Try breathing exercises',
        })
      } else if (personalCoherence > 60 && personalCoherence < 80) {
        newInsights.push({
          type: 'recommendation',
          title: 'Maintain This State',
          description: 'You\'re in an excellent coherence range. Focus on maintaining this state through consistent chanting.',
          action: 'Continue chanting',
        })
      }

      // Trend insights
      if (currentSession) {
        const groupAvg = currentSession.groupMetrics?.averageCoherence || 0
        if (personalCoherence > groupAvg + 10) {
          newInsights.push({
            type: 'trend',
            title: 'Above Group Average',
            description: `Your coherence (${Math.round(personalCoherence)}%) is significantly above the group average (${Math.round(groupAvg)}%). You're leading the session!`,
          })
        }
      }

      // Milestone insights
      if (personalCoherence >= 80) {
        newInsights.push({
          type: 'milestone',
          title: 'High Coherence Achieved',
          description: `Congratulations! You've reached ${Math.round(personalCoherence)}% coherence - a high coherence state.`,
        })
      }

      return newInsights
    }

    const interval = setInterval(() => {
      setInsights(generateInsights())
    }, 5000)

    setInsights(generateInsights())

    return () => clearInterval(interval)
  }, [personalCoherence, currentSession])

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'prediction':
        return '🔮'
      case 'recommendation':
        return '💡'
      case 'trend':
        return '📈'
      case 'milestone':
        return '🎯'
      default:
        return '✨'
    }
  }

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'prediction':
        return 'border-purple-500/50 bg-purple-900/20'
      case 'recommendation':
        return 'border-blue-500/50 bg-blue-900/20'
      case 'trend':
        return 'border-green-500/50 bg-green-900/20'
      case 'milestone':
        return 'border-yellow-500/50 bg-yellow-900/20'
      default:
        return 'border-gray-500/50 bg-gray-900/20'
    }
  }

  if (insights.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">🧠 Advanced Insights</h3>
        <p className="text-gray-400 text-center py-4">
          Insights will appear as you chant and build coherence
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">🧠 Advanced Insights</h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getInsightIcon(insight.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white">{insight.title}</h4>
                  {insight.confidence && (
                    <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded">
                      {insight.confidence}% confidence
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-300 mb-2">{insight.description}</p>
                {insight.action && (
                  <button className="text-xs text-purple-400 hover:text-purple-300 underline">
                    {insight.action} →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

