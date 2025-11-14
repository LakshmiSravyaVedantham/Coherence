'use client'

import { useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

export default function SessionSharing() {
  const { currentSession, personalCoherence } = useSessionStore()
  const [copied, setCopied] = useState(false)
  const [shareMethod, setShareMethod] = useState<'link' | 'image' | 'social'>('link')

  if (!currentSession) return null

  const shareData = {
    title: 'I just completed a chanting session!',
    text: `I achieved ${Math.round(personalCoherence)}% coherence in a group chanting session with ${currentSession.participantCount} people. Join me in the next session!`,
    url: window.location.origin,
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`
      navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareData.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateShareImage = () => {
    // In production, this would generate an image with session stats
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 630
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1200, 630)
      gradient.addColorStop(0, '#1a1a2e')
      gradient.addColorStop(1, '#16213e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 1200, 630)

      // Title
      ctx.fillStyle = '#a855f7'
      ctx.font = 'bold 48px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Chanting Session Complete!', 600, 200)

      // Stats
      ctx.fillStyle = '#ffffff'
      ctx.font = '36px Arial'
      ctx.fillText(`Coherence: ${Math.round(personalCoherence)}%`, 600, 300)
      ctx.fillText(`Group Size: ${currentSession.participantCount} people`, 600, 350)
      ctx.fillText(`Peak Coherence: ${Math.round(currentSession.groupMetrics?.peakCoherence || 0)}%`, 600, 400)

      // Logo/Watermark
      ctx.fillStyle = '#a855f7'
      ctx.font = '24px Arial'
      ctx.fillText('Sync - Collective Coherence Platform', 600, 580)
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'chanting-session-share.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">📤 Share Your Session</h3>

      <div className="space-y-4">
        {/* Share Method Selection */}
        <div className="flex gap-2">
          <button
            onClick={() => setShareMethod('link')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              shareMethod === 'link'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Link
          </button>
          <button
            onClick={() => setShareMethod('image')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              shareMethod === 'image'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Image
          </button>
          <button
            onClick={() => setShareMethod('social')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              shareMethod === 'social'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Social
          </button>
        </div>

        {/* Share Content */}
        {shareMethod === 'link' && (
          <div className="space-y-3">
            <div className="bg-gray-900 rounded-lg p-3 text-sm text-gray-300">
              {shareData.text}
            </div>
            <button
              onClick={copyLink}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        )}

        {shareMethod === 'image' && (
          <div className="space-y-3">
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {Math.round(personalCoherence)}% Coherence
              </div>
              <div className="text-sm text-gray-400">
                {currentSession.participantCount} people chanting together
              </div>
            </div>
            <button
              onClick={generateShareImage}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
            >
              Download Share Image
            </button>
          </div>
        )}

        {shareMethod === 'social' && (
          <div className="space-y-3">
            <button
              onClick={handleShare}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
            >
              {navigator.share ? 'Share via Device' : 'Copy Share Text'}
            </button>
            {copied && (
              <div className="text-sm text-green-400 text-center">✓ Copied to clipboard!</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

