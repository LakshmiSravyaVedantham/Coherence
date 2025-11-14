'use client'

import { useEffect, useState } from 'react'

export default function CoherenceStreak() {
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)

  useEffect(() => {
    // Load streak from localStorage
    try {
      const stored = localStorage.getItem('sync_coherence_streak')
      if (stored) {
        const data = JSON.parse(stored)
        setStreak(data.current || 0)
        setLongestStreak(data.longest || 0)
      }
    } catch (error) {
      console.error('Error loading streak:', error)
    }
  }, [])

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400 mb-1">Coherence Streak</div>
          <div className="text-2xl font-bold text-purple-400">{streak} days</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">Longest</div>
          <div className="text-xl font-semibold text-yellow-400">{longestStreak} days</div>
        </div>
      </div>
      {streak > 0 && (
        <div className="mt-3 flex gap-1">
          {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-purple-500"
              style={{ opacity: 1 - i * 0.1 }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

