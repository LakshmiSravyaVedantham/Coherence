'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  unlocked: boolean
  unlockedAt?: number
}

export default function CoherenceAchievements() {
  const { personalCoherence, currentSession } = useSessionStore()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    const loadAchievements = () => {
      try {
        const stored = localStorage.getItem('sync_achievements')
        if (stored) {
          setAchievements(JSON.parse(stored))
        } else {
          // Initialize achievements
          const initial: Achievement[] = [
            {
              id: 'first_coherence',
              name: 'First Coherence',
              description: 'Achieve coherence for the first time',
              emoji: '🌟',
              unlocked: false,
            },
            {
              id: 'peak_coherence',
              name: 'Peak Performance',
              description: 'Reach 80% coherence',
              emoji: '✨',
              unlocked: false,
            },
            {
              id: 'group_sync',
              name: 'In Harmony',
              description: 'Sync with 10+ participants',
              emoji: '🕉️',
              unlocked: false,
            },
            {
              id: 'long_session',
              name: 'Dedicated Practice',
              description: 'Complete a full 15-minute session',
              emoji: '🧘',
              unlocked: false,
            },
            {
              id: 'coherence_streak',
              name: 'Consistent Flow',
              description: 'Maintain coherence for 5 minutes',
              emoji: '💫',
              unlocked: false,
            },
          ]
          setAchievements(initial)
          localStorage.setItem('sync_achievements', JSON.stringify(initial))
        }
      } catch (error) {
        console.error('Error loading achievements:', error)
      }
    }

    loadAchievements()
  }, [])

  useEffect(() => {
    if (!currentSession || achievements.length === 0) return

    const updated = achievements.map((achievement) => {
      if (achievement.unlocked) return achievement

      let shouldUnlock = false

      switch (achievement.id) {
        case 'first_coherence':
          shouldUnlock = personalCoherence >= 50
          break
        case 'peak_coherence':
          shouldUnlock = personalCoherence >= 80
          break
        case 'group_sync':
          shouldUnlock = (currentSession.participantCount || 0) >= 10
          break
        case 'long_session':
          // Checked when session ends
          break
        case 'coherence_streak':
          // Checked separately
          break
      }

      if (shouldUnlock && !achievement.unlocked) {
        const unlocked = {
          ...achievement,
          unlocked: true,
          unlockedAt: Date.now(),
        }
        setNewAchievement(unlocked)
        setTimeout(() => setNewAchievement(null), 5000)
        return unlocked
      }

      return achievement
    })

    const hasChanges = updated.some(
      (a, i) => a.unlocked !== achievements[i].unlocked
    )
    if (hasChanges) {
      setAchievements(updated)
      localStorage.setItem('sync_achievements', JSON.stringify(updated))
    }
  }, [personalCoherence, currentSession, achievements])

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <>
      {/* New Achievement Notification */}
      {newAchievement && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 shadow-lg z-50 animate-pulse">
          <div className="text-3xl mb-2">{newAchievement.emoji}</div>
          <div className="text-white font-bold">{newAchievement.name}</div>
          <div className="text-sm text-purple-100">{newAchievement.description}</div>
        </div>
      )}

      {/* Achievements Display */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Achievements</h3>
          <div className="text-sm text-gray-400">
            {unlockedCount} / {achievements.length}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border text-center transition-all ${
                achievement.unlocked
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-700 bg-gray-900/50 opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">
                {achievement.unlocked ? achievement.emoji : '🔒'}
              </div>
              <div
                className={`text-xs font-semibold ${
                  achievement.unlocked ? 'text-white' : 'text-gray-500'
                }`}
              >
                {achievement.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

