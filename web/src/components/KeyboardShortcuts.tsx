'use client'

import { useEffect, useState } from 'react'

interface Shortcut {
  key: string
  description: string
  action: () => void
  modifier?: 'ctrl' | 'alt' | 'shift'
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const modifierPressed =
          !shortcut.modifier ||
          (shortcut.modifier === 'ctrl' && (e.ctrlKey || e.metaKey)) ||
          (shortcut.modifier === 'alt' && e.altKey) ||
          (shortcut.modifier === 'shift' && e.shiftKey)

        if (
          modifierPressed &&
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          !e.target ||
          (e.target as HTMLElement).tagName !== 'INPUT' &&
          (e.target as HTMLElement).tagName !== 'TEXTAREA'
        ) {
          e.preventDefault()
          shortcut.action()
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export default function KeyboardShortcutsHelp() {
  const [showHelp, setShowHelp] = useState(false)

  useKeyboardShortcuts([
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => setShowHelp(!showHelp),
    },
    {
      key: 'Escape',
      description: 'Close modals',
      action: () => setShowHelp(false),
    },
  ])

  if (!showHelp) return null

  const shortcuts = [
    { key: '?', description: 'Show/hide this help', modifier: undefined },
    { key: 'Esc', description: 'Close modals', modifier: undefined },
    { key: 'Space', description: 'Play/pause audio', modifier: undefined },
    { key: 'M', description: 'Mute/unmute audio', modifier: undefined },
    { key: '←', description: 'Rewind 5 seconds', modifier: undefined },
    { key: '→', description: 'Forward 5 seconds', modifier: undefined },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-purple-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">⌨️ Keyboard Shortcuts</h2>
          <button
            onClick={() => setShowHelp(false)}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-300">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-gray-900 rounded text-sm text-purple-400">
                {shortcut.modifier && `${shortcut.modifier.toUpperCase()} + `}
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowHelp(false)}
          className="mt-4 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}

