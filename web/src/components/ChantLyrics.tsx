'use client'

import { useState } from 'react'
import { getChantById } from '@/lib/chants'

interface ChantLyricsProps {
  chantId: string
}

const chantLyrics: Record<string, { sanskrit: string; transliteration: string; meaning: string }> = {
  'om-chant-432hz': {
    sanskrit: 'ॐ',
    transliteration: 'Om',
    meaning: 'The primordial sound, the vibration of the universe',
  },
  'gayatri-mantra-432hz': {
    sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
    transliteration:
      'Om Bhur Bhuvaḥ Swaḥ, Tat Savitur Vareṇyaṃ, Bhargo Devasya Dheemahi, Dhiyo Yo Naḥ Prachodayāt',
    meaning:
      'We meditate on the divine light of the Sun that illuminates the three worlds, may it inspire our intellect',
  },
  'maha-mrityunjaya-mantra': {
    sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात्',
    transliteration:
      'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat',
    meaning:
      'We worship the three-eyed Lord Shiva who is fragrant and nourishes all. May he liberate us from death like a cucumber from its vine, but not from immortality',
  },
}

export default function ChantLyrics({ chantId }: ChantLyricsProps) {
  const [showLyrics, setShowLyrics] = useState(false)
  const chant = getChantById(chantId)
  const lyrics = chantLyrics[chantId]

  if (!lyrics) return null

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <button
        onClick={() => setShowLyrics(!showLyrics)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-white font-semibold">View Chant Lyrics</span>
        <span className="text-purple-400">{showLyrics ? '▼' : '▶'}</span>
      </button>

      {showLyrics && (
        <div className="mt-4 space-y-4 pt-4 border-t border-gray-700">
          <div>
            <div className="text-xs text-gray-400 mb-1">Sanskrit</div>
            <div className="text-2xl text-purple-300 font-serif">{lyrics.sanskrit}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Transliteration</div>
            <div className="text-lg text-gray-300 italic">{lyrics.transliteration}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Meaning</div>
            <div className="text-sm text-gray-400">{lyrics.meaning}</div>
          </div>
        </div>
      )}
    </div>
  )
}

