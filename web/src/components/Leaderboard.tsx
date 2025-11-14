'use client'

import { useState, useEffect } from 'react'

interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  averageCoherence: number
  peakCoherence: number
  totalSessions: number
  streak: number
  avatar?: string
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [category, setCategory] = useState<'coherence' | 'sessions' | 'streak'>('coherence')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate leaderboard data
    // In production, this would come from backend
    const generateLeaderboard = (): LeaderboardEntry[] => {
      const entries: LeaderboardEntry[] = []
      const names = [
        'Spiritual Warrior',
        'Harmony Seeker',
        'Peaceful Mind',
        'Coherent Soul',
        'Zen Master',
        'Mantra Lover',
        'Sacred Voice',
        'Unity Builder',
        'Divine Chant',
        'Serenity Flow',
      ]

      for (let i = 0; i < 10; i++) {
        entries.push({
          rank: i + 1,
          userId: `user-${i}`,
          name: names[i] || `Chanter ${i + 1}`,
          averageCoherence: 75 - i * 3 + Math.random() * 5,
          peakCoherence: 90 - i * 2 + Math.random() * 5,
          totalSessions: 50 + Math.floor(Math.random() * 100),
          streak: 5 + Math.floor(Math.random() * 20),
        })
      }

      return entries
    }

    setTimeout(() => {
      setLeaderboard(generateLeaderboard())
      setLoading(false)
    }, 500)
  }, [category])

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    switch (category) {
      case 'coherence':
        return b.averageCoherence - a.averageCoherence
      case 'sessions':
        return b.totalSessions - a.totalSessions
      case 'streak':
        return b.streak - a.streak
      default:
        return 0
    }
  })

  const getCategoryValue = (entry: LeaderboardEntry) => {
    switch (category) {
      case 'coherence':
        return `${Math.round(entry.averageCoherence)}%`
      case 'sessions':
        return `${entry.totalSessions} sessions`
      case 'streak':
        return `${entry.streak} days`
      default:
        return ''
    }
  }

  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-gray-400">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">🏆 Global Leaderboard</h3>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setCategory('coherence')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            category === 'coherence'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Top Coherence
        </button>
        <button
          onClick={() => setCategory('sessions')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            category === 'sessions'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Most Sessions
        </button>
        <button
          onClick={() => setCategory('streak')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            category === 'streak'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Longest Streak
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {sortedLeaderboard.map((entry) => (
          <div
            key={entry.userId}
            className={`flex items-center justify-between p-3 rounded-lg ${
              entry.rank <= 3
                ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/50'
                : 'bg-gray-900/50 border border-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-lg font-bold w-8 text-center">
                {getMedal(entry.rank)}
              </div>
              <div>
                <div className="font-semibold text-white">{entry.name}</div>
                <div className="text-xs text-gray-400">
                  Peak: {Math.round(entry.peakCoherence)}% • {entry.totalSessions} sessions
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-400">
                {getCategoryValue(entry)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Rankings update in real-time • Join sessions to climb the leaderboard
      </div>
    </div>
  )
}

