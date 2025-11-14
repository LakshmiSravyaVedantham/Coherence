import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
      )
    }

    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return supabaseClient
}

// Database types matching Supabase schema
export interface User {
  user_id: string
  created_at: string
  experience_level: number
  research_consent: boolean
  last_active: string | null
}

export interface Session {
  session_id: string
  started_at: string
  duration: number
  audio_track_id: string | null
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

export interface SessionParticipant {
  session_id: string
  user_id: string
  joined_at: string
  left_at: string | null
  intention_category: string | null
  peak_coherence: number | null
  time_in_coherence: number | null
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

