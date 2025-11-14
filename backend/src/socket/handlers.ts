import { Server, Socket } from 'socket.io';
import { sessionManager } from '../session/sessionManager';
import { CoherenceScore, SessionIntention } from '@sync/shared';

interface ClientData {
  userId: string;
  sessionId: string | null;
}

export function setupSocketHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    const clientData: ClientData = {
      userId: socket.handshake.auth.userId || socket.id,
      sessionId: null,
    };

    console.log(`🔌 Client connected: ${clientData.userId}`);

    // Join current session
    socket.on('join_session', async (data: { intention?: SessionIntention; chantId?: string }) => {
      const session = sessionManager.getCurrentSession();
      if (!session) {
        socket.emit('error', { message: 'No active session available' });
        return;
      }

      // If chantId is provided, update the session's audio track
      let audioTrack = session.audioTrack;
      if (data.chantId) {
        // Update audio track for this user's session view
        // Note: In a real implementation, you might want to allow different chants per user
        // For now, we'll use the default session chant
        audioTrack = {
          id: data.chantId,
          name: data.chantId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          duration: session.audioTrack.duration,
        };
      }

      const success = sessionManager.joinSession(
        session.sessionId,
        clientData.userId,
        data.intention
      );

      if (success) {
        clientData.sessionId = session.sessionId;
        socket.join(session.sessionId);

        // Send current session state with user's selected chant
        socket.emit('session_joined', {
          sessionId: session.sessionId,
          startedAt: session.startedAt,
          duration: session.duration,
          currentPhase: session.currentPhase,
          participantCount: session.participants.size,
          groupMetrics: session.groupMetrics,
          audioTrack: audioTrack,
        });

        // Broadcast updated participant count
        io.to(session.sessionId).emit('participant_update', {
          participantCount: session.participants.size,
        });
      } else {
        socket.emit('error', { message: 'Failed to join session' });
      }
    });

    // Update coherence
    socket.on('update_coherence', (data: { coherence: CoherenceScore }) => {
      if (!clientData.sessionId) {
        return;
      }

      sessionManager.updateParticipantCoherence(
        clientData.sessionId,
        clientData.userId,
        data.coherence
      );

      const session = sessionManager.getSession(clientData.sessionId);
      if (session) {
        // Broadcast updated group metrics to all in session
        io.to(clientData.sessionId).emit('group_metrics_update', {
          groupMetrics: session.groupMetrics,
        });

        // Send personal contribution feedback
        const participant = session.participants.get(clientData.userId);
        if (participant) {
          const avgCoherence = session.groupMetrics.averageCoherence;
          const contribution =
            participant.currentCoherence > avgCoherence
              ? 'helping_lift'
              : 'being_supported';

          socket.emit('personal_feedback', {
            yourCoherence: participant.currentCoherence,
            groupAverage: avgCoherence,
            contribution,
          });
        }
      }
    });

    // Leave session
    socket.on('leave_session', () => {
      if (clientData.sessionId) {
        sessionManager.leaveSession(clientData.sessionId, clientData.userId);
        socket.leave(clientData.sessionId);

        const session = sessionManager.getSession(clientData.sessionId);
        if (session) {
          io.to(clientData.sessionId).emit('participant_update', {
            participantCount: session.participants.size,
          });
        }

        clientData.sessionId = null;
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (clientData.sessionId) {
        sessionManager.leaveSession(clientData.sessionId, clientData.userId);

        const session = sessionManager.getSession(clientData.sessionId);
        if (session) {
          io.to(clientData.sessionId).emit('participant_update', {
            participantCount: session.participants.size,
          });
        }
      }

      console.log(`🔌 Client disconnected: ${clientData.userId}`);
    });

    // Periodic group metrics broadcast (every 5 seconds)
    const metricsInterval = setInterval(() => {
      if (clientData.sessionId) {
        const session = sessionManager.getSession(clientData.sessionId);
        if (session) {
          io.to(clientData.sessionId).emit('group_metrics_update', {
            groupMetrics: session.groupMetrics,
          });
        }
      }
    }, 5000);

    socket.on('disconnect', () => {
      clearInterval(metricsInterval);
    });
  });
}

