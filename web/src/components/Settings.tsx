'use client'

import { useState } from 'react'

interface SettingsData {
  audio: {
    volume: number
    autoplay: boolean
    spatialAudio: boolean
    equalizerEnabled: boolean
  }
  notifications: {
    sessionReminders: boolean
    achievements: boolean
    coherenceMilestones: boolean
    communityActivity: boolean
  }
  appearance: {
    theme: 'dark' | 'light' | 'auto'
    animationSpeed: 'slow' | 'normal' | 'fast'
    showAdvancedMetrics: boolean
  }
  privacy: {
    shareData: boolean
    showInLeaderboard: boolean
    allowAnalytics: boolean
  }
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>(() => {
    // Load from localStorage or use defaults
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sync_settings')
      if (stored) {
        return JSON.parse(stored)
      }
    }
    return {
      audio: {
        volume: 1,
        autoplay: true,
        spatialAudio: false,
        equalizerEnabled: false,
      },
      notifications: {
        sessionReminders: true,
        achievements: true,
        coherenceMilestones: true,
        communityActivity: false,
      },
      appearance: {
        theme: 'dark',
        animationSpeed: 'normal',
        showAdvancedMetrics: false,
      },
      privacy: {
        shareData: true,
        showInLeaderboard: true,
        allowAnalytics: true,
      },
    }
  })

  const [activeSection, setActiveSection] = useState<'audio' | 'notifications' | 'appearance' | 'privacy'>('audio')

  const updateSettings = (section: keyof SettingsData, updates: Partial<SettingsData[keyof SettingsData]>) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        ...updates,
      },
    }
    setSettings(newSettings)
    localStorage.setItem('sync_settings', JSON.stringify(newSettings))
  }

  const sections = [
    { id: 'audio' as const, label: 'Audio', emoji: '🔊' },
    { id: 'notifications' as const, label: 'Notifications', emoji: '🔔' },
    { id: 'appearance' as const, label: 'Appearance', emoji: '🎨' },
    { id: 'privacy' as const, label: 'Privacy', emoji: '🔒' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-gray-400 mb-6">Customize your chanting experience</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{section.emoji}</span>
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {/* Audio Settings */}
            {activeSection === 'audio' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">🔊 Audio Settings</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Volume: {Math.round(settings.audio.volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.audio.volume}
                    onChange={(e) => updateSettings('audio', { volume: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-300">Autoplay</label>
                    <p className="text-xs text-gray-500">Automatically start chanting when joining a session</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.audio.autoplay}
                      onChange={(e) => updateSettings('audio', { autoplay: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-300">Spatial Audio</label>
                    <p className="text-xs text-gray-500">3D audio experience for immersive chanting</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.audio.spatialAudio}
                      onChange={(e) => updateSettings('audio', { spatialAudio: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-300">Audio Equalizer</label>
                    <p className="text-xs text-gray-500">Enhance audio frequencies for better experience</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.audio.equalizerEnabled}
                      onChange={(e) => updateSettings('audio', { equalizerEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">🔔 Notification Settings</h2>

                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-semibold text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <p className="text-xs text-gray-500">
                        {key === 'sessionReminders' && 'Get notified about upcoming sessions'}
                        {key === 'achievements' && 'Celebrate your achievements'}
                        {key === 'coherenceMilestones' && 'Reach new coherence milestones'}
                        {key === 'communityActivity' && 'See what your community is up to'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          updateSettings('notifications', { [key]: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">🎨 Appearance Settings</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Theme</label>
                  <select
                    value={settings.appearance.theme}
                    onChange={(e) =>
                      updateSettings('appearance', {
                        theme: e.target.value as 'dark' | 'light' | 'auto',
                      })
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Animation Speed</label>
                  <select
                    value={settings.appearance.animationSpeed}
                    onChange={(e) =>
                      updateSettings('appearance', {
                        animationSpeed: e.target.value as 'slow' | 'normal' | 'fast',
                      })
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-300">Show Advanced Metrics</label>
                    <p className="text-xs text-gray-500">Display detailed coherence analytics</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.appearance.showAdvancedMetrics}
                      onChange={(e) =>
                        updateSettings('appearance', { showAdvancedMetrics: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">🔒 Privacy Settings</h2>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-300">Share Data for Research</label>
                    <p className="text-xs text-gray-500">Help advance collective coherence research</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.shareData}
                      onChange={(e) => updateSettings('privacy', { shareData: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-300">Show in Leaderboard</label>
                    <p className="text-xs text-gray-500">Display your progress on public leaderboards</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showInLeaderboard}
                      onChange={(e) =>
                        updateSettings('privacy', { showInLeaderboard: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-gray-300">Allow Analytics</label>
                    <p className="text-xs text-gray-500">Help improve the platform with usage analytics</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowAnalytics}
                      onChange={(e) =>
                        updateSettings('privacy', { allowAnalytics: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

