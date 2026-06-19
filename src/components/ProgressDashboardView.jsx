import React from "react";
import { useApp } from "../context/AppContext";
import { LESSONS } from "../data/lessons";
import { ArrowLeft, Star, Award, TrendingUp, Calendar, Trophy, BarChart3, HelpCircle } from "lucide-react";
import { playBubbleSound } from "../utils/audio";

export const ProgressDashboardView = ({ onBack }) => {
  const { state } = useApp();

  const totalEvals = state.evaluations.length;

  const averageGrade = totalEvals
    ? (state.evaluations.reduce((acc, curr) => acc + curr.score, 0) / totalEvals).toFixed(2)
    : "0.0";

  const bestGrade = totalEvals
    ? Math.max(...state.evaluations.map((e) => e.score)).toFixed(1)
    : "0.0";

  const hasColorsBadge = state.badges.includes("colors");
  const hasSchoolBadge = state.badges.includes("school");
  const hasShapesBadge = state.badges.includes("shapes");
  const hasExpertBadge = state.badges.includes("expert");

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6" id="student-progress">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-2.5 rounded-2xl border-2 border-amber-300">
            <Trophy className="text-amber-600 animate-spin" size={24} style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-black text-gray-800">
              🏆 Mi Álbum de Logros
            </h1>
            <p className="text-gray-400 font-sans text-xs">
              Muestra con orgullo tus estrellas, exámenes y hermosas medallas.
            </p>
          </div>
        </div>

        <button
          id="btn-progress-back"
          onClick={() => {
            playBubbleSound();
            onBack();
          }}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-650 font-display font-bold px-4 py-2.5 rounded-2xl border transition"
        >
          <ArrowLeft size={16} /> Volver al Menú
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">


        <div className="bg-white p-5 rounded-3xl border-4 border-amber-300 shadow-md flex flex-col items-center justify-center text-center">
          <span className="text-5xl animate-bounce">⭐</span>
          <h3 className="text-sm font-display font-bold text-gray-400 mt-2">
            Estrellas Acumuladas
          </h3>
          <span className="text-5xl font-display font-black text-amber-500 mt-1">
            {state.stars}
          </span>
          <p className="text-xs text-gray-400 font-sans mt-2">
            ¡Sigue ganando estrellas en lecciones y desafíos!
          </p>
        </div>


        <div className="bg-white p-5 rounded-3xl border-4 border-indigo-300 shadow-md flex flex-col items-center justify-center text-center">
          <span className="text-5xl">📝</span>
          <h3 className="text-sm font-display font-bold text-gray-400 mt-2">
            Mejor Calificación
          </h3>
          <span className="text-5xl font-display font-black text-indigo-700 mt-1">
            {bestGrade} / 5.0
          </span>
          <p className="text-xs text-gray-400 font-sans mt-2">
            Promedio General: {averageGrade}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-4 border-emerald-300 shadow-md flex flex-col items-center justify-center text-center">
          <span className="text-5xl">📖</span>
          <h3 className="text-sm font-display font-bold text-gray-400 mt-2">
            Temas Estudiados
          </h3>
          <span className="text-5xl font-display font-black text-emerald-600 mt-1">
            {state.watchedVideos.length} / {LESSONS.length}
          </span>
          <p className="text-xs text-gray-400 font-sans mt-2">
            Juegos terminados: {state.completedActivities.length}
          </p>
        </div>

      </div>


      <div className="bg-white rounded-3xl border-4 border-purple-200 p-6 shadow-sm mb-8">
        <h2 className="text-xl font-display font-black text-purple-700 flex items-center gap-2 mb-6">
          <Award size={22} className="text-purple-600" /> Mis Medallas de Honor
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

          <div className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center justify-center h-44 transition shadow-sm ${hasColorsBadge
            ? "bg-pink-50/50 border-pink-300 text-pink-955 scale-102"
            : "bg-gray-50 border-gray-150 text-gray-400 opacity-60"
            }`}>
            <span className="text-5xl mb-2">{hasColorsBadge ? "🎨" : "🔒"}</span>
            <span className="text-xs font-display font-bold text-gray-400">Medalla Colores</span>
            <span className="text-sm font-display font-black text-gray-700 mt-1">
              Explorador de Colores
            </span>
          </div>


          <div className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center justify-center h-44 transition shadow-sm ${hasSchoolBadge
            ? "bg-cyan-55 border-cyan-300 text-cyan-955 scale-102"
            : "bg-gray-50 border-gray-150 text-gray-400 opacity-60"
            }`}>
            <span className="text-5xl mb-2">{hasSchoolBadge ? "🏫" : "🔒"}</span>
            <span className="text-xs font-display font-bold text-gray-400">Medalla Escuela</span>
            <span className="text-sm font-display font-black text-gray-700 mt-1">
              Experto en Útiles
            </span>
          </div>


          <div className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center justify-center h-44 transition shadow-sm ${hasShapesBadge
            ? "bg-yellow-50 border-yellow-300 text-yellow-955 scale-102"
            : "bg-gray-50 border-gray-150 text-gray-400 opacity-60"
            }`}>
            <span className="text-5xl mb-2">{hasShapesBadge ? "📐" : "🔒"}</span>
            <span className="text-xs font-display font-bold text-gray-400">Medalla Geometría</span>
            <span className="text-sm font-display font-black text-gray-700 mt-1">
              Maestro de Figuras
            </span>
          </div>


          <div className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center justify-center h-44 transition shadow-sm ${hasExpertBadge
            ? "bg-green-50 border-green-300 text-green-955 scale-102 border-dashed"
            : "bg-gray-50 border-gray-150 text-gray-400 opacity-60"
            }`}>
            <span className="text-5xl mb-2">{hasExpertBadge ? "👑" : "🔒"}</span>
            <span className="text-xs font-display font-bold text-gray-400">Medalla Máxima</span>
            <span className="text-sm font-display font-black text-gray-700 mt-1">
              Súper Experto
            </span>
          </div>

        </div>

        {state.badges.length === 0 && (
          <p className="text-center font-display font-bold text-sm text-purple-400 mt-6 animate-pulse">
            🐾 ¡Completa los juegos interactivos de cada tema para desbloquear hermosas medallas en este estante!
          </p>
        )}
      </div>

      <div className="bg-white rounded-3xl border-4 border-indigo-200 p-6 shadow-sm">
        <h2 className="text-xl font-display font-black text-indigo-700 flex items-center gap-2 mb-4">
          <BarChart3 size={22} className="text-indigo-650" /> Historial de Exámenes
        </h2>

        {totalEvals === 0 ? (
          <div className="text-center py-8 text-gray-400 font-sans text-sm">
            🛡️ Aún no has realizado ninguna evaluación académica de inglés. Estudia tus lecciones y pídele al profesor que abra tus prácticas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-150 text-xs font-display font-bold text-gray-500 uppercase">
                  <th className="py-3 px-2">Fecha</th>
                  <th className="py-3 px-2">Calificación</th>
                  <th className="py-3 px-2">Aciertos</th>
                  <th className="py-3 px-2">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {state.evaluations.map((item) => (
                  <tr key={item.id} className="text-sm font-sans hover:bg-gray-50/50">
                    <td className="py-3.5 px-2 font-medium text-gray-500 flex items-center gap-1">
                      <Calendar size={14} className="text-indigo-400" /> {item.date}
                    </td>
                    <td className="py-3.5 px-2 font-display font-black text-lg text-indigo-600">
                      {item.score.toFixed(1)} / 5.0
                    </td>
                    <td className="py-3.5 px-2 text-gray-600 font-semibold font-display">
                      {item.correctCount} de {item.totalQuestions}
                    </td>
                    <td className="py-3.5 px-2">
                      {item.passed ? (
                        <span className="bg-green-100 text-green-700 text-xs font-display font-bold px-2.5 py-1 rounded-full border border-green-200">
                          Aprobado ✨
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-orange-700 text-xs font-display font-bold px-2.5 py-1 rounded-full border border-orange-200">
                          Rehacer 🛠️
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
