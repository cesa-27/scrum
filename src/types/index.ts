// ============================================
// TYPES & INTERFACES FOR DATABASE MODELS
// ============================================

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  overall_progress: number; // 0-100
  average_score: number; // 0-100
  study_time: number; // hours
  total_points: number;
  medals_count: number;
  current_streak: number; // days
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  section_id: string;
  section_title: string;
  section_description: string;
  section_icon: string;
  section_color: string;
  title: string;
  duration: string;
  content: LessonContent;
  order: number;
  created_at: string;
}

export interface LessonContent {
  intro: string;
  sections: {
    subtitle: string;
    text?: string;
    points?: string[];
  }[];
}

export interface UserLesson {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  total_questions: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer_index: number;
  feedback: string;
  incorrect_feedback: string;
  order: number;
  created_at: string;
}

export interface UserQuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number; // 0-100
  correct_answers: number;
  total_questions: number;
  answers: number[]; // array of selected answer indices
  completed_at: string;
  created_at: string;
}

export interface DragDropGame {
  id: string;
  title: string;
  description: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  game_type: 'roles-match' | 'events-order' | 'artifacts-match';
  game_data: any; // JSON data specific to each game type
  created_at: string;
}

export interface UserGameScore {
  id: string;
  user_id: string;
  game_id: string;
  score: number;
  perfect_score: boolean;
  completed_at: string;
  created_at: string;
}

export interface CaseSimulation {
  id: string;
  title: string;
  description: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  scenario: CaseScenario;
  created_at: string;
}

export interface CaseScenario {
  steps: CaseStep[];
}

export interface CaseStep {
  situation: string;
  question: string;
  options: CaseOption[];
}

export interface CaseOption {
  text: string;
  feedback: string;
  consequence: string;
  score: number; // 0-10
}

export interface UserCaseAttempt {
  id: string;
  user_id: string;
  case_id: string;
  decisions: number[]; // array of selected option indices
  total_score: number; // 0-100
  completed_at: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  color: string;
  requirement_type: 'lessons_completed' | 'quizzes_completed' | 'high_score' | 'streak' | 'total_points';
  requirement_value: number;
  points_reward: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  created_at: string;
}

export interface Resource {
  id: string;
  type: 'libro' | 'articulo' | 'glosario' | 'plantilla';
  title: string;
  description: string;
  author?: string;
  category?: string;
  pages?: number;
  source?: string;
  url?: string;
  read_time?: string;
  format?: string;
  size?: string;
  term?: string; // for glossary items
  definition?: string; // for glossary items
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string; // 'Completaste', 'Obtuviste', 'Desbloqueaste'
  item: string;
  type: 'lesson' | 'quiz' | 'medal' | 'game' | 'case';
  created_at: string;
}

// Dashboard specific data
export interface DashboardData {
  userProgress: UserProgress;
  recentActivity: ActivityLog[];
  progressData: { name: string; puntos: number }[];
  quizScores: { name: string; puntaje: number }[];
  achievements: {
    achievement: Achievement;
    earned: boolean;
  }[];
}
