-- ============================================
-- SUPABASE DATABASE SCHEMA
-- Instructions: Run this SQL in your Supabase SQL Editor
-- to create all necessary tables and relationships
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER PROFILES TABLE
-- Extends Supabase auth.users with additional profile info
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER PROGRESS TABLE
-- Tracks overall user progress and statistics
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  overall_progress INTEGER DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100),
  average_score INTEGER DEFAULT 0 CHECK (average_score >= 0 AND average_score <= 100),
  study_time NUMERIC(10,2) DEFAULT 0 CHECK (study_time >= 0),
  total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
  medals_count INTEGER DEFAULT 0 CHECK (medals_count >= 0 AND medals_count <= 12),
  current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LESSONS TABLE
-- Stores all lesson content
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL,
  section_title TEXT NOT NULL,
  section_description TEXT NOT NULL,
  section_icon TEXT NOT NULL,
  section_color TEXT NOT NULL,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  content JSONB NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER LESSONS TABLE
-- Tracks which lessons each user has completed
-- ============================================
CREATE TABLE IF NOT EXISTS user_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ============================================
-- QUIZZES TABLE
-- Stores quiz metadata
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Básico', 'Intermedio', 'Avanzado')),
  total_questions INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- QUIZ QUESTIONS TABLE
-- Stores questions for each quiz
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id TEXT REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer_index INTEGER NOT NULL,
  feedback TEXT NOT NULL,
  incorrect_feedback TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER QUIZ ATTEMPTS TABLE
-- Tracks user quiz submissions and scores
-- ============================================
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id TEXT REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DRAG DROP GAMES TABLE
-- Stores drag-and-drop game definitions
-- ============================================
CREATE TABLE IF NOT EXISTS drag_drop_games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Básico', 'Intermedio', 'Avanzado')),
  game_type TEXT NOT NULL,
  game_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER GAME SCORES TABLE
-- Tracks user game completions and scores
-- ============================================
CREATE TABLE IF NOT EXISTS user_game_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT REFERENCES drag_drop_games(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  perfect_score BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CASE SIMULATIONS TABLE
-- Stores case study scenarios
-- ============================================
CREATE TABLE IF NOT EXISTS case_simulations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Básico', 'Intermedio', 'Avanzado')),
  scenario JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER CASE ATTEMPTS TABLE
-- Tracks user case simulation attempts
-- ============================================
CREATE TABLE IF NOT EXISTS user_case_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  case_id TEXT REFERENCES case_simulations(id) ON DELETE CASCADE NOT NULL,
  decisions JSONB NOT NULL,
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ACHIEVEMENTS TABLE
-- Stores available achievements/medals
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  points_reward INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER ACHIEVEMENTS TABLE
-- Tracks which achievements users have earned
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- RESOURCES TABLE
-- Stores books, articles, glossary, templates
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('libro', 'articulo', 'glosario', 'plantilla')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT,
  category TEXT,
  pages INTEGER,
  source TEXT,
  url TEXT,
  read_time TEXT,
  format TEXT,
  size TEXT,
  term TEXT,
  definition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOGS TABLE
-- Tracks user activities for dashboard feed
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  item TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lesson', 'quiz', 'medal', 'game', 'case', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_lessons_user_id ON user_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons_lesson_id ON user_lessons(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_quiz_id ON user_quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_game_scores_user_id ON user_game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_case_attempts_user_id ON user_case_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures users can only access their own data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_case_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User Progress Policies
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- User Lessons Policies
CREATE POLICY "Users can view their own lessons"
  ON user_lessons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lessons"
  ON user_lessons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Quiz Attempts Policies
CREATE POLICY "Users can view their own quiz attempts"
  ON user_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
  ON user_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Game Scores Policies
CREATE POLICY "Users can view their own game scores"
  ON user_game_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game scores"
  ON user_game_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Case Attempts Policies
CREATE POLICY "Users can view their own case attempts"
  ON user_case_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own case attempts"
  ON user_case_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Achievements Policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- Activity Logs Policies
CREATE POLICY "Users can view their own activity"
  ON activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public read access for content tables
CREATE POLICY "Anyone can read lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read games"
  ON drag_drop_games FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read cases"
  ON case_simulations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read resources"
  ON resources FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- FUNCTIONS FOR AUTOMATIC UPDATES
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL SEED DATA WOULD BE INSERTED HERE
-- Use the data from /constants/seeds.ts
-- ============================================

COMMENT ON TABLE user_profiles IS 'Extended user profile information';
COMMENT ON TABLE user_progress IS 'User progress tracking and statistics';
COMMENT ON TABLE lessons IS 'Lesson content and metadata';
COMMENT ON TABLE user_lessons IS 'User lesson completion tracking';
COMMENT ON TABLE quizzes IS 'Quiz metadata';
COMMENT ON TABLE quiz_questions IS 'Questions for each quiz';
COMMENT ON TABLE user_quiz_attempts IS 'User quiz submissions';
COMMENT ON TABLE drag_drop_games IS 'Drag and drop game definitions';
COMMENT ON TABLE user_game_scores IS 'User game scores';
COMMENT ON TABLE case_simulations IS 'Case study scenarios';
COMMENT ON TABLE user_case_attempts IS 'User case simulation attempts';
COMMENT ON TABLE achievements IS 'Available achievements/medals';
COMMENT ON TABLE user_achievements IS 'User earned achievements';
COMMENT ON TABLE resources IS 'Learning resources (books, articles, etc)';
COMMENT ON TABLE activity_logs IS 'User activity feed';
