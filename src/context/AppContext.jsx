import React, { createContext, useContext, useState, useEffect } from "react";

const DEFAULT_STATE = {
  name: null,
  stars: 0,
  completedLessons: [],
  watchedVideos: [],
  completedActivities: [],
  badges: [],
  evaluations: [],
  teacherConfig: {
    selectedEvalTopics: ["colors", "school", "shapes"]
  }
};

const LOCAL_STORAGE_KEY = "kids_english_learning_state_v1";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error reading initial local storage", e);
        }
      }
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setStudentName = (name) => {
    setState((prev) => ({
      ...prev,
      name
    }));
  };

  const markVideoWatched = (topicId) => {
    setState((prev) => {
      const watched = prev.watchedVideos.includes(topicId)
        ? prev.watchedVideos
        : [...prev.watchedVideos, topicId];

      const hadFinishedActivity = prev.completedActivities.includes(topicId);
      const completedLessons = prev.completedLessons.includes(topicId)
        ? prev.completedLessons
        : (hadFinishedActivity ? [...prev.completedLessons, topicId] : prev.completedLessons);

      return {
        ...prev,
        watchedVideos: watched,
        completedLessons
      };
    });
  };

  const markActivityCompleted = (topicId) => {
    setState((prev) => {
      const completedActivities = prev.completedActivities.includes(topicId)
        ? prev.completedActivities
        : [...prev.completedActivities, topicId];

      const hadWatchedVideo = prev.watchedVideos.includes(topicId);
      const completedLessons = prev.completedLessons.includes(topicId)
        ? prev.completedLessons
        : (hadWatchedVideo ? [...prev.completedLessons, topicId] : prev.completedLessons);

      const newBadges = [...prev.badges];

      if (topicId === "colors" && !newBadges.includes("colors")) {
        newBadges.push("colors"); // "Explorador de Colores"
      } else if (topicId === "school" && !newBadges.includes("school")) {
        newBadges.push("school"); // "Experto en Útiles"
      } else if (topicId === "shapes" && !newBadges.includes("shapes")) {
        newBadges.push("shapes"); // "Maestro de Figuras"
      }

      if (
        completedActivities.includes("colors") &&
        completedActivities.includes("school") &&
        completedActivities.includes("shapes") &&
        !newBadges.includes("expert")
      ) {
        newBadges.push("expert");
      }

      return {
        ...prev,
        completedActivities,
        completedLessons,
        badges: newBadges
      };
    });
  };

  const addStars = (amount) => {
    setState((prev) => ({
      ...prev,
      stars: prev.stars + amount
    }));
  };

  const addEvaluation = (recordData) => {
    const newRecord = {
      ...recordData,
      id: "eval_" + Date.now(),
      date: new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setState((prev) => {
      const evaluations = [newRecord, ...prev.evaluations];

      const bonusStars = recordData.correctCount * 2;

      return {
        ...prev,
        evaluations,
        stars: prev.stars + bonusStars
      };
    });
  };

  const updateTeacherConfig = (selectedTopics) => {
    setState((prev) => ({
      ...prev,
      teacherConfig: {
        selectedEvalTopics: selectedTopics
      }
    }));
  };

  const resetAllData = () => {
    setState(DEFAULT_STATE);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setStudentName,
        markVideoWatched,
        markActivityCompleted,
        addStars,
        addEvaluation,
        updateTeacherConfig,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
