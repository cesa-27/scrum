import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserProgress, ActivityLog } from '../types';

export const progressService = {
  /**
   * Get user progress
   */
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    if (!isSupabaseConfigured()) {
      // Return mock data from localStorage
      const savedProgress = localStorage.getItem('userProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        return {
          id: 'mock-progress-id',
          user_id: userId,
          overall_progress: progress.overallProgress || 45,
          average_score: progress.averageScore || 87,
          study_time: progress.studyTime || 12.5,
          total_points: 1250,
          medals_count: progress.medals || 5,
          current_streak: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data as UserProgress;
    } catch (err) {
      console.error('Error fetching user progress:', err);
      return null;
    }
  },

  /**
   * Update user progress
   */
  async updateUserProgress(
    userId: string,
    updates: Partial<Omit<UserProgress, 'id' | 'user_id' | 'created_at'>>
  ): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      // Update localStorage
      const savedProgress = localStorage.getItem('userProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        const updated = {
          ...progress,
          overallProgress: updates.overall_progress ?? progress.overallProgress,
          averageScore: updates.average_score ?? progress.averageScore,
          studyTime: updates.study_time ?? progress.studyTime,
          medals: updates.medals_count ?? progress.medals,
        };
        localStorage.setItem('userProgress', JSON.stringify(updated));
      }
      return { success: true, error: null };
    }

    try {
      const { error } = await supabase
        .from('user_progress')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Update failed' };
    }
  },

  /**
   * Increment study time
   */
  async incrementStudyTime(userId: string, hours: number): Promise<void> {
    if (!isSupabaseConfigured()) {
      const savedProgress = localStorage.getItem('userProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        progress.studyTime = (progress.studyTime || 0) + hours;
        localStorage.setItem('userProgress', JSON.stringify(progress));
      }
      return;
    }

    try {
      const current = await this.getUserProgress(userId);
      if (current) {
        await this.updateUserProgress(userId, {
          study_time: current.study_time + hours,
        });
      }
    } catch (err) {
      console.error('Error incrementing study time:', err);
    }
  },

  /**
   * Add points to user
   */
  async addPoints(userId: string, points: number): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      const current = await this.getUserProgress(userId);
      if (current) {
        await this.updateUserProgress(userId, {
          total_points: current.total_points + points,
        });
      }
    } catch (err) {
      console.error('Error adding points:', err);
    }
  },

  /**
   * Increment medals count
   */
  async incrementMedals(userId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      const savedProgress = localStorage.getItem('userProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        progress.medals = (progress.medals || 0) + 1;
        localStorage.setItem('userProgress', JSON.stringify(progress));
      }
      return;
    }

    try {
      const current = await this.getUserProgress(userId);
      if (current && current.medals_count < 12) {
        await this.updateUserProgress(userId, {
          medals_count: current.medals_count + 1,
        });
      }
    } catch (err) {
      console.error('Error incrementing medals:', err);
    }
  },

  /**
   * Update overall progress based on completed lessons
   */
  async updateOverallProgress(userId: string, completedCount: number, totalCount: number): Promise<void> {
    const newProgress = Math.round((completedCount / totalCount) * 100);
    await this.updateUserProgress(userId, {
      overall_progress: Math.min(newProgress, 100),
    });
  },

  /**
   * Update average score based on quiz results
   */
  async updateAverageScore(userId: string, newScore: number): Promise<void> {
    if (!isSupabaseConfigured()) {
      const savedProgress = localStorage.getItem('userProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        const currentAverage = progress.averageScore || 0;
        const newAverage = Math.round((currentAverage + newScore) / 2);
        progress.averageScore = newAverage;
        localStorage.setItem('userProgress', JSON.stringify(progress));
      }
      return;
    }

    try {
      const current = await this.getUserProgress(userId);
      if (current) {
        const newAverage = Math.round((current.average_score + newScore) / 2);
        await this.updateUserProgress(userId, {
          average_score: newAverage,
        });
      }
    } catch (err) {
      console.error('Error updating average score:', err);
    }
  },

  /**
   * Get recent activity for user
   */
  async getRecentActivity(userId: string, limit: number = 10): Promise<ActivityLog[]> {
    if (!isSupabaseConfigured()) {
      // Return mock data
      return [
        {
          id: '1',
          user_id: userId,
          action: 'Completaste',
          item: 'Roles en Scrum',
          type: 'lesson',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          user_id: userId,
          action: 'Obtuviste 95%',
          item: 'Quiz de Eventos',
          type: 'quiz',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          user_id: userId,
          action: 'Desbloqueaste',
          item: 'Medalla: Maestro de Roles',
          type: 'medal',
          created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }

    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as ActivityLog[];
    } catch (err) {
      console.error('Error fetching activity:', err);
      return [];
    }
  },

  /**
   * Log an activity
   */
  async logActivity(
    userId: string,
    action: string,
    item: string,
    type: 'lesson' | 'quiz' | 'medal' | 'game' | 'case'
  ): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      await supabase.from('activity_logs').insert({
        user_id: userId,
        action,
        item,
        type,
      });
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  },

  /**
   * Get progress data for charts (weekly points)
   */
  async getProgressChartData(userId: string): Promise<{ name: string; puntos: number }[]> {
    if (!isSupabaseConfigured()) {
      // Return mock data
      return [
        { name: 'Sem 1', puntos: 150 },
        { name: 'Sem 2', puntos: 280 },
        { name: 'Sem 3', puntos: 420 },
        { name: 'Sem 4', puntos: 650 },
        { name: 'Sem 5', puntos: 950 },
        { name: 'Sem 6', puntos: 1250 },
      ];
    }

    // TODO: Implement actual weekly points calculation from database
    // This would query user_quiz_attempts, user_game_scores, etc.
    // and aggregate points by week
    return [];
  },

  /**
   * Get quiz scores for chart
   */
  async getQuizScoresChartData(userId: string): Promise<{ name: string; puntaje: number }[]> {
    if (!isSupabaseConfigured()) {
      // Return mock data
      return [
        { name: 'Quiz 1', puntaje: 70 },
        { name: 'Quiz 2', puntaje: 85 },
        { name: 'Quiz 3', puntaje: 90 },
        { name: 'Quiz 4', puntaje: 95 },
      ];
    }

    // TODO: Implement actual quiz scores from database
    return [];
  },
};
