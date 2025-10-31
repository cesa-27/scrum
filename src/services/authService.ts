import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '../types';

export const authService = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      // Mock login for development
      if (email.includes('@') && password.length >= 6) {
        const mockUser: User = {
          id: 'mock-user-id',
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return { user: mockUser, error: null };
      }
      return { user: null, error: 'Invalid credentials' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'No user returned' };
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at || data.user.created_at,
      };

      return { user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Login failed' };
    }
  },

  /**
   * Register new user
   */
  async register(
    email: string,
    password: string,
    fullName?: string
  ): Promise<{ user: User | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      // Mock registration for development
      if (email.includes('@') && password.length >= 6) {
        const mockUser: User = {
          id: 'mock-user-id',
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return { user: mockUser, error: null };
      }
      return { user: null, error: 'Invalid data' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'No user returned' };
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at || data.user.created_at,
      };

      // Create user profile and initial progress
      await this.initializeUserData(user.id, fullName);

      return { user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Registration failed' };
    }
  },

  /**
   * Logout current user
   */
  async logout(): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      return { error: error ? error.message : null };
    } catch (err: any) {
      return { error: err.message || 'Logout failed' };
    }
  },

  /**
   * Get current session
   */
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      // Return mock user if in development
      const mockAuth = localStorage.getItem('isAuthenticated');
      if (mockAuth === 'true') {
        return {
          id: 'mock-user-id',
          email: 'demo@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return null;
    }

    try {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session?.user) {
        return null;
      }

      return {
        id: data.session.user.id,
        email: data.session.user.email!,
        created_at: data.session.user.created_at,
        updated_at: data.session.user.updated_at || data.session.user.created_at,
      };
    } catch (err) {
      return null;
    }
  },

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error: error ? error.message : null };
    } catch (err: any) {
      return { error: err.message || 'Password reset failed' };
    }
  },

  /**
   * Initialize user data (profile and progress) after registration
   */
  async initializeUserData(userId: string, fullName?: string): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      // Create user profile
      await supabase.from('user_profiles').insert({
        user_id: userId,
        full_name: fullName || null,
      });

      // Create initial progress
      await supabase.from('user_progress').insert({
        user_id: userId,
        overall_progress: 0,
        average_score: 0,
        study_time: 0,
        total_points: 0,
        medals_count: 0,
        current_streak: 0,
      });

      // Create initial activity log
      await supabase.from('activity_logs').insert({
        user_id: userId,
        action: 'Se unió',
        item: 'Plataforma de Aprendizaje Ágil',
        type: 'system',
      });
    } catch (err) {
      console.error('Error initializing user data:', err);
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        };
        callback(user);
      } else {
        callback(null);
      }
    });

    return { unsubscribe: data.subscription.unsubscribe };
  },
};
