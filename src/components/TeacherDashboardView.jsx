import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { LESSONS } from "../data/lessons";
import { ArrowLeft, CheckSquare, Square, Trash2, Award, ClipboardList, TrendingUp } from "lucide-react";
import { playBubbleSound, playCelebrationSound } from "../utils/audio";

export const TeacherDashboardView = ({ onBack }) => {
  const { state, updateTeacherConfig, resetAllData } = useApp();
  const [selectedTopics, setSelectedTopics] = useState(
    state.teacherConfig.selectedEvalTopics
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleToggleTopic = (topicId) => {
    playBubbleSound();
    let updated;
    if (selectedTopics.includes(topicId)) {
      updated = selectedTopics.filter((id) => id !== topicId);
    } else {
      updated = [...selectedTopics, topicId];
    }
    setSelectedTopics(updated);
    updateTeacherConfig(updated);
  };

  const handleSelectAll = () => {
    playBubbleSound();
    const allIds = LESSONS.map((t) => t.id);
    setSelectedTopics(allIds);
    updateTeacherConfig(allIds);
  };

  const handleDeselectAll = () => {
    playBubbleSound();
    setSelectedTopics([]);
    updateTeacherConfig([]);
  };

  const handleReset = () => {
    playCelebrationSound();
    resetAllData();
    setSelectedTopics([]);
    setSuccessMessage("¡Todos los datos han sido borrados de este tablet!");
    setTimeout(() => setSuccessMessage(""), 4000);
    setShowResetConfirm(false);
  };


  const totalEvals = state.evaluations.length;
  const averageScore = totalEvals
    ? (state.evaluations.reduce((acc, curr) => acc + curr.score, 0) / totalEvals).toFixed(2)
    : "Sin evaluaciones";
  const bestScore = totalEvals
    ? Math.max(...state.evaluations.map((e) => e.score)).toFixed(1)
    : "Sin evaluaciones";
  const lastScore = totalEvals
    ? state.evaluations[0].score.toFixed(1)
    : "Sin evaluaciones";
  const lastActivityDate = totalEvals
    ? state.evaluations[0].date
    : state.completedActivities.length > 0 || state.watchedVideos.length > 0
      ? "Hoy (Viendo clases)"
      : "Ninguna actividad registrada";

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6" id="teacher-panel">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-800 flex items-center gap-2">
            👨‍🏫 Panel del Profesor / Adulto
          </h1>
          <p className="text-gray-500 font-sans mt-1 text-sm">
            Configura las actividades, revisa calificaciones y administra el progreso técnico de la app.
          </p>
        </div>
        <button
          id="btn-teacher-back"
          onClick={() => {
            playBubbleSound();
            onBack();
          }}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-display font-medium px-4 py-2.5 rounded-2xl transition shadow-sm self-start md:self-auto"
        >
          <ArrowLeft size={18} /> Volver al Inicio
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 font-display font-medium rounded-2xl text-center border-2 border-green-300 animate-bounce">
          🎉 {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border-4 border-purple-200 shadow-md">
          <h2 className="text-xl font-display font-bold text-purple-700 flex items-center gap-2 mb-4">
            <ClipboardList size={22} /> Configurar Evaluación
          </h2>
          <p className="text-gray-600 font-sans text-sm mb-4">
            Selecciona qué temas aparecerán de manera aleatoria en las pruebas del estudiante.
          </p>

          <div className="flex gap-4 mb-4">
            <button
              id="btn-teacher-all"
              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 font-display font-semibold py-1.5 px-3 rounded-lg transition"
            >
              Seleccionar Todos
            </button>
            <button
              id="btn-teacher-none"
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-650 font-display font-semibold py-1.5 px-3 rounded-lg transition"
            >
              Deseleccionar Todos
            </button>
          </div>

          <div className="space-y-3">
            {LESSONS.map((topic) => {
              const isSelected = selectedTopics.includes(topic.id);
              return (
                <div
                  key={topic.id}
                  onClick={() => handleToggleTopic(topic.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition ${isSelected
                    ? "border-purple-500 bg-purple-50/50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {topic.id === "colors" ? "🎨" : topic.id === "school" ? "🎒" : "📐"}
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-gray-800">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {topic.words.length} palabras de vocabulario
                      </p>
                    </div>
                  </div>
                  <div>
                    {isSelected ? (
                      <CheckSquare className="text-purple-600" size={24} />
                    ) : (
                      <Square className="text-gray-300" size={24} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedTopics.length === 0 && (
            <p className="mt-4 text-xs text-amber-500 font-medium">
              ⚠️ Alerta: Si deseleccionas todos los temas, la evaluación se bloqueará para el estudiante.
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl border-4 border-blue-200 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-blue-700 flex items-center gap-2 mb-4">
              <TrendingUp size={22} /> Estadísticas de {state.name || "Estudiante"}
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-2xl">
                <span className="font-display text-gray-600 text-sm">Estudiante actual:</span>
                <span className="font-display font-bold text-blue-800">
                  {state.name || "Sin registrar"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-2xl text-center border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium">Pruebas realizadas</div>
                  <div className="text-2xl font-display font-black text-gray-700 mt-1">
                    {totalEvals}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl text-center border border-gray-100">
                  <div className="text-xs text-gray-500 font-medium">Estrellas totales</div>
                  <div className="text-2xl font-display font-black text-amber-500 mt-1">
                    ⭐ {state.stars}
                  </div>
                </div>
              </div>

              <div className="space-y-2 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Promedio general:</span>
                  <span className="font-display font-bold text-gray-800">
                    {averageScore}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mejor nota:</span>
                  <span className="font-display font-bold text-green-600">
                    {bestScore}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Última nota:</span>
                  <span className="font-display font-bold text-purple-600">
                    {lastScore}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Última actividad:</span>
                  <span className="font-sans text-xs font-bold text-gray-600 text-right">
                    {lastActivityDate}
                  </span>
                </div>
              </div>

              {state.badges.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-550 block mb-2 font-display">Insignias obtenidas:</span>
                  <div className="flex flex-wrap gap-2">
                    {state.badges.includes("colors") && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full font-display font-semibold flex items-center gap-1 border border-yellow-300">
                        🎨 Explorador Colores
                      </span>
                    )}
                    {state.badges.includes("school") && (
                      <span className="text-xs bg-cyan-100 text-cyan-800 px-2.5 py-1 rounded-full font-display font-semibold flex items-center gap-1 border border-cyan-300">
                        🎒 Experto Útiles
                      </span>
                    )}
                    {state.badges.includes("shapes") && (
                      <span className="text-xs bg-pink-100 text-pink-800 px-2.5 py-1 rounded-full font-display font-semibold flex items-center gap-1 border border-pink-300">
                        📐 Maestro Figuras
                      </span>
                    )}
                    {state.badges.includes("expert") && (
                      <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-display font-bold flex items-center gap-1 border border-green-300">
                        ⭐ Súper Experto
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-150">
            {!showResetConfirm ? (
              <button
                id="btn-teacher-reset-trigger"
                onClick={() => {
                  playBubbleSound();
                  setShowResetConfirm(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-display font-bold py-3 px-4 rounded-2xl transition border border-red-300"
              >
                <Trash2 size={18} /> Restablecer Información
              </button>
            ) : (
              <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl animate-pulse">
                <p className="text-red-850 font-display font-bold text-sm text-center mb-3">
                  ⚠️ ¿Estás completamente seguro de borrar TODO el progreso, monedas, estrellas y nombre?
                </p>
                <div className="flex gap-3">
                  <button
                    id="btn-teacher-reset-confirm"
                    onClick={handleReset}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-display font-bold py-2 rounded-xl transition text-xs"
                  >
                    Sí, BORRAR TODO
                  </button>
                  <button
                    id="btn-teacher-reset-cancel"
                    onClick={() => {
                      playBubbleSound();
                      setShowResetConfirm(false);
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-display font-semibold py-2 rounded-xl transition text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
