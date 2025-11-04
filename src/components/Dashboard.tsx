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
  const [chartData, setChartData] = useState<{ name: string; puntos: number }[]>([]);
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

        /** 1️⃣ LEER progreso actual */
        const { data: progressRow } = await supabase
          .from('user_progress')
          .select('overall_progress, average_score, study_time, medals_count')
          .eq('user_id', user.id)
          .maybeSingle();

        setProgress({
          overall_progress: progressRow?.overall_progress ?? 0,
          average_score: progressRow?.average_score ?? 0,
          study_time: progressRow?.study_time ?? 0,
          medals_count: progressRow?.medals_count ?? 0,
        });

        /** 2️⃣ ACTIVIDAD RECIENTE */
        const { data: actRows } = await supabase
          .from('activity_logs')
          .select('action,item,created_at,type')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6);
        setRecentActivity(actRows ?? []);

        /** 3️⃣ ÚLTIMOS QUIZZES */
        const { data: attempts } = await supabase
          .from('user_quiz_attempts')
          .select('score, completed_at')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: true });

        const quizBars = (attempts ?? []).slice(-6).map((a, i) => ({
          name: `Quiz ${i + 1}`,
          puntaje: Number(a.score) || 0,
        }));
        setQuizScores(quizBars);

        /** 4️⃣ GRÁFICA DINÁMICA (diaria o semanal) */
        const now = new Date();
        const attemptsWithDates = (attempts ?? []).filter(a => a.completed_at);
        if (attemptsWithDates.length === 0) {
          setChartData([{ name: 'Sin datos', puntos: 0 }]);
        } else {
          const first = new Date(attemptsWithDates[0].completed_at);
          const diffDays = Math.max(1, Math.ceil((now.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)));

          if (diffDays <= 7) {
            // 🔹 Mostrar progreso diario
            const buckets = Array.from({ length: diffDays }).map((_, i) => ({
              name: `Día ${i + 1}`,
              puntos: 0,
            }));

            attemptsWithDates.forEach(a => {
              const d = new Date(a.completed_at);
              const diff = Math.floor((d.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
              buckets[diff].puntos += Number(a.score) || 0;
            });
            setChartData(buckets);
          } else {
            // 🔹 Mostrar progreso semanal
            const weekCount = Math.ceil(diffDays / 7);
            const buckets = Array.from({ length: weekCount }).map((_, i) => ({
              name: `Sem ${i + 1}`,
              puntos: 0,
            }));

            attemptsWithDates.forEach(a => {
              const d = new Date(a.completed_at);
              const diff = Math.floor((now.getTime() - d.getTime()) / (7 * 24 * 60 * 60 * 1000));
              const idx = Math.max(0, Math.min(weekCount - 1, weekCount - 1 - diff));
              buckets[idx].puntos += Number(a.score) || 0;
            });
            setChartData(buckets);
          }
        }

        /** 5️⃣ REGISTRAR TIEMPO DE ESTUDIO (seguro al cerrar) */
        const sessionStart = Date.now();
        const handleUnload = async () => {
          const sessionEnd = Date.now();
          const mins = Math.round((sessionEnd - sessionStart) / 60000);
          if (mins > 0) {
            await supabase
              .from('user_progress')
              .update({
                study_time: (progress.study_time ?? 0) + mins,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', user.id);
          }
        };
        window.addEventListener('beforeunload', handleUnload);

        /** 6️⃣ SUSCRIPCIÓN EN TIEMPO REAL */
        const subscription = supabase
          .channel('progress-changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'user_progress' },
            (payload: { new: any }) => {
              const newRow = payload.new as Partial<ProgressRow> & { user_id?: string };
              if (newRow.user_id === user.id) {
                setProgress(newRow as ProgressRow);
              }
            }
          )
          .subscribe();

        return () => {
          window.removeEventListener('beforeunload', handleUnload);
          supabase.removeChannel(subscription);
        };
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
      <div className="container mx-auto px-4 py-16 text-slate-600">Cargando tu panel…</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">¡Bienvenido de vuelta!</h1>
        <p className="text-lg text-slate-500 mt-2">Continúa tu viaje de aprendizaje </p>
      </div>

      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Progreso General" value={`${Math.round(progress.overall_progress ?? 0)}%`} icon={<Target />} color="#3B82F6" bg="#DBEAFE" />
        <StatCard title="Promedio Quizzes" value={`${Math.round(progress.average_score ?? 0)}%`} icon={<TrendingUp />} color="#10B981" bg="#D1FAE5" />
        <StatCard title="Tiempo de Estudio" value={fmtStudy(progress.study_time)} icon={<Clock />} color="#F59E0B" bg="#FEF3C7" />
        <StatCard title="Medallas Obtenidas" value={String(progress.medals_count ?? 0)} icon={<Award />} color="#8B5CF6" bg="#E9D5FF" />
      </div>

      {/* Gráfica y actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Tu progreso reciente</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Line type="monotone" dataKey="puntos" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Actividad Reciente</h3>
          <div className="space-y-4">
            {recentActivity.length === 0 && <p className="text-slate-500 text-sm">Sin actividad reciente.</p>}
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  backgroundColor: a.type === 'quiz' ? '#D1FAE5' :
                    a.type === 'medal' ? '#FEF3C7' : '#DBEAFE'
                }}>
                  {a.type === 'quiz' ? <Star color="#10B981" /> :
                    a.type === 'medal' ? <Trophy color="#F59E0B" /> :
                      <ChevronRight color="#3B82F6" />}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{a.action}</p>
                  <p className="text-xs text-slate-500">{fmt(a.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quizzes y CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Rendimiento en Quizzes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={quizScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="puntaje" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Sigue aprendiendo</h3>
          <p className="text-slate-500 mb-6">Practica y desbloquea más logros.</p>
          <button
            onClick={() => setActiveModule('aprende')}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105"
            style={{ backgroundColor: '#3B82F6' }}
          >
            Continuar Lección
          </button>
        </div>
      </div>
    </div>
  );
}

/** 🔹 Componente auxiliar para tarjetas */
function StatCard({ title, value, icon, color, bg }: { title: string; value: string; icon: React.ReactNode; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: bg }}>
        {React.cloneElement(icon as any, { color, size: 24 })}
      </div>
      <p className="text-sm text-slate-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
