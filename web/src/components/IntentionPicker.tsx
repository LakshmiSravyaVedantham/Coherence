'use client'

import { useState } from 'react'

interface IntentionCategory {
  id: string
  name: string
  emoji: string
}

const categories: IntentionCategory[] = [
  { id: 'spiritual_awakening', name: 'Spiritual Awakening', emoji: '🕉️' },
  { id: 'inner_peace', name: 'Inner Peace', emoji: '☮️' },
  { id: 'healing', name: 'Healing', emoji: '🌿' },
  { id: 'gratitude', name: 'Gratitude', emoji: '🙏' },
  { id: 'protection', name: 'Protection', emoji: '🛡️' },
  { id: 'wisdom', name: 'Wisdom', emoji: '📿' },
  { id: 'devotion', name: 'Devotion', emoji: '💫' },
  { id: 'other', name: 'Other', emoji: '✨' },
]

interface IntentionPickerProps {
  onSelect: (intention?: { category: string; note?: string }) => void
  onCancel: () => void
}

export default function IntentionPicker({ onSelect, onCancel }: IntentionPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const handleJoin = () => {
    if (selectedCategory) {
      onSelect({
        category: selectedCategory,
        note: note.trim() || undefined,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-purple-500 my-auto max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold mb-2 text-center">Set Your Intention</h2>
          <p className="text-sm text-gray-400 text-center mb-4">
            What do you wish to manifest through this chant?
          </p>
          {!selectedCategory && (
            <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <p className="text-xs text-yellow-400 text-center">
                ⚠️ Please select an intention below to continue
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto mb-4">
          <div className="space-y-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCategory === category.id
                    ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="text-2xl mr-3">{category.emoji}</span>
                <span className="text-white">{category.name}</span>
                {selectedCategory === category.id && (
                  <span className="float-right text-purple-400">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Personal Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a personal note..."
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex-shrink-0 flex gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={!selectedCategory}
            className={`flex-1 px-4 py-3 rounded-lg text-white transition-all font-semibold text-lg ${
              selectedCategory
                ? 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/50'
                : 'bg-gray-700 cursor-not-allowed opacity-60'
            }`}
          >
            {selectedCategory ? (
              <span className="flex items-center justify-center gap-2">
                <span>✨</span>
                <span>Join Session</span>
              </span>
            ) : (
              <span className="text-gray-400">Select an intention first</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

