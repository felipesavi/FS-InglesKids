import React from "react";
import { useApp } from "../context/AppContext";
import { LESSONS } from "../data/lessons";
import { Award, BookOpen, Star, HelpCircle, User, LogOut, Video, Sparkles, CheckCircle2 } from "lucide-react";
import { playBubbleSound } from "../utils/audio";
import { motion } from "motion/react";

export const StudentDashboardView = ({
  onSelectTopic,
  onSelectEvaluation,
  onSelectProgress,
  onLogOut
}) => {
  const { state } = useApp();

  const selectedEvalTopics = state.teacherConfig.selectedEvalTopics;

  const isNoTopicsSelected = selectedEvalTopics.length === 0;

  const missingTopics = selectedEvalTopics.filter(
    (topicId) => !state.watchedVideos.includes(topicId)
  );

  const isEvalLocked = isNoTopicsSelected || missingTopics.length > 0;


  const getTopicName = (id) => {
    const found = LESSONS.find((l) => l.id === id);
    return found ? found.name : id;
  };

  const getTopicEmoji = (id) => {
    if (id === "colors") return "🎨";
    if (id === "school") return "🎒";
    return "📐";
  };


  const getTobyMessage = () => {
    if (state.stars === 0) {
      return `¡Vamos a estudiar para ganar nuestras primeras estrellas y divertidas insignias! 🚀`;
    }
    if (state.stars < 20) {
      return `¡Fantástico! Tienes ⭐ ${state.stars} estrellas. ¡Eres muy inteligente! Sigue aprendiendo.`;
    }
    return `¡Wow, ${state.name}! ¡Tienes ⭐ ${state.stars} estrellas! Eres una súper estrella del inglés 🌟`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4 md:p-6" id="student-menu">


      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 mt-2">
        <div>
          <h2 className="text-4xl font-display font-black text-indigo-900 tracking-tight">
            ¡Hola, {state.name || "amiguito"}! 👋
          </h2>
          <p className="text-indigo-650 text-base md:text-lg font-bold mt-1 uppercase tracking-wider">
            ¿Qué vamos a aprender hoy?
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-md border-2 border-indigo-100 flex items-center gap-4 transition-transform hover:scale-102">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center text-3xl shadow-inner select-none"
          >
            🦁
          </motion.div>
          <div>
            <p className="text-xs font-black text-indigo-400 uppercase tracking-widest leading-none">Mascota Guía</p>
            <p className="text-sm text-indigo-900 font-bold italic mt-1 font-serif">
              "{getTobyMessage().length > 50 ? "¡Estás haciéndolo excelente!" : getTobyMessage()}"
            </p>
          </div>
        </div>
      </header>


      <div className="grid grid-cols-12 gap-6 md:gap-8">


        <section className="col-span-12 lg:col-span-8 space-y-6">
          <h3 className="text-xl font-display font-black text-slate-800 tracking-wide flex items-center gap-1.5">
            🎯 Elige tu Aventura de Hoy:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {LESSONS.map((topic, index) => {
              const hasVideo = state.watchedVideos.includes(topic.id);
              const hasActivity = state.completedActivities.includes(topic.id);

              let progressPct = 0;
              if (hasVideo) progressPct += 50;
              if (hasActivity) progressPct += 50;
              let borderStyle = "border-orange-400";
              let shadowStyle = "shadow-[0_12px_0_0_#ea580c] hover:shadow-[0_12px_0_0_#f97316]";
              let iconThemeBg = "bg-orange-100 text-orange-600";
              let emojiIcon = "🎨";
              let subtitleEN = "Colors & Tones";

              if (topic.id === "colors") {
                borderStyle = "border-orange-400";
                shadowStyle = "shadow-[0_12px_0_0_#f97316]";
                iconThemeBg = "bg-orange-100 text-orange-600";
                emojiIcon = "🎨";
                subtitleEN = "Colors & Tones";
              } else if (topic.id === "school") {
                borderStyle = "border-green-400";
                shadowStyle = "shadow-[0_12px_0_0_#22c55e]";
                iconThemeBg = "bg-green-100 text-green-600";
                emojiIcon = "🎒";
                subtitleEN = "School Supplies";
              } else if (topic.id === "shapes") {
                borderStyle = "border-blue-400";
                shadowStyle = "shadow-[0_12px_0_0_#3b82f6]";
                iconThemeBg = "bg-blue-100 text-blue-600";
                emojiIcon = "📐";
                subtitleEN = "Basic Shapes";
              }

              return (
                <button
                  key={topic.id}
                  id={`btn-lesson-${topic.id}`}
                  onClick={() => {
                    playBubbleSound();
                    onSelectTopic(topic.id);
                  }}
                  className={`group bg-white rounded-[40px] p-6 shadow-md transition-all border-4 ${borderStyle} ${shadowStyle} active:shadow-none active:translate-y-2 text-left hover:-translate-y-1 duration-150 relative overflow-hidden`}
                >
                  <div className="absolute top-4 right-4 flex gap-1 z-10">
                    {hasVideo && (
                      <span className="bg-red-100 text-red-650 rounded-full p-1.5 border border-red-200 text-xs shadow-xs" title="Video visto">
                        <Video size={13} fill="#ef4444" className="text-white" />
                      </span>
                    )}
                    {hasActivity && (
                      <span className="bg-green-150 text-green-700 rounded-full p-1.5 border border-green-200 text-xs shadow-xs" title="Práctica superada">
                        <CheckCircle2 size={13} className="text-green-650" />
                      </span>
                    )}
                  </div>

                  <div className={`w-16 h-16 rounded-2xl ${iconThemeBg} flex items-center justify-center text-4xl mb-4 transition transform group-hover:scale-110 shadow-inner`}>
                    {emojiIcon}
                  </div>

                  <h3 className="text-2xl font-display font-black text-slate-800 leading-none">
                    {topic.name}
                  </h3>

                  <p className="text-slate-400 font-display font-bold uppercase text-xs tracking-widest mt-1.5">
                    {subtitleEN}
                  </p>

                  <p className="text-gray-500 font-sans text-xs mt-2 font-medium leading-relaxed">
                    Aprende palabras clave con videos exclusivos y divertidos juegos interactivos.
                  </p>

                  <div className="mt-5">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
                      <span>Progreso</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                      <div
                        className={`h-full transition-all duration-500 ${topic.id === "colors" ? "bg-orange-400" : topic.id === "school" ? "bg-green-400" : "bg-blue-400"
                          }`}
                        style={{ width: `${progressPct || 10}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
            <button
              id="btn-student-eval"
              onClick={() => {
                if (!isEvalLocked) {
                  playBubbleSound();
                  onSelectEvaluation();
                }
              }}
              disabled={isEvalLocked}
              className={`group rounded-[40px] p-6 shadow-md border-4 text-left transition-all relative overflow-hidden ${isEvalLocked
                  ? "bg-slate-800 border-slate-600 text-slate-400 opacity-80 cursor-not-allowed shadow-[0_12px_0_0_#1e293b]"
                  : "bg-indigo-900 border-indigo-300 text-white shadow-[0_12px_0_0_#1e1b4b] active:shadow-none active:translate-y-2 hover:-translate-y-1 cursor-pointer"
                }`}
            >
              <div className="absolute top-4 right-4 z-10">
                {isEvalLocked ? (
                  <span className="text-xs bg-slate-750 text-slate-350 px-2.5 py-1 rounded-full border border-slate-600 font-bold flex items-center gap-1">
                    🔒 Bloqueado
                  </span>
                ) : (
                  <span className="text-xs bg-indigo-700 text-white px-2.5 py-1 rounded-full border border-indigo-500 font-bold animate-pulse">
                    ✨ ¡Súper Listo!
                  </span>
                )}
              </div>

              <div className="w-16 h-16 bg-white/10 rounded-2xl mb-4 flex items-center justify-center text-4xl shadow-inner">
                ⚡
              </div>

              <h3 className={`text-2xl font-display font-black leading-none ${isEvalLocked ? "text-slate-300" : "text-white"}`}>
                Evaluación
              </h3>

              <p className={`font-display font-bold uppercase text-xs tracking-widest mt-1.5 ${isEvalLocked ? "text-slate-500" : "text-indigo-200"}`}>
                Daily Challenge
              </p>

              <p className={`font-sans text-xs mt-2 font-medium leading-relaxed ${isEvalLocked ? "text-slate-400" : "text-indigo-100"}`}>
                Responde preguntas rápidas para ganar insignias y un super certificado de inglés de Toby.
              </p>

              {isEvalLocked ? (
                <div className="mt-4 p-2.5 bg-slate-900/50 border border-slate-705 rounded-xl">
                  {isNoTopicsSelected ? (
                    <p className="text-[10px] text-amber-400 font-bold">
                      ⚠️ Tu profesor todavía no ha activado ningún tema de evaluación.
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-300 font-semibold leading-tight flex flex-warp gap-1">
                      🔒 Repasa: {missingTopics.map(id => getTopicEmoji(id)).join(" ")}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-4 flex gap-1.5">
                  <span className="text-[10px] bg-green-500 text-white px-2.5 py-1 rounded-full border border-green-400 font-bold">
                    🚀 ¡Comenzar examen ya! →
                  </span>
                </div>
              )}
            </button>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-[40px] p-8 shadow-xl border-4 border-indigo-100 relative overflow-hidden">

            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none text-9xl">
              🏅
            </div>

            <h4 className="text-2xl font-display font-black text-indigo-900 mb-6 flex items-center gap-2">
              🏅 Mis Logros
            </h4>

            <div className="space-y-6">


              <div className={`flex items-center gap-4 transition-all duration-300 ${state.badges.includes("colors") ? "grayscale-0 opacity-100 scale-100" : "grayscale opacity-35"}`}>
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-3xl border-2 border-orange-200 shadow-sm">
                  🌈
                </div>
                <div>
                  <p className="font-display font-black text-slate-800 leading-none">Explorador de Colores</p>
                  <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider leading-none">
                    {state.badges.includes("colors") ? "¡Ganado ayer!" : "Pendiente"}
                  </p>
                </div>
              </div>


              <div className={`flex items-center gap-4 transition-all duration-300 ${state.badges.includes("school") ? "grayscale-0 opacity-100 scale-100" : "grayscale opacity-35"}`}>
                <div className="w-14 h-14 bg-yellow-105 rounded-full flex items-center justify-center text-3xl border-2 border-yellow-200 shadow-sm">
                  ✨
                </div>
                <div>
                  <p className="font-display font-black text-slate-800 leading-none">Pequeño Experto</p>
                  <p className="text-xs text-slate-550 mt-1 uppercase font-bold tracking-wider leading-none">
                    {state.badges.includes("school") ? "¡Completado!" : "Sigue aprendiendo"}
                  </p>
                </div>
              </div>


              <div className={`flex items-center gap-4 transition-all duration-300 ${state.badges.includes("shapes") ? "grayscale-0 opacity-100 scale-100" : "grayscale opacity-35"}`}>
                <div className="w-14 h-14 bg-blue-101 rounded-full flex items-center justify-center text-3xl border-2 border-blue-200 shadow-sm">
                  👑
                </div>
                <div>
                  <p className="font-display font-black text-slate-800 leading-none">Maestro de Figuras</p>
                  <p className="text-xs text-slate-550 mt-1 uppercase font-bold tracking-wider leading-none">
                    {state.badges.includes("shapes") ? "¡Insignia real!" : "Bloqueado"}
                  </p>
                </div>
              </div>

            </div>


            <button
              id="btn-sidebar-progress"
              onClick={() => {
                playBubbleSound();
                onSelectProgress();
              }}
              className="mt-12 w-full bg-pink-500 hover:bg-pink-600 text-white font-display font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"
            >
              📊 Ver mi Progreso
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
};
