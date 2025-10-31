import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { CaseSimulation, UserCaseAttempt } from '../types';
import { CASES_SEED_DATA } from '../constants/seeds';
import { progressService } from './progressService';

export const caseService = {
  /**
   * Get all case simulations
   */
  async getCases(): Promise<CaseSimulation[]> {
    if (!isSupabaseConfigured()) {
      return CASES_SEED_DATA;
    }

    try {
      const { data, error } = await supabase
        .from('case_simulations')
        .select('*')
        .order('created_at');

      if (error) throw error;
      return data as CaseSimulation[];
    } catch (err) {
      console.error('Error fetching cases:', err);
      return CASES_SEED_DATA;
    }
  },

  /**
   * Get case by ID
   */
  async getCaseById(caseId: string): Promise<CaseSimulation | null> {
    if (!isSupabaseConfigured()) {
      return CASES_SEED_DATA.find((c) => c.id === caseId) || null;
    }

    try {
      const { data, error } = await supabase
        .from('case_simulations')
        .select('*')
        .eq('id', caseId)
        .single();

      if (error) throw error;
      return data as CaseSimulation;
    } catch (err) {
      console.error('Error fetching case:', err);
      return null;
    }
  },

  /**
   * Submit case attempt
   */
  async submitCaseAttempt(
    userId: string,
    caseId: string,
    decisions: number[],
    totalScore: number
  ): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      console.log('Case completed:', { userId, caseId, decisions, totalScore });
      return { success: true, error: null };
    }

    try {
      const { error: insertError } = await supabase.from('user_case_attempts').insert({
        user_id: userId,
        case_id: caseId,
        decisions,
        total_score: totalScore,
        completed_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      // Award points based on score
      const points = Math.round(totalScore * 3); // Max 300 points for perfect score
      await progressService.addPoints(userId, points);

      // Log activity
      const caseData = await this.getCaseById(caseId);
      if (caseData) {
        const performance = totalScore >= 80 ? 'Excelente' : totalScore >= 60 ? 'Bueno' : 'Regular';
        await progressService.logActivity(
          userId,
          `Completaste con ${performance}`,
          caseData.title,
          'case'
        );
      }

      // Award medal for excellent performance
      if (totalScore >= 90) {
        await progressService.incrementMedals(userId);
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to submit case attempt' };
    }
  },

  /**
   * Get user's case attempts
   */
  async getUserCaseAttempts(userId: string, caseId?: string): Promise<UserCaseAttempt[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase
        .from('user_case_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (caseId) {
        query = query.eq('case_id', caseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as UserCaseAttempt[];
    } catch (err) {
      console.error('Error fetching case attempts:', err);
      return [];
    }
  },

  /**
   * Get best score for a case
   */
  async getBestScore(userId: string, caseId: string): Promise<number> {
    const attempts = await this.getUserCaseAttempts(userId, caseId);
    if (attempts.length === 0) return 0;
    return Math.max(...attempts.map((a) => a.total_score));
  },

  /**
   * Get case statistics
   */
  async getCaseStats(userId: string): Promise<{
    casesCompleted: number;
    averageScore: number;
    bestScore: number;
    excellentPerformances: number;
  }> {
    const attempts = await this.getUserCaseAttempts(userId);

    if (attempts.length === 0) {
      return {
        casesCompleted: 0,
        averageScore: 0,
        bestScore: 0,
        excellentPerformances: 0,
      };
    }

    const scores = attempts.map((a) => a.total_score);
    const uniqueCases = new Set(attempts.map((a) => a.case_id));

    return {
      casesCompleted: uniqueCases.size,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      bestScore: Math.max(...scores),
      excellentPerformances: attempts.filter((a) => a.total_score >= 80).length,
    };
  },

  /**
   * Calculate score for case attempt
   */
  calculateCaseScore(caseData: CaseSimulation, decisions: number[]): number {
    let total = 0;
    let maxScore = 0;

    decisions.forEach((decision, index) => {
      const step = caseData.scenario.steps[index];
      if (step) {
        total += step.options[decision].score;
        maxScore += Math.max(...step.options.map((o) => o.score));
      }
    });

    return maxScore > 0 ? Math.round((total / maxScore) * 100) : 0;
  },
};
