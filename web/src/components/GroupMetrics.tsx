'use client'

interface GroupMetricsProps {
  metrics: {
    sessionId: string
    timestamp: number
    participantCount: number
    averageCoherence: number
    peakCoherence: number
    coherencePhase: 'low' | 'medium' | 'high'
    coherenceDistribution: {
      low: number
      medium: number
      high: number
    }
  }
}

export default function GroupMetrics({ metrics }: GroupMetricsProps) {
  const colorMap = {
    low: 'text-red-400',
    medium: 'text-yellow-400',
    high: 'text-green-400',
  }

  const bgColorMap = {
    low: 'bg-red-500',
    medium: 'bg-yellow-500',
    high: 'bg-green-500',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Group Coherence</div>
        <div className={`text-4xl font-bold ${colorMap[metrics.coherencePhase]}`}>
          {Math.round(metrics.averageCoherence)}%
        </div>
        <div className="text-xs text-gray-500 mt-1 capitalize">
          {metrics.coherencePhase} coherence
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Peak Coherence</div>
        <div className="text-4xl font-bold text-purple-400">
          {Math.round(metrics.peakCoherence)}%
        </div>
        <div className="text-xs text-gray-500 mt-1">Highest achieved</div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Chanting Together</div>
        <div className="text-4xl font-bold text-blue-400">
          {metrics.participantCount}
        </div>
        <div className="text-xs text-gray-500 mt-1">Voices in harmony</div>
      </div>

      {/* Distribution */}
      <div className="md:col-span-3 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-sm text-gray-400 mb-4">Coherence Distribution</div>
        <div className="flex items-end gap-2 h-24">
          <div className="flex-1 flex flex-col items-center">
            <div
              className={`w-full ${bgColorMap.low} rounded-t transition-all`}
              style={{
                height: `${
                  (metrics.coherenceDistribution.low / metrics.participantCount) *
                  100
                }%`,
              }}
            />
            <div className="text-xs text-gray-400 mt-2">
              Low: {metrics.coherenceDistribution.low}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div
              className={`w-full ${bgColorMap.medium} rounded-t transition-all`}
              style={{
                height: `${
                  (metrics.coherenceDistribution.medium /
                    metrics.participantCount) *
                  100
                }%`,
              }}
            />
            <div className="text-xs text-gray-400 mt-2">
              Medium: {metrics.coherenceDistribution.medium}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div
              className={`w-full ${bgColorMap.high} rounded-t transition-all`}
              style={{
                height: `${
                  (metrics.coherenceDistribution.high /
                    metrics.participantCount) *
                  100
                }%`,
              }}
            />
            <div className="text-xs text-gray-400 mt-2">
              High: {metrics.coherenceDistribution.high}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

