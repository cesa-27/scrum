import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Lesson, UserLesson } from '../types';
import { LESSONS_SEED_DATA } from '../constants/seeds';
import { progressService } from './progressService';

export const lessonService = {
  /**
   * Get all lessons grouped by section
   */
  async getLessons(): Promise<Lesson[]> {
    if (!isSupabaseConfigured()) {
      // Return seed data for development
      return LESSONS_SEED_DATA;
    }

    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('section_id')
        .order('order');

      if (error) throw error;
      return data as Lesson[];
    } catch (err) {
      console.error('Error fetching lessons:', err);
      return LESSONS_SEED_DATA; // Fallback to seed data
    }
  },

  /**
   * Get a specific lesson by ID
   */
  async getLessonById(lessonId: string): Promise<Lesson | null> {
    if (!isSupabaseConfigured()) {
      return LESSONS_SEED_DATA.find((l) => l.id === lessonId) || null;
    }

    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      return data as Lesson;
    } catch (err) {
      console.error('Error fetching lesson:', err);
      return null;
    }
  },

  /**
   * Get completed lessons for a user
   */
  async getCompletedLessons(userId: string): Promise<string[]> {
    if (!isSupabaseConfigured()) {
      // Return from localStorage
      const saved = localStorage.getItem('completedLessons');
      return saved ? JSON.parse(saved) : ['fundamentos-1', 'scrum-1'];
    }

    try {
      const { data, error } = await supabase
        .from('user_lessons')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('completed', true);

      if (error) throw error;
      return data.map((item) => item.lesson_id);
    } catch (err) {
      console.error('Error fetching completed lessons:', err);
      return [];
    }
  },

  /**
   * Mark a lesson as completed
   */
  async markLessonComplete(
    userId: string,
    lessonId: string
  ): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      // Update localStorage
      const saved = localStorage.getItem('completedLessons');
      const completed = saved ? JSON.parse(saved) : [];
      if (!completed.includes(lessonId)) {
        completed.push(lessonId);
        localStorage.setItem('completedLessons', JSON.stringify(completed));

        // Update progress
        const totalLessons = LESSONS_SEED_DATA.length;
        await progressService.updateOverallProgress(userId, completed.length, totalLessons);
        await progressService.incrementStudyTime(userId, 0.3);
      }
      return { success: true, error: null };
    }

    try {
      // Check if already completed
      const { data: existing } = await supabase
        .from('user_lessons')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();

      if (existing) {
        // Already completed
        return { success: true, error: null };
      }

      // Insert new completion
      const { error: insertError } = await supabase.from('user_lessons').insert({
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      // Update overall progress
      const completedLessons = await this.getCompletedLessons(userId);
      const allLessons = await this.getLessons();
      await progressService.updateOverallProgress(userId, completedLessons.length, allLessons.length);

      // Increment study time
      await progressService.incrementStudyTime(userId, 0.3);

      // Log activity
      const lesson = await this.getLessonById(lessonId);
      if (lesson) {
        await progressService.logActivity(userId, 'Completaste', lesson.title, 'lesson');
      }

      // Award points
      await progressService.addPoints(userId, 50);

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to mark lesson complete' };
    }
  },

  /**
   * Get user's lesson with completion status
   */
  async getUserLesson(userId: string, lessonId: string): Promise<UserLesson | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('user_lessons')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();

      if (error) throw error;
      return data as UserLesson;
    } catch (err) {
      return null;
    }
  },

  /**
   * Get progress for a specific section
   */
  async getSectionProgress(userId: string, sectionId: string): Promise<{
    completed: number;
    total: number;
    percentage: number;
  }> {
    const allLessons = await this.getLessons();
    const sectionLessons = allLessons.filter((l) => l.section_id === sectionId);
    const completedLessons = await this.getCompletedLessons(userId);
    const completedInSection = sectionLessons.filter((l) => completedLessons.includes(l.id));

    return {
      completed: completedInSection.length,
      total: sectionLessons.length,
      percentage: sectionLessons.length > 0 
        ? Math.round((completedInSection.length / sectionLessons.length) * 100)
        : 0,
    };
  },
};
