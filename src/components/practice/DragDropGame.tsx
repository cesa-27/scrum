import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';

interface DragDropGameProps {
  onBack: () => void;
}

export function DragDropGame({ onBack }: DragDropGameProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'roles-match',
      title: 'Empareja Roles con Responsabilidades',
      description: 'Arrastra cada responsabilidad al rol correcto',
      difficulty: 'Básico',
    },
    {
      id: 'events-order',
      title: 'Ordena los Eventos de Scrum',
      description: 'Coloca los eventos en el orden correcto dentro de un Sprint',
      difficulty: 'Intermedio',
    },
    {
      id: 'artifacts-match',
      title: 'Conecta Artefactos con sus Características',
      description: 'Une cada artefacto con su descripción correcta',
      difficulty: 'Básico',
    },
  ];

  if (selectedGame === 'roles-match') {
    return <RolesMatchGame onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'events-order') {
    return <EventsOrderGame onBack={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'artifacts-match') {
    return <ArtifactsMatchGame onBack={() => setSelectedGame(null)} />;
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
          <h2 style={{ color: '#1E293B', fontSize: '2rem', fontWeight: 600 }}>
            Juegos de Arrastrar y Soltar
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem' }}>
            Aprende de forma interactiva emparejando conceptos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-xl p-6 border" 
              style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" 
                style={{ backgroundColor: '#D1FAE5' }}>
                <span className="text-2xl">🎯</span>
              </div>

              <h3 className="mb-2" style={{ color: '#1E293B', fontSize: '1.25rem', fontWeight: 600 }}>
                {game.title}
              </h3>

              <p className="mb-4" style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: '1.5' }}>
                {game.description}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 rounded text-xs" 
                  style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontWeight: 600 }}>
                  {game.difficulty}
                </span>
              </div>

              <button
                onClick={() => setSelectedGame(game.id)}
                className="w-full px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 600 }}
              >
                Jugar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RolesMatchGame({ onBack }: { onBack: () => void }) {
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const roles = [
    { id: 'po', name: 'Product Owner', color: '#3B82F6' },
    { id: 'sm', name: 'Scrum Master', color: '#10B981' },
    { id: 'dev', name: 'Development Team', color: '#F59E0B' },
  ];

  const responsibilities = [
    { id: 'resp1', text: 'Maximizar el valor del producto', correctRole: 'po' },
    { id: 'resp2', text: 'Facilitar eventos de Scrum', correctRole: 'sm' },
    { id: 'resp3', text: 'Crear el incremento del producto', correctRole: 'dev' },
    { id: 'resp4', text: 'Gestionar el Product Backlog', correctRole: 'po' },
    { id: 'resp5', text: 'Eliminar impedimentos del equipo', correctRole: 'sm' },
    { id: 'resp6', text: 'Estimar el trabajo del Sprint', correctRole: 'dev' },
  ];

  const handleItemClick = (itemId: string) => {
    if (showResults) return;
    setSelectedItem(itemId);
  };

  const handleRoleClick = (roleId: string) => {
    if (showResults || !selectedItem) return;
    setMatches({ ...matches, [selectedItem]: roleId });
    setSelectedItem(null);
  };

  const handleCheck = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setMatches({});
    setSelectedItem(null);
    setShowResults(false);
  };

  const correctCount = responsibilities.filter(r => matches[r.id] === r.correctRole).length;
  const allMatched = responsibilities.every(r => matches[r.id]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors"
          style={{ color: '#1E293B', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="bg-white rounded-xl p-8 border mb-6" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 className="mb-4" style={{ color: '#1E293B', fontSize: '1.75rem', fontWeight: 600 }}>
            Empareja Roles con Responsabilidades
          </h2>
          <p className="mb-6" style={{ color: '#64748B', fontSize: '1rem' }}>
            Haz clic en una responsabilidad y luego en el rol correcto para emparejarlos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Responsibilities */}
            <div>
              <h3 className="mb-4" style={{ color: '#1E293B', fontSize: '1.25rem', fontWeight: 600 }}>
                Responsabilidades
              </h3>
              <div className="space-y-3">
                {responsibilities.map((resp) => {
                  const matchedRole = matches[resp.id];
                  const role = roles.find(r => r.id === matchedRole);
                  const isCorrect = showResults && matchedRole === resp.correctRole;
                  const isIncorrect = showResults && matchedRole && matchedRole !== resp.correctRole;

                  return (
                    <button
                      key={resp.id}
                      onClick={() => handleItemClick(resp.id)}
                      disabled={showResults}
                      className="w-full text-left p-4 rounded-lg border-2 transition-all"
                      style={{
                        borderColor: selectedItem === resp.id ? '#3B82F6' :
                                   isCorrect ? '#10B981' :
                                   isIncorrect ? '#EF4444' :
                                   role ? role.color : '#E2E8F0',
                        backgroundColor: selectedItem === resp.id ? '#DBEAFE' :
                                       isCorrect ? '#D1FAE5' :
                                       isIncorrect ? '#FEE2E2' :
                                       role ? role.color + '10' : '#FFFFFF',
                        cursor: showResults ? 'default' : 'pointer',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span style={{ color: '#1E293B', fontWeight: 500 }}>
                          {resp.text}
                        </span>
                        {matchedRole && (
                          <span className="px-2 py-1 rounded text-xs ml-2" 
                            style={{ 
                              backgroundColor: role?.color + '20',
                              color: role?.color,
                              fontWeight: 600
                            }}>
                            {role?.name}
                          </span>
                        )}
                        {isCorrect && <CheckCircle className="w-5 h-5 ml-2" style={{ color: '#10B981' }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Roles */}
            <div>
              <h3 className="mb-4" style={{ color: '#1E293B', fontSize: '1.25rem', fontWeight: 600 }}>
                Roles de Scrum
              </h3>
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleClick(role.id)}
                    disabled={showResults || !selectedItem}
                    className="w-full p-6 rounded-lg border-2 transition-all hover:scale-105"
                    style={{
                      borderColor: role.color,
                      backgroundColor: role.color + '10',
                      cursor: showResults || !selectedItem ? 'default' : 'pointer',
                      opacity: !selectedItem && !showResults ? 0.6 : 1,
                    }}
                  >
                    <span style={{ color: role.color, fontSize: '1.25rem', fontWeight: 600 }}>
                      {role.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            {!showResults ? (
              <>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  style={{ backgroundColor: '#F1F5F9', color: '#1E293B', fontWeight: 600, border: '1px solid #E2E8F0' }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Reiniciar
                </button>
                <button
                  onClick={handleCheck}
                  disabled={!allMatched}
                  className="flex-1 px-6 py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: allMatched ? '#10B981' : '#E2E8F0',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    cursor: allMatched ? 'pointer' : 'not-allowed',
                    opacity: allMatched ? 1 : 0.5,
                  }}
                >
                  Verificar Respuestas
                </button>
              </>
            ) : (
              <div className="flex-1">
                <div className="p-6 rounded-lg mb-4" 
                  style={{ 
                    backgroundColor: correctCount === responsibilities.length ? '#D1FAE5' : '#FEF3C7',
                    border: `2px solid ${correctCount === responsibilities.length ? '#10B981' : '#F59E0B'}`
                  }}>
                  <p style={{ 
                    color: correctCount === responsibilities.length ? '#065F46' : '#92400E',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    {correctCount === responsibilities.length ? 
                      '🎉 ¡Perfecto! Todas las respuestas son correctas' :
                      `Obtuviste ${correctCount} de ${responsibilities.length} correctas`
                    }
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', fontWeight: 600 }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Intentar Nuevamente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsOrderGame({ onBack }: { onBack: () => void }) {
  const correctOrder = ['planning', 'daily', 'review', 'retrospective'];
  const [items, setItems] = useState([
    { id: 'planning', name: 'Sprint Planning', emoji: '📋' },
    { id: 'retrospective', name: 'Sprint Retrospective', emoji: '🔄' },
    { id: 'daily', name: 'Daily Scrum', emoji: '☀️' },
    { id: 'review', name: 'Sprint Review', emoji: '👀' },
  ]);
  const [showResults, setShowResults] = useState(false);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (showResults) return;
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setItems(newItems);
  };

  const handleCheck = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setItems([
      { id: 'planning', name: 'Sprint Planning', emoji: '📋' },
      { id: 'retrospective', name: 'Sprint Retrospective', emoji: '🔄' },
      { id: 'daily', name: 'Daily Scrum', emoji: '☀️' },
      { id: 'review', name: 'Sprint Review', emoji: '👀' },
    ]);
    setShowResults(false);
  };

  const isCorrectOrder = items.every((item, index) => item.id === correctOrder[index]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors"
          style={{ color: '#1E293B', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="bg-white rounded-xl p-8 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 className="mb-4" style={{ color: '#1E293B', fontSize: '1.75rem', fontWeight: 600 }}>
            Ordena los Eventos de Scrum
          </h2>
          <p className="mb-6" style={{ color: '#64748B', fontSize: '1rem' }}>
            Organiza los eventos en el orden en que ocurren durante un Sprint
          </p>

          <div className="space-y-3 mb-8">
            {items.map((item, index) => {
              const isCorrectPosition = showResults && item.id === correctOrder[index];
              const isIncorrectPosition = showResults && item.id !== correctOrder[index];

              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={showResults || index === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                      style={{ color: '#64748B' }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={showResults || index === items.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                      style={{ color: '#64748B' }}
                    >
                      ▼
                    </button>
                  </div>
                  <div className="flex-1 p-4 rounded-lg border-2" 
                    style={{
                      borderColor: isCorrectPosition ? '#10B981' : isIncorrectPosition ? '#EF4444' : '#E2E8F0',
                      backgroundColor: isCorrectPosition ? '#D1FAE5' : isIncorrectPosition ? '#FEE2E2' : '#FFFFFF',
                    }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <span style={{ color: '#1E293B', fontWeight: 600, fontSize: '1.125rem' }}>
                        {item.name}
                      </span>
                      {isCorrectPosition && <CheckCircle className="w-5 h-5 ml-auto" style={{ color: '#10B981' }} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4">
            {!showResults ? (
              <>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  style={{ backgroundColor: '#F1F5F9', color: '#1E293B', fontWeight: 600, border: '1px solid #E2E8F0' }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Reiniciar
                </button>
                <button
                  onClick={handleCheck}
                  className="flex-1 px-6 py-3 rounded-lg transition-colors"
                  style={{ backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 600 }}
                >
                  Verificar Orden
                </button>
              </>
            ) : (
              <div className="flex-1">
                <div className="p-6 rounded-lg mb-4" 
                  style={{ 
                    backgroundColor: isCorrectOrder ? '#D1FAE5' : '#FEE2E2',
                    border: `2px solid ${isCorrectOrder ? '#10B981' : '#EF4444'}`
                  }}>
                  <p style={{ 
                    color: isCorrectOrder ? '#065F46' : '#991B1B',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    {isCorrectOrder ? 
                      '🎉 ¡Correcto! El orden es: Planning → Daily → Review → Retrospective' :
                      '❌ No es el orden correcto. El orden dentro de un Sprint es: Planning → Daily (múltiples veces) → Review → Retrospective'
                    }
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', fontWeight: 600 }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Intentar Nuevamente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtifactsMatchGame({ onBack }: { onBack: () => void }) {
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const artifacts = [
    { id: 'product-backlog', name: 'Product Backlog', emoji: '📝' },
    { id: 'sprint-backlog', name: 'Sprint Backlog', emoji: '📋' },
    { id: 'increment', name: 'Incremento', emoji: '✨' },
  ];

  const descriptions = [
    { id: 'desc1', text: 'Lista ordenada de todo lo necesario en el producto', correct: 'product-backlog' },
    { id: 'desc2', text: 'Ítems seleccionados para el Sprint más el plan', correct: 'sprint-backlog' },
    { id: 'desc3', text: 'Suma de todos los ítems completados y "Done"', correct: 'increment' },
    { id: 'desc4', text: 'Gestionado por el Product Owner', correct: 'product-backlog' },
    { id: 'desc5', text: 'Propiedad del Development Team', correct: 'sprint-backlog' },
  ];

  const handleItemClick = (itemId: string) => {
    if (showResults) return;
    setSelectedItem(itemId);
  };

  const handleArtifactClick = (artifactId: string) => {
    if (showResults || !selectedItem) return;
    setMatches({ ...matches, [selectedItem]: artifactId });
    setSelectedItem(null);
  };

  const handleCheck = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setMatches({});
    setSelectedItem(null);
    setShowResults(false);
  };

  const correctCount = descriptions.filter(d => matches[d.id] === d.correct).length;
  const allMatched = descriptions.every(d => matches[d.id]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors"
          style={{ color: '#1E293B', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="bg-white rounded-xl p-8 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 className="mb-4" style={{ color: '#1E293B', fontSize: '1.75rem', fontWeight: 600 }}>
            Conecta Artefactos con sus Características
          </h2>
          <p className="mb-6" style={{ color: '#64748B', fontSize: '1rem' }}>
            Haz clic en una característica y luego en el artefacto correspondiente
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="mb-4" style={{ color: '#1E293B', fontSize: '1.25rem', fontWeight: 600 }}>
                Características
              </h3>
              <div className="space-y-3">
                {descriptions.map((desc) => {
                  const matchedArtifact = matches[desc.id];
                  const artifact = artifacts.find(a => a.id === matchedArtifact);
                  const isCorrect = showResults && matchedArtifact === desc.correct;
                  const isIncorrect = showResults && matchedArtifact && matchedArtifact !== desc.correct;

                  return (
                    <button
                      key={desc.id}
                      onClick={() => handleItemClick(desc.id)}
                      disabled={showResults}
                      className="w-full text-left p-4 rounded-lg border-2 transition-all"
                      style={{
                        borderColor: selectedItem === desc.id ? '#3B82F6' :
                                   isCorrect ? '#10B981' :
                                   isIncorrect ? '#EF4444' :
                                   matchedArtifact ? '#8B5CF6' : '#E2E8F0',
                        backgroundColor: selectedItem === desc.id ? '#DBEAFE' :
                                       isCorrect ? '#D1FAE5' :
                                       isIncorrect ? '#FEE2E2' :
                                       matchedArtifact ? '#E9D5FF' : '#FFFFFF',
                        cursor: showResults ? 'default' : 'pointer',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span style={{ color: '#1E293B', fontWeight: 500 }}>
                          {desc.text}
                        </span>
                        {artifact && (
                          <span className="text-xl ml-2">{artifact.emoji}</span>
                        )}
                        {isCorrect && <CheckCircle className="w-5 h-5 ml-2" style={{ color: '#10B981' }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-4" style={{ color: '#1E293B', fontSize: '1.25rem', fontWeight: 600 }}>
                Artefactos
              </h3>
              <div className="space-y-3">
                {artifacts.map((artifact) => (
                  <button
                    key={artifact.id}
                    onClick={() => handleArtifactClick(artifact.id)}
                    disabled={showResults || !selectedItem}
                    className="w-full p-6 rounded-lg border-2 transition-all hover:scale-105"
                    style={{
                      borderColor: '#8B5CF6',
                      backgroundColor: '#E9D5FF',
                      cursor: showResults || !selectedItem ? 'default' : 'pointer',
                      opacity: !selectedItem && !showResults ? 0.6 : 1,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{artifact.emoji}</span>
                      <span style={{ color: '#8B5CF6', fontSize: '1.125rem', fontWeight: 600 }}>
                        {artifact.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            {!showResults ? (
              <>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  style={{ backgroundColor: '#F1F5F9', color: '#1E293B', fontWeight: 600, border: '1px solid #E2E8F0' }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Reiniciar
                </button>
                <button
                  onClick={handleCheck}
                  disabled={!allMatched}
                  className="flex-1 px-6 py-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: allMatched ? '#10B981' : '#E2E8F0',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    cursor: allMatched ? 'pointer' : 'not-allowed',
                    opacity: allMatched ? 1 : 0.5,
                  }}
                >
                  Verificar Respuestas
                </button>
              </>
            ) : (
              <div className="flex-1">
                <div className="p-6 rounded-lg mb-4" 
                  style={{ 
                    backgroundColor: correctCount === descriptions.length ? '#D1FAE5' : '#FEF3C7',
                    border: `2px solid ${correctCount === descriptions.length ? '#10B981' : '#F59E0B'}`
                  }}>
                  <p style={{ 
                    color: correctCount === descriptions.length ? '#065F46' : '#92400E',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    {correctCount === descriptions.length ? 
                      '🎉 ¡Perfecto! Todas las respuestas son correctas' :
                      `Obtuviste ${correctCount} de ${descriptions.length} correctas`
                    }
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#3B82F6', color: '#FFFFFF', fontWeight: 600 }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Intentar Nuevamente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
