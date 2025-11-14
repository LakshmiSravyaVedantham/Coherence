'use client'

import { useState, useEffect } from 'react'
import { AVAILABLE_CHANTS } from '@/lib/chants'

interface ChantRoom {
  id: string
  name: string
  chantId: string
  participantCount: number
  status: 'active' | 'starting_soon' | 'ended'
  startTime: number
}

export default function ChantRooms() {
  const [rooms, setRooms] = useState<ChantRoom[]>([])

  // Simulate active chant rooms
  useEffect(() => {
    const simulatedRooms: ChantRoom[] = AVAILABLE_CHANTS.slice(0, 5).map((chant, index) => ({
      id: `room-${chant.id}`,
      name: `${chant.name} Room`,
      chantId: chant.id,
      participantCount: Math.floor(Math.random() * 50) + 5,
      status: index < 2 ? 'active' : 'starting_soon',
      startTime: Date.now() - (index * 60000),
    }))
    setRooms(simulatedRooms)
  }, [])

  const handleJoinRoom = (room: ChantRoom) => {
    // In production, this would join the specific room
    console.log('Joining room:', room.id)
    // For now, redirect to welcome view to start session
    window.location.reload()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Active Chant Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const chant = AVAILABLE_CHANTS.find((c) => c.id === room.chantId)
          return (
            <div
              key={room.id}
              onClick={() => handleJoinRoom(room)}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{room.name}</h3>
                  <p className="text-sm text-gray-400">{chant?.description}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    room.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {room.status === 'active' ? 'Live' : 'Starting Soon'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  👥 {room.participantCount} chanting
                </span>
                <span className="text-purple-400 font-semibold">
                  {chant?.frequency} Hz
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

