/**
 * Core types for the Sync platform
 */

export type CoherenceScore = number; // 0-100 scale

export type HRVMetric = {
  timestamp: number;
  rmssd: number; // Root Mean Square of Successive Differences
  sdnn: number; // Standard Deviation of NN intervals
  meanRR: number; // Mean R-R interval in ms
  heartRate: number; // BPM
};

export type CoherenceState = {
  timestamp: number;
  score: CoherenceScore;
  peakPower: number; // Power in 0.04-0.26 Hz band
  totalPower: number; // Total power in 0-0.4 Hz band
  phase: 'low' | 'medium' | 'high'; // Based on HeartMath thresholds
};

export type IntentionCategory =
  | 'physical_healing'
  | 'emotional_release'
  | 'anxiety'
  | 'abundance'
  | 'energy'
  | 'grief'
  | 'other';

export type SessionIntention = {
  category: IntentionCategory;
  note?: string; // Private, not shared
};

export type SessionParticipant = {
  userId: string; // Hashed/anonymized
  joinedAt: number;
  intention?: SessionIntention;
  currentCoherence: CoherenceScore;
  lastUpdate: number;
};

export type GroupCoherenceMetrics = {
  sessionId: string;
  timestamp: number;
  participantCount: number;
  averageCoherence: CoherenceScore;
  peakCoherence: CoherenceScore;
  coherencePhase: 'low' | 'medium' | 'high';
  // Individual contributions
  coherenceDistribution: {
    low: number; // Count in low coherence
    medium: number;
    high: number;
  };
};

export type SessionState = {
  sessionId: string;
  startedAt: number;
  duration: number; // seconds
  currentPhase: 'preparation' | 'active' | 'integration' | 'complete';
  participants: Map<string, SessionParticipant>;
  groupMetrics: GroupCoherenceMetrics;
  audioTrack: {
    id: string;
    name: string;
    duration: number;
  };
};

export type SynchronizationPair = {
  userA: string;
  userB: string;
  correlation: number; // Pearson correlation coefficient
  phaseSyncIndex: number; // Phase locking value
  syncStrength: number; // Combined metric (0-1)
};

export type UserSessionData = {
  userId: string;
  sessionId: string;
  hrvMetrics: HRVMetric[];
  coherenceStates: CoherenceState[];
  intention?: SessionIntention;
  joinedAt: number;
  leftAt?: number;
  peakCoherence: CoherenceScore;
  timeInCoherence: number; // seconds
};

