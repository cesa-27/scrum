// Aprende.tsx
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  CheckCircle,
  ChevronRight,
  Play,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface AprendeProps {
  completedLessons: string[];
  onCompleteLesson: (lessonId: string) => void;
}

export function Aprende({ completedLessons, onCompleteLesson }: AprendeProps) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 🔊 Lector de voz
  const speak = (text: string) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-MX"; // español mexicano
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // 🎙️ Control por voz
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("El reconocimiento de voz no está disponible en este navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript.trim().toLowerCase();
      setRecognizedText(text);
      handleVoiceCommand(text);
    };

    if (listening) recognition.start();
    else recognition.stop();

    return () => recognition.stop();
  }, [listening]);

  // 🧠 Interpretar comandos de voz
  const handleVoiceCommand = (command: string) => {
    console.log("Comando de voz:", command);

    if (command.includes("abrir fundamentos")) setSelectedLesson("fundamentos-1");
    else if (command.includes("abrir tradicional")) setSelectedLesson("fundamentos-2");
    else if (command.includes("abrir scrum")) setSelectedLesson("scrum-1");
    else if (command.includes("volver") || command.includes("regresar")) setSelectedLesson(null);
    else if (command.includes("completar") || command.includes("terminar")) {
      if (selectedLesson) handleCompleteLesson(selectedLesson);
    }
    else if (command.includes("reproducir") || command.includes("play")) {
      const iframe = document.querySelector("iframe");
      if (iframe) {
        const src = iframe.getAttribute("src");
        if (src && !src.includes("autoplay=1")) {
          iframe.setAttribute("src", src + "?autoplay=1");
        }
      }
    }
    else if (command.includes("leer")) {
      const text = document.body.innerText;
      speak(text);
    }
    else if (command.includes("detener lectura")) {
      stopSpeaking();
    }
  };

  // 📘 Lecciones
  const sections = [
    {
      id: "fundamentos",
      title: "Fundamentos Ágiles",
      description:
        "Aprende el origen, los valores, los principios y la evolución del pensamiento ágil.",
      icon: BookOpen,
      color: "#3B82F6",
      lessons: [
        {
          id: "fundamentos-1",
          title: "¿Qué es Agile?",
          videoUrl: "https://www.youtube.com/embed/xlmEwPHeO4k",
          content: {
            intro:
              "Agile es una filosofía de trabajo que prioriza la adaptabilidad, la colaboración y la entrega continua de valor.",
            sections: [
              {
                subtitle: "Origen del Movimiento Ágil",
                text: `En los años 90, los equipos de software se enfrentaban a grandes retrasos y sobrecostos. En 2001, diecisiete desarrolladores crearon el Manifiesto Ágil en Snowbird, Utah.`,
              },
              {
                subtitle: "Los 4 Valores del Manifiesto Ágil",
                points: [
                  "Individuos e interacciones sobre procesos y herramientas.",
                  "Software funcionando sobre documentación extensiva.",
                  "Colaboración con el cliente sobre negociación contractual.",
                  "Respuesta ante el cambio sobre seguir un plan.",
                ],
              },
              {
                subtitle: "Agile Hoy",
                text: "Hoy Agile está presente en empresas de todo tipo. Su enfoque adaptable permite responder al cambio en entornos complejos.",
              },
            ],
          },
        },
        {
          id: "fundamentos-2",
          title: "Ágil vs Tradicional",
          videoUrl: "https://www.youtube.com/embed/JpSMlo7uZ_s",
          content: {
            intro:
              "Comprender las diferencias entre los métodos tradicionales y los ágiles es esencial para aplicar la estrategia correcta.",
            sections: [
              {
                subtitle: "Metodología Tradicional (Cascada)",
                text: "El modelo en cascada sigue una secuencia rígida: requisitos → diseño → desarrollo → pruebas → entrega.",
              },
              {
                subtitle: "Metodología Ágil",
                text: "El enfoque ágil divide el trabajo en iteraciones cortas llamadas sprints. Cada sprint produce un incremento funcional.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "scrum",
      title: "Scrum",
      description:
        "Descubre cómo Scrum estructura el trabajo en equipo a través de roles, eventos y artefactos.",
      icon: Users,
      color: "#10B981",
      lessons: [
        {
          id: "scrum-1",
          title: "Roles en Scrum",
          videoUrl: "https://www.youtube.com/embed/Q5k7a9YEoUI",
          content: {
            intro:
              "Scrum se basa en tres roles principales que garantizan la transparencia, la inspección y la adaptación dentro del proceso ágil.",
            sections: [
              {
                subtitle: "Product Owner",
                text: "El Product Owner maximiza el valor del producto y gestiona el Product Backlog.",
              },
              {
                subtitle: "Scrum Master",
                text: "El Scrum Master guía al equipo en la adopción de Scrum. Es un líder servicial que elimina impedimentos y fomenta la mejora continua.",
              },
              {
                subtitle: "Development Team",
                text: "Profesionales que realizan el trabajo de entregar el incremento del producto. Son autoorganizados y multifuncionales.",
              },
            ],
          },
        },
      ],
    },
  ];

  // Guardar progreso
  const handleCompleteLesson = async (lessonId: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      if (!user) throw new Error("No autenticado");

      const { error } = await supabase
        .from("user_lessons")
        .upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" }
        );

      if (error) throw error;
      onCompleteLesson(lessonId);
    } catch (e: any) {
      setErrorMsg(e.message || "Error guardando lección");
    } finally {
      setLoading(false);
      setSelectedLesson(null);
    }
  };

  // Vista de lección
  if (selectedLesson) {
    let currentLesson: any = null;
    let sectionColor = "#3B82F6";
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
          {/* Botones de voz */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>

            <button
              onClick={() => setListening(!listening)}
              className={`px-4 py-2 rounded-lg text-white font-semibold ${
                listening ? "bg-red-500" : "bg-blue-600"
              }`}
            >
              {listening ? "🎙️ Detener voz" : "🎧 Activar voz"}
            </button>
          </div>

          {recognizedText && (
            <p className="text-sm text-gray-500 italic mb-3">
              Escuchando: “{recognizedText}”
            </p>
          )}

          <div className="bg-white rounded-xl p-8 border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: sectionColor + "20" }}
              >
                <Play className="w-6 h-6" style={{ color: sectionColor }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {currentLesson.title}
                </h1>
              </div>
            </div>

            {currentLesson.videoUrl && (
              <div className="mt-6 mb-8">
                <iframe
                  className="w-full rounded-xl shadow-md"
                  height="400"
                  src={currentLesson.videoUrl}
                  title="Video de lección"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* Botón de lectura */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => {
                  if (!isSpeaking) {
                    let fullText = currentLesson.content.intro;
                    currentLesson.content.sections.forEach((section: any) => {
                      fullText += " " + section.subtitle + ". ";
                      if (section.text) fullText += section.text + " ";
                      if (section.points)
                        fullText += section.points.join(". ") + ". ";
                    });
                    speak(fullText);
                  } else stopSpeaking();
                }}
                className={`px-5 py-2 rounded-lg text-white font-semibold shadow transition-all ${
                  isSpeaking ? "bg-red-500" : "bg-green-600"
                }`}
              >
                {isSpeaking ? "🛑 Detener lectura" : "🔊 Leer lección"}
              </button>
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
                  {loading ? "Guardando..." : "Marcar como completada"}
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

  // Vista general
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Aprende</h1>
        <p className="text-slate-600 mb-8">
          Explora lecciones interactivas con control por voz y narración en español.
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
                    style={{ backgroundColor: section.color + "20" }}
                  >
                    <Icon className="w-7 h-7" style={{ color: section.color }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-slate-800">
                      {section.title}
                    </h2>
                    <p className="text-slate-600 mb-2">
                      {section.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: section.color,
                          }}
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
                          done ? "bg-gray-50" : "bg-white"
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
                            Lección
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
