import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { LESSONS } from "../data/lessons";
import { speakEnglish, speakSpanish, playSuccessSound, playErrorSound, playCelebrationSound, playBubbleSound } from "../utils/audio";
import { Star, Award, ChevronRight, HelpCircle, Check, X, RotateCcw, Volume2 } from "lucide-react";
import { motion } from "motion/react";

export const EvaluationSessionView = ({ onBack }) => {
  const { state, addEvaluation } = useApp();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // question Index => selected option id
  const [evalFinished, setEvalFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);


  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    const activeTopicIds = state.teacherConfig.selectedEvalTopics;
    const activeLessons = LESSONS.filter((lesson) => activeTopicIds.includes(lesson.id));

    if (activeLessons.length === 0) {
      onBack();
      return;
    }

    const questionPool = [];
    const idCounter = 1;


    activeLessons.forEach((lesson) => {
      lesson.words.forEach((word) => {


        const otherOptionsListen = shuffleArray(lesson.words.filter((w) => w.id !== word.id)).slice(0, 3);
        const optionsListen = [word, ...otherOptionsListen].map((o) => ({
          id: o.id,
          label: o.english,
          emoji: o.emoji,
          colorHex: o.colorHex
        }));

        questionPool.push({
          id: `q_listen_${word.id}`,
          type: "listen",
          prompt: "¿Cuál de estos dibujos escuchas?",
          listenValue: word.english,
          options: shuffleArray(optionsListen),
          correctAnswerId: word.id,
          topicName: lesson.name
        });

        const otherOptionsMultiple = shuffleArray(lesson.words.filter((w) => w.id !== word.id)).slice(0, 3);
        const optionsMultiple = [word, ...otherOptionsMultiple].map((o) => ({
          id: o.id,
          label: o.spanish,
          emoji: o.emoji,
          colorHex: o.colorHex
        }));

        questionPool.push({
          id: `q_mult_${word.id}`,
          type: "multiple",
          prompt: `¿Cómo se dice "${word.spanish}" en inglés?`,
          displayValue: word.spanish,
          options: shuffleArray([word, ...otherOptionsMultiple].map((o) => ({
            id: o.id,
            label: o.english,
            emoji: o.emoji,
            colorHex: o.colorHex
          }))),
          correctAnswerId: word.id,
          topicName: lesson.name
        });

        const otherOptionsVisual = shuffleArray(lesson.words.filter((w) => w.id !== word.id)).slice(0, 3);
        questionPool.push({
          id: `q_vis_${word.id}`,
          type: "visual",
          prompt: "Mira el dibujo, ¿qué es en inglés?",
          displayValue: word.emoji,
          options: shuffleArray([word, ...otherOptionsVisual].map((o) => ({
            id: o.id,
            label: o.english,
            emoji: o.emoji,
            colorHex: o.colorHex
          }))),
          correctAnswerId: word.id,
          topicName: lesson.name
        });
      });
    });


    const finalSelection = shuffleArray(questionPool).slice(0, 5);
    setQuestions(finalSelection);
    setCurrentIdx(0);
    setAnswers({});
    setEvalFinished(false);


    if (finalSelection[0]?.type === "listen") {
      setTimeout(() => {
        if (finalSelection[0].listenValue) speakEnglish(finalSelection[0].listenValue);
      }, 600);
    }
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleSelectOption = (optionId) => {
    playBubbleSound();
    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionId
    }));
  };

  const handleNext = () => {
    playBubbleSound();

    const wasCorrect = answers[currentIdx] === questions[currentIdx].correctAnswerId;
    if (wasCorrect) {
      playSuccessSound();
    } else {
      playErrorSound();
    }

    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);

      if (questions[nextIdx]?.type === "listen" && questions[nextIdx].listenValue) {
        setTimeout(() => {
          speakEnglish(questions[nextIdx].listenValue);
        }, 500);
      }
    } else {

      let corrects = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correctAnswerId) {
          corrects++;
        }
      });


      let finalGrade = 1.0;
      if (corrects === 5) finalGrade = 5.0;
      else if (corrects === 4) finalGrade = 4.5;
      else if (corrects === 3) finalGrade = 4.0;
      else if (corrects === 2) finalGrade = 3.5;
      else if (corrects === 1) finalGrade = 2.5;
      else finalGrade = 1.0;

      const passed = finalGrade >= 3.5;


      addEvaluation({
        score: finalGrade,
        correctCount: corrects,
        totalQuestions: questions.length,
        passed,
        topics: state.teacherConfig.selectedEvalTopics
      });

      playCelebrationSound();
      setEvalFinished(true);
    }
  };

  const handleRepeatVoice = () => {
    playBubbleSound();
    const activeQuestion = questions[currentIdx];
    if (activeQuestion?.listenValue) {
      speakEnglish(activeQuestion.listenValue);
    }
  };


  const getGradeTagAndColor = (grade) => {
    if (grade === 5.0) return { label: "Excelente ✨", bg: "bg-green-150 border-green-400 text-green-700", msg: "¡Increíble! Eres una súper estrella del inglés 🌟" };
    if (grade >= 4.5) return { label: "Superior 🚀", bg: "bg-teal-50 border-teal-300 text-teal-700", msg: "¡Hiciste un trabajo grandioso! 🚀" };
    if (grade >= 4.0) return { label: "Alto 🎉", bg: "bg-blue-100 border-blue-300 text-blue-700", msg: "¡Vas por muy buen camino! 🎉" };
    if (grade >= 3.5) return { label: "Aprobado 👍", bg: "bg-amber-100 border-amber-300 text-amber-700", msg: "¡Buen esfuerzo, sigue practicando! 💪" };
    return { label: "Debe reforzar ❤️", bg: "bg-red-50 border-red-300 text-red-700", msg: "Puedes intentarlo de nuevo, ¡la práctica hace al maestro! ❤️" };
  };

  if (questions.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="font-display font-medium text-gray-500">Cargando preguntas del examen...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const isCurrentAnswered = answers[currentIdx] !== undefined;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6" id="student-evaluation">
      {!evalFinished ? (
        <div className="space-y-6">
          {/* Header Progress Header */}
          <div className="bg-white rounded-3xl p-4 md:p-5 border-4 border-indigo-200 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <div>
                <h2 className="font-display font-black text-indigo-800 text-lg">
                  Examen de Inglés
                </h2>
                <span className="text-xs text-gray-400 font-display font-semibold">
                  Tema evaluado: {currentQuestion.topicName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${idx === currentIdx
                    ? "bg-indigo-500 scale-120 border-indigo-600"
                    : idx < currentIdx
                      ? "bg-green-400 border-green-500"
                      : "bg-gray-100 border-gray-300"
                    }`}
                />
              ))}
            </div>

            <div className="font-display font-bold text-gray-500 text-sm">
              Pregunta {currentIdx + 1} de {questions.length}
            </div>
          </div>

          <div className="bg-white rounded-3xl border-4 border-indigo-300 p-6 md:p-8 shadow-md">

            <div className="text-center space-y-6">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-display font-bold px-3 py-1 rounded-full border border-indigo-150">
                ⭐ Pregunta {currentIdx + 1}
              </span>

              <h3 className="text-2xl font-display font-black text-gray-800">
                {currentQuestion.prompt}
              </h3>

              {currentQuestion.type === "listen" && (
                <div className="py-2">
                  <button
                    id="btn-eval-listen-repeat"
                    onClick={handleRepeatVoice}
                    className="mx-auto bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full w-24 h-24 shadow-md border-4 border-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all animate-bounce"
                  >
                    <Volume2 size={40} className="text-indigo-600" />
                  </button>
                  <label className="text-xs text-indigo-400 font-display block mt-3 font-medium">
                    (Haz clic para repetir el sonido)
                  </label>
                </div>
              )}

              {currentQuestion.type === "visual" && (
                <div className="flex justify-center py-2">
                  <div className="bg-slate-50 border-2 border-gray-100 w-32 h-32 rounded-3xl flex items-center justify-center text-7xl shadow-sm">
                    {currentQuestion.displayValue}
                  </div>
                </div>
              )}

              {currentQuestion.type === "multiple" && (
                <div className="text-center py-4">
                  <span className="text-4xl px-6 py-2.5 bg-yellow-50 text-yellow-800 font-display font-black rounded-3xl border-2 border-yellow-200 shadow-sm inline-block">
                    {currentQuestion.displayValue}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentIdx] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      id={`btn-eval-opt-${opt.id}`}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`min-h-24 p-4 border-4 rounded-3xl flex flex-col items-center justify-center text-center transition-all active:scale-97 outline-none cursor-pointer ${isSelected
                        ? "bg-indigo-50 border-indigo-500 scale-102"
                        : "bg-white border-gray-200 hover:border-indigo-300"
                        }`}
                    >
                      {opt.emoji && <span className="text-4xl mb-1">{opt.emoji}</span>}
                      <span className="text-md font-display font-bold text-gray-800">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              id="btn-eval-abandon"
              onClick={() => {
                playBubbleSound();
                onBack();
              }}
              className="text-gray-400 hover:text-gray-650 font-display font-semibold text-xs"
            >
              Abandondar examen
            </button>

            <button
              id="btn-eval-next"
              disabled={!isCurrentAnswered}
              onClick={handleNext}
              className={`font-display font-black text-lg py-3 px-8 rounded-2xl flex items-center gap-1 transition-all ${isCurrentAnswered
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow hover:scale-103"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border"
                }`}
            >
              {isLastQuestion ? "Finalizar 🎉" : "Siguiente"} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      ) : (

        <div className="space-y-6">
          {(() => {
            // Recalculate results for presentation
            let corrects = 0;
            questions.forEach((q, idx) => {
              if (answers[idx] === q.correctAnswerId) corrects++;
            });
            const wrongCount = questions.length - corrects;
            const successPct = Math.round((corrects / questions.length) * 100);


            let calculatedGrade = 1.0;
            if (corrects === 5) calculatedGrade = 5.0;
            else if (corrects === 4) calculatedGrade = 4.5;
            else if (corrects === 3) calculatedGrade = 4.0;
            else if (corrects === 2) calculatedGrade = 3.5;
            else if (corrects === 1) calculatedGrade = 2.5;

            const meta = getGradeTagAndColor(calculatedGrade);

            return (
              <div className="space-y-6">
                <div className="bg-white border-4 border-indigo-400 rounded-3xl p-6 md:p-8 shadow-md text-center">

                  <span className="text-7xl animate-bounce duration-1000 block">🏆👨‍🎓🏫</span>

                  <h1 className="text-3xl font-display font-black text-indigo-900 mt-4">
                    ¡Examen Terminado, {state.name}!
                  </h1>


                  <div className="my-6 inline-block">
                    <div className="bg-indigo-50 border-2 border-indigo-200 px-6 py-1 rounded-full text-xs font-display font-bold text-indigo-600 mb-2">
                      Tu Calificación Final
                    </div>
                    <div className="text-7xl font-display font-black text-indigo-700 leading-none">
                      {calculatedGrade.toFixed(1)}
                    </div>
                    <div className={`mt-2.5 text-sm font-display font-bold px-4 py-1.5 rounded-full border-2 inline-block ${meta.bg}`}>
                      🏆 Nivel: {meta.label}
                    </div>
                  </div>


                  <p className="text-xl font-display font-black text-purple-700 max-w-md mx-auto">
                    {meta.msg}
                  </p>

                  <p className="text-gray-500 font-sans text-xs mt-3">
                    Cada respuesta correcta te regala 2 nuevas estrellas ⭐.
                  </p>

                  <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mt-8 border-t border-gray-100 pt-6">
                    <div className="bg-green-50 p-3 rounded-2xl border border-green-100">
                      <div className="text-2xl font-display font-black text-green-600">
                        {corrects}
                      </div>
                      <div className="text-xs text-gray-550 font-semibold font-display mt-0.5">Correctas</div>
                    </div>

                    <div className="bg-red-50 p-3 rounded-2xl border border-red-100">
                      <div className="text-2xl font-display font-black text-red-600">
                        {wrongCount}
                      </div>
                      <div className="text-xs text-gray-550 font-semibold font-display mt-0.5">Incorrectas</div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
                      <div className="text-2xl font-display font-black text-blue-600">
                        {successPct}%
                      </div>
                      <div className="text-xs text-gray-550 font-semibold font-display mt-0.5">Aciertos</div>
                    </div>
                  </div>

                  <div className="mt-8 text-left border-t border-gray-200 pt-6 max-w-md mx-auto">
                    <h3 className="text-sm font-display font-black text-gray-700 mb-4 flex items-center gap-1.5">
                      🔎 Repaso de Preguntas:
                    </h3>

                    <div className="space-y-3">
                      {questions.map((q, idx) => {
                        const answerId = answers[idx];
                        const isCorrect = answerId === q.correctAnswerId;
                        const correctWord = LESSONS.flatMap((l) => l.words).find((w) => w.id === q.correctAnswerId);

                        return (
                          <div key={q.id} className="flex items-start gap-2.5 p-3 rounded-2xl bg-gray-50 border text-xs">
                            <span className="mt-0.5">
                              {isCorrect ? (
                                <span className="bg-green-100 text-green-700 p-1 rounded-full"><Check size={12} strokeWidth={3} /></span>
                              ) : (
                                <span className="bg-red-100 text-red-700 p-1 rounded-full"><X size={12} strokeWidth={3} /></span>
                              )}
                            </span>
                            <div>
                              <div className="font-display font-bold text-gray-750">
                                Pregunta {idx + 1}: {q.prompt}
                              </div>
                              <div className="text-gray-400 mt-0.5">
                                Tema: {q.topicName} — Tu respuesta: {" "}
                                <span className="font-semibold text-gray-600">
                                  {q.options.find((o) => o.id === answerId)?.label || "Ninguna"}
                                </span>
                              </div>
                              <div className="text-green-600 font-semibold mt-0.5">
                                Solución correcta: {correctWord?.english} ({correctWord?.spanish}) {correctWord?.emoji}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>


                <div className="flex gap-4">
                  <button
                    id="btn-eval-restart"
                    onClick={() => {
                      playBubbleSound();
                      generateQuestions();
                    }}
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-605 font-display font-bold rounded-2xl flex items-center justify-center gap-1 transition"
                  >
                    <RotateCcw size={16} /> Hacer otro examen
                  </button>

                  <button
                    id="btn-eval-exit"
                    onClick={() => {
                      playBubbleSound();
                      onBack();
                    }}
                    className="flex-1 py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-display font-black rounded-2xl transition text-center shadow"
                  >
                    Volver al Menú Principal
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
