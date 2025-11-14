'use client'

import { useState, useEffect } from 'react'

interface CommunityActivity {
  id: string
  userId: string
  userName: string
  type: 'session_complete' | 'achievement' | 'milestone' | 'streak'
  message: string
  timestamp: number
  coherence?: number
  achievement?: string
}

export default function CommunityFeed() {
  const [activities, setActivities] = useState<CommunityActivity[]>([])
  const [filter, setFilter] = useState<'all' | 'sessions' | 'achievements'>('all')

  useEffect(() => {
    // Simulate community feed
    const generateActivities = (): CommunityActivity[] => {
      const names = [
        'Spiritual Warrior',
        'Harmony Seeker',
        'Peaceful Mind',
        'Coherent Soul',
        'Zen Master',
      ]
      const activities: CommunityActivity[] = []

      for (let i = 0; i < 10; i++) {
        const type = ['session_complete', 'achievement', 'milestone', 'streak'][
          Math.floor(Math.random() * 4)
        ] as CommunityActivity['type']
        const name = names[Math.floor(Math.random() * names.length)]

        let message = ''
        switch (type) {
          case 'session_complete':
            message = `completed a chanting session with ${Math.round(60 + Math.random() * 30)}% coherence`
            break
          case 'achievement':
            message = `unlocked achievement: ${['First Steps', 'Coherence Master', 'Streak Champion'][Math.floor(Math.random() * 3)]}`
            break
          case 'milestone':
            message = `reached ${Math.floor(10 + Math.random() * 40)} total sessions!`
            break
          case 'streak':
            message = `maintained a ${Math.floor(5 + Math.random() * 20)} day streak!`
            break
        }

        activities.push({
          id: `activity-${i}`,
          userId: `user-${i}`,
          userName: name,
          type,
          message,
          timestamp: Date.now() - Math.random() * 3600000, // Last hour
          coherence: type === 'session_complete' ? 60 + Math.random() * 30 : undefined,
        })
      }

      return activities.sort((a, b) => b.timestamp - a.timestamp)
    }

    const interval = setInterval(() => {
      setActivities(generateActivities())
    }, 5000)

    setActivities(generateActivities())

    return () => clearInterval(interval)
  }, [filter])

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'all') return true
    if (filter === 'sessions') return activity.type === 'session_complete'
    if (filter === 'achievements') return ['achievement', 'milestone', 'streak'].includes(activity.type)
    return true
  })

  const getActivityIcon = (type: CommunityActivity['type']) => {
    switch (type) {
      case 'session_complete':
        return '🕉️'
      case 'achievement':
        return '🏆'
      case 'milestone':
        return '⭐'
      case 'streak':
        return '🔥'
      default:
        return '✨'
    }
  }

  const formatTime = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">👥 Community Activity</h3>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('sessions')}
          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
            filter === 'sessions'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Sessions
        </button>
        <button
          onClick={() => setFilter('achievements')}
          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
            filter === 'achievements'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Achievements
        </button>
      </div>

      {/* Activity Feed */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-gray-900/50 rounded-lg p-3 border border-gray-700"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{activity.userName}</span>
                  {activity.coherence && (
                    <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded">
                      {Math.round(activity.coherence)}% coherence
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-300">{activity.message}</div>
                <div className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

