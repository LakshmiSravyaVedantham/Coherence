'use client'

import { getChantById, AVAILABLE_CHANTS } from '@/lib/chants'

interface ChantInfoProps {
  chantId: string
}

export default function ChantInfo({ chantId }: ChantInfoProps) {
  const chant = getChantById(chantId)

  if (!chant) return null

  const traditionEmojis = {
    hindu: '🕉️',
    buddhist: '☸️',
    christian: '✝️',
    secular: '🌍',
    universal: '✨',
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-purple-500/30 mb-4">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{traditionEmojis[chant.tradition]}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white">{chant.name}</h3>
            {chant.filename && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                Audio Available
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mb-2">{chant.description}</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Frequency: {chant.frequency} Hz</span>
            {chant.bpm && <span>Rhythm: {chant.bpm} BPM</span>}
            <span className="capitalize">{chant.tradition}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

