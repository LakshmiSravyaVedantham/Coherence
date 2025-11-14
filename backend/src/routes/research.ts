import { Express, Request, Response } from 'express';
import { DataCollectionService } from '../data/collection';
import { getSupabaseClient } from '../db/supabase';

export function setupResearchRoutes(app: Express): void {
  const dataCollection = new DataCollectionService();
  const supabase = getSupabaseClient();

  // Export research data (requires authentication in production)
  app.get('/api/research/export', async (req: Request, res: Response) => {
    try {
      const startDate = req.query.start
        ? new Date(req.query.start as string)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days ago
      const endDate = req.query.end
        ? new Date(req.query.end as string)
        : new Date();

      const data = await dataCollection.exportResearchData(startDate, endDate);

      res.json({
        success: true,
        dateRange: { start: startDate, end: endDate },
        data,
      });
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ error: 'Failed to export data' });
    }
  });

  // Get aggregate statistics
  app.get('/api/research/stats', async (req: Request, res: Response) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get snapshots from last 30 days
      const { data: snapshots, error } = await supabase
        .from('group_coherence_snapshots')
        .select('*')
        .gte('time', thirtyDaysAgo.toISOString());

      if (error) {
        throw error;
      }

      // Calculate statistics
      const totalSessions = new Set(snapshots?.map((s) => s.session_id) || []).size;
      const avgGroupCoherence =
        snapshots?.reduce((sum, s) => sum + s.average_coherence, 0) /
          (snapshots?.length || 1) || 0;
      const maxGroupCoherence =
        Math.max(...(snapshots?.map((s) => s.peak_coherence) || [0])) || 0;
      const avgParticipants =
        snapshots?.reduce((sum, s) => sum + s.participant_count, 0) /
          (snapshots?.length || 1) || 0;

      // Get unique users
      const { data: users } = await supabase
        .from('users')
        .select('user_id')
        .gte('last_active', thirtyDaysAgo.toISOString());

      const totalUsers = new Set(users?.map((u) => u.user_id) || []).size;

      res.json({
        success: true,
        stats: {
          total_sessions: totalSessions,
          total_users: totalUsers,
          avg_group_coherence: avgGroupCoherence,
          max_group_coherence: maxGroupCoherence,
          avg_participants: avgParticipants,
        },
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  });
}

