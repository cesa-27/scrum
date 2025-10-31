import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, Target, Award, ChevronRight, Trophy, Star } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  setActiveModule: (module: string) => void;
}

type ActivityItem = {
  action: string;
  item: string | null;
  created_at: string;
  type: 'lesson' | 'quiz' | 'medal' | 'case' | 'game' | 'system';
};

type ProgressRow = {
  overall_progress: number | null;
  average_score: number | null;
  study_time: number | null; // MINUTOS
  medals_count: number | null;
};

export function Dashboard({ setActiveModule }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [quizScores, setQuizScores] = useState<{ name: string; puntaje: number }[]>([]);
  const [weeklyPoints, setWeeklyPoints] = useState<{ name: string; puntos: number }[]>([]);
  const [progress, setProgress] = useState<ProgressRow>({
    overall_progress: 0,
    average_score: 0,
    study_time: 0,
    medals_count: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr) throw authErr;
        if (!user) { setLoading(false); return; }

        /** 1) LEER INTENTOS (para barras y fallback promedio) */
        const { data: attempts, error: attErr } = await supabase
          .from('user_quiz_attempts')
          .select('quiz_id, score, completed_at')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: true });
        if (attErr) throw attErr;

        const avgFromAttempts =
          attempts && attempts.length
            ? Math.round(attempts.reduce((sum, a) => sum + (Number(a.score) || 0), 0) / attempts.length)
            : 0;

        const quizBars = (attempts ?? []).slice(-6).map((a, i) => ({
          name: `Quiz ${Math.max(1, (attempts?.length ?? 0) - Math.min(5, (attempts?.length ?? 0) - 1) + i)}`,
          puntaje: Number(a.score) || 0,
        }));
        setQuizScores(quizBars);

        /** 2) ACTIVIDAD RECIENTE (primero intentamos activity_logs) */
        const { data: actRows, error: actErr } = await supabase
          .from('activity_logs')
          .select('action,item,created_at,type')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6);
        if (actErr) throw actErr;

        let activity: ActivityItem[] = (actRows ?? []) as ActivityItem[];

        /** 2b) Si no hay activity_logs suficientes, la reconstruimos desde quizzes y lecciones */
        if (!activity || activity.length < 6) {
          // ---- desde quizzes ----
          const lastAttempts = (await supabase
            .from('user_quiz_attempts')
            .select('quiz_id, score, completed_at')
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false })
            .limit(10)
          ).data ?? [];

          const quizIds = Array.from(new Set(lastAttempts.map(a => a.quiz_id).filter(Boolean)));
          const quizTitleById = new Map<string, string>();
          if (quizIds.length) {
            const quizzesLookup = (await supabase
              .from('quizzes')
              .select('id,title')
              .in('id', quizIds as string[])
            ).data ?? [];
            quizzesLookup.forEach(q => quizTitleById.set(q.id, q.title));
          }

          const quizActivities: ActivityItem[] = lastAttempts.map(a => ({
            action: `Completó el quiz "${quizTitleById.get(a.quiz_id as string) ?? a.quiz_id}" con ${a.score}%`,
            item: null,
            created_at: a.completed_at as string,
            type: 'quiz',
          }));

          // ---- desde lecciones ----
          const lastLessons = (await supabase
            .from('user_lessons')
            .select('lesson_id, completed, completed_at')
            .eq('user_id', user.id)
            .eq('completed', true)
            .order('completed_at', { ascending: false })
            .limit(10)
          ).data ?? [];

          const lessonIds = Array.from(new Set(lastLessons.map(l => l.lesson_id).filter(Boolean)));
          const lessonTitleById = new Map<string, string>();
          if (lessonIds.length) {
            const lessonsLookup = (await supabase
              .from('lessons')
              .select('id,title')
              .in('id', lessonIds as string[])
            ).data ?? [];
            lessonsLookup.forEach(l => lessonTitleById.set(l.id, l.title));
          }

          const lessonActivities: ActivityItem[] = lastLessons
            .filter(l => l.completed_at)
            .map(l => ({
              action: `Completó la lección "${lessonTitleById.get(l.lesson_id as string) ?? l.lesson_id}"`,
              item: null,
              created_at: l.completed_at as string,
              type: 'lesson',
            }));

          // Mezclar, ordenar por fecha desc y tomar 6
          const merged = [...activity, ...quizActivities, ...lessonActivities]
            .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
            .slice(0, 6);

          activity = merged;
        }

        setRecentActivity(activity);

        /** 3) FALLBACK de PROGRESO GENERAL desde lecciones */
        const { count: totalLessons, error: totErr } = await supabase
          .from('lessons')
          .select('id', { count: 'exact', head: true });
        if (totErr) throw totErr;

        const { count: completedLessons, error: compErr } = await supabase
          .from('user_lessons')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('completed', true);
        if (compErr) throw compErr;

        const overallFromLessons =
          (totalLessons ?? 0) > 0
            ? Math.round(((completedLessons ?? 0) / (totalLessons ?? 0)) * 100)
            : 0;

        /** 4) LEER/CREAR user_progress */
        const { data: progressRow, error: progErr } = await supabase
          .from('user_progress')
          .select('overall_progress, average_score, study_time, medals_count')
          .eq('user_id', user.id)
          .maybeSingle();
        if (progErr) throw progErr;

        const mergedProgress: ProgressRow = {
          overall_progress: (progressRow?.overall_progress ?? undefined) != null
            ? progressRow!.overall_progress
            : overallFromLessons,
          average_score: (progressRow?.average_score ?? 0) || avgFromAttempts,
          study_time: progressRow?.study_time ?? 0, // en MINUTOS
          medals_count: progressRow?.medals_count ?? 0,
        };

        const needsUpsert =
          !progressRow ||
          (progressRow.overall_progress ?? 0) !== (mergedProgress.overall_progress ?? 0) ||
          (progressRow.average_score ?? 0) !== (mergedProgress.average_score ?? 0);

        if (needsUpsert) {
          const { error: upErr } = await supabase
            .from('user_progress')
            .upsert(
              {
                user_id: user.id,
                overall_progress: mergedProgress.overall_progress ?? 0,
                average_score: mergedProgress.average_score ?? 0,
                study_time: mergedProgress.study_time ?? 0,
                medals_count: mergedProgress.medals_count ?? 0,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' }
            );
          if (upErr) console.error('UPsert user_progress falló (revisa RLS):', upErr.message);
        }

        setProgress(mergedProgress);

        /** 5) PROGRESO POR SEMANA (últimas 6) */
        const now = new Date();
        const SIX_WEEKS_MS = 6 * 7 * 24 * 60 * 60 * 1000;
        const startRange = new Date(now.getTime() - SIX_WEEKS_MS);

        const { data: lastAttemptsForWeeks } = await supabase
          .from('user_quiz_attempts')
          .select('score, completed_at')
          .eq('user_id', user.id)
          .gte('completed_at', startRange.toISOString())
          .lte('completed_at', now.toISOString());

        const buckets: { name: string; puntos: number }[] = Array.from({ length: 6 }).map((_, i) => ({
          name: `Sem ${i + 1}`,
          puntos: 0,
        }));

        (lastAttemptsForWeeks ?? []).forEach(a => {
          const d = new Date(a.completed_at as string);
          const diffW = Math.floor((now.getTime() - d.getTime()) / (7 * 24 * 60 * 60 * 1000)); // 0..5
          const idx = Math.max(0, Math.min(5, 5 - diffW)); // más reciente a la derecha
          buckets[idx].puntos += Number(a.score) || 0;
        });
        setWeeklyPoints(buckets);
      } catch (e) {
        console.error('Error cargando dashboard:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = (iso: string) => new Date(iso).toLocaleString();
  const fmtStudy = (mins: number | null | undefined) => {
    const m = Math.max(0, Number(mins || 0));
    const h = Math.floor(m / 60);
    const r = m % 60;
    return `${h}h ${r}m`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-slate-600">Cargando tu panel…</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 style={{ color: '#1E293B', fontSize: '2.5rem', fontWeight: 700 }}>
          ¡Bienvenido de vuelta!
        </h1>
        <p style={{ color: '#64748B', fontSize: '1.125rem', marginTop: '0.5rem' }}>
          Continúa tu viaje de aprendizaje en metodologías ágiles
        </p>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#DBEAFE' }}>
            <Target className="w-6 h-6" style={{ color: '#3B82F6' }} />
          </div>
          <p className="text-sm mb-1" style={{ color: '#64748B' }}>Progreso General</p>
          <p className="text-3xl" style={{ color: '#1E293B', fontWeight: 700 }}>
            {Math.round(progress.overall_progress ?? 0)}%
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#D1FAE5' }}>
            <TrendingUp className="w-6 h-6" style={{ color: '#10B981' }} />
          </div>
          <p className="text-sm mb-1" style={{ color: '#64748B' }}>Promedio Quizzes</p>
          <p className="text-3xl" style={{ color: '#1E293B', fontWeight: 700 }}>
            {Math.round(progress.average_score ?? 0)}%
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#FEF3C7' }}>
            <Clock className="w-6 h-6" style={{ color: '#F59E0B' }} />
          </div>
          <p className="text-sm mb-1" style={{ color: '#64748B' }}>Tiempo de Estudio</p>
          <p className="text-3xl" style={{ color: '#1E293B', fontWeight: 700 }}>
            {fmtStudy(progress.study_time)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#E9D5FF' }}>
            <Award className="w-6 h-6" style={{ color: '#8B5CF6' }} />
          </div>
          <p className="text-sm mb-1" style={{ color: '#64748B' }}>Medallas Obtenidas</p>
          <p className="text-3xl" style={{ color: '#1E293B', fontWeight: 700 }}>
            {Number(progress.medals_count ?? 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progreso por semanas */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 className="mb-6" style={{ color: '#1E293B', fontSize: '1.5rem', fontWeight: 600 }}>
            Tu Progreso (últimas 6 semanas)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyPoints.length ? weeklyPoints : [{ name: '—', puntos: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                }}
              />
              <Line type="monotone" dataKey="puntos" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Actividad */}
        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 className="mb-6" style={{ color: '#1E293B', fontSize: '1.5rem', fontWeight: 600 }}>
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            {recentActivity.length === 0 && (
              <div className="text-sm text-slate-500">Sin actividad reciente aún.</div>
            )}
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor:
                      activity.type === 'medal' ? '#FEF3C7' :
                      activity.type === 'quiz' ? '#D1FAE5' : '#DBEAFE',
                  }}
                >
                  {activity.type === 'medal' ? (
                    <Trophy className="w-5 h-5" style={{ color: '#F59E0B' }} />
                  ) : activity.type === 'quiz' ? (
                    <Star className="w-5 h-5" style={{ color: '#10B981' }} />
                  ) : (
                    <ChevronRight className="w-5 h-5" style={{ color: '#3B82F6' }} />
                  )}
                </div>
                <div className="flex-1">
                  <p style={{ color: '#1E293B', fontWeight: 500 }}>{activity.action}</p>
                  <p className="text-sm" style={{ color: '#64748B' }}>{activity.item ?? '—'}</p>
                  <p className="text-xs mt-1" style={{ color: '#64748B' }}>{fmt(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Puntajes últimos quizzes */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 className="mb-6" style={{ color: '#1E293B', fontSize: '1.5rem', fontWeight: 600 }}>
            Rendimiento en Quizzes
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={quizScores.length ? quizScores : [{ name: '—', puntaje: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="puntaje" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 className="mb-4" style={{ color: '#1E293B', fontSize: '1.5rem', fontWeight: 600 }}>
            Sigue aprendiendo
          </h3>
          <p className="mb-6" style={{ color: '#64748B' }}>
            Practica y desbloquea más logros.
          </p>
          <button
            onClick={() => setActiveModule('aprende')}
            className="px-6 py-3 rounded-lg transition-transform hover:scale-105"
            style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', fontWeight: 600 }}
          >
            Continuar Lección
          </button>
        </div>
      </div>
    </div>
  );
}
