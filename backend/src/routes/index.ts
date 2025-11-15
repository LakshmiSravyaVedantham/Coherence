import { Express, Request, Response } from 'express';
import { sessionManager } from '../session/sessionManager';
import { setupResearchRoutes } from './research';

export function setupRoutes(app: Express): void {
  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // Get current session
  app.get('/api/sessions/current', (req: Request, res: Response) => {
    const session = sessionManager.getCurrentSession();
    if (!session) {
      return res.status(404).json({ error: 'No active session found' });
    }

    // Return session info without full participant details
    res.json({
      sessionId: session.sessionId,
      startedAt: session.startedAt,
      duration: session.duration,
      currentPhase: session.currentPhase,
      participantCount: session.participants.size,
      groupMetrics: session.groupMetrics,
      audioTrack: session.audioTrack,
    });
  });

  // Get session details
  app.get('/api/sessions/:sessionId', (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const session = sessionManager.getSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId: session.sessionId,
      startedAt: session.startedAt,
      duration: session.duration,
      currentPhase: session.currentPhase,
      participantCount: session.participants.size,
      groupMetrics: session.groupMetrics,
      audioTrack: session.audioTrack,
    });
  });

  // Get all active sessions
  app.get('/api/sessions', (req: Request, res: Response) => {
    const sessions = sessionManager.getAllActiveSessions();
    res.json(
      sessions.map((s) => ({
        sessionId: s.sessionId,
        startedAt: s.startedAt,
        duration: s.duration,
        currentPhase: s.currentPhase,
        participantCount: s.participants.size,
        groupMetrics: s.groupMetrics,
        audioTrack: s.audioTrack,
      }))
    );
  });

  // Research routes
  setupResearchRoutes(app);
}

