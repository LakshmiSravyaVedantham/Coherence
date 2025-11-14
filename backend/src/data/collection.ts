import { createHash } from 'crypto';
import {
  HRVMetric,
  CoherenceState,
  UserSessionData,
  SessionIntention,
} from '@sync/shared';
import { getSupabaseClient } from '../db/supabase';

/**
 * Data collection and anonymization pipeline
 * Handles storing research data while maintaining privacy
 * Uses Supabase for database operations
 */

export class DataCollectionService {
  private supabase = getSupabaseClient();

  /**
   * Hash user ID for anonymization
   */
  private hashUserId(userId: string): string {
    return createHash('sha256').update(userId).digest('hex');
  }

  /**
   * Store HRV metrics (time-series data)
   */
  async storeHRVMetrics(
    userId: string,
    sessionId: string,
    metrics: HRVMetric[]
  ): Promise<void> {
    const hashedUserId = this.hashUserId(userId);

    const records = metrics.map((m) => ({
      time: new Date(m.timestamp).toISOString(),
      user_id: hashedUserId,
      session_id: sessionId,
      heart_rate: m.heartRate,
      rmssd: m.rmssd,
      sdnn: m.sdnn,
      mean_rr: m.meanRR,
      coherence_score: null, // Will be updated separately
    }));

    // Batch insert using Supabase
    const { error } = await this.supabase
      .from('hrv_metrics')
      .upsert(records, { onConflict: 'time,user_id,session_id' });

    if (error) {
      console.error('Error storing HRV metrics:', error);
      throw error;
    }
  }

  /**
   * Store coherence states
   */
  async storeCoherenceStates(
    userId: string,
    sessionId: string,
    states: CoherenceState[]
  ): Promise<void> {
    const hashedUserId = this.hashUserId(userId);

    // Update hrv_metrics with coherence scores
    for (const state of states) {
      const { error } = await this.supabase
        .from('hrv_metrics')
        .update({ coherence_score: state.score })
        .eq('user_id', hashedUserId)
        .eq('session_id', sessionId)
        .eq('time', new Date(state.timestamp).toISOString());

      if (error) {
        console.error('Error updating coherence score:', error);
      }
    }
  }

  /**
   * Store session participant data
   */
  async storeSessionParticipant(
    userId: string,
    sessionId: string,
    intention: SessionIntention | undefined,
    peakCoherence: number,
    timeInCoherence: number
  ): Promise<void> {
    const hashedUserId = this.hashUserId(userId);

    const { error } = await this.supabase
      .from('session_participants')
      .upsert(
        {
          session_id: sessionId,
          user_id: hashedUserId,
          joined_at: new Date().toISOString(),
          intention_category: intention?.category || null,
          peak_coherence: peakCoherence,
          time_in_coherence: timeInCoherence,
        },
        { onConflict: 'session_id,user_id' }
      );

    if (error) {
      console.error('Error storing session participant:', error);
      throw error;
    }
  }

  /**
   * Store group coherence snapshot
   */
  async storeGroupCoherenceSnapshot(
    sessionId: string,
    metrics: {
      participantCount: number;
      averageCoherence: number;
      peakCoherence: number;
      coherencePhase: 'low' | 'medium' | 'high';
      distribution: {
        low: number;
        medium: number;
        high: number;
      };
    }
  ): Promise<void> {
    const { error } = await this.supabase
      .from('group_coherence_snapshots')
      .insert({
        time: new Date().toISOString(),
        session_id: sessionId,
        participant_count: metrics.participantCount,
        average_coherence: metrics.averageCoherence,
        peak_coherence: metrics.peakCoherence,
        coherence_phase: metrics.coherencePhase,
        low_count: metrics.distribution.low,
        medium_count: metrics.distribution.medium,
        high_count: metrics.distribution.high,
      });

    if (error) {
      console.error('Error storing group coherence snapshot:', error);
      throw error;
    }
  }

  /**
   * Create or update user record
   */
  async upsertUser(userId: string, researchConsent: boolean): Promise<void> {
    const hashedUserId = this.hashUserId(userId);

    const { error } = await this.supabase
      .from('users')
      .upsert(
        {
          user_id: hashedUserId,
          research_consent: researchConsent,
          last_active: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  /**
   * Increment user experience level
   */
  async incrementUserExperience(userId: string): Promise<void> {
    const hashedUserId = this.hashUserId(userId);

    // Get current experience level
    const { data, error: fetchError } = await this.supabase
      .from('users')
      .select('experience_level')
      .eq('user_id', hashedUserId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" - we'll create the user
      console.error('Error fetching user:', fetchError);
    }

    const currentLevel = data?.experience_level || 0;

    const { error } = await this.supabase
      .from('users')
      .upsert(
        {
          user_id: hashedUserId,
          experience_level: currentLevel + 1,
          last_active: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Error incrementing user experience:', error);
      throw error;
    }
  }

  /**
   * Export research data (anonymized)
   */
  async exportResearchData(
    dateRangeStart: Date,
    dateRangeEnd: Date
  ): Promise<{
    hrvMetrics: any[];
    groupSnapshots: any[];
    sessionParticipants: any[];
  }> {
    const startISO = dateRangeStart.toISOString();
    const endISO = dateRangeEnd.toISOString();

    // Get users who consented
    const { data: consentingUsers } = await this.supabase
      .from('users')
      .select('user_id')
      .eq('research_consent', true);

    const consentingUserIds = consentingUsers?.map((u) => u.user_id) || [];

    // Get HRV metrics from consenting users
    const { data: hrvMetrics, error: hrvError } = await this.supabase
      .from('hrv_metrics')
      .select('*')
      .in('user_id', consentingUserIds)
      .gte('time', startISO)
      .lte('time', endISO)
      .order('time', { ascending: true });

    if (hrvError) {
      console.error('Error fetching HRV metrics:', hrvError);
    }

    // Get group snapshots
    const { data: groupSnapshots, error: groupError } = await this.supabase
      .from('group_coherence_snapshots')
      .select('*')
      .gte('time', startISO)
      .lte('time', endISO)
      .order('time', { ascending: true });

    if (groupError) {
      console.error('Error fetching group snapshots:', groupError);
    }

    // Get session participants from consenting users
    const { data: sessionParticipants, error: participantError } =
      await this.supabase
        .from('session_participants')
        .select('*')
        .in('user_id', consentingUserIds)
        .gte('joined_at', startISO)
        .lte('joined_at', endISO);

    if (participantError) {
      console.error('Error fetching session participants:', participantError);
    }

    // Log export
    const uniqueUserIds = new Set(hrvMetrics?.map((m) => m.user_id) || []);

    await this.supabase.from('research_exports').insert({
      date_range_start: startISO,
      date_range_end: endISO,
      session_count: groupSnapshots?.length || 0,
      user_count: uniqueUserIds.size,
    });

    return {
      hrvMetrics: hrvMetrics || [],
      groupSnapshots: groupSnapshots || [],
      sessionParticipants: sessionParticipants || [],
    };
  }
}

