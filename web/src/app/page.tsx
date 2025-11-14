'use client'

import { useEffect, useState } from 'react'
import { SessionProvider } from '@/contexts/SessionContext'
import WelcomeView from '@/components/WelcomeView'
import SessionView from '@/components/SessionView'
import ProfileView from '@/components/ProfileView'
import { useSessionStore } from '@/store/sessionStore'

export default function Home() {
  const { currentSession, isConnected } = useSessionStore()
  const [view, setView] = useState<'home' | 'profile'>('home')

  return (
    <SessionProvider>
      <main className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black">
        {/* Navigation */}
        <nav className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sync
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setView('home')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'home'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setView('profile')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'profile'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Profile
              </button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {view === 'profile' ? (
            <ProfileView />
          ) : !currentSession ? (
            <WelcomeView />
          ) : (
            <SessionView />
          )}
        </div>
      </main>
    </SessionProvider>
  )
}

