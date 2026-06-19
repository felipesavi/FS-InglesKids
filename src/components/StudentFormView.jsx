import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { playBubbleSound, playSuccessSound } from "../utils/audio";

export const StudentFormView = ({ onBack, onSuccess }) => {
  const { setStudentName } = useApp();
  const [inputName, setInputName] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = inputName.trim();
    if (!trimmed) {
      setErrorText("¡Por favor, escribe tu nombre! 🎈");
      return;
    }

    if (trimmed.length < 2) {
      setErrorText("Tu nombre debe tener al menos 2 letras 🧸");
      return;
    }

    playSuccessSound();
    setStudentName(trimmed);
    onSuccess();
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh]">
      {/* Decorative Character dialogue */}
      <div className="relative mb-6 w-full flex flex-col items-center">
        {/* Toby standard dialog speech balloon */}
        <div className="bg-white border-4 border-yellow-400 rounded-3xl p-5 shadow-md relative w-full mb-6">
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-yellow-400 rotate-45" />
          <h2 className="text-xl font-display font-black text-center text-purple-700">
            🐶 ¡Hola, amiguito!
          </h2>
          <p className="text-gray-650 font-sans text-center mt-2 font-medium">
            ¡Quiero saber quién eres para que ganemos muchas estrellas juntos! ¿Cómo te llamas?
          </p>
        </div>
        <span className="text-5xl animate-bounce">👋🧒🏼🎒</span>
      </div>

      <div className="bg-white w-full rounded-3xl border-4 border-emerald-300 p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-display font-bold text-lg text-center mb-3">
              Escribe tu nombre aquí:
            </label>
            <input
              id="student-name-input"
              type="text"
              autoFocus
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
                if (errorText) setErrorText("");
              }}
              placeholder="Ej. Mateo, Sofía..."
              className="w-full text-center font-display font-bold text-2xl text-purple-700 bg-purple-50 hover:bg-purple-100/50 border-4 border-purple-200 focus:border-purple-400 rounded-2xl py-3 px-4 focus:outline-none transition-all placeholder:text-gray-300"
              maxLength={20}
            />
          </div>

          {errorText && (
            <div className="text-red-500 font-display font-bold text-center text-sm bg-red-50 py-2.5 px-4 rounded-xl border-2 border-red-200">
              {errorText}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="btn-form-back"
              type="button"
              onClick={() => {
                playBubbleSound();
                onBack();
              }}
              className="sm:flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-display font-bold rounded-2xl transition shadow-sm border border-gray-200 flex items-center justify-center gap-2 order-2 sm:order-1"
            >
              <ArrowLeft size={18} /> Atrás
            </button>
            <button
              id="btn-form-submit"
              type="submit"
              className="sm:flex-1 py-3 px-4 bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-white font-display font-black text-lg rounded-2xl transition shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 transform order-1 sm:order-2"
            >
              ¡Comenzar! <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
