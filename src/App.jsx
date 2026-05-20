import React, { useState, useEffect } from "react";
import "./App.css";
import "./ProgressManagement/ProgressManagement.css";

import Dashboard from "./Pages/Dashboard.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import NewQuizSystem from "./components/NewQuizSystem.jsx";
import CertificatePreview from "./components/CertificatePreview.jsx";
import Notes from "./components/Notes.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  const [activePage, setActivePage] = useState(
    localStorage.getItem("isLoggedIn") === "true" ? "dashboard" : "login"
  );

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [completedItems, setCompletedItems] = useState([1, 2, 3]);
  const [certificateProgressMemory, setCertificateProgressMemory] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("certificateProgressMemory") || "null");
    return saved && typeof saved === "object"
      ? {
          beginner: false,
          intermediate: false,
          advanced: false,
          ...saved
        }
      : {
          beginner: false,
          intermediate: false,
          advanced: false
        };
  });
  const [completedSubjectMemory, setCompletedSubjectMemory] = useState(() => {
    return JSON.parse(localStorage.getItem("certificateSubjectCompletion") || "{}") || {};
  });
  const [difficultyLevel, setDifficultyLevel] = useState("Medium");
  const [quizScore, setQuizScore] = useState(75);
  const [practicalScore, setPracticalScore] = useState(80);
  const [adaptiveMessage, setAdaptiveMessage] = useState("");

  const certificateSubjectIdsByLevel = {
    beginner: [1, 2],
    intermediate: [3, 4],
    advanced: [5, 6]
  };

  const [leaderboard, setLeaderboard] = useState([
    { name: "Aina", score: 80, level: "beginner" },
    { name: "Amar", score: 88, level: "beginner" },
    { name: "Kevin", score: 70, level: "beginner" },

    { name: "Aina", score: 75, level: "intermediate" },
    { name: "Amar", score: 85, level: "intermediate" },
    { name: "Kevin", score: 65, level: "intermediate" },

    { name: "Aina", score: 90, level: "advanced" },
    { name: "Amar", score: 92, level: "advanced" },
    { name: "Kevin", score: 88, level: "advanced" }
  ]);

  const [showLevelPopup, setShowLevelPopup] = useState(
    localStorage.getItem("learningLevel") ? false : true
  );

  const [learningLevel, setLearningLevel] = useState(
    localStorage.getItem("learningLevel") || ""
  );

  const totalLearningItems = 8;

  const updateCertificateProgressMemory = (newMemory) => {
    const normalizedMemory = {
      beginner: Boolean(newMemory.beginner),
      intermediate: Boolean(newMemory.intermediate),
      advanced: Boolean(newMemory.advanced)
    };

    localStorage.setItem(
      "certificateProgressMemory",
      JSON.stringify(normalizedMemory)
    );
    setCertificateProgressMemory(normalizedMemory);
  };

  const getUpdatedCertificateMemory = (subjectCompletion) => {
    const nextMemory = {
      beginner: certificateSubjectIdsByLevel.beginner.every(
        (id) => subjectCompletion[id]
      ),
      intermediate: certificateSubjectIdsByLevel.intermediate.every(
        (id) => subjectCompletion[id]
      ),
      advanced: certificateSubjectIdsByLevel.advanced.every(
        (id) => subjectCompletion[id]
      )
    };

    return nextMemory;
  };

  useEffect(() => {
    const restoredMemory = getUpdatedCertificateMemory(completedSubjectMemory);
    if (
      restoredMemory.beginner !== certificateProgressMemory.beginner ||
      restoredMemory.intermediate !== certificateProgressMemory.intermediate ||
      restoredMemory.advanced !== certificateProgressMemory.advanced
    ) {
      updateCertificateProgressMemory(restoredMemory);
    }
  }, []);

  useEffect(() => {
    if (!selectedSubject || !Array.isArray(completedItems)) return;
    if (completedItems.length < totalLearningItems) return;

    const subjectId = selectedSubject.id;
    if (!subjectId) return;

    if (completedSubjectMemory[subjectId]) return;

    const updatedSubjectMemory = {
      ...completedSubjectMemory,
      [subjectId]: true
    };

    localStorage.setItem(
      "certificateSubjectCompletion",
      JSON.stringify(updatedSubjectMemory)
    );
    setCompletedSubjectMemory(updatedSubjectMemory);

    const newCertificateMemory = getUpdatedCertificateMemory(updatedSubjectMemory);
    updateCertificateProgressMemory(newCertificateMemory);
  }, [completedItems, selectedSubject, completedSubjectMemory]);

  const handleSelectLevel = (level) => {
    setLearningLevel(level);
    localStorage.setItem("learningLevel", level);
    setShowLevelPopup(false);
  };

  const handleEnroll = (subject) => {
    setSelectedSubject(subject);
    setActivePage("learning-content");
    setCompletedItems([]);
    setDifficultyLevel("Medium");
    setQuizScore(null);
    setPracticalScore(null);
    setAdaptiveMessage("");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setActivePage("login");
  };

  const getAdaptiveMessage = (level) => {
    if (level === "Easy") {
      return "You may need more support. Review the reading and video.";
    }

    if (level === "Medium") {
      return "You are making steady progress.";
    }

    return "Excellent performance. Ready for advanced content.";
  };

  const updateAdaptiveLevel = (newQuizScore, newPracticalScore) => {
    if (newQuizScore === null || newPracticalScore === null) return;

    const finalScore = newQuizScore * 0.4 + newPracticalScore * 0.6;

    let newLevel = "Easy";

    if (finalScore >= 75) {
      newLevel = "Hard";
    } else if (finalScore >= 50) {
      newLevel = "Medium";
    }

    setDifficultyLevel(newLevel);
    setAdaptiveMessage(getAdaptiveMessage(newLevel));
  };

  const updateLeaderboard = (
    studentName,
    score,
    level = localStorage.getItem("learningLevel") || "beginner"
  ) => {
    const name = studentName || "Student";

    setLeaderboard((prev) => {
      const existing = prev.find(
        (item) => item.name === name && item.level === level
      );

      let updated;

      if (existing) {
        updated = prev.map((item) =>
          item.name === name && item.level === level
            ? { ...item, score: Math.max(item.score, score) }
            : item
        );
      } else {
        updated = [...prev, { name, score, level }];
      }

      return updated.sort((a, b) => b.score - a.score);
    });
  };

  const certificateCompletedCount =
    (certificateProgressMemory.beginner ? 1 : 0) +
    (certificateProgressMemory.intermediate ? 1 : 0) +
    (certificateProgressMemory.advanced ? 1 : 0);

  const certificateProgress =
    certificateCompletedCount === 3
      ? 100
      : certificateCompletedCount === 2
      ? 67
      : certificateCompletedCount === 1
      ? 33
      : 0;

  const studentData = {
    completedModules: completedItems.length,
    totalModules: totalLearningItems,
    progressPercent: selectedSubject
      ? Math.round((completedItems.length / totalLearningItems) * 100)
      : 0,
    certificateProgress,
    certificateProgressMemory,
    quizScore: quizScore || 0,
    practicalScore: practicalScore || 0,
    averageScore: Math.round(((quizScore || 0) + (practicalScore || 0)) / 2),
    difficultyLevel:
      learningLevel === "beginner"
        ? "Beginner"
        : learningLevel === "intermediate"
        ? "Intermediate"
        : learningLevel === "advanced"
        ? "Advanced"
        : "Beginner",
    adaptiveMessage:
      adaptiveMessage ||
      "Complete quiz and practical task to get adaptive feedback."
  };

  return (
    <div className="app-container">
      {activePage === "dashboard" && (
        <Dashboard
          handleEnroll={handleEnroll}
          studentData={studentData}
          leaderboard={leaderboard}
          updateLeaderboard={updateLeaderboard}
          setQuizScore={setQuizScore}
          setActivePage={setActivePage}
          handleLogout={handleLogout}
          learningLevel={learningLevel}
          showLevelPopup={showLevelPopup}
          handleSelectLevel={handleSelectLevel}
        />
      )}

      {activePage === "login" && (
        <Login
          goToRegister={() => setActivePage("register")}
          goToDashboard={() => setActivePage("dashboard")}
        />
      )}

      {activePage === "register" && (
        <Register goToLogin={() => setActivePage("login")} />
      )}

      {activePage === "learning-content" && selectedSubject && (
        <NewQuizSystem
          module={selectedSubject}
          onBack={() => setActivePage("dashboard")}
          setQuizScore={setQuizScore}
          setPracticalScore={setPracticalScore}
          completedItems={completedItems}
          setCompletedItems={setCompletedItems}
          difficultyLevel={difficultyLevel}
          updateAdaptiveLevel={updateAdaptiveLevel}
          updateLeaderboard={updateLeaderboard}
          leaderboard={leaderboard}
        />
      )}

      {activePage === "certificate-preview" && (
        <CertificatePreview onBack={() => setActivePage("dashboard")} />
      )}
      
    </div>
);
}

export default App;