import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Calendar,
  Package,
  CheckCircle,
  ChevronRight,
  Play,
  FileText,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AprendeProps {
  completedLessons: string[];
  onCompleteLesson: (lessonId: string) => void;
}

export function Aprende({ completedLessons, onCompleteLesson }: AprendeProps) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sections = [
    {
      id: 'fundamentos',
      title: 'Fundamentos Ágiles',
      description: 'Comprende los principios y valores que sustentan las metodologías ágiles',
      icon: BookOpen,
      color: '#3B82F6',
      lessons: [
        {
          id: 'fundamentos-1',
          title: '¿Qué es Agile?',
          duration: '15 min',
          content: {
            intro: 'Agile es un conjunto de valores y principios para el desarrollo de software que enfatiza la flexibilidad, la colaboración y la entrega continua de valor.',
            sections: [
              {
                subtitle: 'Origen del Movimiento Ágil',
                text: 'En 2001, 17 desarrolladores de software se reunieron en Snowbird, Utah, para discutir métodos de desarrollo más ligeros. De esta reunión surgió el Manifiesto Ágil.',
              },
              {
                subtitle: 'Los 4 Valores del Manifiesto Ágil',
                points: [
                  'Individuos e interacciones sobre procesos y herramientas',
                  'Software funcionando sobre documentación extensiva',
                  'Colaboración con el cliente sobre negociación contractual',
                  'Respuesta ante el cambio sobre seguir un plan',
                ],
              },
              {
                subtitle: '12 Principios Clave',
                text: 'Los principios ágiles incluyen: satisfacer al cliente mediante entregas tempranas y continuas, aceptar cambios en cualquier etapa, entregar software frecuentemente, colaboración diaria entre negocio y desarrollo, construir proyectos alrededor de individuos motivados, entre otros.',
              },
            ],
          },
        },
        {
          id: 'fundamentos-2',
          title: 'Ágil vs Tradicional',
          duration: '12 min',
          content: {
            intro: 'Comprender las diferencias fundamentales entre metodologías ágiles y tradicionales es clave para elegir el enfoque correcto.',
            sections: [
              {
                subtitle: 'Metodología en Cascada (Tradicional)',
                text: 'Enfoque secuencial donde cada fase debe completarse antes de iniciar la siguiente: Requisitos → Diseño → Desarrollo → Pruebas → Despliegue. Es rígido y poco flexible al cambio.',
              },
              {
                subtitle: 'Metodología Ágil',
                text: 'Enfoque iterativo e incremental. El trabajo se divide en ciclos cortos (sprints) que producen incrementos funcionales del producto. Permite adaptación continua.',
              },
              {
                subtitle: 'Comparación Clave',
                points: [
                  'Planificación: Cascada (completa al inicio) vs Ágil (continua)',
                  'Cambios: Cascada (costosos) vs Ágil (bienvenidos)',
                  'Entregas: Cascada (al final) vs Ágil (frecuentes)',
                  'Riesgo: Cascada (alto al final) vs Ágil (distribuido)',
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: 'scrum',
      title: 'Scrum',
      description: 'Domina el framework ágil más popular del mundo',
      icon: Users,
      color: '#10B981',
      lessons: [
        {
          id: 'scrum-1',
          title: 'Roles en Scrum',
          duration: '20 min',
          content: {
            intro: 'Scrum define tres roles principales, cada uno con responsabilidades específicas y complementarias.',
            sections: [
              {
                subtitle: 'Product Owner (PO)',
                text: 'El PO es el responsable de maximizar el valor del producto. Define el "qué" se debe construir.',
                points: [
                  'Gestiona el Product Backlog (priorización)',
                  'Define criterios de aceptación',
                  'Toma decisiones sobre el producto',
                  'Representa a los stakeholders',
                  'Acepta o rechaza el trabajo completado',
                ],
              },
              {
                subtitle: 'Scrum Master (SM)',
                text: 'El SM es el facilitador del proceso Scrum. Protege al equipo y asegura que se sigan las prácticas ágiles.',
                points: [
                  'Facilita eventos Scrum',
                  'Elimina impedimentos',
                  'Coaching al equipo y la organización',
                  'Protege al equipo de interrupciones',
                  'Promueve la mejora continua',
                ],
              },
              {
                subtitle: 'Development Team (Equipo de Desarrollo)',
                text: 'Profesionales que realizan el trabajo de entregar el incremento del producto.',
                points: [
                  'Autoorganizados y multifuncionales',
                  'Tamaño ideal: 3-9 personas',
                  'Comprometidos con el Sprint Goal',
                  'Responsables de la calidad',
                  'Estiman su propio trabajo',
                ],
              },
            ],
          },
        },
      ],
    },
  ];

  // Guardar en Supabase cuando se completa
  const handleCompleteLesson = async (lessonId: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      if (!user) throw new Error('No autenticado');

      const { error } = await supabase
        .from('user_lessons')
        .upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) throw error;
      onCompleteLesson(lessonId);
    } catch (e: any) {
      setErrorMsg(e.message || 'Error guardando lección');
    } finally {
      setLoading(false);
      setSelectedLesson(null);
    }
  };

  if (selectedLesson) {
    let currentLesson: any = null;
    let sectionColor = '#3B82F6';

    for (const section of sections) {
      const lesson = section.lessons.find((l) => l.id === selectedLesson);
      if (lesson) {
        currentLesson = lesson;
        sectionColor = section.color;
        break;
      }
    }

    if (!currentLesson) return null;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <button
            onClick={() => setSelectedLesson(null)}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Lecciones
          </button>

          <div className="bg-white rounded-xl p-8 border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: sectionColor + '20' }}
              >
                <Play className="w-6 h-6" style={{ color: sectionColor }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {currentLesson.title}
                </h1>
                <p className="text-sm text-slate-500">
                  Duración estimada: {currentLesson.duration}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <p className="text-lg leading-relaxed text-slate-800">
                {currentLesson.content.intro}
              </p>

              {currentLesson.content.sections.map((section: any, i: number) => (
                <div key={i}>
                  <h3 className="text-xl font-semibold mb-3 text-slate-800">
                    {section.subtitle}
                  </h3>
                  {section.text && (
                    <p className="text-slate-700 mb-3">{section.text}</p>
                  )}
                  {section.points && (
                    <ul className="space-y-2 ml-6 list-none">
                      {section.points.map((point: string, j: number) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle
                            className="w-5 h-5 mt-1 flex-shrink-0"
                            style={{ color: sectionColor }}
                          />
                          <span className="text-slate-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-between items-center border-t pt-4">
              {completedLessons.includes(selectedLesson) ? (
                <div className="flex items-center gap-2 text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Lección completada</span>
                </div>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => handleCompleteLesson(selectedLesson)}
                  className="px-6 py-3 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: sectionColor }}
                >
                  {loading ? 'Guardando...' : 'Marcar como Completada'}
                </button>
              )}
            </div>

            {errorMsg && (
              <p className="mt-3 text-red-600 font-medium">{errorMsg}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Aprende</h1>
        <p className="text-slate-600 mb-8">
          Explora lecciones interactivas sobre metodologías ágiles
        </p>

        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const completedInSection = section.lessons.filter((l) =>
              completedLessons.includes(l.id)
            ).length;
            const progress = (completedInSection / section.lessons.length) * 100;

            return (
              <div
                key={section.id}
                className="bg-white rounded-xl p-6 border shadow-sm"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: section.color + '20' }}
                  >
                    <Icon className="w-7 h-7" style={{ color: section.color }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-slate-800">
                      {section.title}
                    </h2>
                    <p className="text-slate-600 mb-2">{section.description}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${progress}%`, backgroundColor: section.color }}
                        />
                      </div>
                      <span className="text-sm text-slate-600 font-semibold">
                        {completedInSection}/{section.lessons.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.lessons.map((lesson) => {
                    const done = completedLessons.includes(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson.id)}
                        className={`text-left p-4 rounded-lg border hover:shadow-md transition-all ${
                          done ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-slate-800">
                            {lesson.title}
                          </h3>
                          {done && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <div className="flex justify-between items-center text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {lesson.duration}
                          </div>
                          <ChevronRight
                            className="w-5 h-5"
                            style={{ color: section.color }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
