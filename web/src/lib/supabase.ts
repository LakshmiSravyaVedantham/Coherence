import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database types
export interface Session {
  id: string
  started_at: string
  duration: number
  audio_track_id: string
  peak_group_coherence: number | null
  total_participants: number
  created_at: string
}

export interface HRVMetric {
  time: string
  user_id: string
  session_id: string | null
  heart_rate: number | null
  rmssd: number | null
  sdnn: number | null
  mean_rr: number | null
  coherence_score: number | null
}

export interface GroupCoherenceSnapshot {
  time: string
  session_id: string
  participant_count: number
  average_coherence: number
  peak_coherence: number
  coherence_phase: 'low' | 'medium' | 'high'
  low_count: number
  medium_count: number
  high_count: number
}

export interface SessionParticipant {
  session_id: string
  user_id: string
  joined_at: string
  left_at: string | null
  intention_category: string | null
  peak_coherence: number | null
  time_in_coherence: number | null
}

