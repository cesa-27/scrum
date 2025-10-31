// ============================================
// SEED DATA FOR DATABASE INITIALIZATION
// This data will be used when Supabase is not configured
// and also to populate the database initially
// ============================================

import type { Lesson, DragDropGame, CaseSimulation, Resource } from '../types';

// LESSONS SEED DATA
export const LESSONS_SEED_DATA: Lesson[] = [
  // Fundamentos Ágiles
  {
    id: 'fundamentos-1',
    section_id: 'fundamentos',
    section_title: 'Fundamentos Ágiles',
    section_description: 'Comprende los principios y valores que sustentan las metodologías ágiles',
    section_icon: 'BookOpen',
    section_color: '#3B82F6',
    title: '¿Qué es Agile?',
    duration: '15 min',
    order: 1,
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
    created_at: new Date().toISOString(),
  },
  {
    id: 'fundamentos-2',
    section_id: 'fundamentos',
    section_title: 'Fundamentos Ágiles',
    section_description: 'Comprende los principios y valores que sustentan las metodologías ágiles',
    section_icon: 'BookOpen',
    section_color: '#3B82F6',
    title: 'Ágil vs Tradicional',
    duration: '12 min',
    order: 2,
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
    created_at: new Date().toISOString(),
  },
  // Scrum Lessons
  {
    id: 'scrum-1',
    section_id: 'scrum',
    section_title: 'Scrum',
    section_description: 'Domina el framework ágil más popular del mundo',
    section_icon: 'Users',
    section_color: '#10B981',
    title: 'Roles en Scrum',
    duration: '20 min',
    order: 1,
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
    created_at: new Date().toISOString(),
  },
  {
    id: 'scrum-2',
    section_id: 'scrum',
    section_title: 'Scrum',
    section_description: 'Domina el framework ágil más popular del mundo',
    section_icon: 'Users',
    section_color: '#10B981',
    title: 'Eventos de Scrum',
    duration: '25 min',
    order: 2,
    content: {
      intro: 'Scrum estructura el trabajo en eventos de tiempo fijo que crean regularidad y minimizan reuniones innecesarias.',
      sections: [
        {
          subtitle: 'Sprint',
          text: 'El contenedor de todos los demás eventos. Duración: 1-4 semanas (típicamente 2). Durante el Sprint se crea un incremento de producto "Done".',
        },
        {
          subtitle: 'Sprint Planning',
          text: 'Reunión al inicio del Sprint donde el equipo planifica el trabajo.',
          points: [
            'Duración: máximo 8h para Sprint de 4 semanas',
            'Se define el Sprint Goal',
            'El equipo selecciona ítems del Product Backlog',
            'Se crea el Sprint Backlog',
            'Se responden: ¿Qué? y ¿Cómo?',
          ],
        },
        {
          subtitle: 'Daily Scrum',
          text: 'Reunión diaria de 15 minutos donde el equipo sincroniza actividades.',
          points: [
            'Misma hora y lugar cada día',
            'Solo el Development Team habla',
            'Se inspeccionan progresos hacia el Sprint Goal',
            'Se planifica el trabajo de las próximas 24h',
          ],
        },
        {
          subtitle: 'Sprint Review',
          text: 'Al final del Sprint, el equipo demuestra el trabajo completado a los stakeholders.',
          points: [
            'Duración: máximo 4h para Sprint de 4 semanas',
            'Se inspecciona el incremento',
            'Se obtiene feedback',
            'Se adapta el Product Backlog',
          ],
        },
        {
          subtitle: 'Sprint Retrospective',
          text: 'El equipo reflexiona sobre su proceso y crea un plan de mejora.',
          points: [
            'Ocurre después del Review y antes del siguiente Planning',
            'Duración: máximo 3h para Sprint de 4 semanas',
            '¿Qué salió bien? ¿Qué puede mejorar?',
            'Se identifican acciones de mejora',
          ],
        },
      ],
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'scrum-3',
    section_id: 'scrum',
    section_title: 'Scrum',
    section_description: 'Domina el framework ágil más popular del mundo',
    section_icon: 'Users',
    section_color: '#10B981',
    title: 'Artefactos de Scrum',
    duration: '18 min',
    order: 3,
    content: {
      intro: 'Los artefactos de Scrum representan trabajo o valor y proporcionan transparencia y oportunidades de inspección y adaptación.',
      sections: [
        {
          subtitle: 'Product Backlog',
          text: 'Lista ordenada de todo lo que podría ser necesario en el producto. Es la única fuente de requisitos.',
          points: [
            'Gestionado por el Product Owner',
            'Ordenado por valor, riesgo, y dependencias',
            'Refinado continuamente',
            'Transparente y visible para todos',
            'Los ítems más prioritarios están más detallados',
          ],
        },
        {
          subtitle: 'Sprint Backlog',
          text: 'Conjunto de ítems del Product Backlog seleccionados para el Sprint, más el plan para entregarlos.',
          points: [
            'Propiedad del Development Team',
            'Incluye el Sprint Goal',
            'Puede modificarse durante el Sprint',
            'Altamente visible',
            'Plan en tiempo real del trabajo',
          ],
        },
        {
          subtitle: 'Incremento',
          text: 'La suma de todos los ítems del Product Backlog completados durante un Sprint y el valor de todos los Sprints anteriores.',
          points: [
            'Debe estar en condición "Done"',
            'Debe ser potencialmente entregable',
            'Debe cumplir la Definition of Done',
            'Es inspeccionado en el Sprint Review',
          ],
        },
      ],
    },
    created_at: new Date().toISOString(),
  },
  // Kanban
  {
    id: 'kanban-1',
    section_id: 'kanban',
    section_title: 'Kanban',
    section_description: 'Aprende a visualizar y optimizar el flujo de trabajo',
    section_icon: 'Package',
    section_color: '#F59E0B',
    title: 'Principios de Kanban',
    duration: '15 min',
    order: 1,
    content: {
      intro: 'Kanban es un método para gestionar el trabajo del conocimiento con énfasis en la entrega just-in-time y la no sobrecarga del equipo.',
      sections: [
        {
          subtitle: 'Los 4 Principios Básicos',
          points: [
            'Empieza con lo que haces ahora',
            'Acuerda buscar el cambio incremental y evolutivo',
            'Respeta los procesos, roles y responsabilidades actuales',
            'Fomenta el liderazgo en todos los niveles',
          ],
        },
        {
          subtitle: 'Las 6 Prácticas Core',
          text: 'Visualizar, Limitar WIP, Gestionar el flujo, Hacer políticas explícitas, Implementar ciclos de feedback, Mejorar colaborativamente.',
        },
      ],
    },
    created_at: new Date().toISOString(),
  },
  // PMBOK
  {
    id: 'pmbok-1',
    section_id: 'pmbok',
    section_title: 'PMBOK Ágil',
    section_description: 'Integra PMBOK con prácticas ágiles',
    section_icon: 'Calendar',
    section_color: '#8B5CF6',
    title: 'PMBOK en Contextos Ágiles',
    duration: '22 min',
    order: 1,
    content: {
      intro: 'El PMBOK (Project Management Body of Knowledge) del PMI puede integrarse efectivamente con metodologías ágiles.',
      sections: [
        {
          subtitle: 'Áreas de Conocimiento Clave',
          text: 'Las 10 áreas de conocimiento del PMBOK (Integración, Alcance, Cronograma, Costos, Calidad, Recursos, Comunicaciones, Riesgos, Adquisiciones, Stakeholders) se adaptan en contextos ágiles.',
        },
        {
          subtitle: 'Gestión de Alcance en Ágil',
          points: [
            'El alcance es flexible y evoluciona',
            'Product Backlog como herramienta de alcance',
            'User Stories definen requisitos',
            'Priorización continua del valor',
          ],
        },
        {
          subtitle: 'Gestión de Cronograma',
          points: [
            'Sprints de tiempo fijo',
            'Velocity para estimación',
            'Burndown charts para seguimiento',
            'Planificación iterativa vs cascada',
          ],
        },
      ],
    },
    created_at: new Date().toISOString(),
  },
];

// QUIZZES SEED DATA (reusing from existing QuizModule)
export const QUIZZES_SEED_DATA = [
  {
    id: 'quiz-roles',
    title: 'Quiz: Roles en Scrum',
    description: 'Evalúa tu conocimiento sobre los tres roles principales de Scrum',
    difficulty: 'Básico' as const,
    questions_data: [
      {
        question: '¿Quién es el responsable de maximizar el valor del producto?',
        options: ['Scrum Master', 'Product Owner', 'Development Team', 'Stakeholders'],
        correct: 1,
        feedback: 'Correcto! El Product Owner es el único responsable de maximizar el valor del producto y gestionar el Product Backlog.',
        incorrectFeedback: 'Incorrecto. El Product Owner es quien tiene la responsabilidad de maximizar el valor del producto.',
      },
      {
        question: '¿Cuál es el tamaño ideal de un Development Team?',
        options: ['2-3 personas', '3-9 personas', '10-15 personas', 'No hay límite'],
        correct: 1,
        feedback: 'Excelente! El tamaño ideal es de 3 a 9 personas para mantener la comunicación efectiva y la agilidad.',
        incorrectFeedback: 'El tamaño ideal es de 3 a 9 personas para balance entre habilidades y comunicación.',
      },
      {
        question: '¿Quién facilita los eventos de Scrum y elimina impedimentos?',
        options: ['Product Owner', 'Project Manager', 'Scrum Master', 'Tech Lead'],
        correct: 2,
        feedback: 'Correcto! El Scrum Master es el facilitador del proceso y protector del equipo.',
        incorrectFeedback: 'El Scrum Master es quien facilita los eventos y elimina impedimentos del equipo.',
      },
      {
        question: '¿Puede el Scrum Master ser también un miembro del Development Team?',
        options: ['Sí, siempre', 'No, nunca', 'Sí, pero no es recomendable en equipos pequeños', 'Solo si tiene experiencia técnica'],
        correct: 2,
        feedback: 'Correcto! Es posible pero no recomendable, especialmente en equipos pequeños, ya que puede crear conflictos de rol.',
        incorrectFeedback: 'Es posible pero crea conflictos, especialmente en equipos pequeños donde ambos roles demandan mucho tiempo.',
      },
      {
        question: '¿Quién acepta o rechaza el incremento de producto al final del Sprint?',
        options: ['Scrum Master', 'Product Owner', 'Todo el equipo Scrum', 'Los Stakeholders'],
        correct: 1,
        feedback: 'Perfecto! El Product Owner es quien tiene la autoridad final para aceptar o rechazar el trabajo completado.',
        incorrectFeedback: 'El Product Owner es el único autorizado para aceptar o rechazar el incremento del producto.',
      },
    ],
  },
  {
    id: 'quiz-eventos',
    title: 'Quiz: Eventos de Scrum',
    description: 'Pon a prueba tu comprensión de los eventos y ceremonias de Scrum',
    difficulty: 'Intermedio' as const,
    questions_data: [
      {
        question: '¿Cuál es la duración máxima del Daily Scrum?',
        options: ['15 minutos', '30 minutos', '1 hora', 'No tiene límite'],
        correct: 0,
        feedback: 'Correcto! El Daily Scrum tiene una duración fija de 15 minutos para mantener el foco.',
        incorrectFeedback: 'El Daily Scrum siempre dura 15 minutos, sin importar el tamaño del equipo.',
      },
      {
        question: '¿Cuándo ocurre la Sprint Retrospective?',
        options: ['Al inicio del Sprint', 'A mitad del Sprint', 'Después del Review y antes del siguiente Planning', 'Durante el Daily Scrum'],
        correct: 2,
        feedback: 'Excelente! La Retrospective ocurre después del Review, cerrando el Sprint actual antes de iniciar el siguiente.',
        incorrectFeedback: 'La Retrospective ocurre después del Sprint Review y antes del siguiente Sprint Planning.',
      },
      {
        question: '¿Qué se define durante el Sprint Planning?',
        options: ['Solo el Sprint Goal', 'Solo qué ítems del backlog se harán', 'El Sprint Goal y cómo se logrará', 'La velocidad del equipo'],
        correct: 2,
        feedback: 'Perfecto! En el Sprint Planning se responden dos preguntas clave: ¿Qué? y ¿Cómo?',
        incorrectFeedback: 'En el Sprint Planning se define tanto el QUÉ (Sprint Goal y backlog items) como el CÓMO (plan de trabajo).',
      },
      {
        question: '¿Quién debe asistir obligatoriamente al Sprint Review?',
        options: ['Solo el Product Owner', 'Solo el Development Team', 'Todo el equipo Scrum y los Stakeholders invitados', 'Solo los Stakeholders'],
        correct: 2,
        feedback: 'Correcto! El Sprint Review es un evento colaborativo donde participan todos.',
        incorrectFeedback: 'El Sprint Review requiere la presencia de todo el equipo Scrum más los Stakeholders invitados.',
      },
      {
        question: '¿Se puede cancelar un Sprint una vez iniciado?',
        options: ['Sí, el Product Owner puede cancelarlo si el Sprint Goal se vuelve obsoleto', 'No, nunca', 'Sí, cualquier miembro del equipo puede cancelarlo', 'Solo si todos están de acuerdo'],
        correct: 0,
        feedback: 'Correcto! Solo el Product Owner tiene autoridad para cancelar un Sprint si el objetivo ya no tiene sentido.',
        incorrectFeedback: 'Solo el Product Owner puede cancelar un Sprint, y solo cuando el Sprint Goal se vuelve obsoleto.',
      },
    ],
  },
  {
    id: 'quiz-artefactos',
    title: 'Quiz: Artefactos de Scrum',
    description: 'Demuestra tu conocimiento sobre los artefactos de Scrum',
    difficulty: 'Básico' as const,
    questions_data: [
      {
        question: '¿Quién es el dueño del Product Backlog?',
        options: ['El Development Team', 'El Product Owner', 'El Scrum Master', 'La organización'],
        correct: 1,
        feedback: 'Correcto! El Product Owner es responsable del Product Backlog, incluyendo su contenido y priorización.',
        incorrectFeedback: 'El Product Owner es el único responsable del Product Backlog.',
      },
      {
        question: '¿Qué significa que un incremento esté "Done"?',
        options: ['Que está programado', 'Que cumple la Definition of Done y es potencialmente entregable', 'Que pasó code review', 'Que el PO lo aprobó'],
        correct: 1,
        feedback: 'Excelente! "Done" significa que cumple todos los criterios de calidad y está listo para producción.',
        incorrectFeedback: '"Done" significa que cumple la Definition of Done acordada y es potencialmente entregable.',
      },
      {
        question: '¿Puede modificarse el Sprint Backlog durante el Sprint?',
        options: ['No, nunca', 'Sí, por el Product Owner', 'Sí, por el Development Team según aprenden más', 'Solo en el Daily Scrum'],
        correct: 2,
        feedback: 'Correcto! El Development Team puede ajustar el Sprint Backlog según aprende más durante el Sprint.',
        incorrectFeedback: 'El Development Team puede modificar el Sprint Backlog durante el Sprint según aprenden más sobre el trabajo.',
      },
      {
        question: '¿Cómo deben ordenarse los ítems en el Product Backlog?',
        options: ['Por complejidad técnica', 'Por valor, riesgo y dependencias', 'Alfabéticamente', 'Por preferencia del equipo'],
        correct: 1,
        feedback: 'Perfecto! El Product Owner ordena el backlog considerando valor de negocio, riesgos y dependencias.',
        incorrectFeedback: 'El Product Backlog se ordena principalmente por valor de negocio, considerando también riesgos y dependencias.',
      },
    ],
  },
];

// GAMES SEED DATA
export const GAMES_SEED_DATA: DragDropGame[] = [
  {
    id: 'roles-match',
    title: 'Empareja Roles con Responsabilidades',
    description: 'Arrastra cada responsabilidad al rol correcto',
    difficulty: 'Básico',
    game_type: 'roles-match',
    game_data: {
      roles: [
        { id: 'po', name: 'Product Owner', color: '#3B82F6' },
        { id: 'sm', name: 'Scrum Master', color: '#10B981' },
        { id: 'dev', name: 'Development Team', color: '#F59E0B' },
      ],
      responsibilities: [
        { id: 'resp1', text: 'Maximizar el valor del producto', correctRole: 'po' },
        { id: 'resp2', text: 'Facilitar eventos de Scrum', correctRole: 'sm' },
        { id: 'resp3', text: 'Crear el incremento del producto', correctRole: 'dev' },
        { id: 'resp4', text: 'Gestionar el Product Backlog', correctRole: 'po' },
        { id: 'resp5', text: 'Eliminar impedimentos del equipo', correctRole: 'sm' },
        { id: 'resp6', text: 'Estimar el trabajo del Sprint', correctRole: 'dev' },
      ],
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'events-order',
    title: 'Ordena los Eventos de Scrum',
    description: 'Coloca los eventos en el orden correcto dentro de un Sprint',
    difficulty: 'Intermedio',
    game_type: 'events-order',
    game_data: {
      correctOrder: ['planning', 'daily', 'review', 'retrospective'],
      items: [
        { id: 'planning', name: 'Sprint Planning', emoji: '📋' },
        { id: 'daily', name: 'Daily Scrum', emoji: '☀️' },
        { id: 'review', name: 'Sprint Review', emoji: '👀' },
        { id: 'retrospective', name: 'Sprint Retrospective', emoji: '🔄' },
      ],
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'artifacts-match',
    title: 'Conecta Artefactos con sus Características',
    description: 'Une cada artefacto con su descripción correcta',
    difficulty: 'Básico',
    game_type: 'artifacts-match',
    game_data: {
      artifacts: [
        { id: 'product-backlog', name: 'Product Backlog', emoji: '📝' },
        { id: 'sprint-backlog', name: 'Sprint Backlog', emoji: '📋' },
        { id: 'increment', name: 'Incremento', emoji: '✨' },
      ],
      descriptions: [
        { id: 'desc1', text: 'Lista ordenada de todo lo necesario en el producto', correct: 'product-backlog' },
        { id: 'desc2', text: 'Ítems seleccionados para el Sprint más el plan', correct: 'sprint-backlog' },
        { id: 'desc3', text: 'Suma de todos los ítems completados y "Done"', correct: 'increment' },
        { id: 'desc4', text: 'Gestionado por el Product Owner', correct: 'product-backlog' },
        { id: 'desc5', text: 'Propiedad del Development Team', correct: 'sprint-backlog' },
      ],
    },
    created_at: new Date().toISOString(),
  },
];

// CASES SEED DATA (from CaseSimulator component)
export const CASES_SEED_DATA: CaseSimulation[] = [
  {
    id: 'case1',
    title: 'Crisis en el Sprint',
    description: 'El Product Owner quiere agregar una funcionalidad urgente a mitad del Sprint',
    difficulty: 'Intermedio',
    scenario: {
      steps: [
        {
          situation: 'Estás en el día 5 de un Sprint de 2 semanas. El Product Owner te llama urgentemente: "Nuestro cliente más importante necesita una nueva funcionalidad de reportes para mañana. Es crítico para renovar el contrato. Necesito que el equipo la desarrolle HOY."',
          question: '¿Cuál es tu respuesta como Scrum Master?',
          options: [
            {
              text: 'Acepto inmediatamente y pido al equipo que trabaje horas extra para completarlo',
              feedback: 'Incorrecto. Esto viola el Sprint Goal y la autoorganización del equipo. Además, crear presión para horas extra es insostenible.',
              consequence: 'El equipo se siente presionado y desmotivado. El Sprint Goal original se ve comprometido.',
              score: 0,
            },
            {
              text: 'Explico que no podemos cambiar el Sprint Backlog, pero podemos discutirlo en el siguiente Sprint Planning',
              feedback: 'Buena respuesta. Proteges el Sprint actual y el Sprint Goal. Sin embargo, podrías explorar si realmente es tan urgente.',
              consequence: 'El PO entiende la situación. Acuerdan revisar la prioridad en el siguiente Sprint.',
              score: 7,
            },
            {
              text: 'Propongo una reunión urgente con el PO y el equipo para evaluar el impacto y considerar cancelar el Sprint si es necesario',
              feedback: '¡Excelente! Balanceas la urgencia del negocio con los principios de Scrum. La cancelación del Sprint es una opción válida cuando el Sprint Goal se vuelve obsoleto.',
              consequence: 'Realizan una reunión. El equipo y el PO evalúan el impacto juntos.',
              score: 10,
            },
          ],
        },
        {
          situation: 'En la reunión, el equipo estima que la funcionalidad requiere 3 días de trabajo. El Sprint actual termina en 5 días y ya tienen comprometido trabajo que completa el Sprint Goal.',
          question: '¿Qué propones?',
          options: [
            {
              text: 'Cancelar el Sprint actual, agregar la funcionalidad al nuevo Sprint y empezar mañana',
              feedback: 'Correcto, pero solo si el Sprint Goal actual ya no tiene valor. Cancela un Sprint es una decisión seria que debe evaluarse cuidadosamente.',
              consequence: 'Se cancela el Sprint. El trabajo "Done" se revisa. Se inicia un nuevo Sprint con la funcionalidad urgente priorizada.',
              score: 8,
            },
            {
              text: 'Completar el Sprint actual (5 días) y hacer el reporte en el siguiente Sprint con alta prioridad',
              feedback: 'Buena opción si el Sprint Goal actual sigue siendo valioso. Respeta el ritmo del equipo.',
              consequence: 'El equipo completa el Sprint actual con éxito. En el siguiente Sprint, priorizan el reporte y lo completan en 3 días.',
              score: 9,
            },
            {
              text: 'Dividir el equipo: algunos continúan el Sprint actual, otros trabajan en el reporte',
              feedback: 'Incorrecto. Dividir al equipo destruye la colaboración y el foco. Es una anti-práctica de Scrum.',
              consequence: 'El equipo se fragmenta. Ambos trabajos avanzan lentamente. La calidad disminuye.',
              score: 2,
            },
          ],
        },
        {
          situation: 'El cliente acepta esperar al siguiente Sprint. Sin embargo, el PO dice: "Necesito garantías de que estará listo en 3 días. Pueden comprometerse?"',
          question: '¿Cómo respondes?',
          options: [
            {
              text: 'Sí, el equipo se compromete a 3 días',
              feedback: 'Incorrecto. Solo el Development Team puede comprometerse. El Scrum Master no habla por ellos.',
              consequence: 'El equipo se siente presionado. No se les consultó y ahora tienen un compromiso que no hicieron.',
              score: 1,
            },
            {
              text: 'Es decisión del Development Team. Ellos estimarán y se comprometerán en el Sprint Planning',
              feedback: '¡Perfecto! Respetas la autoorganización del equipo y el proceso de Scrum.',
              consequence: 'En el Sprint Planning, el equipo revisa la User Story, la refina, y hace su propio compromiso basado en su velocidad.',
              score: 10,
            },
            {
              text: 'Probablemente sí, basándome en la velocidad histórica del equipo',
              feedback: 'Aceptable, pero ideal que el equipo mismo lo confirme en lugar de que tú hables por ellos.',
              consequence: 'Das una expectativa basada en datos, pero aclaras que el compromiso final es del equipo.',
              score: 7,
            },
          ],
        },
      ],
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'case2',
    title: 'Conflicto de Roles',
    description: 'Tensión entre el Product Owner y el Development Team sobre prioridades',
    difficulty: 'Avanzado',
    scenario: {
      steps: [
        {
          situation: 'Durante el Sprint Planning, el Product Owner presenta las User Stories más prioritarias. El Development Team las cuestiona: "Estas no aportan valor real al usuario. Hay deuda técnica crítica que debemos resolver primero o el sistema colapsará."',
          question: 'Como Scrum Master, ¿cuál es tu acción?',
          options: [
            {
              text: 'Apoyo al equipo. La deuda técnica debe priorizarse',
              feedback: 'Incorrecto. El PO decide el QUÉ. Tu rol es facilitar, no decidir prioridades.',
              consequence: 'El PO se molesta. Siente que su autoridad es cuestionada.',
              score: 3,
            },
            {
              text: 'Apoyo al PO. Él decide las prioridades del Product Backlog',
              feedback: 'Parcialmente correcto, pero ignoras una preocupación técnica legítima del equipo.',
              consequence: 'El equipo se frustra. Sienten que sus preocupaciones técnicas no son escuchadas.',
              score: 5,
            },
            {
              text: 'Facilito una conversación donde el equipo explica el impacto técnico y el PO explica el valor de negocio',
              feedback: '¡Excelente! Tu rol es facilitar la comunicación y entendimiento mutuo.',
              consequence: 'Ambas partes exponen sus puntos. Comienzan a entenderse mutuamente.',
              score: 10,
            },
          ],
        },
        {
          situation: 'El equipo explica: "Si no refactorizamos este módulo, cada nueva funcionalidad tomará el doble de tiempo. Ya estamos viendo el impacto." El PO responde: "Entiendo, pero tenemos compromisos con el cliente que no podemos romper."',
          question: '¿Qué solución propones?',
          options: [
            {
              text: 'Que el equipo dedique 20% de cada Sprint a deuda técnica sin consultar al PO',
              feedback: 'Incorrecto. Esto excluye al PO de decisiones del producto. La deuda técnica debe estar en el Product Backlog.',
              consequence: 'Se genera desconfianza. El PO siente que pierde control.',
              score: 2,
            },
            {
              text: 'Agregar la deuda técnica como User Stories en el Product Backlog para que el PO las priorice',
              feedback: '¡Perfecto! La deuda técnica debe ser visible y priorizada como cualquier otro ítem.',
              consequence: 'El equipo crea User Stories técnicas. El PO las entiende y las prioriza balanceando valor y riesgo técnico.',
              score: 10,
            },
            {
              text: 'Hacer la deuda técnica en secreto durante el desarrollo de features',
              feedback: 'Muy incorrecto. Falta transparencia, uno de los pilares de Scrum.',
              consequence: 'Pérdida total de confianza. El PO descubre que el equipo "esconde" trabajo.',
              score: 0,
            },
          ],
        },
      ],
    },
    created_at: new Date().toISOString(),
  },
];

// RESOURCES SEED DATA
export const RESOURCES_SEED_DATA: Resource[] = [
  // LIBROS
  {
    id: 'libro-1',
    type: 'libro',
    title: 'Scrum: The Art of Doing Twice the Work in Half the Time',
    description: 'El co-creador de Scrum explica cómo funciona el framework y por qué es tan efectivo.',
    author: 'Jeff Sutherland',
    category: 'Scrum',
    pages: 256,
    created_at: new Date().toISOString(),
  },
  {
    id: 'libro-2',
    type: 'libro',
    title: 'User Stories Applied',
    description: 'Guía práctica para escribir user stories efectivas en el desarrollo ágil.',
    author: 'Mike Cohn',
    category: 'Agile',
    pages: 304,
    created_at: new Date().toISOString(),
  },
  {
    id: 'libro-3',
    type: 'libro',
    title: 'The Scrum Guide',
    description: 'La guía oficial y definitiva de Scrum, actualizada regularmente.',
    author: 'Ken Schwaber & Jeff Sutherland',
    category: 'Scrum',
    pages: 19,
    created_at: new Date().toISOString(),
  },
  {
    id: 'libro-4',
    type: 'libro',
    title: 'Agile Estimating and Planning',
    description: 'Técnicas prácticas para estimación y planificación en proyectos ágiles.',
    author: 'Mike Cohn',
    category: 'Agile',
    pages: 368,
    created_at: new Date().toISOString(),
  },
  {
    id: 'libro-5',
    type: 'libro',
    title: 'PMBOK Guide',
    description: 'Guía fundamental de las mejores prácticas en gestión de proyectos.',
    author: 'Project Management Institute',
    category: 'PMBOK',
    pages: 756,
    created_at: new Date().toISOString(),
  },

  // ARTÍCULOS
  {
    id: 'articulo-1',
    type: 'articulo',
    title: 'Los 12 Principios del Manifiesto Ágil Explicados',
    description: 'Análisis profundo de cada uno de los 12 principios fundamentales del desarrollo ágil.',
    source: 'Agile Alliance',
    url: '#',
    read_time: '15 min',
    created_at: new Date().toISOString(),
  },
  {
    id: 'articulo-2',
    type: 'articulo',
    title: 'Cómo Escribir User Stories Efectivas',
    description: 'Guía paso a paso para crear user stories que agreguen valor real.',
    source: 'Mountain Goat Software',
    url: '#',
    read_time: '10 min',
    created_at: new Date().toISOString(),
  },
  {
    id: 'articulo-3',
    type: 'articulo',
    title: 'Sprint Retrospectives: Ideas y Técnicas',
    description: 'Técnicas innovadoras para hacer retrospectivas más efectivas y dinámicas.',
    source: 'Scrum.org',
    url: '#',
    read_time: '12 min',
    created_at: new Date().toISOString(),
  },
  {
    id: 'articulo-4',
    type: 'articulo',
    title: 'Definition of Done vs Acceptance Criteria',
    description: 'Comprende las diferencias clave entre DoD y criterios de aceptación.',
    source: 'Scrum Alliance',
    url: '#',
    read_time: '8 min',
    created_at: new Date().toISOString(),
  },

  // GLOSARIO
  {
    id: 'glosario-1',
    type: 'glosario',
    title: 'Backlog',
    description: 'Lista ordenada de todo el trabajo pendiente en un proyecto.',
    term: 'Backlog',
    definition: 'Lista ordenada de todo el trabajo pendiente en un proyecto. Puede ser Product Backlog (todo el producto) o Sprint Backlog (trabajo del sprint actual).',
    created_at: new Date().toISOString(),
  },
  {
    id: 'glosario-2',
    type: 'glosario',
    title: 'Burndown Chart',
    description: 'Gráfico que muestra el trabajo restante vs el tiempo.',
    term: 'Burndown Chart',
    definition: 'Gráfico que muestra el trabajo restante vs el tiempo. Ayuda a visualizar el progreso hacia completar el trabajo del Sprint o Release.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'glosario-3',
    type: 'glosario',
    title: 'Daily Scrum',
    description: 'Reunión diaria de 15 minutos.',
    term: 'Daily Scrum',
    definition: 'Reunión diaria de 15 minutos donde el Development Team sincroniza actividades y planifica el trabajo de las próximas 24 horas.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'glosario-4',
    type: 'glosario',
    title: 'Definition of Done (DoD)',
    description: 'Criterios compartidos de completitud.',
    term: 'Definition of Done (DoD)',
    definition: 'Criterios compartidos que definen cuándo un incremento está completo y listo para ser entregado.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'glosario-5',
    type: 'glosario',
    title: 'Epic',
    description: 'User Story grande que necesita dividirse.',
    term: 'Epic',
    definition: 'User Story grande que necesita ser dividida en stories más pequeñas antes de poder implementarse.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'glosario-6',
    type: 'glosario',
    title: 'Increment',
    description: 'La suma de todos los items completados.',
    term: 'Increment',
    definition: 'La suma de todos los Product Backlog items completados durante un Sprint y el valor de los incrementos de todos los Sprints anteriores.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'glosario-7',
    type: 'glosario',
    title: 'Product Owner',
    description: 'Responsable de maximizar el valor del producto.',
    term: 'Product Owner',
    definition: 'Rol responsable de maximizar el valor del producto y gestionar el Product Backlog.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'glosario-8',
    type: 'glosario',
    title: 'Sprint',
    description: 'Período de tiempo fijo.',
    term: 'Sprint',
    definition: 'Período de tiempo fijo (1-4 semanas) durante el cual se crea un incremento de producto "Done" y potencialmente entregable.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'glosario-9',
    type: 'glosario',
    title: 'Sprint Goal',
    description: 'Objetivo del Sprint.',
    term: 'Sprint Goal',
    definition: 'Objetivo que se establece para el Sprint y que proporciona guía al Development Team sobre por qué está construyendo el incremento.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'glosario-10',
    type: 'glosario',
    title: 'Velocity',
    description: 'Medida de trabajo completado.',
    term: 'Velocity',
    definition: 'Medida de la cantidad de trabajo que un Development Team puede completar durante un Sprint.',
    created_at: new Date().toISOString(),
  },

  // PLANTILLAS
  {
    id: 'plantilla-1',
    type: 'plantilla',
    title: 'Plantilla de Product Backlog',
    description: 'Formato Excel para gestionar y priorizar tu Product Backlog',
    format: 'XLSX',
    size: '45 KB',
    created_at: new Date().toISOString(),
  },
  {
    id: 'plantilla-2',
    type: 'plantilla',
    title: 'Plantilla de Sprint Planning',
    description: 'Documento para facilitar la planificación de Sprints',
    format: 'PDF',
    size: '120 KB',
    created_at: new Date().toISOString(),
  },
  {
    id: 'plantilla-3',
    type: 'plantilla',
    title: 'Tablero Kanban Digital',
    description: 'Plantilla editable de un tablero Kanban',
    format: 'PNG',
    size: '230 KB',
    created_at: new Date().toISOString(),
  },
  {
    id: 'plantilla-4',
    type: 'plantilla',
    title: 'Formato de User Story',
    description: 'Template para escribir user stories efectivas',
    format: 'DOCX',
    size: '35 KB',
    created_at: new Date().toISOString(),
  },
  {
    id: 'plantilla-5',
    type: 'plantilla',
    title: 'Guía de Retrospectiva',
    description: 'Actividades y formatos para Sprint Retrospectives',
    format: 'PDF',
    size: '280 KB',
    created_at: new Date().toISOString(),
  },
  {
    id: 'plantilla-6',
    type: 'plantilla',
    title: 'Checklist Definition of Done',
    description: 'Lista verificable de criterios para "Done"',
    format: 'PDF',
    size: '95 KB',
    created_at: new Date().toISOString(),
  },
];
