import React, { useState, useEffect } from "react";
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
  
  const certificateSubjectIdsByLevel = {
    beginner: [1, 2],
    intermediate: [3, 4],
    advanced: [5, 6]
  };

  const [showLevelPopup, setShowLevelPopup] = useState(
    localStorage.getItem("learningLevel") ? false : true
  );

  const [learningLevel, setLearningLevel] = useState(
    localStorage.getItem("learningLevel") || "beginner"
  );

  const [userPlan, setUserPlan] = useState(
  localStorage.getItem("userPlan") || "standard"
);

  const handleUpgradePremium = () => {
    localStorage.setItem("userPlan", "premium");
    setUserPlan("premium");
    alert("Premium plan activated! All modules, quizzes and AI chatbot are now unlocked.");
  };

  const handleSwitchToStandard = () => {
    localStorage.setItem("userPlan", "standard");
    setUserPlan("standard");

    alert(
      "You are now using the Standard Plan. Some modules, quizzes, and AI chatbot features are limited."
    );
  };

  const totalLearningItems = 8;
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

useEffect(() => {
  saveProgress(completedItems, quizScore, practicalScore);
}, [completedItems, quizScore, practicalScore, progressKey]);

const [leaderboard, setLeaderboard] = useState([]);
  const [difficultyLevel, setDifficultyLevel] = useState("Medium");
  const [dashboardTargetTab, setDashboardTargetTab] = useState(null);
  const totalModules = 8;

  const certificateProgress = Math.round(
    (Object.values(certificateProgressMemory).filter(Boolean).length /
      Object.keys(certificateProgressMemory).length) *
      100
  );

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
    certificateProgressMemory,
    certificateProgress,
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
        userPlan={userPlan}
        onPremiumPlan={handleUpgradePremium}
        onStandardPlan={handleSwitchToStandard}        dashboardTargetTab={dashboardTargetTab}
        setDashboardTargetTab={setDashboardTargetTab}      />
)}

{activePage === "learning-content" && selectedSubject && (
  <NewQuizSystem
    module={selectedSubject}
    userPlan={userPlan}
    onBack={() => {
      setDashboardTargetTab("subjects");
      setActivePage("dashboard");
    }}

    setQuizScore={(score) => {
      setQuizScore(score);
    }}

    setPracticalScore={(score) => {
      setPracticalScore(score);
    }}

    completedItems={completedItems}

    setCompletedItems={(itemsOrFunction) => {
      if (typeof itemsOrFunction === "function") {
        setCompletedItems((prev) => itemsOrFunction(prev));
      } else {
        setCompletedItems(itemsOrFunction);
      }
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