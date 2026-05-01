import React, { useState } from "react";
import "./App.css";

import Dashboard from "./Pages/Dashboard.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import NewQuizSystem from "./components/NewQuizSystem.jsx";
import CertificatePreview from "./components/CertificatePreview.jsx";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [completedItems, setCompletedItems] = useState([]);
  const [difficultyLevel, setDifficultyLevel] = useState("Medium");
  const [quizScore, setQuizScore] = useState(null);
  const [practicalScore, setPracticalScore] = useState(null);
  const [adaptiveMessage, setAdaptiveMessage] = useState("");

  const handleEnroll = (subject) => {
    setSelectedSubject(subject);
    setActivePage("learning-content");

    setCompletedItems([]);
    setDifficultyLevel("Medium");
    setQuizScore(null);
    setPracticalScore(null);
    setAdaptiveMessage("");
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

  const totalLearningItems = 8;

  const studentData = {
    completedModules: completedItems.length,
    progressPercent: selectedSubject
      ? Math.round((completedItems.length / totalLearningItems) * 100)
      : 0,
    quizScore: quizScore || 0,
    practicalScore: practicalScore || 0,
    difficultyLevel: difficultyLevel,
    adaptiveMessage: adaptiveMessage
  };

  return (
    <div className="app-container">
      {activePage === "dashboard" && (
        <Dashboard
          handleEnroll={handleEnroll}
          studentData={studentData}
          setActivePage={setActivePage}
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
        />
      )}

      {activePage === "certificate-preview" && (
        <CertificatePreview onBack={() => setActivePage("dashboard")} />
      )}
    </div>
  );
}

export default App;