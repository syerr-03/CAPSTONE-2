import React, { useState } from "react";
import "./App.css";

import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import NewQuizSystem from "./components/NewQuizSystem.jsx";
import CertificatePreview from "./components/CertificatePreview.jsx";
import "./ProgressManagement/ProgressManagement.css";

function App() {
  const [activePage, setActivePage] = useState("login");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [learningLevel, setLearningLevel] = useState(
    localStorage.getItem("learningLevel") || "beginner"
  );

  const studentKey = localStorage.getItem("name") || "guest";
  const progressKey = `progress_${studentKey}`;
  const subjectProgressKey = `subjectProgress_${studentKey}`;
  const savedProgress = JSON.parse(localStorage.getItem(progressKey)) || {
    completedItems: [],
    quizScore: 0,
    practicalScore: 0
  };

  const [completedItems, setCompletedItems] = useState(savedProgress.completedItems);
  const [quizScore, setQuizScore] = useState(savedProgress.quizScore);
  const [practicalScore, setPracticalScore] = useState(savedProgress.practicalScore);
  const [subjectProgress, setSubjectProgress] = useState(
  JSON.parse(localStorage.getItem(subjectProgressKey)) || {}
);

const saveSubjectProgress = (updatedProgress) => {
  setSubjectProgress(updatedProgress);
  localStorage.setItem(subjectProgressKey, JSON.stringify(updatedProgress));
};
  const saveProgress = (newCompletedItems, newQuizScore, newPracticalScore) => {
  localStorage.setItem(
    progressKey,
    JSON.stringify({
      completedItems: newCompletedItems,
      quizScore: newQuizScore,
      practicalScore: newPracticalScore
    })
  );
};
  const [leaderboard, setLeaderboard] = useState([]);
  const [difficultyLevel, setDifficultyLevel] = useState("Medium");

  const totalModules = 8;

  const studentData = {
    completedModules: completedItems.length,
    totalModules,
    progressPercent: Math.round((completedItems.length / totalModules) * 100),
    completedContent: completedItems.map((item) => ({
      title: item,
      type: "Learning Activity",
    })),
    quizScore,
    practicalScore,
    averageScore: Math.round((quizScore + practicalScore) / 2),
    difficultyLevel,
    streak: 7,
    weakTopics: [],
    subjectProgress,
  };

  const goToDashboard = () => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      setActivePage("admin");
    } else {
      setActivePage("dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setActivePage("login");
  };

  const handleEnroll = (subject) => {
    setSelectedSubject(subject);
    setActivePage("learning-content");
  };

  const updateLeaderboard = (name, score) => {
    const newEntry = {
      name: name || localStorage.getItem("name") || "Student",
      score: score || 0,
    };

    setLeaderboard((prev) =>
      [...prev, newEntry].sort((a, b) => b.score - a.score)
    );
  };

  const handleSelectLevel = (level) => {
    setLearningLevel(level);
    localStorage.setItem("learningLevel", level);
  };

  const updateAdaptiveLevel = (score) => {
    if (score >= 80) setDifficultyLevel("Hard");
    else if (score >= 50) setDifficultyLevel("Medium");
    else setDifficultyLevel("Easy");
  };

  return (
    <div className="app-container">
      {activePage === "login" && (
        <Login
          goToRegister={() => setActivePage("register")}
          goToDashboard={goToDashboard}
        />
      )}

      {activePage === "register" && (
        <Register goToLogin={() => setActivePage("login")} />
      )}

      {activePage === "admin" && <AdminDashboard />}

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
          showLevelPopup={false}
          handleSelectLevel={handleSelectLevel}
        />
      )}

      {activePage === "learning-content" && selectedSubject && (
        <NewQuizSystem
      module={selectedSubject}
      onBack={() => setActivePage("dashboard")}

      setQuizScore={(score) => {
        setQuizScore(score);
        saveProgress(completedItems, score, practicalScore);
      }}

      setPracticalScore={(score) => {
        setPracticalScore(score);
        saveProgress(completedItems, quizScore, score);
      }}

      completedItems={completedItems}

      setCompletedItems={(itemsOrFunction) => {
        const newItems =
          typeof itemsOrFunction === "function"
            ? itemsOrFunction(completedItems)
            : itemsOrFunction;

        setCompletedItems(newItems);
        saveProgress(newItems, quizScore, practicalScore);
      }}

      updateAdaptiveLevel={updateAdaptiveLevel}
      updateLeaderboard={updateLeaderboard}
      leaderboard={leaderboard}
      saveSubjectProgress={saveSubjectProgress}
    />
          )}

          {activePage === "certificate-preview" && (
            <CertificatePreview onBack={() => setActivePage("dashboard")} />
          )}
        </div>
      );
    }

export default App;