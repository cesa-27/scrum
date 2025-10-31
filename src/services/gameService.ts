import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { DragDropGame, UserGameScore } from '../types';
import { GAMES_SEED_DATA } from '../constants/seeds';
import { progressService } from './progressService';

export const gameService = {
  /**
   * Get all drag-drop games
   */
  async getGames(): Promise<DragDropGame[]> {
    if (!isSupabaseConfigured()) {
      return GAMES_SEED_DATA;
    }

    try {
      const { data, error } = await supabase
        .from('drag_drop_games')
        .select('*')
        .order('created_at');

      if (error) throw error;
      return data as DragDropGame[];
    } catch (err) {
      console.error('Error fetching games:', err);
      return GAMES_SEED_DATA;
    }
  },

  /**
   * Get game by ID
   */
  async getGameById(gameId: string): Promise<DragDropGame | null> {
    if (!isSupabaseConfigured()) {
      return GAMES_SEED_DATA.find((g) => g.id === gameId) || null;
    }

    try {
      const { data, error } = await supabase
        .from('drag_drop_games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (error) throw error;
      return data as DragDropGame;
    } catch (err) {
      console.error('Error fetching game:', err);
      return null;
    }
  },

  /**
   * Submit game score
   */
  async submitGameScore(
    userId: string,
    gameId: string,
    score: number,
    perfectScore: boolean
  ): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      // In development, just log it
      console.log('Game completed:', { userId, gameId, score, perfectScore });
      return { success: true, error: null };
    }

    try {
      const { error: insertError } = await supabase.from('user_game_scores').insert({
        user_id: userId,
        game_id: gameId,
        score,
        perfect_score: perfectScore,
        completed_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      // Award points
      const points = perfectScore ? 150 : Math.round(score * 1.5);
      await progressService.addPoints(userId, points);

      // Log activity
      const game = await this.getGameById(gameId);
      if (game) {
        const action = perfectScore ? '🎉 Completaste perfectamente' : 'Completaste';
        await progressService.logActivity(userId, action, game.title, 'game');
      }

      // Award medal for perfect score
      if (perfectScore) {
        await progressService.incrementMedals(userId);
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to submit game score' };
    }
  },

  /**
   * Get user's game scores
   */
  async getUserGameScores(userId: string, gameId?: string): Promise<UserGameScore[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase
        .from('user_game_scores')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (gameId) {
        query = query.eq('game_id', gameId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as UserGameScore[];
    } catch (err) {
      console.error('Error fetching game scores:', err);
      return [];
    }
  },

  /**
   * Get best score for a game
   */
  async getBestScore(userId: string, gameId: string): Promise<number> {
    const scores = await this.getUserGameScores(userId, gameId);
    if (scores.length === 0) return 0;
    return Math.max(...scores.map((s) => s.score));
  },

  /**
   * Check if user has perfect score on game
   */
  async hasPerfectScore(userId: string, gameId: string): Promise<boolean> {
    const scores = await this.getUserGameScores(userId, gameId);
    return scores.some((s) => s.perfect_score);
  },

  /**
   * Get game statistics
   */
  async getGameStats(userId: string): Promise<{
    gamesPlayed: number;
    perfectScores: number;
    averageScore: number;
  }> {
    const scores = await this.getUserGameScores(userId);

    if (scores.length === 0) {
      return {
        gamesPlayed: 0,
        perfectScores: 0,
        averageScore: 0,
      };
    }

    return {
      gamesPlayed: scores.length,
      perfectScores: scores.filter((s) => s.perfect_score).length,
      averageScore: Math.round(
        scores.reduce((sum, s) => sum + s.score, 0) / scores.length
      ),
    };
  },
};
