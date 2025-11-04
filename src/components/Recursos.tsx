import React, { useState } from 'react';
import { BookOpen, FileText, Download, ExternalLink, Search, BookMarked } from 'lucide-react';

export function Recursos() {
  const [activeTab, setActiveTab] = useState<'libros' | 'articulos' | 'glosario' | 'plantillas'>('libros');
  const [searchTerm, setSearchTerm] = useState('');

  const libros = [
    {
      title: 'Guía de Scrum 2020 (versión oficial en español)',
      author: 'Ken Schwaber & Jeff Sutherland',
      description: 'Versión oficial de la Guía de Scrum en español.',
      category: 'Scrum',
      pages: 20,
      url: 'https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-Spanish-European.pdf'
    },
    {
      title: 'SCRUM y XP desde las trincheras (versión en español)',
      author: 'Henrik Kniberg',
      description: 'Libro práctico sobre cómo aplicar Scrum y XP, versión gratuita online en español.',
      category: 'Scrum',
      pages: 160,
      url: 'https://www.proyectalis.com/wp-content/uploads/2008/02/scrum-y-xp-desde-las-trincheras.pdf'
    },
    {
      title: 'Guía SBOK™ 3ª Edición – Scrumstudy (Español)',
      author: 'SCRUMstudy™',
      description: 'Guía para el cuerpo de conocimiento de Scrum, edición 3ª en español.',
      category: 'Scrum',
      pages: 400,
      url: 'https://primeconsultores.com.pe/wp-content/uploads/2021/02/SCRUMstudy-SBOK-Guide-3rd-edition-Spanish.pdf'
    },
    {
      title: 'Introducción a las metodologías ágiles (Scrum)',
      author: 'Albert Álvarez Carulla',
      description: 'Guía libre en español sobre metodologías ágiles y Scrum.',
      category: 'Agile',
      pages: 75,
      url: 'https://diposit.ub.edu/dspace/bitstream/2445/174890/1/Albert%20Álvarez%20Carulla%20-Introducción%20a%20las%20metodologías%20ágiles%20%28Scrum%29.pdf'
    },
  ];

  const articulos = [
    {
      title: 'Los 12 Principios del Manifiesto Ágil explicados',
      source: 'Sentrio Blog',
      url: 'https://sentrio.io/blog/valores-principios-agile-manifiesto-agil/',
      description: 'Análisis profundo de los valores y principios del manifiesto ágil.',
      readTime: '15 min',
    },
    {
      title: 'Metodologías ágiles: ¿Qué son y cuáles son más utilizadas?',
      source: 'IEBS Hub',
      url: 'https://www.iebschool.com/hub/que-son-metodologias-agiles-agile-scrum/',
      description: 'Explicación completa de las metodologías ágiles y su uso en la industria.',
      readTime: '15 min',
    },
    {
      title: 'Agile vs Scrum: ¿Cuál es la mejor metodología para tu equipo?',
      source: 'monday.com Blog',
      url: 'https://monday.com/blog/es/gestion-de-proyectos/agile-vs-scrum-cual-es-la-mejor-metodologia-para-tu-equipo/',
      description: 'Comparativa entre Agile y Scrum en español, con ejemplos prácticos.',
      readTime: '10 min',
    },
    {
      title: 'El ágil tiene como objetivo eliminar ineficiencias: ¿Qué es Agile?',
      source: 'Deiser Blog',
      url: 'https://blog.deiser.com/es/que-es-el-agile',
      description: 'Artículo introductorio sobre el enfoque ágil y su relevancia hoy en día.',
      readTime: '8 min',
    },
  ];

  const glosario = [
    { term: 'Backlog', definition: 'Lista ordenada de todo el trabajo pendiente en un proyecto.' },
    { term: 'Burndown Chart', definition: 'Gráfico que muestra el trabajo restante vs el tiempo.' },
    { term: 'Daily Scrum', definition: 'Reunión diaria de 15 min donde el equipo sincroniza actividades.' },
    { term: 'Definition of Done (DoD)', definition: 'Criterios que definen cuándo un incremento está completo y listo para ser entregado.' },
    { term: 'Epic', definition: 'Historia de usuario grande que necesita ser dividida en historias más pequeñas.' },
    { term: 'Incremento', definition: 'La suma de todos los Product Backlog items completados durante un Sprint y el valor de los incrementos anteriores.' },
    { term: 'Product Owner', definition: 'Rol responsable de maximizar el valor del producto y gestionar el Product Backlog.' },
    { term: 'Scrum Master', definition: 'Rol responsable de facilitar Scrum y ayudar al equipo a entender y aplicar la teoría, prácticas, reglas y valores de Scrum.' },
    { term: 'Sprint', definition: 'Período de tiempo fijo (1-4 semanas) durante el cual se crea un incremento de producto “Done”.' },
    { term: 'Sprint Goal', definition: 'Objetivo del Sprint que guía al equipo sobre qué construir y por qué.' },
    { term: 'Sprint Planning', definition: 'Evento al inicio del Sprint donde el equipo planifica el trabajo a realizar.' },
    { term: 'Sprint Retrospective', definition: 'Evento al final del Sprint donde el equipo inspecciona y mejora su proceso de trabajo.' },
    { term: 'Stakeholder', definition: 'Persona u organización que tiene interés en el producto pero no es parte del Scrum Team.' },
    { term: 'User Story', definition: 'Descripción corta y simple de una funcionalidad contada desde la perspectiva del usuario.' },
    { term: 'Velocity', definition: 'Medida de la cantidad de trabajo que un Development Team puede completar durante un Sprint.' },
    { term: 'WIP (Work In Progress)', definition: 'Trabajo que ha sido iniciado pero no completado. Limitar el WIP es un principio clave en Kanban.' },
  ];

  const plantillas = [
    {
      title: 'Plantilla de Historia de Usuario Ágil (PDF / Word)',
      description: 'Plantilla lista para usar en historias de usuario (“Como…, quiero…, para que…”).',
      format: 'PDF / DOCX',
      size: 'Variable',
      url: 'https://docsandslides.com/es/google-docs/plantilla-de-historia-de-usuario-agil/'
    },
    {
      title: 'Plantillas gratuitas de Scrum (Historias, Backlog, etc.)',
      description: 'Colección de plantillas descargables en Excel / PDF para distintos artefactos de Scrum.',
      format: 'PDF / XLSX',
      size: 'Variable',
      url: 'https://es.smartsheet.com/content/scrum-templates'
    },
    {
      title: 'Plantilla de Sprint Backlog',
      description: 'Formato de backlog de sprint para enumerar tareas, estimaciones, responsable, estado.',
      format: 'PDF',
      size: 'Variable',
      url: 'https://www.atlassian.com/es/software/jira/templates/sprint-backlog'
    },
    {
      title: 'Plantilla de Backlog de Producto',
      description: 'Herramienta para gestionar el Product Backlog y priorizar tareas en equipos ágiles.',
      format: 'PDF / Online',
      size: 'Variable',
      url: 'https://miro.com/es/plantillas/product-backlog/'
    },
    {
      title: 'Plantilla de Historias de Usuario con criterios de aceptación (PDF)',
      description: 'Documento PDF con ejemplos completos de historias de usuario y criterios de aceptación.',
      format: 'PDF',
      size: '180 KB',
      url: 'https://www.scrummanager.com/files/scrum_manager_historias_usuario.pdf'
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
              <div key={index} className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-20 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#DBEAFE' }}>
                    <BookOpen className="w-8 h-8" style={{ color: '#3B82F6' }} />
                  </div>
                </div>
                <h3 className="mb-2" style={{ color: '#1E293B', fontSize: '1.125rem', fontWeight: 600 }}>{libro.title}</h3>
                <p className="text-sm text-slate-600 mb-3">por {libro.author}</p>
                <p className="text-sm text-slate-500 mb-4">{libro.description}</p>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>{libro.pages ? `${libro.pages} páginas` : ''}</span>
                  <a href={libro.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    Ver más <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Artículos */}
        {activeTab === 'articulos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articulos.map((art, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow" style={{ borderColor: '#E2E8F0' }}>
                <FileText className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">{art.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{art.description}</p>
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>{art.source}</span> • <span>{art.readTime}</span>
                </div>
                <a href={art.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold text-sm flex items-center gap-1">
                  Leer <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Glosario */}
        {activeTab === 'glosario' && (
          <div>
            <div className="mb-6 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar término..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-4">
              {filteredGlosario.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-lg text-slate-800 mb-1">{item.term}</h3>
                  <p className="text-slate-600 text-sm">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plantillas */}
        {activeTab === 'plantillas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plantillas.map((plantilla, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Download className="w-6 h-6 text-purple-500 mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-2">{plantilla.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{plantilla.description}</p>
                <div className="flex justify-between mb-4 text-sm text-slate-500">
                  <span className="px-2 py-1 rounded bg-slate-100 font-semibold">{plantilla.format}</span>
                  <span>{plantilla.size}</span>
                </div>
                <a href={plantilla.url} target="_blank" rel="noopener noreferrer" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-center font-semibold text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Descargar
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
