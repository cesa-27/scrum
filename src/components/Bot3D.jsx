import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Environment,
} from "@react-three/drei";
import { MessageCircle, X, Send } from "lucide-react";


// ======================================================================
//     RESPUESTAS INTELIGENTES (VERSIÓN LARGA, UN SOLO PÁRRAFO)
// ======================================================================
function getBotResponse(userText) {
  const text = userText.toLowerCase();

  // SCRUM
  if (text.includes("scrum")) {
    return "Scrum es un marco de trabajo ágil que organiza el desarrollo en ciclos cortos llamados Sprints, donde el equipo entrega incrementos funcionales del producto y se enfoca en la mejora continua mediante roles definidos, ceremonias y artefactos claros.";
  }

  // AGILE
  if (text.includes("ágil") || text.includes("agile")) {
    return "Agile es un enfoque de trabajo flexible que prioriza la adaptación al cambio, la colaboración constante y la entrega continua de valor mediante iteraciones cortas y retroalimentación frecuente entre el equipo y los interesados.";
  }

  // TRADICIONAL
  if (text.includes("tradicional") || text.includes("cascada")) {
    return "La metodología tradicional sigue un proceso secuencial donde cada fase debe completarse antes de avanzar a la siguiente, lo cual dificulta la adaptación al cambio una vez iniciado el proyecto.";
  }

  // ROLES SCRUM
  if (
    text.includes("roles") ||
    text.includes("product owner") ||
    text.includes("scrum master") ||
    text.includes("developer")
  ) {
    return "Los roles de Scrum son el Product Owner, que maximiza el valor del producto; el Scrum Master, que facilita el proceso y elimina impedimentos; y los Developers, responsables de construir el incremento durante cada Sprint.";
  }

  // CEREMONIAS SCRUM
  if (text.includes("ceremonias") || text.includes("events") || text.includes("reuniones")) {
    return "Las ceremonias de Scrum incluyen el Sprint Planning para planificar el Sprint, el Daily Scrum para coordinar el trabajo diario, el Refinement para mejorar el Product Backlog, el Sprint Review para revisar el incremento y la Sprint Retrospective para reflexionar sobre el proceso.";
  }

  // ARTEFACTOS SCRUM
  if (text.includes("artefactos") || text.includes("product backlog") || text.includes("sprint backlog") || text.includes("increment")) {
    return "Los artefactos de Scrum son el Product Backlog que contiene todas las necesidades priorizadas del producto, el Sprint Backlog que define el trabajo del Sprint, y el Increment que es el resultado terminado y funcional al final de cada Sprint.";
  }

  // SPRINT
  if (text.includes("sprint")) {
    return "Un Sprint es un ciclo de tiempo fijo, generalmente de una a cuatro semanas, en el que el equipo desarrolla un incremento potencialmente entregable del producto mediante un proceso iterativo e incremental.";
  }


  // ======================
  // TEMAS NUEVOS: KANBAN, LEAN, XP, ETC.
  // ======================

  // KANBAN
  if (text.includes("kanban")) {
    return "Kanban es un método visual que organiza el trabajo mediante tarjetas y columnas, enfocándose en limitar el trabajo en progreso y mejorar el flujo continuo para incrementar la eficiencia del equipo.";
  }

  // LEAN
  if (text.includes("lean")) {
    return "Lean es un enfoque que busca maximizar el valor entregado al cliente reduciendo desperdicios, optimizando el flujo y promoviendo la mejora continua en todas las etapas del proceso de desarrollo.";
  }

  // XP
  if (text.includes("xp") || text.includes("extreme programming")) {
    return "Extreme Programming (XP) es una metodología ágil enfocada en mejorar la calidad del software mediante prácticas como desarrollo guiado por pruebas, programación en pareja, integración continua y ciclos de entrega muy cortos.";
  }

  // HISTORIAS DE USUARIO
  if (text.includes("historia") || text.includes("user story") || text.includes("historias de usuario")) {
    return "Una historia de usuario es una descripción breve de una necesidad del usuario escrita en lenguaje natural que facilita la conversación, la comprensión del valor y la priorización dentro del Product Backlog.";
  }

  // VELOCITY
  if (text.includes("velocity") || text.includes("velocidad")) {
    return "La Velocidad es una métrica que indica la cantidad de puntos completados por el equipo en un Sprint, permitiendo estimar la capacidad futura y ayudar en la planificación realista de las iteraciones.";
  }

  // BURNDOWN
  if (text.includes("burndown")) {
    return "El Burndown Chart es una gráfica que muestra el trabajo restante en un Sprint y permite visualizar si el equipo está avanzando al ritmo esperado o necesita ajustar su planificación.";
  }

  // DOD
  if (text.includes("definition of done") || text.includes("dod") || text.includes("done")) {
    return "La Definition of Done es un acuerdo que establece los criterios mínimos de calidad que un incremento debe cumplir para considerarse terminado, asegurando consistencia y claridad sobre el estado del trabajo.";
  }

  // DOR
  if (text.includes("definition of ready") || text.includes("dor") || text.includes("ready")) {
    return "La Definition of Ready es un conjunto de criterios que definen cuándo una historia de usuario está suficientemente preparada, refinada y estimada como para ser incluida en un Sprint.";
  }

  // ROADMAP
  if (text.includes("roadmap") || text.includes("hoja de ruta")) {
    return "Un Roadmap es una planificación de alto nivel que muestra la evolución esperada del producto a lo largo del tiempo, incluyendo hitos, entregas importantes y prioridades estratégicas.";
  }

  // PLANNING POKER
  if (text.includes("poker") || text.includes("planning poker")) {
    return "Planning Poker es una técnica colaborativa de estimación donde los miembros del equipo asignan puntos a las historias utilizando cartas numeradas, fomentando la discusión y logrando un consenso más preciso.";
  }

  // AUTOORGANIZACIÓN
  if (text.includes("autoorgan") || text.includes("autónomo") || text.includes("autoorganizado")) {
    return "Un equipo autoorganizado es aquel que decide internamente cómo abordar su trabajo, distribuye responsabilidades, resuelve problemas y mejora continuamente sin necesidad de supervisión externa directa.";
  }


  // DEFAULT
  return "Puedo ayudarte con temas relacionados a Scrum, Agile, roles, ceremonias, artefactos, Lean, Kanban, XP, historias de usuario, Velocity, Burndown, Definition of Done, Definition of Ready, Roadmaps, Planning Poker y otros conceptos ágiles. Pregúntame sobre cualquiera de ellos.";
}



// ======================================================================
//              MODELO 3D (SIN CAMBIOS)
// ======================================================================
function BotModel() {
  const ref = useRef();
  const { scene, animations } = useGLTF(`${import.meta.env.BASE_URL}bot3d.glb`, true);
  const { actions } = useAnimations(animations || [], ref);

  useEffect(() => {
    if (actions && animations.length > 0) {
      const action = actions[animations[0].name];
      if (action) {
        action.reset().fadeIn(0.5).play();
        return () => action.fadeOut(0.5).stop();
      }
    }
  }, [actions, animations]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t * 0.5) * 0.25;
      ref.current.position.y = Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <primitive ref={ref} object={scene} scale={1.2} position={[0, -1.3, 0]} />
  );
}



// ======================================================================
//                 COMPONENTE PRINCIPAL DEL CHAT 3D
// ======================================================================
export default function Bot3D() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hola, ¿sobre qué tema de Scrum o Agile te gustaría aprender?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // POSICIÓN DEL DRAG
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });



  // ============================================================
  //         FIX PARA QUE LA BURBUJA NO DESAPAREZCA
  // ============================================================
  const startDrag = (e) => {
    // Si tocas el botón del bot → NO arrastrar
    if (e.target.closest(".bot-button")) {
      return;
    }

    isDragging.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const onDrag = (e) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const stopDrag = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };



  // ============================================================
  //                 ENVÍO DE MENSAJE
  // ============================================================
  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setTyping(true);

    setTimeout(() => {
      const botReply = getBotResponse(userText);

      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
      setTyping(false);
    }, 900);
  };



  return (
    <div
      onMouseDown={startDrag}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        cursor: "grab",
        zIndex: 999999, // Mantener siempre visible
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >


      {/* PANEL DEL CHAT */}
      {open && (
        <div
          className="w-[280px] bg-white border border-slate-200 flex flex-col overflow-hidden"
          style={{
            borderRadius: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            marginBottom: "12px",
          }}
        >
          <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-2 rounded-t-2xl">
            Asistente 3D
          </div>

          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2 max-h-[220px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.from === "bot"
                    ? "bg-blue-100 text-slate-800 self-start"
                    : "bg-blue-600 text-white self-end ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {typing && (
              <div className="bg-blue-100 text-slate-600 p-2 rounded-lg w-[80px] text-xs">
                escribiendo...
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="flex items-center border-t border-slate-200">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe aquí..."
              className="flex-1 px-3 py-2 text-sm outline-none rounded-bl-2xl"
            />
            <button
              onClick={handleSend}
              className="p-2 text-blue-600 hover:text-blue-800 rounded-br-2xl"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}



      {/* MODELO 3D */}
      {open && (
        <div
          style={{
            width: "220px",
            height: "260px",
            pointerEvents: "none",
          }}
        >
          <Suspense fallback={<div className="text-center text-sm text-slate-500">Cargando...</div>}>
            <Canvas camera={{ position: [0, 1.5, 3.2], fov: 40 }}>
              <ambientLight intensity={1.3} />
              <directionalLight position={[2, 5, 2]} intensity={1.8} />
              <Environment preset="sunset" />
              <BotModel />
              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.1} />
            </Canvas>
          </Suspense>
        </div>
      )}



      {/* BOTÓN DEL BOT — TOTALMENTE AZUL */}
      <button
        onClick={() => setOpen(!open)}
        className="bot-button bg-blue-700 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform border-2 border-blue-900"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>


    </div>
  );
}
