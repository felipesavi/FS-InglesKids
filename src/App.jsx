import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { WelcomeView } from "./components/WelcomeView";
import { StudentFormView } from "./components/StudentFormView";
import { StudentDashboardView } from "./components/StudentDashboardView";
import { LessonSessionView } from "./components/LessonSessionView";
import { EvaluationSessionView } from "./components/EvaluationSessionView";
import { ProgressDashboardView } from "./components/ProgressDashboardView";
import { TeacherDashboardView } from "./components/TeacherDashboardView";
import { Sparkles, Music } from "lucide-react";
import { playBubbleSound } from "./utils/audio";

function AppContent() {
  const { state } = useApp();


  const [authMode, setAuthMode] = useState("welcome");
  const [activeStudentView, setActiveStudentView] = useState("menu");

  const [soundEnabled, setSoundEnabled] = useState(true);


  const handleEnterStudent = () => {
    if (state.name && state.name.trim().length >= 2) {
      setAuthMode("student-app");
      setActiveStudentView("menu");
    } else {
      setAuthMode("student-form");
    }
  };

  const handleEnterTeacher = () => {
    setAuthMode("teacher-panel");
  };

  const handleBackToWelcome = () => {
    setAuthMode("welcome");
  };

  const handleStudentFormSuccess = () => {
    setAuthMode("student-app");
    setActiveStudentView("menu");
  };

  const handleStudentLogOut = () => {
    setAuthMode("welcome");
  };

  const toggleSound = () => {
    playBubbleSound();
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50/40 flex flex-col font-sans selection:bg-purple-200">


      <nav className="bg-indigo-600 h-20 px-4 sm:px-8 flex items-center justify-between shadow-lg relative z-40 text-white select-none">

        <div
          className="flex items-center gap-2 sm:gap-3.5 cursor-pointer"
          onClick={() => {
            playBubbleSound();
            setAuthMode("welcome");
            setActiveStudentView("menu");
          }}
          title="Mundo Inglés Principal"
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center text-3xl shadow-sm hover:scale-105 transition-transform duration-200 animate-pulse">
            🦁
          </div>
          <h1 className="text-white font-display font-black text-xl sm:text-2xl tracking-tight uppercase">
            Mundo <span className="text-yellow-300">Inglés</span>
          </h1>
        </div>


        <div className="flex items-center gap-3 sm:gap-5">


          {authMode === "student-app" && (
            <div className="flex gap-2 sm:gap-3.5">
              <div
                onClick={() => {
                  playBubbleSound();
                  setActiveStudentView("progress");
                }}
                className="bg-white/20 hover:bg-white/25 cursor-pointer px-3 sm:px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-white/30 text-white text-xs sm:text-sm font-bold transition-all"
                title="Tus estrellas"
              >
                <span className="text-yellow-300 text-base sm:text-lg">⭐</span>
                <span>{state.stars}</span>
              </div>
              <div
                onClick={() => {
                  playBubbleSound();
                  setActiveStudentView("progress");
                }}
                className="bg-white/20 hover:bg-white/25 cursor-pointer px-3 sm:px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-white/30 text-white text-xs sm:text-sm font-bold transition-all"
                title="Insignias ganadas"
              >
                <span className="text-pink-300 text-base sm:text-lg">🏆</span>
                <span>{state.badges.length}</span>
              </div>
            </div>
          )}


          {authMode !== "teacher-panel" && (
            <button
              id="btn-teacher-settings-direct"
              onClick={() => {
                playBubbleSound();
                setAuthMode("teacher-panel");
              }}
              className="w-10 h-10 rounded-full bg-indigo-800 hover:bg-indigo-700 flex items-center justify-center text-white/80 hover:text-white transition-colors border border-indigo-500/30"
              title="Panel del Profesor / Adulto"
            >
              ⚙️
            </button>
          )}


          <button
            id="btn-sound-toggle"
            onClick={toggleSound}
            className={`p-2.5 rounded-xl transition-colors border ${soundEnabled
              ? "bg-yellow-400 border-white text-indigo-900 font-bold"
              : "bg-indigo-800 text-indigo-300 border-indigo-700 hover:text-white"
              }`}
            title={soundEnabled ? "Guías de voz activadas" : "Guías de voz silenciadas"}
          >
            <Music size={16} className={soundEnabled ? "animate-pulse" : ""} />
          </button>

        </div>
      </nav>


      <main className="flex-1 flex flex-col py-6 px-4">


        {authMode === "welcome" && (
          <WelcomeView
            onEnterStudent={handleEnterStudent}
            onEnterTeacher={handleEnterTeacher}
          />
        )}


        {authMode === "student-form" && (
          <StudentFormView
            onBack={handleBackToWelcome}
            onSuccess={handleStudentFormSuccess}
          />
        )}


        {authMode === "teacher-panel" && (
          <TeacherDashboardView
            onBack={handleBackToWelcome}
          />
        )}


        {authMode === "student-app" && (
          <>
            {activeStudentView === "menu" && (
              <StudentDashboardView
                onSelectTopic={(topicId) => {
                  setActiveStudentView(topicId);
                }}
                onSelectEvaluation={() => {
                  setActiveStudentView("evaluation");
                }}
                onSelectProgress={() => {
                  setActiveStudentView("progress");
                }}
                onLogOut={handleStudentLogOut}
              />
            )}


            {(activeStudentView === "colors" || activeStudentView === "school" || activeStudentView === "shapes") && (
              <LessonSessionView
                topicId={activeStudentView}
                onBack={() => setActiveStudentView("menu")}
              />
            )}

            {activeStudentView === "evaluation" && (
              <EvaluationSessionView
                onBack={() => setActiveStudentView("menu")}
              />
            )}

            {activeStudentView === "progress" && (
              <ProgressDashboardView
                onBack={() => setActiveStudentView("menu")}
              />
            )}
          </>
        )}

      </main>


      <footer className="py-6 px-4 text-center text-xs font-display font-medium text-purple-300/80 border-t border-purple-50/20 max-w-lg mx-auto w-full select-none mt-12">
        <p className="flex items-center justify-center gap-1">
          Hecho con cariño para mentes pequeñas 🧸🎈 <Sparkles size={12} className="text-yellow-400" />
        </p>
        <p className="font-sans text-[10px] mt-1 text-gray-400">
          Clasificación recomendada de 4 a 7 años de edad.
        </p>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
