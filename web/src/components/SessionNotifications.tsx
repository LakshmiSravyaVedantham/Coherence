'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface Notification {
  id: string
  message: string
  type: 'coherence' | 'group' | 'milestone'
  timestamp: number
}

export default function SessionNotifications() {
  const { currentSession, personalCoherence } = useSessionStore()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!currentSession) return

    const newNotifications: Notification[] = []

    // Check for coherence milestones
    if (personalCoherence >= 80 && !notifications.some((n) => n.message.includes('80%'))) {
      newNotifications.push({
        id: 'peak-coherence',
        message: '🎉 You reached peak coherence (80%+)!',
        type: 'milestone',
        timestamp: Date.now(),
      })
    } else if (personalCoherence >= 60 && !notifications.some((n) => n.message.includes('60%'))) {
      newNotifications.push({
        id: 'high-coherence',
        message: '✨ You achieved high coherence!',
        type: 'coherence',
        timestamp: Date.now(),
      })
    }

    // Check for group milestones
    if (currentSession.groupMetrics.averageCoherence >= 70) {
      newNotifications.push({
        id: 'group-peak',
        message: '🕉️ Group coherence is peaking!',
        type: 'group',
        timestamp: Date.now(),
      })
    }

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev].slice(0, 3))
    }
  }, [personalCoherence, currentSession, notifications])

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) =>
        prev.filter((n) => Date.now() - n.timestamp < 5000)
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 shadow-lg animate-slide-in"
          style={{
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <div className="text-white font-semibold">{notification.message}</div>
        </div>
      ))}
    </div>
  )
}

