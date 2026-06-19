import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { ShieldCheck, GraduationCap, User, Lock, Delete } from "lucide-react";
import { playBubbleSound, playSuccessSound, playErrorSound } from "../utils/audio";

export const WelcomeView = ({ onEnterStudent, onEnterTeacher }) => {
  const { state } = useApp();
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [errorText, setErrorText] = useState("");


  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef(null);
  const holdTimerRef = useRef(null);


  const startHolding = () => {
    setIsHolding(true);
    setHoldProgress(0);

    let elapsed = 0;
    const intervalMs = 100;
    const targetMs = 5000;

    holdIntervalRef.current = setInterval(() => {
      elapsed += intervalMs;
      const pct = Math.min((elapsed / targetMs) * 100, 100);
      setHoldProgress(pct);

      if (pct >= 100) {
        clearInterval(holdIntervalRef.current);
      }
    }, intervalMs);

    holdTimerRef.current = setTimeout(() => {
      playSuccessSound();
      setShowPasswordModal(true);
      resetHolding();
    }, targetMs);
  };

  const resetHolding = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  const handleNumpadPress = (num) => {
    playBubbleSound();
    setErrorText("");
    if (passwordInput.length < 8) {
      setPasswordInput((prev) => prev + num);
    }
  };

  const handleNumpadDelete = () => {
    playBubbleSound();
    setPasswordInput((prev) => prev.slice(0, -1));
  };

  const handleNumpadSubmit = () => {
    if (passwordInput === "1234") {
      playSuccessSound();
      setShowPasswordModal(false);
      setPasswordInput("");
      onEnterTeacher();
    } else {
      playErrorSound();
      setErrorText("Contraseña incorrecta ❌");
      setPasswordInput("");
      setTimeout(() => setErrorText(""), 2000);
    }
  };

  const handleStudentSelect = () => {
    playBubbleSound();
    onEnterStudent();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 min-h-[80vh]">
      <div className="relative group text-center select-none mb-10">
        <label className="text-xs text-purple-400 font-display block mb-1 font-medium tracking-widest animate-pulse">
          {isHolding ? "¡Sigue presionando! 🦊" : "(Mantén presionado el logo para Modo Profesor)"}
        </label>

        <div
          id="hold-logo"
          onMouseDown={startHolding}
          onMouseUp={resetHolding}
          onMouseLeave={resetHolding}
          onTouchStart={startHolding}
          onTouchEnd={resetHolding}
          className="cursor-pointer relative overflow-hidden inline-flex flex-col items-center justify-center bg-white border-4 border-yellow-400 rounded-full w-40 h-40 shadow-xl transform active:scale-95 transition-all outline-none"
        >
          {isHolding && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-yellow-200 transition-all duration-100 ease-out"
              style={{ height: `${holdProgress}%`, opacity: 0.8 }}
            />
          )}

          <div className="relative z-10 flex flex-col items-center">
            <span className="text-6xl animate-bounce duration-1000">🐶</span>
            <span className="text-xl font-display font-black text-amber-500 mt-1">
              TOBY
            </span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-black text-purple-700 tracking-tight mt-6">
          Aprender Inglés Jugando
        </h1>
        <p className="text-gray-500 font-sans mt-2 font-medium">
          ¡Un mundo de colores, figuras y diversión para niñas y niños de 4 a 7 años!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl px-4">
        <button
          id="btn-select-student"
          onClick={handleStudentSelect}
          className="bento-card group relative bg-white border-4 border-emerald-400 hover:border-emerald-500 rounded-3xl p-6 shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-all outline-none text-gray-800"
        >
          <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            🎯
          </div>

          <div className="bg-emerald-100 border-2 border-emerald-300 w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition transform group-hover:scale-110">
            <span className="text-4xl">🧒🏽</span>
          </div>

          <h2 className="text-2xl font-display font-bold text-emerald-700">
            Modo Estudiante
          </h2>
          <p className="text-gray-500 font-sans text-sm mt-2">
            ¡Entra aquí para ver videos, aprender vocabulario y ganar estrellas!
          </p>

          {state.name && (
            <div className="mt-4 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 text-xs font-display font-bold text-emerald-700">
              Continuar como: {state.name} ⭐
            </div>
          )}
        </button>

        <button
          id="btn-select-teacher"
          onClick={() => {
            playBubbleSound();
            setShowPasswordModal(true);
          }}
          className="bento-card group relative bg-white border-4 border-indigo-400 hover:border-indigo-500 rounded-3xl p-6 shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-all outline-none text-gray-800"
        >
          <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            ⚙️
          </div>

          <div className="bg-indigo-100 border-2 border-indigo-300 w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition transform group-hover:scale-110">
            <span className="text-4xl">👨‍🏫</span>
          </div>

          <h2 className="text-2xl font-display font-bold text-indigo-700">
            Modo Profesor / Adulto
          </h2>
          <p className="text-gray-500 font-sans text-sm mt-2">
            Configura las evaluaciones, ve estadísticas de estudio y borra los datos guardados.
          </p>

          <div className="mt-4 text-xs font-display font-semibold text-indigo-500 flex items-center gap-1">
            <Lock size={12} /> Contraseña requerida
          </div>
        </button>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-4 border-indigo-300 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 mb-2">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-display font-bold text-indigo-900">
                Acceso Adulto
              </h3>
              <p className="text-xs text-gray-400 text-center mt-1">
                Ingresa la contraseña para entrar al panel. (Por defecto: 1234)
              </p>
            </div>

            <div className="flex justify-center gap-3 my-5">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 border-indigo-300 transition-all ${passwordInput.length > idx
                    ? "bg-indigo-600 scale-110"
                    : "bg-gray-100"
                    }`}
                />
              ))}
            </div>

            {errorText && (
              <div className="text-red-500 font-display font-bold text-sm text-center mb-4">
                {errorText}
              </div>
            )}


            <div className="grid grid-cols-3 gap-3 mb-5">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  id={`btn-num-${num}`}
                  onClick={() => handleNumpadPress(num)}
                  className="bg-gray-50 hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-300 rounded-2xl py-3 font-display font-bold text-lg text-gray-700 active:scale-95 transition-all text-center"
                >
                  {num}
                </button>
              ))}
              <button
                id="btn-num-del"
                onClick={handleNumpadDelete}
                className="bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-2xl py-3 text-red-600 active:scale-95 transition-all flex items-center justify-center font-display font-bold"
              >
                <Delete size={20} />
              </button>
              <button
                id="btn-num-0"
                onClick={() => handleNumpadPress("0")}
                className="bg-gray-50 hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-300 rounded-2xl py-3 font-display font-bold text-lg text-gray-700 active:scale-95 transition-all text-center"
              >
                0
              </button>
              <button
                id="btn-num-ok"
                onClick={handleNumpadSubmit}
                disabled={passwordInput.length === 0}
                className="bg-green-100 hover:bg-green-200 border-2 border-green-300 text-green-700 rounded-2xl py-3 active:scale-95 transition-all flex items-center justify-center font-display font-bold disabled:opacity-40"
              >
                OK
              </button>
            </div>

            <button
              id="btn-close-pwd-modal"
              onClick={() => {
                playBubbleSound();
                setShowPasswordModal(false);
                setPasswordInput("");
              }}
              className="w-full text-center py-2 text-xs font-display font-semibold text-gray-400 hover:text-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
