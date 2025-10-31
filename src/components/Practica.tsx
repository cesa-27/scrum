import React, { useEffect, useState } from 'react';
import { Target, Gamepad2, BookOpen, ChevronRight, Trophy } from 'lucide-react';
import { QuizModule } from './practice/QuizModule';
import { DragDropGame } from './practice/DragDropGame';
import { CaseSimulator } from './practice/CaseSimulator';
import { supabase } from '../lib/supabase';

interface PracticaProps {
  // Si tu App padre los usa, los dejamos, pero ya NO serán la fuente de verdad.
  completedQuizzes?: string[];
  onCompleteQuiz?: (quizId: string, score: number) => void;
}

type AttemptRow = {
  quiz_id: string;
  score: number;
  completed_at: string;
};

export function Practica({ completedQuizzes, onCompleteQuiz }: PracticaProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const [totalQuizzes, setTotalQuizzes] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);

  // ✅ Completados por EL USUARIO autenticado
  const [completedQuizIds, setCompletedQuizIds] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const sections = [
    {
      id: 'quizzes',
      title: 'Quizzes Interactivos',
      description: 'Evalúa tu comprensión con preguntas de opción múltiple',
      icon: Target,
      color: '#3B82F6',
      count: `${totalQuizzes} quizzes disponibles`,
    },
    {
      id: 'dragdrop',
      title: 'Juegos de Arrastrar y Soltar',
      description: 'Empareja conceptos y practica tus conocimientos de forma divertida',
      icon: Gamepad2,
      color: '#10B981',
      count: '3 juegos disponibles',
    },
    {
      id: 'simulator',
      title: 'Simulador de Casos',
      description: 'Toma decisiones en escenarios reales de proyectos ágiles',
      icon: BookOpen,
      color: '#F59E0B',
      count: '4 casos disponibles',
    },
  ];

  // 🔄 Cargar métricas y completados del usuario desde Supabase
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // 0) Usuario actual
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr) throw authErr;
        if (!user) {
          // no logueado -> 0 en todo
          setTotalQuizzes(0);
          setCompletedCount(0);
          setAverageScore(0);
          setStreakDays(0);
          setCompletedQuizIds([]);
          setLoading(false);
          return;
        }

        // 1) Total de quizzes existentes
        {
          const { count, error } = await supabase
            .from('quizzes')
            .select('*', { count: 'exact', head: true });
          if (error) throw error;
          setTotalQuizzes(count ?? 0);
        }

        // 2) Intentos del usuario (todas sus filas)
        const { data: attempts, error: attErr } = await supabase
          .from('user_quiz_attempts')
          .select('quiz_id, score, completed_at')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: true });

        if (attErr) throw attErr;

        if (!attempts || attempts.length === 0) {
          setCompletedCount(0);
          setAverageScore(0);
          setStreakDays(0);
          setCompletedQuizIds([]);
          setLoading(false);
          return;
        }

        // 3) Nos quedamos con el ÚLTIMO intento por quiz (para promedio y completados)
        const byQuiz = new Map<string, AttemptRow>();
        for (const a of attempts) {
          const row: AttemptRow = {
            quiz_id: a.quiz_id,
            score: Number(a.score) || 0,
            completed_at: a.completed_at,
          };
          byQuiz.set(a.quiz_id, row); // el orden ya viene por fecha asc, la última iteración gana
        }

        const latestAttempts = Array.from(byQuiz.values());

        // a) Completados distintos
        setCompletedQuizIds(latestAttempts.map(a => a.quiz_id));
        setCompletedCount(latestAttempts.length);

        // b) Promedio del último intento por quiz
        const avg =
          latestAttempts.reduce((acc, r) => acc + r.score, 0) /
          (latestAttempts.length || 1);
        setAverageScore(Math.round(avg));

        // c) Racha (días consecutivos con algún intento)
        const dayKeys = Array.from(
          new Set(
            attempts.map(a =>
              new Date(a.completed_at).toISOString().split('T')[0]
            )
          )
        ).sort();
        let streak = dayKeys.length > 0 ? 1 : 0;
        for (let i = dayKeys.length - 1; i > 0; i--) {
          const d1 = new Date(dayKeys[i]);
          const d0 = new Date(dayKeys[i - 1]);
          const diffDays = (d1.getTime() - d0.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays <= 1.5) streak++;
          else break;
        }
        setStreakDays(streak);
      } catch (e) {
        console.error('Error cargando práctica:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 📝 Cuando un quiz termina, guardamos el intento en BD y refrescamos métricas
  const handleCompleteQuiz = async (quizId: string, score: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Inserta intento del usuario
      await supabase.from('user_quiz_attempts').insert({
        user_id: user.id,
        quiz_id: quizId,
        score,
        // Si tienes estos datos en QuizModule, pásalos aquí:
        correct_answers: null,
        total_questions: null,
        answers: [],
        completed_at: new Date().toISOString(),
      });

      // Vuelve a traer intentos para refrescar panel (mismo código del useEffect, resumido)
      const { data: attempts } = await supabase
        .from('user_quiz_attempts')
        .select('quiz_id, score, completed_at')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: true });

      if (attempts && attempts.length > 0) {
        const byQuiz = new Map<string, AttemptRow>();
        for (const a of attempts) {
          byQuiz.set(a.quiz_id, {
            quiz_id: a.quiz_id,
            score: Number(a.score) || 0,
            completed_at: a.completed_at,
          });
        }
        const latestAttempts = Array.from(byQuiz.values());
        setCompletedQuizIds(latestAttempts.map(a => a.quiz_id));
        setCompletedCount(latestAttempts.length);

        const avg =
          latestAttempts.reduce((acc, r) => acc + r.score, 0) /
          (latestAttempts.length || 1);
        setAverageScore(Math.round(avg));

        const dayKeys = Array.from(
          new Set(
            attempts.map(a =>
              new Date(a.completed_at).toISOString().split('T')[0]
            )
          )
        ).sort();
        let streak = dayKeys.length > 0 ? 1 : 0;
        for (let i = dayKeys.length - 1; i > 0; i--) {
          const d1 = new Date(dayKeys[i]);
          const d0 = new Date(dayKeys[i - 1]);
          const diffDays = (d1.getTime() - d0.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays <= 1.5) streak++; else break;
        }
        setStreakDays(streak);
      } else {
        setCompletedQuizIds([]);
        setCompletedCount(0);
        setAverageScore(0);
        setStreakDays(0);
      }

      // Notifica al padre si lo necesita
      onCompleteQuiz?.(quizId, score);
    } catch (e) {
      console.error('Error guardando intento de quiz:', e);
    }
  };

  // Navegación a secciones
  if (activeSection === 'quizzes') {
    return (
      <QuizModule
        onBack={() => setActiveSection(null)}
        // ✅ Ahora pasamos los completados del usuario actual (no globales)
        completedQuizzes={completedQuizIds}
        // ✅ Guardamos en BD al terminar un quiz
        onCompleteQuiz={handleCompleteQuiz}
      />
    );
  }
  if (activeSection === 'dragdrop') {
    return <DragDropGame onBack={() => setActiveSection(null)} />;
  }
  if (activeSection === 'simulator') {
    return <CaseSimulator onBack={() => setActiveSection(null)} />;
  }

  // Pantalla principal
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 style={{ color: '#1E293B', fontSize: '2.5rem', fontWeight: 700 }}>
            Práctica
          </h1>
          <p
            style={{
              color: '#64748B',
              fontSize: '1.125rem',
              marginTop: '0.5rem',
            }}
          >
            Pon a prueba tus conocimientos con ejercicios interactivos
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Completados */}
          <div
            className="bg-white rounded-xl p-6 border"
            style={{
              borderColor: '#E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#DBEAFE' }}
              >
                <Trophy className="w-5 h-5" style={{ color: '#3B82F6' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Quizzes Completados
                </p>
                <p
                  style={{
                    color: '#1E293B',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  {loading ? '...' : completedCount}
                </p>
              </div>
            </div>
          </div>

          {/* Promedio */}
          <div
            className="bg-white rounded-xl p-6 border"
            style={{
              borderColor: '#E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#D1FAE5' }}
              >
                <Target className="w-5 h-5" style={{ color: '#10B981' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Promedio General
                </p>
                <p
                  style={{
                    color: '#1E293B',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  {loading ? '...' : `${averageScore}%`}
                </p>
              </div>
            </div>
          </div>

          {/* Racha */}
          <div
            className="bg-white rounded-xl p-6 border"
            style={{
              borderColor: '#E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#FEF3C7' }}
              >
                <Gamepad2 className="w-5 h-5" style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  Racha Actual
                </p>
                <p
                  style={{
                    color: '#1E293B',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  {loading ? '...' : `${streakDays} días`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="bg-white rounded-xl p-6 border transition-all hover:shadow-lg text-left group"
                style={{
                  borderColor: '#E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: section.color + '20' }}
                >
                  <Icon className="w-7 h-7" style={{ color: section.color }} />
                </div>

                <h3
                  className="mb-2"
                  style={{
                    color: '#1E293B',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                  }}
                >
                  {section.title}
                </h3>

                <p
                  className="mb-4"
                  style={{
                    color: '#64748B',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                  }}
                >
                  {section.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#64748B' }}>
                    {section.count}
                  </span>
                  <ChevronRight
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    style={{ color: section.color }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Banner final */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                }}
              >
                ¿Listo para un desafío?
              </h3>
              <p style={{ opacity: 0.9 }}>
                Completa todos los ejercicios y desbloquea la medalla "Maestro
                Ágil"
              </p>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
        </div>
      </div>
    </div>
  );
}
