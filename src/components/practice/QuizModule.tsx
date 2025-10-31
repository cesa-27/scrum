import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface QuizModuleProps {
  onBack: () => void;
  completedQuizzes: string[];
  onCompleteQuiz: (quizId: string, score: number) => void;
}

/** Tipos que vienen de la BD */
type DBQuiz = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado' | string;
  total_questions: number;
};

type DBQuestion = {
  id: string;
  quiz_id: string;
  question: string;
  options: string[]; // jsonb
  correct_answer_index: number;
  feedback: string;
  incorrect_feedback: string;
  order: number;
  created_at: string;
};

export function QuizModule({ onBack, completedQuizzes, onCompleteQuiz }: QuizModuleProps) {
  // Lista de quizzes
  const [quizzes, setQuizzes] = useState<DBQuiz[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);

  // Estado del quiz en curso
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [questions, setQuestions] = useState<DBQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState<boolean>(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // ---- TRACKING DE TIEMPO (en minutos) ----
  // Marca de inicio del estudio del quiz actual
  const sessionStartRef = useRef<number | null>(null);

  /** Suma minutos a user_progress.study_time */
  const addStudyMinutes = async (minutes: number) => {
    if (!minutes || minutes <= 0) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Leer valor actual
      const { data: row } = await supabase
        .from('user_progress')
        .select('study_time')
        .eq('user_id', user.id)
        .maybeSingle();

      const current = Number(row?.study_time ?? 0);
      const next = current + minutes;

      // Upsert con minutes acumulados
      await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: user.id,
            study_time: next,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      // Registrar actividad (opcional pero útil para el panel)
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: `Estudió ${minutes} min`,
        item: 'Quizzes',
        type: 'system',
      });
    } catch (e) {
      console.error('Error sumando minutos de estudio:', e);
    }
  };

  /** Cierra la sesión de estudio actual y acumula minutos */
  const flushStudyTime = async () => {
    if (sessionStartRef.current == null) return;
    const started = sessionStartRef.current;
    sessionStartRef.current = null;

    const elapsedMs = Date.now() - started;
    const minutes = Math.floor(elapsedMs / 60000); // redondeo hacia abajo
    if (minutes >= 1) {
      await addStudyMinutes(minutes);
    }
  };

  // Limpia el tiempo si el componente se desmonta con un quiz abierto
  useEffect(() => {
    return () => {
      // Nota: no podemos usar await en cleanup; lanzamos y dejamos que se resuelva
      flushStudyTime();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1) Cargar lista de quizzes desde Supabase
  useEffect(() => {
    (async () => {
      try {
        setLoadingList(true);
        const { data, error } = await supabase
          .from('quizzes')
          .select('id,title,description,difficulty,total_questions');

        if (error) throw error;
        setQuizzes(data ?? []);
      } catch (e) {
        console.error('Error cargando quizzes:', e);
        setQuizzes([]);
      } finally {
        setLoadingList(false);
      }
    })();
  }, []);

  // 2) Cargar preguntas cuando seleccionas un quiz
  const handleStartQuiz = async (quizId: string) => {
    try {
      // Si ya había otra sesión, flushear antes de empezar
      await flushStudyTime();

      setSelectedQuiz(quizId);
      setLoadingQuiz(true);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setAnswers([]);
      setQuizCompleted(false);

      const { data, error } = await supabase
        .from('quiz_questions')
        .select(
          'id, quiz_id, question, options, correct_answer_index, feedback, incorrect_feedback, "order", created_at'
        )
        .eq('quiz_id', quizId)
        .order('order', { ascending: true });

      if (error) throw error;
      setQuestions((data ?? []) as DBQuestion[]);

      // Iniciar conteo de estudio desde ahora
      sessionStartRef.current = Date.now();
    } catch (e) {
      console.error('Error cargando preguntas:', e);
      setQuestions([]);
    } finally {
      setLoadingQuiz(false);
    }
  };

  // Helpers
  const quizMeta = useMemo(() => quizzes.find(q => q.id === selectedQuiz) || null, [quizzes, selectedQuiz]);
  const totalQuestions = questions.length;
  const progressPct = totalQuestions ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;
  const currentQ = totalQuestions ? questions[currentQuestion] : null;
  const isCorrect = currentQ ? selectedAnswer === currentQ.correct_answer_index : false;

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showFeedback) setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setShowFeedback(true);
    setAnswers(prev => [...prev, selectedAnswer]);
  };

  // 3) Guardar intento al finalizar
  const saveAttempt = async (quizId: string, score: number, finalCorrect: number, totalQ: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const payload = {
        user_id: user.id,
        quiz_id: quizId,
        score,
        correct_answers: finalCorrect,
        total_questions: totalQ,
        answers: answers, // array de índices elegidos
        completed_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('user_quiz_attempts').insert(payload);
      if (error) throw error;

      // Actividad
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: `Completó el quiz`,
        item: quizId,
        type: 'quiz',
      });
    } catch (e) {
      console.error('Error guardando intento de quiz:', e);
    }
  };

  const handleBackFromQuiz = async () => {
    // Si el usuario se regresa sin terminar, también contamos el tiempo transcurrido
    await flushStudyTime();
    setSelectedQuiz(null);
    setQuizCompleted(false);
  };

  const handleNextQuestion = async () => {
    if (!currentQ || !quizMeta) return;

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Última pregunta -> calcular score
      const baseCorrect = answers.filter((ans, idx) => ans === questions[idx].correct_answer_index).length;
      const finalCorrect =
        selectedAnswer === questions[currentQuestion].correct_answer_index
          ? baseCorrect + 1
          : baseCorrect;

      const score = Math.round((finalCorrect / totalQuestions) * 100);

      // Guardar intento
      await saveAttempt(quizMeta.id, score, finalCorrect, totalQuestions);

      // Flushear tiempo de estudio de esta sesión (terminó el quiz)
      await flushStudyTime();

      // Notificar al padre para marcar como completado
      onCompleteQuiz(quizMeta.id, score);

      // Mostrar pantalla final
      setQuizCompleted(true);
    }
  };

  /** ------------- Renders ------------- */

  // Pantalla final
  if (quizCompleted && quizMeta && totalQuestions > 0) {
    const baseCorrect = answers.filter((ans, idx) => ans === questions[idx].correct_answer_index).length;
    const finalCorrect =
      selectedAnswer === questions[currentQuestion]?.correct_answer_index
        ? baseCorrect + 1
        : baseCorrect;

    const score = Math.round((finalCorrect / totalQuestions) * 100);
    const isPassing = score >= 70;

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div
            className="bg-white rounded-xl p-8 border text-center"
            style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: isPassing ? '#D1FAE5' : '#FEE2E2' }}
            >
              {isPassing ? (
                <Trophy className="w-10 h-10" style={{ color: '#10B981' }} />
              ) : (
                <AlertCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
              )}
            </div>

            <h2
              style={{ color: '#1E293B', fontSize: '2rem', fontWeight: 600, marginBottom: '1rem' }}
            >
              {isPassing ? '¡Excelente trabajo!' : '¡Sigue practicando!'}
            </h2>

            <p style={{ color: '#64748B', fontSize: '1.125rem', marginBottom: '2rem' }}>
              Obtuviste {finalCorrect} de {totalQuestions} respuestas correctas
            </p>

            <div
              className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
              style={{
                backgroundColor: isPassing ? '#D1FAE5' : '#FEE2E2',
                border: `8px solid ${isPassing ? '#10B981' : '#EF4444'}`,
              }}
            >
              <span
                style={{ color: isPassing ? '#065F46' : '#991B1B', fontSize: '2.5rem', fontWeight: 700 }}
              >
                {score}%
              </span>
            </div>

            {isPassing && (
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#D1FAE5' }}>
                <p style={{ color: '#065F46', fontWeight: 600 }}>
                  🎉 Has desbloqueado 50 puntos de experiencia
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSelectedQuiz(null);
                  setQuizCompleted(false);
                }}
                className="px-6 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: '#F1F5F9', color: '#1E293B', fontWeight: 600, border: '1px solid #E2E8F0' }}
              >
                Ver todos los quizzes
              </button>
              <button
                onClick={() => handleStartQuiz(quizMeta.id)}
                className="px-6 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', fontWeight: 600 }}
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla del quiz en curso
  if (selectedQuiz) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <button
            onClick={handleBackFromQuiz}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors"
            style={{ color: '#1E293B', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          {loadingQuiz ? (
            <div className="bg-white rounded-xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
              Cargando preguntas...
            </div>
          ) : !currentQ || !quizMeta ? (
            <div className="bg-white rounded-xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
              No hay preguntas para este quiz.
            </div>
          ) : (
            <>
              {/* Barra de progreso */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 600 }}>
                    Pregunta {currentQuestion + 1} de {totalQuestions}
                  </span>
                  <span style={{ color: '#3B82F6', fontSize: '0.875rem', fontWeight: 600 }}>
                    {Math.round(progressPct)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
                  <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: '#3B82F6' }} />
                </div>
              </div>

              {/* Pregunta */}
              <div
                className="bg-white rounded-xl p-8 border mb-6"
                style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
              >
                <h3 className="mb-6" style={{ color: '#1E293B', fontSize: '1.5rem', fontWeight: 600, lineHeight: '1.4' }}>
                  {currentQ.question}
                </h3>

                <div className="space-y-3">
                  {currentQ.options.map((option, index) => {
                    let borderColor = '#E2E8F0';
                    let backgroundColor = '#FFFFFF';
                    let textColor = '#1E293B';

                    if (showFeedback) {
                      if (index === currentQ.correct_answer_index) {
                        borderColor = '#10B981';
                        backgroundColor = '#D1FAE5';
                        textColor = '#065F46';
                      } else if (index === selectedAnswer) {
                        borderColor = '#EF4444';
                        backgroundColor = '#FEE2E2';
                        textColor = '#991B1B';
                      }
                    } else if (selectedAnswer === index) {
                      borderColor = '#3B82F6';
                      backgroundColor = '#DBEAFE';
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showFeedback}
                        className="w-full text-left p-4 rounded-lg border-2 transition-all"
                        style={{
                          borderColor,
                          backgroundColor,
                          cursor: showFeedback ? 'default' : 'pointer',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor }}>
                            {showFeedback && index === currentQ.correct_answer_index && (
                              <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} />
                            )}
                            {showFeedback && index === selectedAnswer && index !== currentQ.correct_answer_index && (
                              <XCircle className="w-4 h-4" style={{ color: '#EF4444' }} />
                            )}
                          </div>
                          <span style={{ color: textColor, fontWeight: 500 }}>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div
                    className="mt-6 p-4 rounded-lg"
                    style={{
                      backgroundColor: isCorrect ? '#D1FAE5' : '#FEE2E2',
                      border: `1px solid ${isCorrect ? '#10B981' : '#EF4444'}`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#065F46' }} />
                      ) : (
                        <XCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#991B1B' }} />
                      )}
                      <p style={{ color: isCorrect ? '#065F46' : '#991B1B', lineHeight: '1.6' }}>
                        {isCorrect ? currentQ.feedback : currentQ.incorrect_feedback}
                      </p>
                    </div>
                  </div>
                )}

                {/* Botones */}
                <div className="mt-6 flex gap-3">
                  {!showFeedback ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      className="flex-1 px-6 py-3 rounded-lg transition-all"
                      style={{
                        backgroundColor: selectedAnswer === null ? '#E2E8F0' : '#10B981',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        cursor: selectedAnswer === null ? 'not-allowed' : 'pointer',
                        opacity: selectedAnswer === null ? 0.5 : 1,
                      }}
                    >
                      Verificar Respuesta
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 px-6 py-3 rounded-lg transition-all"
                      style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', fontWeight: 600 }}
                    >
                      {currentQuestion < totalQuestions - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Listado de quizzes
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors"
          style={{ color: '#1E293B', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Práctica
        </button>

        <div className="mb-8">
          <h2 style={{ color: '#1E293B', fontSize: '2rem', fontWeight: 600 }}>Quizzes Interactivos</h2>
          <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem' }}>
            Evalúa tu comprensión con preguntas cuidadosamente diseñadas
          </p>
        </div>

        {loadingList ? (
          <div className="bg-white rounded-xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
            Cargando quizzes...
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border" style={{ borderColor: '#E2E8F0' }}>
            No hay quizzes disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const isCompleted = completedQuizzes.includes(quiz.id);
              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-xl p-6 border"
                  style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                      <Trophy className="w-6 h-6" style={{ color: '#3B82F6' }} />
                    </div>
                    {isCompleted && (
                      <div className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 600 }}>
                        Completado
                      </div>
                    )}
                  </div>

                  <h3 className="mb-2" style={{ color: '#1E293B', fontSize: '1.25rem', fontWeight: 600 }}>
                    {quiz.title}
                  </h3>

                  <p className="mb-4" style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {quiz.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: '#64748B' }}>
                    <span>{quiz.total_questions} preguntas</span>
                    <span>•</span>
                    <span>{quiz.difficulty}</span>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="w-full px-4 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', fontWeight: 600 }}
                  >
                    {isCompleted ? 'Reintentar' : 'Comenzar Quiz'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
