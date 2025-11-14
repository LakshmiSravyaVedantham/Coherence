import { v4 as uuidv4 } from 'uuid';
import {
  SessionState,
  SessionParticipant,
  GroupCoherenceMetrics,
  CoherenceScore,
} from '@sync/shared';
import { calculateGroupCoherence } from './groupMetrics';

export class SessionManager {
  private sessions: Map<string, SessionState> = new Map();
  private rollingInterval: NodeJS.Timeout | null = null;
  private readonly SESSION_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly ROLLING_INTERVAL = 15 * 60 * 1000; // New session every 15 minutes

  /**
   * Start the rolling session system
   */
  startRollingSessions(): void {
    // Create initial session
    this.createNewSession();

    // Schedule rolling sessions
    this.rollingInterval = setInterval(() => {
      this.createNewSession();
      this.cleanupOldSessions();
    }, this.ROLLING_INTERVAL);

    console.log('✅ Rolling session system started');
  }

  /**
   * Stop the rolling session system
   */
  stopRollingSessions(): void {
    if (this.rollingInterval) {
      clearInterval(this.rollingInterval);
      this.rollingInterval = null;
    }
  }

  /**
   * Create a new session
   */
  createNewSession(): string {
    const sessionId = uuidv4();
    const now = Date.now();

    const session: SessionState = {
      sessionId,
      startedAt: now,
      duration: this.SESSION_DURATION,
      currentPhase: 'preparation',
      participants: new Map(),
      groupMetrics: {
        sessionId,
        timestamp: now,
        participantCount: 0,
        averageCoherence: 0 as CoherenceScore,
        peakCoherence: 0 as CoherenceScore,
        coherencePhase: 'low',
        coherenceDistribution: {
          low: 0,
          medium: 0,
          high: 0,
        },
      },
      audioTrack: {
        id: 'om-chant-432hz',
        name: 'Om Chant - 432 Hz Tuning',
        duration: this.SESSION_DURATION,
      },
    };

    this.sessions.set(sessionId, session);

    // Transition to active phase after 30 seconds
    setTimeout(() => {
      const s = this.sessions.get(sessionId);
      if (s) {
        s.currentPhase = 'active';
      }
    }, 30000);

    // Transition to integration phase 2 minutes before end
    setTimeout(() => {
      const s = this.sessions.get(sessionId);
      if (s) {
        s.currentPhase = 'integration';
      }
    }, this.SESSION_DURATION - 120000);

    // Mark complete at end
    setTimeout(() => {
      const s = this.sessions.get(sessionId);
      if (s) {
        s.currentPhase = 'complete';
      }
    }, this.SESSION_DURATION);

    console.log(`📅 Created new session: ${sessionId}`);
    return sessionId;
  }

  /**
   * Get the current active session (most recent non-complete session)
   */
  getCurrentSession(): SessionState | null {
    const activeSessions = Array.from(this.sessions.values())
      .filter((s) => s.currentPhase !== 'complete')
      .sort((a, b) => b.startedAt - a.startedAt);

    return activeSessions[0] || null;
  }

  /**
   * Get a specific session
   */
  getSession(sessionId: string): SessionState | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Join a session
   */
  joinSession(
    sessionId: string,
    userId: string,
    intention?: SessionParticipant['intention']
  ): boolean {
    const session = this.sessions.get(sessionId);
    if (!session || session.currentPhase === 'complete') {
      return false;
    }

    const participant: SessionParticipant = {
      userId,
      joinedAt: Date.now(),
      intention,
      currentCoherence: 0 as CoherenceScore,
      lastUpdate: Date.now(),
    };

    session.participants.set(userId, participant);
    this.updateGroupMetrics(sessionId);

    return true;
  }

  /**
   * Leave a session
   */
  leaveSession(sessionId: string, userId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.participants.delete(userId);
      this.updateGroupMetrics(sessionId);
    }
  }

  /**
   * Update participant coherence
   */
  updateParticipantCoherence(
    sessionId: string,
    userId: string,
    coherence: CoherenceScore
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const participant = session.participants.get(userId);
    if (participant) {
      participant.currentCoherence = coherence;
      participant.lastUpdate = Date.now();
      this.updateGroupMetrics(sessionId);
    }
  }

  /**
   * Update group coherence metrics
   */
  private updateGroupMetrics(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const metrics = calculateGroupCoherence(session);
    session.groupMetrics = metrics;
  }

  /**
   * Get group metrics for a session
   */
  getGroupMetrics(sessionId: string): GroupCoherenceMetrics | null {
    const session = this.sessions.get(sessionId);
    return session ? session.groupMetrics : null;
  }

  /**
   * Clean up old completed sessions (keep last 10)
   */
  private cleanupOldSessions(): void {
    const completedSessions = Array.from(this.sessions.entries())
      .filter(([_, s]) => s.currentPhase === 'complete')
      .sort(([_, a], [__, b]) => b.startedAt - a.startedAt);

    // Keep only the 10 most recent completed sessions
    const toDelete = completedSessions.slice(10);
    toDelete.forEach(([sessionId]) => {
      this.sessions.delete(sessionId);
    });

    if (toDelete.length > 0) {
      console.log(`🧹 Cleaned up ${toDelete.length} old sessions`);
    }
  }

  /**
   * Get all active sessions
   */
  getAllActiveSessions(): SessionState[] {
    return Array.from(this.sessions.values()).filter(
      (s) => s.currentPhase !== 'complete'
    );
  }
}

export const sessionManager = new SessionManager();

