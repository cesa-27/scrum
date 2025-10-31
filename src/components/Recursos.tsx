import React, { useState } from 'react';
import { BookOpen, FileText, Download, ExternalLink, Search, BookMarked } from 'lucide-react';

export function Recursos() {
  const [activeTab, setActiveTab] = useState<'libros' | 'articulos' | 'glosario' | 'plantillas'>('libros');
  const [searchTerm, setSearchTerm] = useState('');

  const libros = [
    {
      title: 'Scrum: The Art of Doing Twice the Work in Half the Time',
      author: 'Jeff Sutherland',
      description: 'El co-creador de Scrum explica cómo funciona el framework y por qué es tan efectivo.',
      category: 'Scrum',
      pages: 256,
    },
    {
      title: 'User Stories Applied',
      author: 'Mike Cohn',
      description: 'Guía práctica para escribir user stories efectivas en el desarrollo ágil.',
      category: 'Agile',
      pages: 304,
    },
    {
      title: 'The Scrum Guide',
      author: 'Ken Schwaber & Jeff Sutherland',
      description: 'La guía oficial y definitiva de Scrum, actualizada regularmente.',
      category: 'Scrum',
      pages: 19,
    },
    {
      title: 'Agile Estimating and Planning',
      author: 'Mike Cohn',
      description: 'Técnicas prácticas para estimación y planificación en proyectos ágiles.',
      category: 'Agile',
      pages: 368,
    },
    {
      title: 'PMBOK Guide',
      author: 'Project Management Institute',
      description: 'Guía fundamental de las mejores prácticas en gestión de proyectos.',
      category: 'PMBOK',
      pages: 756,
    },
  ];

  const articulos = [
    {
      title: 'Los 12 Principios del Manifiesto Ágil Explicados',
      source: 'Agile Alliance',
      url: '#',
      description: 'Análisis profundo de cada uno de los 12 principios fundamentales del desarrollo ágil.',
      readTime: '15 min',
    },
    {
      title: 'Cómo Escribir User Stories Efectivas',
      source: 'Mountain Goat Software',
      url: '#',
      description: 'Guía paso a paso para crear user stories que agreguen valor real.',
      readTime: '10 min',
    },
    {
      title: 'Sprint Retrospectives: Ideas y Técnicas',
      source: 'Scrum.org',
      url: '#',
      description: 'Técnicas innovadoras para hacer retrospectivas más efectivas y dinámicas.',
      readTime: '12 min',
    },
    {
      title: 'Definition of Done vs Acceptance Criteria',
      source: 'Scrum Alliance',
      url: '#',
      description: 'Comprende las diferencias clave entre DoD y criterios de aceptación.',
      readTime: '8 min',
    },
  ];

  const glosario = [
    { term: 'Backlog', definition: 'Lista ordenada de todo el trabajo pendiente en un proyecto. Puede ser Product Backlog (todo el producto) o Sprint Backlog (trabajo del sprint actual).' },
    { term: 'Burndown Chart', definition: 'Gráfico que muestra el trabajo restante vs el tiempo. Ayuda a visualizar el progreso hacia completar el trabajo del Sprint o Release.' },
    { term: 'Daily Scrum', definition: 'Reunión diaria de 15 minutos donde el Development Team sincroniza actividades y planifica el trabajo de las próximas 24 horas.' },
    { term: 'Definition of Done (DoD)', definition: 'Criterios compartidos que definen cuándo un incremento está completo y listo para ser entregado.' },
    { term: 'Epic', definition: 'User Story grande que necesita ser dividida en stories más pequeñas antes de poder implementarse.' },
    { term: 'Increment', definition: 'La suma de todos los Product Backlog items completados durante un Sprint y el valor de los incrementos de todos los Sprints anteriores.' },
    { term: 'Product Owner', definition: 'Rol responsable de maximizar el valor del producto y gestionar el Product Backlog.' },
    { term: 'Refinement', definition: 'Actividad continua de añadir detalle, estimaciones y orden a los items del Product Backlog.' },
    { term: 'Scrum Master', definition: 'Rol responsable de facilitar Scrum y ayudar al equipo a entender y aplicar la teoría, prácticas, reglas y valores de Scrum.' },
    { term: 'Sprint', definition: 'Período de tiempo fijo (1-4 semanas) durante el cual se crea un incremento de producto "Done" y potencialmente entregable.' },
    { term: 'Sprint Goal', definition: 'Objetivo que se establece para el Sprint y que proporciona guía al Development Team sobre por qué está construyendo el incremento.' },
    { term: 'Sprint Planning', definition: 'Evento al inicio del Sprint donde el equipo planifica el trabajo a realizar. Responde: ¿Qué puede entregarse? ¿Cómo se logrará?' },
    { term: 'Sprint Retrospective', definition: 'Evento al final del Sprint donde el equipo inspecciona cómo fue el último Sprint y crea un plan de mejoras.' },
    { term: 'Sprint Review', definition: 'Evento al final del Sprint donde el equipo y stakeholders inspeccionan el incremento y adaptan el Product Backlog si es necesario.' },
    { term: 'Stakeholder', definition: 'Persona u organización que tiene interés en el producto pero no es parte del Scrum Team.' },
    { term: 'User Story', definition: 'Descripción corta y simple de una funcionalidad contada desde la perspectiva del usuario.' },
    { term: 'Velocity', definition: 'Medida de la cantidad de trabajo que un Development Team puede completar durante un Sprint.' },
    { term: 'WIP (Work In Progress)', definition: 'Trabajo que ha sido iniciado pero no completado. Limitar el WIP es un principio clave en Kanban.' },
  ];

  const plantillas = [
    {
      title: 'Plantilla de Product Backlog',
      description: 'Formato Excel para gestionar y priorizar tu Product Backlog',
      format: 'XLSX',
      size: '45 KB',
    },
    {
      title: 'Plantilla de Sprint Planning',
      description: 'Documento para facilitar la planificación de Sprints',
      format: 'PDF',
      size: '120 KB',
    },
    {
      title: 'Tablero Kanban Digital',
      description: 'Plantilla editable de un tablero Kanban',
      format: 'PNG',
      size: '230 KB',
    },
    {
      title: 'Formato de User Story',
      description: 'Template para escribir user stories efectivas',
      format: 'DOCX',
      size: '35 KB',
    },
    {
      title: 'Guía de Retrospectiva',
      description: 'Actividades y formatos para Sprint Retrospectives',
      format: 'PDF',
      size: '280 KB',
    },
    {
      title: 'Checklist Definition of Done',
      description: 'Lista verificable de criterios para "Done"',
      format: 'PDF',
      size: '95 KB',
    },
  ];

  const filteredGlosario = glosario.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 style={{ color: '#1E293B', fontSize: '2.5rem', fontWeight: 700 }}>
            Biblioteca de Recursos
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.125rem', marginTop: '0.5rem' }}>
            Materiales complementarios para profundizar tu aprendizaje
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'libros', label: 'Libros', icon: BookOpen },
            { id: 'articulos', label: 'Artículos', icon: FileText },
            { id: 'glosario', label: 'Glosario', icon: BookMarked },
            { id: 'plantillas', label: 'Plantillas', icon: Download },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap"
                style={{
                  backgroundColor: activeTab === tab.id ? '#3B82F6' : '#FFFFFF',
                  color: activeTab === tab.id ? '#FFFFFF' : '#1E293B',
                  fontWeight: 600,
                  border: activeTab === tab.id ? 'none' : '1px solid #E2E8F0',
                }}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Libros */}
        {activeTab === 'libros' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {libros.map((libro, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border" 
                style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-20 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#DBEAFE' }}>
                    <BookOpen className="w-8 h-8" style={{ color: '#3B82F6' }} />
                  </div>
                  <div className="flex-1">
                    <span className="px-2 py-1 rounded text-xs inline-block mb-2"
                      style={{ 
                        backgroundColor: libro.category === 'Scrum' ? '#D1FAE5' : 
                                       libro.category === 'PMBOK' ? '#E9D5FF' : '#FEF3C7',
                        color: libro.category === 'Scrum' ? '#065F46' : 
                               libro.category === 'PMBOK' ? '#6B21A8' : '#92400E',
                        fontWeight: 600
                      }}>
                      {libro.category}
                    </span>
                  </div>
                </div>

                <h3 className="mb-2" style={{ color: '#1E293B', fontSize: '1.125rem', fontWeight: 600, lineHeight: '1.4' }}>
                  {libro.title}
                </h3>

                <p className="mb-3 text-sm" style={{ color: '#64748B', fontWeight: 500 }}>
                  por {libro.author}
                </p>

                <p className="mb-4" style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {libro.description}
                </p>

                <div className="flex items-center justify-between text-sm" style={{ color: '#64748B' }}>
                  <span>{libro.pages} páginas</span>
                  <button className="flex items-center gap-1 hover:underline" style={{ color: '#3B82F6' }}>
                    <ExternalLink className="w-4 h-4" />
                    Ver más
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Artículos */}
        {activeTab === 'articulos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articulos.map((articulo, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow" 
                style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#D1FAE5' }}>
                    <FileText className="w-6 h-6" style={{ color: '#10B981' }} />
                  </div>

                  <div className="flex-1">
                    <h3 className="mb-2" style={{ color: '#1E293B', fontSize: '1.125rem', fontWeight: 600, lineHeight: '1.4' }}>
                      {articulo.title}
                    </h3>

                    <p className="mb-3" style={{ color: '#64748B', fontSize: '0.875rem' }}>
                      {articulo.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm" style={{ color: '#64748B' }}>
                        <span>{articulo.source}</span>
                        <span>•</span>
                        <span>{articulo.readTime}</span>
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1 rounded transition-colors"
                        style={{ color: '#3B82F6', fontWeight: 600 }}>
                        Leer
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Glosario */}
        {activeTab === 'glosario' && (
          <div>
            <div className="mb-6 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="Buscar términos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border"
                  style={{ 
                    borderColor: '#E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B'
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredGlosario.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border" 
                  style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 className="mb-2" style={{ color: '#1E293B', fontSize: '1.25rem', fontWeight: 600 }}>
                    {item.term}
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: '1.6' }}>
                    {item.definition}
                  </p>
                </div>
              ))}
              {filteredGlosario.length === 0 && (
                <div className="text-center py-12">
                  <p style={{ color: '#64748B', fontSize: '1.125rem' }}>
                    No se encontraron términos que coincidan con tu búsqueda
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Plantillas */}
        {activeTab === 'plantillas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plantillas.map((plantilla, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border" 
                style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#E9D5FF' }}>
                  <Download className="w-6 h-6" style={{ color: '#8B5CF6' }} />
                </div>

                <h3 className="mb-2" style={{ color: '#1E293B', fontSize: '1.125rem', fontWeight: 600 }}>
                  {plantilla.title}
                </h3>

                <p className="mb-4" style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {plantilla.description}
                </p>

                <div className="flex items-center justify-between mb-4 text-sm" style={{ color: '#64748B' }}>
                  <span className="px-2 py-1 rounded" style={{ backgroundColor: '#F1F5F9', fontWeight: 600 }}>
                    {plantilla.format}
                  </span>
                  <span>{plantilla.size}</span>
                </div>

                <button className="w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#F1F5F9', color: '#1E293B', fontWeight: 600, border: '1px solid #E2E8F0' }}>
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
