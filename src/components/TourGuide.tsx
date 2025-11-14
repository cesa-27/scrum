import React, { useEffect, useState } from "react";

type StepPosition = "top" | "bottom" | "left" | "right";

interface Step {
  id: string;
  title: string;
  description: string;
  position: StepPosition;
}

const STEPS: Step[] = [
  {
    id: "navbar-main",
    title: "Navegación principal",
    description: "Aquí cambias entre Dashboard, Aprende, Práctica y Recursos.",
    position: "bottom",
  },
  {
    id: "card-progress",
    title: "Tu progreso general",
    description:
      "Aquí ves tu avance global, tu promedio de quizzes y tu tiempo total de estudio.",
    position: "bottom",
  },
  {
    id: "chart-progress",
    title: "Gráfica de progreso",
    description: "Tu crecimiento basado en tus actividades y quizzes.",
    position: "top",
  },
  {
    id: "recent-activity",
    title: "Actividad reciente",
    description: "Tus últimas acciones dentro de la plataforma.",
    position: "right",
  },
  {
    id: "continue-learning",
    title: "Seguir aprendiendo",
    description: "Accede directo a tu siguiente lección.",
    position: "left",
  },
];

export default function TourGuide() {
  const [step, setStep] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const current = STEPS[step];

  /* ========================
      INICIAR TOUR
  ========================= */
  useEffect(() => {
    localStorage.removeItem("tourDashboard_v3");

    const timer = setTimeout(() => {
      const el = document.getElementById(current.id);
      if (el) {
        setTarget(el);
        setEnabled(true);
        scrollIntoViewSmooth(el);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  /* ========================
      CAMBIO DE PASO
  ========================= */
  useEffect(() => {
    if (!enabled) return;

    const el = document.getElementById(current.id);
    if (el) {
      setTarget(el);
      scrollIntoViewSmooth(el);
    }
  }, [step, enabled]);

  /* =========================
      AUTOSCROLL
  ========================= */
  function scrollIntoViewSmooth(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const y = rect.top + window.scrollY - window.innerHeight / 3;

    window.scrollTo({
      top: Math.max(0, y),
      behavior: "smooth",
    });
  }

  /* =========================
      SIGUIENTE / SALTAR
  ========================= */
  function next() {
    if (step + 1 >= STEPS.length) {
      localStorage.setItem("tourDashboard_v3", "true");
      setEnabled(false);
      return;
    }

    setStep(step + 1);
  }

  function skip() {
    localStorage.setItem("tourDashboard_v3", "true");
    setEnabled(false);
  }

  if (!enabled || !target) return null;

  const rect = target.getBoundingClientRect();

  /* =========================
      SPOTLIGHT
  ========================= */
  const spotlightStyle: React.CSSProperties = {
    position: "fixed",
    top: rect.top - 12,
    left: rect.left - 12,
    width: rect.width + 24,
    height: rect.height + 24,
    borderRadius: 16,
    boxShadow: "0 0 0 2000px rgba(0,0,0,0.55)",
    backdropFilter: "blur(3px)",
    transition: "all 0.25s ease",
    zIndex: 99998,
  };

  /* =========================
      TOOLTIP SEGURO
  ========================= */
  const tooltipWidth = 300;
  const tooltipHeight = 170;

  let top =
    current.position === "bottom"
      ? rect.bottom + 80
      : current.position === "top"
      ? rect.top - 80
      : rect.top + rect.height / 2;

  let left = rect.left + rect.width / 2;

  // Correcciones horizontales
  if (left - tooltipWidth / 2 < 10) left = tooltipWidth / 2 + 20;
  if (left + tooltipWidth / 2 > window.innerWidth)
    left = window.innerWidth - tooltipWidth / 2 - 20;

  // ⭐ CORRECCIÓN CRÍTICA PARA EVITAR QUE SE SALGA POR ABAJO ⭐
  const viewportHeight = window.innerHeight;

  if (top + tooltipHeight / 2 > viewportHeight - 20) {
    top = viewportHeight - tooltipHeight / 2 - 20;
  }

  if (top - tooltipHeight / 2 < 20) {
    top = tooltipHeight / 2 + 20;
  }

  const tooltipStyle: React.CSSProperties = {
    position: "fixed",
    top,
    left,
    transform: "translate(-50%, -50%)",
    width: tooltipWidth,
    height: tooltipHeight,
    background: "white",
    padding: "20px",
    borderRadius: 14,
    zIndex: 99999,
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
    fontFamily: "Inter, sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  /* =========================
      FLECHA
  ========================= */
  const arrowStyle: React.CSSProperties =
    current.position === "bottom"
      ? {
          position: "absolute",
          top: -10,
          left: "50%",
          transform: "translateX(-50%)",
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom: "10px solid white",
        }
      : current.position === "top"
      ? {
          position: "absolute",
          bottom: -10,
          left: "50%",
          transform: "translateX(-50%)",
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "10px solid white",
        }
      : current.position === "left"
      ? {
          position: "absolute",
          right: -10,
          top: "50%",
          transform: "translateY(-50%)",
          borderTop: "10px solid transparent",
          borderBottom: "10px solid transparent",
          borderLeft: "10px solid white",
        }
      : {
          position: "absolute",
          left: -10,
          top: "50%",
          transform: "translateY(-50%)",
          borderTop: "10px solid transparent",
          borderBottom: "10px solid transparent",
          borderRight: "10px solid white",
        };

  /* =========================
      RENDER
  ========================= */
  return (
    <>
      <div style={spotlightStyle}></div>

      <div style={tooltipStyle}>
        <div style={arrowStyle}></div>

        <h2 style={{ fontWeight: 700, fontSize: 18 }}>{current.title}</h2>
        <p style={{ fontSize: 14, color: "#555" }}>{current.description}</p>

        <div style={{ display: "flex", gap: 6 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 26,
                height: 4,
                borderRadius: 999,
                background: i <= step ? "#2563EB" : "#CBD5E1",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={skip} style={{ fontSize: 12, color: "#6B7280" }}>
            Saltar
          </button>
          <button
            onClick={next}
            style={{
              padding: "8px 16px",
              background: "#2563EB",
              color: "white",
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            {step + 1 === STEPS.length ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      </div>
    </>
  );
}
