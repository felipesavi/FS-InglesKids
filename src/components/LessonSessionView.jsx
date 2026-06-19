import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { LESSONS } from "../data/lessons";
import {
  ArrowLeft,
  Volume2,
  Video,
  BookOpen,
  Gamepad2,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles,
  Info
} from "lucide-react";
import {
  playBubbleSound,
  playSuccessSound,
  playErrorSound,
  playCelebrationSound,
  speakEnglish,
  speakSpanish
} from "../utils/audio";
import { motion } from "motion/react";

export const LessonSessionView = ({ topicId, onBack }) => {
  const { state, markVideoWatched, markActivityCompleted, addStars } = useApp();
  const topic = LESSONS.find((l) => l.id === topicId);

  const [activeStep, setActiveStep] = useState("video");
  const [synthSpeakingId, setSynthSpeakingId] = useState(null);

  const [vocabIndex, setVocabIndex] = useState(0);

  const [colorTarget, setColorTarget] = useState(null);
  const [colorOptions, setColorOptions] = useState([]);
  const [colorAttemptsCount, setColorAttemptsCount] = useState(0);
  const [colorFinished, setColorFinished] = useState(false);

  const [schoolCards, setSchoolCards] = useState([]);
  const [selectedSchoolCard, setSelectedSchoolCard] = useState(null);
  const [schoolPairsMatched, setSchoolPairsMatched] = useState(0);
  const [schoolFinished, setSchoolFinished] = useState(false);

  const [shapeTarget, setShapeTarget] = useState(null);
  const [shapeOptions, setShapeOptions] = useState([]);
  const [shapeFinished, setShapeFinished] = useState(false);

  const [activePracticeScore, setActivePracticeScore] = useState(0);

  useEffect(() => {
    if (activeStep === "practice") {
      initPracticeGame();
    }
  }, [activeStep, topicId]);

  const initPracticeGame = () => {
    setActivePracticeScore(0);

    if (topicId === "colors") {
      const target = topic.words[Math.floor(Math.random() * topic.words.length)];
      setColorTarget(target);

      const options = [target];
      while (options.length < 4) {
        const randomOpt = topic.words[Math.floor(Math.random() * topic.words.length)];
        if (!options.some((o) => o.id === randomOpt.id)) {
          options.push(randomOpt);
        }
      }
      setColorOptions(shuffleArray(options));
      setColorFinished(false);
      setColorAttemptsCount(0);

      setTimeout(() => {
        speakEnglish(target.english);
      }, 500);
    }

    else if (topicId === "school") {
      const shuffledWords = shuffleArray([...topic.words]).slice(0, 4);
      const cards = [];

      shuffledWords.forEach((word) => {
        cards.push({
          id: word.id + "-eng",
          wordId: word.id,
          type: "english",
          value: word.english,
          isMatched: false
        });
        cards.push({
          id: word.id + "-emoji",
          wordId: word.id,
          type: "emoji",
          value: word.emoji,
          isMatched: false
        });
      });

      setSchoolCards(shuffleArray(cards));
      setSelectedSchoolCard(null);
      setSchoolPairsMatched(0);
      setSchoolFinished(false);
    }

    else if (topicId === "shapes") {

      const target = topic.words[Math.floor(Math.random() * topic.words.length)];
      setShapeTarget(target);

      setShapeOptions(shuffleArray([...topic.words]));
      setShapeFinished(false);

      setTimeout(() => {
        speakEnglish(target.english);
      }, 500);
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


  const handleSpeakItem = (word, lang) => {
    playBubbleSound();
    setSynthSpeakingId(word.id + "-" + lang);

    if (lang === "english") {
      speakEnglish(word.english, () => setSynthSpeakingId(null));
    } else {
      speakSpanish(word.spanish, () => setSynthSpeakingId(null));
    }
  };

  const handleVerifyVideoCompleted = () => {
    playBubbleSound();
    markVideoWatched(topicId);
    setActiveStep("vocabulary");
  };

  const handleColorSelection = (selected) => {
    if (colorFinished) return;

    if (colorTarget && selected.id === colorTarget.id) {
      playSuccessSound();
      setColorFinished(true);
      markActivityCompleted(topicId);
      addStars(10);
      playCelebrationSound();
    } else {
      playErrorSound();
      setColorAttemptsCount((c) => c + 1);
      if (colorTarget) speakEnglish(colorTarget.english);
    }
  };

  const handleShapeSelection = (selected) => {
    if (shapeFinished) return;

    if (shapeTarget && selected.id === shapeTarget.id) {
      playSuccessSound();
      setShapeFinished(true);
      markActivityCompleted(topicId);
      addStars(10);
      playCelebrationSound();
    } else {
      playErrorSound();
      if (shapeTarget) speakEnglish(shapeTarget.english);
    }
  };

  const handleSchoolCardClick = (card) => {
    if (card.isMatched || schoolFinished) return;
    playBubbleSound();

    if (!selectedSchoolCard) {
      setSelectedSchoolCard(card);

      if (card.type === "english") {
        speakEnglish(card.value);
      }
      return;
    }

    if (selectedSchoolCard.id === card.id) {
      setSelectedSchoolCard(null);
      return;
    }

    // Check matchmaking
    if (selectedSchoolCard.wordId === card.wordId && selectedSchoolCard.type !== card.type) {

      playSuccessSound();

      const updatedCards = schoolCards.map((c) => {
        if (c.wordId === card.wordId) {
          return { ...c, isMatched: true };
        }
        return c;
      });

      setSchoolCards(updatedCards);
      const newMatches = schoolPairsMatched + 1;
      setSchoolPairsMatched(newMatches);
      setSelectedSchoolCard(null);

      const matchingWord = topic.words.find((w) => w.id === card.wordId);
      if (matchingWord) {
        speakEnglish(matchingWord.english);
      }

      if (newMatches === 4) {
        setTimeout(() => {
          setSchoolFinished(true);
          markActivityCompleted(topicId);
          addStars(10);
          playCelebrationSound();
        }, 600);
      }
    } else {
      playErrorSound();
      setSelectedSchoolCard(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6" id={`lesson-theme-${topicId}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            id="btn-lesson-back"
            onClick={() => {
              playBubbleSound();
              onBack();
            }}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-650 rounded-2xl transition border border-gray-200 shadow-xs"
            title="Atrás al menú"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-display font-black text-gray-800">
              Tema: {topic.name}
            </h1>
            <p className="text-gray-400 font-sans text-xs">
              Siguiendo la ruta: Video → Vocabulario → Juego
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-150 p-1.5 rounded-2xl">
          <button
            id="btn-step-video"
            onClick={() => {
              playBubbleSound();
              setActiveStep("video");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display font-bold text-xs transition ${activeStep === "video"
                ? "bg-red-500 text-white shadow-xs"
                : "bg-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            <Video size={14} /> 1. Video
          </button>

          <button
            id="btn-step-vocab"
            onClick={() => {
              playBubbleSound();
              setActiveStep("vocabulary");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display font-bold text-xs transition ${activeStep === "vocabulary"
                ? "bg-purple-500 text-white shadow-xs"
                : "bg-transparent text-gray-550 hover:text-gray-700"
              }`}
          >
            <BookOpen size={14} /> 2. Palabras
          </button>

          <button
            id="btn-step-practice"
            onClick={() => {
              playBubbleSound();
              setActiveStep("practice");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-display font-bold text-xs transition ${activeStep === "practice"
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            <Gamepad2 size={14} /> 3. Jugar
          </button>
        </div>
      </div>

      {activeStep === "video" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border-4 border-red-300 shadow-md">
            <h2 className="text-lg font-display font-bold text-red-500 flex items-center gap-1.5 mb-3">
              📺 Clase Divertida de {topic.name}
            </h2>
            <p className="text-gray-650 font-sans text-sm mb-4">
              Mira el divertido video animado para repasar cómo suenan las palabras en inglés.
            </p>

            <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-red-150 shadow-inner bg-slate-900">
              <iframe
                className="w-full h-full"
                src={topic.videoUrl}
                title={`Clase de ${topic.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              id="btn-ready-video"
              onClick={handleVerifyVideoCompleted}
              className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-display font-black text-lg px-8 py-4 rounded-3xl border-4 border-green-300 shadow-md hover:scale-102 hover:shadow-lg transition-transform"
            >
              ¡Listo! Continuar al Vocabulario 📕
            </button>
          </div>
        </div>
      )}

      {activeStep === "vocabulary" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border-4 border-purple-300 shadow-md text-center">
            <h2 className="text-lg font-display font-bold text-purple-600 flex items-center justify-center gap-1.5 mb-2">
              📕 Diccionario Ilustrado
            </h2>
            <p className="text-gray-550 font-sans text-xs mb-6">
              Haz clic en el botón de la bocina azul para escuchar en Inglés, y en el rosado para Español.
            </p>

            <div className="relative max-w-md mx-auto bg-purple-50/40 rounded-3xl p-8 border-2 border-purple-150 shadow-sm flex flex-col items-center">
              {/* Emojis or Solids representation */}
              <div
                className="w-32 h-32 rounded-3xl flex items-center justify-center text-7xl mb-4 border-4 border-white shadow-md relative"
                style={{
                  backgroundColor: topic.words[vocabIndex].colorHex || '#f8fafc',
                  color: topic.words[vocabIndex].colorHex === '#FFFFFF' ? '#000000' : 'inherit'
                }}
              >
                {topic.words[vocabIndex].colorHex === '#FFFFFF' && (
                  <div className="absolute inset-0 border border-gray-200 rounded-3xl" />
                )}
                <span>{topic.words[vocabIndex].emoji}</span>
              </div>

              <h3 className="text-4xl font-display font-black text-gray-800 uppercase tracking-tight">
                {topic.words[vocabIndex].english}
              </h3>

              <div className="mt-2 text-xl font-display font-bold text-purple-700 bg-white border border-purple-200 px-4 py-1 rounded-full shadow-xs">
                {topic.words[vocabIndex].spanish}
              </div>

              <div className="flex gap-4 w-full justify-center mt-8">

                <button
                  id={`btn-pronounce-eng-${topic.words[vocabIndex].id}`}
                  onClick={() => handleSpeakItem(topic.words[vocabIndex], "english")}
                  className={`flex-1 max-w-[140px] flex flex-col items-center gap-1 bg-cyan-100 hover:bg-cyan-200 text-cyan-800 font-display font-bold px-4 py-3 rounded-2xl transition border-2 border-cyan-300 ${synthSpeakingId === topic.words[vocabIndex].id + "-english" ? "animate-pulse" : ""
                    }`}
                >
                  <Volume2 size={24} className="text-cyan-700 animate-bounce" />
                  <span className="text-xs">Pronunciación</span>
                </button>

                <button
                  id={`btn-pronounce-es-${topic.words[vocabIndex].id}`}
                  onClick={() => handleSpeakItem(topic.words[vocabIndex], "spanish")}
                  className={`flex-1 max-w-[140px] flex flex-col items-center gap-1 bg-pink-100 hover:bg-pink-200 text-pink-800 font-display font-bold px-4 py-3 rounded-2xl transition border-2 border-pink-300 ${synthSpeakingId === topic.words[vocabIndex].id + "-spanish" ? "animate-pulse" : ""
                    }`}
                >
                  <Volume2 size={24} className="text-pink-700" />
                  <span className="text-xs">Español</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between max-w-md mx-auto mt-6">
              <button
                id="btn-vocab-prev"
                onClick={() => {
                  playBubbleSound();
                  setVocabIndex((idx) => (idx > 0 ? idx - 1 : topic.words.length - 1));
                }}
                className="font-display font-semibold text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-2xl border"
              >
                ◀ Anterior
              </button>

              <span className="font-display font-bold text-gray-500 text-sm">
                {vocabIndex + 1} / {topic.words.length}
              </span>

              <button
                id="btn-vocab-next"
                onClick={() => {
                  playBubbleSound();
                  setVocabIndex((idx) => (idx < topic.words.length - 1 ? idx + 1 : 0));
                }}
                className="font-display font-semibold text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2.5 rounded-2xl border border-purple-200"
              >
                Siguiente ▶
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <Info size={14} /> Consejo: Escucha y repite en voz alta con Toby.
            </span>
            <button
              id="btn-go-to-practice"
              onClick={() => {
                playBubbleSound();
                setActiveStep("practice");
              }}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-900 font-display font-black px-6 py-3 rounded-2xl transition shadow border-2 border-amber-300"
            >
              🎮 ¡Vamos a Jugar!
            </button>
          </div>
        </div>
      )}

      {activeStep === "practice" && (
        <div className="space-y-6">

          <div className="bg-white p-6 rounded-3xl border-4 border-amber-300 shadow-md">


            {topicId === "colors" && (
              <div>
                {!colorFinished ? (
                  <div className="text-center space-y-6">
                    <div className="bg-amber-100 p-3 rounded-2xl inline-block">
                      <h3 className="text-lg font-display font-bold text-amber-700 flex items-center justify-center gap-1.5">
                        🔊 Escucha el color y selecciónalo:
                      </h3>
                    </div>

                    <div className="flex justify-center gap-4 py-3">
                      <button
                        id="btn-practice-speak-color"
                        onClick={() => {
                          playBubbleSound();
                          if (colorTarget) speakEnglish(colorTarget.english);
                        }}
                        className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded-full w-20 h-20 shadow-md border-4 border-white flex items-center justify-center cursor-pointer hover:rotate-6 transition-all duration-200 animate-bounce"
                      >
                        <Volume2 size={36} className="text-cyan-600" />
                      </button>
                    </div>


                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                      {colorOptions.map((opt) => (
                        <button
                          key={opt.id}
                          id={`btn-color-choice-${opt.id}`}
                          onClick={() => handleColorSelection(opt)}
                          className="bg-white border-4 border-gray-200 hover:border-amber-400 active:border-green-400 rounded-3xl p-5 flex flex-col items-center gap-2 h-40 transition-all shadow-sm outline-none cursor-pointer"
                        >
                          <div
                            className="w-14 h-14 rounded-2xl shadow-inner border border-gray-200"
                            style={{ backgroundColor: opt.colorHex }}
                          />
                          <span className="text-sm font-display font-bold text-gray-500">
                            ¿Es este?
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <span className="text-7xl animate-bounce block">🏆🧁🎨</span>
                    <h3 className="text-3xl font-display font-black text-green-600">
                      ¡Magnífico! Lo hiciste increíble
                    </h3>
                    <p className="text-gray-650 font-sans font-semibold max-w-md mx-auto">
                      Escuchaste correctamente el color{" "}
                      <span className="text-purple-600 font-display font-bold">
                        {colorTarget?.english} ({colorTarget?.spanish})
                      </span>
                      . ¡Ganaste 10 estrellas!
                    </p>
                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        id="btn-color-retry"
                        onClick={initPracticeGame}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl border-2 text-gray-600 font-display font-medium bg-gray-50 hover:bg-gray-100"
                      >
                        <RotateCcw size={16} /> Jugar de Nuevo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}


            {topicId === "school" && (
              <div>
                {!schoolFinished ? (
                  <div className="space-y-6">
                    <div className="text-center bg-amber-55 p-4 rounded-3xl border border-amber-200 max-w-md mx-auto">
                      <h3 className="text-md font-display font-bold text-amber-800 flex items-center justify-center gap-1.5">
                        💡 Relaciona la palabra con el dibujo:
                      </h3>
                      <p className="text-xs text-gray-500 font-sans mt-1">
                        Toca una palabra y luego busca su dibujo correcto para unirlos.
                      </p>
                    </div>


                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto py-4">
                      {schoolCards.map((card) => {
                        const isSelected = selectedSchoolCard?.id === card.id;

                        return (
                          <button
                            key={card.id}
                            id={`btn-school-card-${card.id}`}
                            onClick={() => handleSchoolCardClick(card)}
                            disabled={card.isMatched}
                            className={`min-h-32 border-4 rounded-2xl p-4 flex flex-col items-center justify-center shadow-md active:scale-95 transition-all outline-none cursor-pointer ${card.isMatched
                                ? "bg-green-100 border-green-400 opacity-60 pointer-events-none"
                                : isSelected
                                  ? "bg-amber-100 border-amber-400 scale-102 rotate-1"
                                  : "bg-white border-gray-200 hover:border-amber-300"
                              }`}
                          >
                            {card.isMatched ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className={card.type === "emoji" ? "text-4xl" : "text-md font-display font-black text-green-700"}>
                                  {card.value}
                                </span>
                                <span className="text-xs text-green-600 font-display font-bold flex items-center gap-0.5">
                                  ❤️ ¡Listo!
                                </span>
                              </div>
                            ) : (
                              <span className={card.type === "emoji" ? "text-5xl" : "text-lg font-display font-bold text-gray-750"}>
                                {card.value}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-center text-xs text-gray-400 font-bold">
                      Progreso: {schoolPairsMatched} / 4 parejas unidas
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-4 animate-fade-in">
                    <span className="text-7xl animate-bounce block">🏆🎒✏️</span>
                    <h3 className="text-3xl font-display font-black text-green-600">
                      ¡Muy bien hecho!
                    </h3>
                    <p className="text-gray-650 font-sans font-semibold max-w-md mx-auto">
                      Lograste relacionar todas las palabras con sus imágenes escolares correctas. ¡Sigue así!
                    </p>
                    <p className="text-amber-500 font-display font-black text-md">
                      ⭐ ¡Sumaste 10 Estrellas!
                    </p>
                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        id="btn-school-retry"
                        onClick={initPracticeGame}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl border-2 text-gray-600 font-display font-medium bg-gray-50 hover:bg-gray-100"
                      >
                        <RotateCcw size={16} /> Jugar de Nuevo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {topicId === "shapes" && (
              <div>
                {!shapeFinished ? (
                  <div className="text-center space-y-6">
                    <div className="bg-amber-100 p-3 rounded-2xl inline-block">
                      <h3 className="text-lg font-display font-bold text-amber-700 flex items-center justify-center gap-1.5">
                        🔊 Escucha la figura y selecciónala:
                      </h3>
                    </div>

                    <div className="flex justify-center gap-4 py-3">
                      <button
                        id="btn-practice-speak-shape"
                        onClick={() => {
                          playBubbleSound();
                          if (shapeTarget) speakEnglish(shapeTarget.english);
                        }}
                        className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded-full w-20 h-20 shadow-md border-4 border-white flex items-center justify-center cursor-pointer hover:rotate-6 transition-all duration-200 animate-bounce"
                      >
                        <Volume2 size={36} className="text-cyan-600" />
                      </button>
                    </div>


                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 justify-center py-4">
                      {shapeOptions.map((opt) => (
                        <button
                          key={opt.id}
                          id={`btn-shape-choice-${opt.id}`}
                          onClick={() => handleShapeSelection(opt)}
                          className="bg-white border-4 border-gray-200 hover:border-amber-400 rounded-2xl p-4 flex flex-col items-center justify-center min-h-28 transition-all active:scale-95 text-center outline-none cursor-pointer"
                        >
                          <span className="text-5xl mb-2">{opt.emoji}</span>
                          <span className="text-xs font-display font-bold text-gray-500">
                            ¿Es este?
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <span className="text-7xl animate-bounce block">🏆🔺⭕</span>
                    <h3 className="text-3xl font-display font-black text-green-600">
                      ¡Genial! Eres un experto
                    </h3>
                    <p className="text-gray-650 font-sans font-semibold max-w-md mx-auto">
                      Identificaste la figura geométrica{" "}
                      <span className="text-purple-600 font-display font-bold">
                        {shapeTarget?.english} ({shapeTarget?.spanish})
                      </span>{" "}
                      exitosamente.
                    </p>
                    <p className="text-amber-500 font-display font-black text-md">
                      ⭐ ¡Sumaste 10 Estrellas!
                    </p>
                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        id="btn-shapes-retry"
                        onClick={initPracticeGame}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl border-2 text-gray-600 font-display font-medium bg-gray-50 hover:bg-gray-100"
                      >
                        <RotateCcw size={16} /> Jugar de Nuevo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-3xl">
            <button
              id="btn-practice-back-to-lessons"
              onClick={() => {
                playBubbleSound();
                setActiveStep("vocabulary");
              }}
              className="font-display font-semibold text-gray-600 text-sm hover:text-gray-800 transition"
            >
              ← Volver a repasar palabras
            </button>
            <button
              id="btn-lesson-complete"
              onClick={() => {
                playBubbleSound();
                onBack();
              }}
              className="bg-green-100 border border-green-300 hover:bg-green-200 text-green-700 px-5 py-2.5 rounded-2xl font-display font-bold text-xs"
            >
              Terminé por hoy ✔️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
