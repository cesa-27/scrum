import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle, RefreshCw, BookOpen } from 'lucide-react';

interface CaseSimulatorProps {
  onBack: () => void;
}

export function CaseSimulator({ onBack }: CaseSimulatorProps) {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [decisions, setDecisions] = useState<number[]>([]);
  const [caseCompleted, setCaseCompleted] = useState(false);

  const cases = [
    {
      id: 'case1',
      title: 'Crisis en el Sprint',
      description: 'El Product Owner quiere agregar una funcionalidad urgente a mitad del Sprint',
      difficulty: 'Intermedio',
      scenario: {
        steps: [
          {
            situation:
              'Estás en el día 5 de un Sprint de 2 semanas. El Product Owner te llama urgentemente: "Nuestro cliente más importante necesita una nueva funcionalidad de reportes para mañana. Es crítico para renovar el contrato. Necesito que el equipo la desarrolle HOY."',
            question: '¿Cuál es tu respuesta como Scrum Master?',
            options: [
              {
                text: 'Acepto inmediatamente y pido al equipo que trabaje horas extra para completarlo',
                feedback:
                  'Incorrecto. Esto viola el Sprint Goal y la autoorganización del equipo. Además, crear presión para horas extra es insostenible.',
                consequence:
                  'El equipo se siente presionado y desmotivado. El Sprint Goal original se ve comprometido.',
                score: 0,
              },
              {
                text: 'Explico que no podemos cambiar el Sprint Backlog, pero podemos discutirlo en el siguiente Sprint Planning',
                feedback:
                  'Buena respuesta. Proteges el Sprint actual y el Sprint Goal. Sin embargo, podrías explorar si realmente es tan urgente.',
                consequence:
                  'El PO entiende la situación. Acuerdan revisar la prioridad en el siguiente Sprint.',
                score: 7,
              },
              {
                text: 'Propongo una reunión urgente con el PO y el equipo para evaluar el impacto y considerar cancelar el Sprint si es necesario',
                feedback:
                  '¡Excelente! Balanceas la urgencia del negocio con los principios de Scrum. La cancelación del Sprint es una opción válida cuando el Sprint Goal se vuelve obsoleto.',
                consequence:
                  'Realizan una reunión. El equipo y el PO evalúan el impacto juntos.',
                score: 10,
              },
            ],
          },
          {
            situation:
              'En la reunión, el equipo estima que la funcionalidad requiere 3 días de trabajo. El Sprint actual termina en 5 días y ya tienen comprometido trabajo que completa el Sprint Goal.',
            question: '¿Qué propones?',
            options: [
              {
                text: 'Cancelar el Sprint actual, agregar la funcionalidad al nuevo Sprint y empezar mañana',
                feedback:
                  'Correcto, pero solo si el Sprint Goal actual ya no tiene valor. Cancela un Sprint es una decisión seria que debe evaluarse cuidadosamente.',
                consequence:
                  'Se cancela el Sprint. El trabajo "Done" se revisa. Se inicia un nuevo Sprint con la funcionalidad urgente priorizada.',
                score: 8,
              },
              {
                text: 'Completar el Sprint actual (5 días) y hacer el reporte en el siguiente Sprint con alta prioridad',
                feedback:
                  'Buena opción si el Sprint Goal actual sigue siendo valioso. Respeta el ritmo del equipo.',
                consequence:
                  'El equipo completa el Sprint actual con éxito. En el siguiente Sprint, priorizan el reporte y lo completan en 3 días.',
                score: 9,
              },
              {
                text: 'Dividir el equipo: algunos continúan el Sprint actual, otros trabajan en el reporte',
                feedback:
                  'Incorrecto. Dividir al equipo destruye la colaboración y el foco. Es una anti-práctica de Scrum.',
                consequence:
                  'El equipo se fragmenta. Ambos trabajos avanzan lentamente. La calidad disminuye.',
                score: 2,
              },
            ],
          },
          {
            situation:
              'El cliente acepta esperar al siguiente Sprint. Sin embargo, el PO dice: "Necesito garantías de que estará listo en 3 días. Pueden comprometerse?"',
            question: '¿Cómo respondes?',
            options: [
              {
                text: 'Sí, el equipo se compromete a 3 días',
                feedback:
                  'Incorrecto. Solo el Development Team puede comprometerse. El Scrum Master no habla por ellos.',
                consequence:
                  'El equipo se siente presionado. No se les consultó y ahora tienen un compromiso que no hicieron.',
                score: 1,
              },
              {
                text: 'Es decisión del Development Team. Ellos estimarán y se comprometerán en el Sprint Planning',
                feedback:
                  '¡Perfecto! Respetas la autoorganización del equipo y el proceso de Scrum.',
                consequence:
                  'En el Sprint Planning, el equipo revisa la User Story, la refina, y hace su propio compromiso basado en su velocidad.',
                score: 10,
              },
              {
                text: 'Probablemente sí, basándome en la velocidad histórica del equipo',
                feedback:
                  'Aceptable, pero ideal que el equipo mismo lo confirme en lugar de que tú hables por ellos.',
                consequence:
                  'Das una expectativa basada en datos, pero aclaras que el compromiso final es del equipo.',
                score: 7,
              },
            ],
          },
        ],
      },
    },
    {
      id: 'case2',
      title: 'Conflicto de Roles',
      description:
        'Tensión entre el Product Owner y el Development Team sobre prioridades',
      difficulty: 'Avanzado',
      scenario: {
        steps: [
          {
            situation:
              'Durante el Sprint Planning, el Product Owner presenta las User Stories más prioritarias. El Development Team las cuestiona: "Estas no aportan valor real al usuario. Hay deuda técnica crítica que debemos resolver primero o el sistema colapsará."',
            question: 'Como Scrum Master, ¿cuál es tu acción?',
            options: [
              {
                text: 'Apoyo al equipo. La deuda técnica debe priorizarse',
                feedback:
                  'Incorrecto. El PO decide el QUÉ. Tu rol es facilitar, no decidir prioridades.',
                consequence:
                  'El PO se molesta. Siente que su autoridad es cuestionada.',
                score: 3,
              },
              {
                text: 'Apoyo al PO. Él decide las prioridades del Product Backlog',
                feedback:
                  'Parcialmente correcto, pero ignoras una preocupación técnica legítima del equipo.',
                consequence:
                  'El equipo se frustra. Sienten que sus preocupaciones técnicas no son escuchadas.',
                score: 5,
              },
              {
                text: 'Facilito una conversación donde el equipo explica el impacto técnico y el PO explica el valor de negocio',
                feedback:
                  '¡Excelente! Tu rol es facilitar la comunicación y entendimiento mutuo.',
                consequence:
                  'Ambas partes exponen sus puntos. Comienzan a entenderse mutuamente.',
                score: 10,
              },
            ],
          },
          {
            situation:
              'El equipo explica: "Si no refactorizamos este módulo, cada nueva funcionalidad tomará el doble de tiempo. Ya estamos viendo el impacto." El PO responde: "Entiendo, pero tenemos compromisos con el cliente que no podemos romper."',
            question: '¿Qué solución propones?',
            options: [
              {
                text: 'Que el equipo dedique 20% de cada Sprint a deuda técnica sin consultar al PO',
                feedback:
                  'Incorrecto. Esto excluye al PO de decisiones del producto. La deuda técnica debe estar en el Product Backlog.',
                consequence:
                  'Se genera desconfianza. El PO siente que pierde control.',
                score: 2,
              },
              {
                text: 'Agregar la deuda técnica como User Stories en el Product Backlog para que el PO las priorice',
                feedback:
                  '¡Perfecto! La deuda técnica debe ser visible y priorizada como cualquier otro ítem.',
                consequence:
                  'El equipo crea User Stories técnicas. El PO las entiende y las prioriza balanceando valor y riesgo técnico.',
                score: 10,
              },
              {
                text: 'Hacer la deuda técnica en secreto durante el desarrollo de features',
                feedback:
                  'Muy incorrecto. Falta transparencia, uno de los pilares de Scrum.',
                consequence:
                  'Pérdida total de confianza. El PO descubre que el equipo "esconde" trabajo.',
                score: 0,
              },
            ],
          },
        ],
      },
    },
  ];

  const handleSelectCase = (caseId: string) => {
    setSelectedCase(caseId);
    setCurrentStep(0);
    setDecisions([]);
    setCaseCompleted(false);
  };

  const handleDecision = (optionIndex: number) => {
    const newDecisions = [...decisions, optionIndex];
    setDecisions(newDecisions);

    const currentCase = cases.find((c) => c.id === selectedCase);
    if (!currentCase) return;

    if (currentStep < currentCase.scenario.steps.length - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1); // evita cierre obsoleto
      }, 2000);
    } else {
      setTimeout(() => {
        setCaseCompleted(true);
      }, 2000);
    }
  };

  const calculateScore = () => {
    const currentCase = cases.find((c) => c.id === selectedCase);
    if (!currentCase) return 0;

    let total = 0;
    decisions.forEach((decision, index) => {
      const step = currentCase.scenario.steps[index];
      if (step) total += step.options[decision].score;
    });

    const maxScore = currentCase.scenario.steps.reduce(
      (sum, step) => sum + Math.max(...step.options.map((o) => o.score)),
      0
    );

    return Math.round((total / maxScore) * 100);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setDecisions([]);
    setCaseCompleted(false);
  };

  if (caseCompleted) {
    const currentCase = cases.find((c) => c.id === selectedCase);
    if (!currentCase) return null;

    const score = calculateScore();
    const performance = score >= 80 ? 'Excelente' : score >= 60 ? 'Bueno' : 'Necesita Mejorar';

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div
            className="bg-white rounded-xl p-8 border text-center"
            style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: score >= 70 ? '#D1FAE5' : '#FEF3C7' }}
            >
              {score >= 70 ? (
                <CheckCircle className="w-10 h-10" style={{ color: '#10B981' }} />
              ) : (
                <AlertCircle className="w-10 h-10" style={{ color: '#F59E0B' }} />
              )}
            </div>

            <h2
              style={{
                color: '#1E293B',
                fontSize: '2rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              Caso Completado: {performance}
            </h2>

            <div
              className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
              style={{
                backgroundColor: score >= 70 ? '#D1FAE5' : '#FEF3C7',
                border: `8px solid ${score >= 70 ? '#10B981' : '#F59E0B'}`,
              }}
            >
              <span
                style={{
                  color: score >= 70 ? '#065F46' : '#92400E',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                }}
              >
                {score}%
              </span>
            </div>

            <div className="text-left max-w-2xl mx-auto mb-8">
              <h3 className="mb-4" style={{ color: '#1E293B', fontSize: '1.25rem', fontWeight: 600 }}>
                Resumen de tus decisiones:
              </h3>
              {currentCase.scenario.steps.map((step, index) => {
                const decision = decisions[index];
                const option = step.options[decision];
                return (
                  <div
                    key={index}
                    className="mb-4 p-4 rounded-lg border"
                    style={{ borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' }}
                  >
                    <p className="mb-2" style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 600 }}>
                      Decisión {index + 1}:
                    </p>
                    <p className="mb-2" style={{ color: '#1E293B', fontWeight: 500 }}>
                      {option.text}
                    </p>
                    <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Puntuación: {option.score}/10</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-6 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: '#F1F5F9', color: '#1E293B', fontWeight: 600, border: '1px solid #E2E8F0' }}
              >
                Ver todos los casos
              </button>
              <button
                onClick={handleRestart}
                className="px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', fontWeight: 600 }}
              >
                <RefreshCw className="w-5 h-5" />
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCase) {
    const currentCase = cases.find((c) => c.id === selectedCase);
    if (!currentCase) return null;

    const step = currentCase.scenario.steps[currentStep];
    const currentDecision = decisions[currentStep];
    const showingFeedback = currentDecision !== undefined;
    const selectedOption = showingFeedback ? step.options[currentDecision!] : null;

    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <button
            onClick={() => setSelectedCase(null)}
            className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors"
            style={{ color: '#1E293B', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 600 }}>
                Decisión {currentStep + 1} de {currentCase.scenario.steps.length}
              </span>
            </div>
            <div className="flex gap-2">
              {currentCase.scenario.steps.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-2 rounded-full"
                  style={{
                    backgroundColor: index <= currentStep ? '#3B82F6' : '#E2E8F0',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Case Card */}
          <div
            className="bg-white rounded-xl p-8 border mb-6"
            style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <div className="mb-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#FEF3C7' }}>
                <AlertCircle className="w-6 h-6" style={{ color: '#F59E0B' }} />
              </div>
              <h3 className="mb-4" style={{ color: '#1E293B', fontSize: '1.5rem', fontWeight: 600 }}>
                Situación
              </h3>
              <p style={{ color: '#1E293B', fontSize: '1.125rem', lineHeight: '1.75', marginBottom: '2rem' }}>
                {step.situation}
              </p>
            </div>

            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F8FAFC', borderLeft: '4px solid #3B82F6' }}>
              <p style={{ color: '#1E293B', fontSize: '1.125rem', fontWeight: 600 }}>{step.question}</p>
            </div>

            <div className="space-y-3 mb-6">
              {step.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showingFeedback && handleDecision(index)}
                  disabled={showingFeedback}
                  className="w-full text-left p-4 rounded-lg border-2 transition-all"
                  style={{
                    borderColor: currentDecision === index ? '#3B82F6' : '#E2E8F0',
                    backgroundColor: currentDecision === index ? '#DBEAFE' : '#FFFFFF',
                    cursor: showingFeedback ? 'default' : 'pointer',
                    opacity: showingFeedback && currentDecision !== index ? 0.5 : 1,
                  }}
                >
                  <p style={{ color: '#1E293B', fontWeight: 500, lineHeight: '1.6' }}>{option.text}</p>
                </button>
              ))}
            </div>

            {showingFeedback && selectedOption && (
              <div>
                <div
                  className="p-4 rounded-lg mb-4"
                  style={{
                    backgroundColor: selectedOption.score >= 7 ? '#D1FAE5' : '#FEF3C7',
                    border: `2px solid ${selectedOption.score >= 7 ? '#10B981' : '#F59E0B'}`,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {selectedOption.score >= 7 ? (
                      <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#065F46' }} />
                    ) : (
                      <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#92400E' }} />
                    )}
                    <div>
                      <p
                        style={{
                          color: selectedOption.score >= 7 ? '#065F46' : '#92400E',
                          fontWeight: 600,
                          marginBottom: '0.5rem',
                        }}
                      >
                        Puntuación: {selectedOption.score}/10
                      </p>
                      <p
                        style={{
                          color: selectedOption.score >= 7 ? '#065F46' : '#92400E',
                          lineHeight: '1.6',
                        }}
                      >
                        {selectedOption.feedback}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <p style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Consecuencia:
                  </p>
                  <p style={{ color: '#1E293B', lineHeight: '1.6' }}>{selectedOption.consequence}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
          <h2 style={{ color: '#1E293B', fontSize: '2rem', fontWeight: 600 }}>Simulador de Casos</h2>
          <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem' }}>
            Enfrenta situaciones reales y toma decisiones como un Scrum Master
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="bg-white rounded-xl p-6 border"
              style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: '#FEF3C7' }}
              >
                {/* Ícono de libro abierto */}
                <BookOpen className="w-6 h-6" style={{ color: '#F59E0B' }} />
              </div>

              <h3 className="mb-2" style={{ color: '#1E293B', fontSize: '1.25rem', fontWeight: 600 }}>
                {caseItem.title}
              </h3>

              <p className="mb-4" style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: '1.5' }}>
                {caseItem.description}
              </p>

              <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: '#64748B' }}>
                <span>{caseItem.scenario.steps.length} decisiones</span>
                <span>•</span>
                <span
                  className="px-2 py-1 rounded text-xs"
                  style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 600 }}
                >
                  {caseItem.difficulty}
                </span>
              </div>

              <button
                onClick={() => handleSelectCase(caseItem.id)}
                className="w-full px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#F59E0B', color: '#FFFFFF', fontWeight: 600 }}
              >
                Comenzar Caso
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

