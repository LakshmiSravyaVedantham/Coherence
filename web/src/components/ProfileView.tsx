'use client'

import { useState } from 'react'
import SessionHistory from './SessionHistory'
import PersonalAnalytics from './PersonalAnalytics'
import CoherenceStreak from './CoherenceStreak'

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'history'>('analytics')

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-400">Track your chanting journey and coherence progress</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'analytics'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'history'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Session History
        </button>
      </div>

      {/* Coherence Streak */}
      <div className="mb-6">
        <CoherenceStreak />
      </div>

      {/* Content */}
      <div>
        {activeTab === 'analytics' && <PersonalAnalytics />}
        {activeTab === 'history' && <SessionHistory />}
      </div>
    </div>
  )
}

