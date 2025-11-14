import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Environment,
} from "@react-three/drei";
import { MessageCircle, X, Send } from "lucide-react";

// 🔹 Modelo 3D (funciona con animado o estático)
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

  // movimiento leve flotante
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t * 0.5) * 0.25;
      ref.current.position.y = Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1.2} // 🔸 tamaño ajustado para ver todo el cuerpo
      position={[0, -1.3, 0]} // 🔸 bajamos un poco el modelo
    />
  );
}

export default function Bot3D() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hola, ¿en qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");

  // 📦 Posición del conjunto (drag completo)
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const startDrag = (e) => {
    isDragging.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const onDrag = (e) => {
    if (!isDragging.current) return;
    setPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
  };

  const stopDrag = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  // 📩 Enviar mensaje
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { from: "user", text: input },
      { from: "bot", text: "Entendido, cuéntame más detalles." },
    ]);
    setInput("");
  };

  return (
    <div
      onMouseDown={startDrag}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        cursor: "grab",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {/* 💬 Chat */}
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
          </div>

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

      {/* 🤖 Modelo 3D sin fondo */}
      {open && (
        <div
          style={{
            width: "220px",
            height: "260px",
            pointerEvents: "none", // para que no interfiera con el drag
          }}
        >
          <Suspense
            fallback={<div className="text-center text-sm text-slate-500">Cargando...</div>}
          >
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

      {/* 🔘 Burbuja de control */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
