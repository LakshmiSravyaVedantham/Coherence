'use client'

import { useEffect } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface HeartRateSimulatorProps {
  onHeartRateChange: (rate: number) => void
}

export default function HeartRateSimulator({
  onHeartRateChange,
}: HeartRateSimulatorProps) {
  const { setHeartRate } = useSessionStore()

  useEffect(() => {
    // Simulate heart rate for web (since we don't have HealthKit)
    // In production, this would come from actual biometric sensors or user input
    let baseRate = 70
    let direction = 1

    const interval = setInterval(() => {
      // Simulate natural heart rate variation
      baseRate += (Math.random() - 0.5) * 2 * direction
      baseRate = Math.max(60, Math.min(100, baseRate))

      // Occasionally change direction
      if (Math.random() < 0.1) {
        direction *= -1
      }

      const rate = Math.round(baseRate)
      setHeartRate(rate)
      onHeartRateChange(rate)
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [onHeartRateChange, setHeartRate])

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 text-center text-sm text-gray-400">
      <p>
        💡 Web Demo: Heart rate is simulated. In production, this would come from
        HealthKit (iOS) or compatible biometric sensors.
      </p>
    </div>
  )
}

