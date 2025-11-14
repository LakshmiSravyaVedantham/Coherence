'use client'

import { useEffect, useState } from 'react'
import { SessionProvider } from '@/contexts/SessionContext'
import WelcomeView from '@/components/WelcomeView'
import SessionView from '@/components/SessionView'
import ProfileView from '@/components/ProfileView'
import ChantRecordings from '@/components/ChantRecordings'
import Settings from '@/components/Settings'
import OfflineIndicator from '@/components/OfflineIndicator'
import KeyboardShortcutsHelp from '@/components/KeyboardShortcuts'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useSessionStore } from '@/store/sessionStore'

export default function Home() {
  const { currentSession, isConnected } = useSessionStore()
  const [view, setView] = useState<'home' | 'recordings' | 'profile' | 'session' | 'settings'>('home')

  return (
    <ErrorBoundary>
      <SessionProvider>
        <OfflineIndicator />
        <KeyboardShortcutsHelp />
        <main className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black overflow-x-hidden">
        {/* Navigation */}
        <nav className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Sync
            </h1>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setView('home')}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  view === 'home'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🏠 Home
              </button>
              <button
                onClick={() => setView('recordings')}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  view === 'recordings'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🎵 Recordings
              </button>
              <button
                onClick={() => setView('profile')}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  view === 'profile'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📊 Profile
              </button>
              <button
                onClick={() => setView('settings')}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  view === 'settings'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {currentSession ? (
            <SessionView />
          ) : view === 'recordings' ? (
            <ChantRecordings />
          ) : view === 'profile' ? (
            <ProfileView />
          ) : view === 'settings' ? (
            <Settings />
          ) : (
            <WelcomeView />
          )}
        </div>
      </main>
      </SessionProvider>
    </ErrorBoundary>
  )
}

