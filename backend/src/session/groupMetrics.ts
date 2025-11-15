import {
  SessionState,
  GroupCoherenceMetrics,
  CoherenceScore,
} from '@sync/shared';

/**
 * Calculate group coherence metrics from session state
 */
export function calculateGroupCoherence(
  session: SessionState
): GroupCoherenceMetrics {
  const participants = Array.from(session.participants.values());
  const participantCount = participants.length;

  if (participantCount === 0) {
    return {
      sessionId: session.sessionId,
      timestamp: Date.now(),
      participantCount: 0,
      averageCoherence: 0 as CoherenceScore,
      peakCoherence: session.groupMetrics.peakCoherence,
      coherencePhase: 'low',
      coherenceDistribution: {
        low: 0,
        medium: 0,
        high: 0,
      },
    };
  }

  // Calculate average coherence
  const totalCoherence = participants.reduce(
    (sum, p) => sum + p.currentCoherence,
    0
  );
  const averageCoherence = (totalCoherence / participantCount) as CoherenceScore;

  // Track peak coherence
  const peakCoherence = Math.max(
    session.groupMetrics.peakCoherence,
    averageCoherence
  ) as CoherenceScore;

  // Determine coherence phase
  let coherencePhase: 'low' | 'medium' | 'high';
  if (averageCoherence < 40) {
    coherencePhase = 'low';
  } else if (averageCoherence < 60) {
    coherencePhase = 'medium';
  } else {
    coherencePhase = 'high';
  }

  // Calculate distribution
  const distribution = {
    low: 0,
    medium: 0,
    high: 0,
  };

    participants.forEach((p: SessionParticipant) => {
    if (p.currentCoherence < 40) {
      distribution.low++;
    } else if (p.currentCoherence < 60) {
      distribution.medium++;
    } else {
      distribution.high++;
    }
  });

  return {
    sessionId: session.sessionId,
    timestamp: Date.now(),
    participantCount,
    averageCoherence,
    peakCoherence,
    coherencePhase,
    coherenceDistribution: distribution,
  };
}

