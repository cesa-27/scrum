import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Quiz, QuizQuestion, UserQuizAttempt } from '../types';
import { QUIZZES_SEED_DATA } from '../constants/seeds';
import { progressService } from './progressService';

export const quizService = {
  /**
   * Get all quizzes
   */
  async getQuizzes(): Promise<Quiz[]> {
    if (!isSupabaseConfigured()) {
      // Return seed data
      return QUIZZES_SEED_DATA.map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        total_questions: q.questions_data.length,
        created_at: new Date().toISOString(),
      }));
    }

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at');

      if (error) throw error;
      return data as Quiz[];
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      return [];
    }
  },

  /**
   * Get quiz by ID
   */
  async getQuizById(quizId: string): Promise<Quiz | null> {
    if (!isSupabaseConfigured()) {
      const quiz = QUIZZES_SEED_DATA.find((q) => q.id === quizId);
      if (!quiz) return null;
      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        total_questions: quiz.questions_data.length,
        created_at: new Date().toISOString(),
      };
    }

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (error) throw error;
      return data as Quiz;
    } catch (err) {
      console.error('Error fetching quiz:', err);
      return null;
    }
  },

  /**
   * Get questions for a quiz
   */
  async getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    if (!isSupabaseConfigured()) {
      const quiz = QUIZZES_SEED_DATA.find((q) => q.id === quizId);
      if (!quiz) return [];
      return quiz.questions_data.map((q, index) => ({
        id: `${quizId}-q${index}`,
        quiz_id: quizId,
        question: q.question,
        options: q.options,
        correct_answer_index: q.correct,
        feedback: q.feedback,
        incorrect_feedback: q.incorrectFeedback,
        order: index,
        created_at: new Date().toISOString(),
      }));
    }

    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order');

      if (error) throw error;
      return data as QuizQuestion[];
    } catch (err) {
      console.error('Error fetching quiz questions:', err);
      return [];
    }
  },

  /**
   * Get completed quizzes for a user
   */
  async getCompletedQuizzes(userId: string): Promise<string[]> {
    if (!isSupabaseConfigured()) {
      const saved = localStorage.getItem('completedQuizzes');
      return saved ? JSON.parse(saved) : ['quiz-roles'];
    }

    try {
      const { data, error } = await supabase
        .from('user_quiz_attempts')
        .select('quiz_id')
        .eq('user_id', userId);

      if (error) throw error;

      // Get unique quiz IDs
      const uniqueQuizIds = [...new Set(data.map((item) => item.quiz_id))];
      return uniqueQuizIds;
    } catch (err) {
      console.error('Error fetching completed quizzes:', err);
      return [];
    }
  },

  /**
   * Submit quiz attempt
   */
  async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: number[],
    score: number,
    correctAnswers: number,
    totalQuestions: number
  ): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      // Update localStorage
      const saved = localStorage.getItem('completedQuizzes');
      const completed = saved ? JSON.parse(saved) : [];
      if (!completed.includes(quizId)) {
        completed.push(quizId);
        localStorage.setItem('completedQuizzes', JSON.stringify(completed));

        // Update progress
        await progressService.updateAverageScore(userId, score);
        await progressService.incrementStudyTime(userId, 0.2);

        // Award medal if high score
        if (score >= 90) {
          await progressService.incrementMedals(userId);
        }
      }
      return { success: true, error: null };
    }

    try {
      // Insert quiz attempt
      const { error: insertError } = await supabase.from('user_quiz_attempts').insert({
        user_id: userId,
        quiz_id: quizId,
        score,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        answers,
        completed_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      // Update average score
      await progressService.updateAverageScore(userId, score);

      // Increment study time
      await progressService.incrementStudyTime(userId, 0.2);

      // Log activity
      const quiz = await this.getQuizById(quizId);
      if (quiz) {
        await progressService.logActivity(
          userId,
          `Obtuviste ${score}%`,
          quiz.title,
          'quiz'
        );
      }

      // Award points based on score
      const points = Math.round(score * 2); // Max 200 points for perfect score
      await progressService.addPoints(userId, points);

      // Check for medal (high score achievement)
      if (score >= 90) {
        await progressService.incrementMedals(userId);
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to submit quiz attempt' };
    }
  },

  /**
   * Get quiz attempts for a user
   */
  async getUserQuizAttempts(userId: string, quizId?: string): Promise<UserQuizAttempt[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase
        .from('user_quiz_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (quizId) {
        query = query.eq('quiz_id', quizId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as UserQuizAttempt[];
    } catch (err) {
      console.error('Error fetching quiz attempts:', err);
      return [];
    }
  },

  /**
   * Get best score for a quiz
   */
  async getBestScore(userId: string, quizId: string): Promise<number> {
    const attempts = await this.getUserQuizAttempts(userId, quizId);
    if (attempts.length === 0) return 0;
    return Math.max(...attempts.map((a) => a.score));
  },

  /**
   * Get quiz statistics for user
   */
  async getQuizStats(userId: string): Promise<{
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    completedQuizzes: number;
  }> {
    const attempts = await this.getUserQuizAttempts(userId);
    
    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        completedQuizzes: 0,
      };
    }

    const scores = attempts.map((a) => a.score);
    const uniqueQuizzes = new Set(attempts.map((a) => a.quiz_id));

    return {
      totalAttempts: attempts.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      bestScore: Math.max(...scores),
      completedQuizzes: uniqueQuizzes.size,
    };
  },
};
