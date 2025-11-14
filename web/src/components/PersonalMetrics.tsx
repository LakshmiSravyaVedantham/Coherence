'use client'

interface PersonalMetricsProps {
  heartRate: number | null
  coherence: number
  coherencePhase: 'low' | 'medium' | 'high'
}

export default function PersonalMetrics({
  heartRate,
  coherence,
  coherencePhase,
}: PersonalMetricsProps) {
  const colorMap = {
    low: 'text-red-400',
    medium: 'text-yellow-400',
    high: 'text-green-400',
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
        <div className="text-sm text-gray-400 mb-2">Heart Rate</div>
        <div className="text-3xl font-bold text-white">
          {heartRate ? `${Math.round(heartRate)} BPM` : '--'}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
        <div className="text-sm text-gray-400 mb-2">Your Coherence</div>
        <div className={`text-3xl font-bold ${colorMap[coherencePhase]}`}>
          {Math.round(coherence)}%
        </div>
        <div className="text-xs text-gray-500 mt-1 capitalize">
          {coherencePhase} coherence
        </div>
      </div>
    </div>
  )
}

