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
  const [currentUser, setCurrentUser] = useState(() => {
    return (
      localStorage.getItem("loggedInUser") ||
      localStorage.getItem("username") ||
      localStorage.getItem("name") ||
      null
    );
  });

  const studentKey =
  localStorage.getItem("loggedInUser") ||
  localStorage.getItem("username") ||
  localStorage.getItem("name") ||
  "guest";
  const progressKey = `progress_${studentKey}`;
  const subjectProgressKey = `subjectProgress_${studentKey}`;
  const completedSubjectMemoryKey = `certificateSubjectCompletion_${studentKey}`;
  const certificateProgressMemoryKey = `certificateProgressMemory_${studentKey}`;
  const learningLevelKey = `learningLevel_${studentKey}`;
  const userPlanKey = `userPlan_${studentKey}`;

  const [certificateProgressMemory, setCertificateProgressMemory] = useState({
    beginner: false,
    intermediate: false,
    advanced: false
  });
  const [completedSubjectMemory, setCompletedSubjectMemory] = useState({});
  const [showLevelPopup, setShowLevelPopup] = useState(true);
  const [learningLevel, setLearningLevel] = useState("beginner");
  const [userPlan, setUserPlan] = useState("standard");
  const [completedItems, setCompletedItems] = useState([]);
  const [quizScore, setQuizScore] = useState(0);
  const [practicalScore, setPracticalScore] = useState(0);
  const [subjectProgress, setSubjectProgress] = useState({});

  const certificateSubjectIdsByLevel = {
    beginner: [1, 2],
    intermediate: [3, 4],
    advanced: [5, 6]
  };

  const handleOpenPremiumUpgrade = () => {
    setDashboardTargetTab("subscriptions");
    setActivePage("dashboard");
  };

  const handleSwitchToStandard = () => {
    localStorage.setItem(userPlanKey, "standard");
    setUserPlan("standard");
    
    alert(
      "You are now using the Standard Plan. Some modules, quizzes and AI chatbot features are limited."
    );
  };

  const handlePremiumPaymentSuccess = () => {
    // Called from Dashboard after successful premium payment
    localStorage.setItem(userPlanKey, "premium");
    localStorage.setItem("userSubscriptionPlan", "premium");
    setUserPlan("premium");
    alert("Premium plan activated! All modules, quizzes and AI chatbot are now unlocked.");
  };

  const totalLearningItems = 8;

  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem(progressKey)) || {
      completedItems: [],
      quizScore: 0,
      practicalScore: 0
    };

    setCompletedItems(savedProgress.completedItems || []);
    setQuizScore(savedProgress.quizScore || 0);
    setPracticalScore(savedProgress.practicalScore || 0);

    const savedSubjectProgress = JSON.parse(localStorage.getItem(subjectProgressKey)) || {};
    setSubjectProgress(savedSubjectProgress);

    const savedCompletedSubjectMemory =
      JSON.parse(localStorage.getItem(completedSubjectMemoryKey)) || {};
    setCompletedSubjectMemory(savedCompletedSubjectMemory);

    const savedCertificateProgressMemory =
      JSON.parse(localStorage.getItem(certificateProgressMemoryKey)) || {
        beginner: false,
        intermediate: false,
        advanced: false
      };

    setCertificateProgressMemory({
      beginner: Boolean(savedCertificateProgressMemory.beginner),
      intermediate: Boolean(savedCertificateProgressMemory.intermediate),
      advanced: Boolean(savedCertificateProgressMemory.advanced)
    });

    const savedLevel = localStorage.getItem(learningLevelKey);
    if (savedLevel) {
      setLearningLevel(savedLevel);
      setShowLevelPopup(false);
    } else {
      setLearningLevel("beginner");
      setShowLevelPopup(true);
    }

    const savedPlan = localStorage.getItem(userPlanKey) || "standard";
    setUserPlan(savedPlan);
  }, [studentKey]);

  const getSubjectKey = (subject) => {
    if (!subject) return null;

    const normalizedLevel = subject.level
      ? String(subject.level).toLowerCase()
      : localStorage.getItem(learningLevelKey) || "beginner";

    return subject.id != null ? `${subject.id}_${normalizedLevel}` : null;
  };

  const updateCertificateProgressMemory = (newMemory) => {
    const normalizedMemory = {
      beginner: Boolean(newMemory["1_beginner"] && newMemory["2_beginner"]),
      intermediate: Boolean(newMemory["3_intermediate"] && newMemory["4_intermediate"]),
      advanced: Boolean(newMemory["5_advanced"] && newMemory["6_advanced"])
    };

    localStorage.setItem(
      certificateProgressMemoryKey,
      JSON.stringify(normalizedMemory)
    );
    setCertificateProgressMemory(normalizedMemory);
  };

  const getUpdatedCertificateMemory = (subjectCompletion) => {
    const nextMemory = {
      beginner:
        Boolean(subjectCompletion["1_beginner"]) &&
        Boolean(subjectCompletion["2_beginner"]),
      intermediate:
        Boolean(subjectCompletion["3_intermediate"]) &&
        Boolean(subjectCompletion["4_intermediate"]),
      advanced:
        Boolean(subjectCompletion["5_advanced"]) &&
        Boolean(subjectCompletion["6_advanced"])
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
  }, [completedSubjectMemory, certificateProgressMemory]);

  const handleSelectLevel = (level) => {
    setLearningLevel(level);
    localStorage.setItem(learningLevelKey, level);
    setShowLevelPopup(false);
  };

const saveSubjectProgress = (subjectKey, progressData) => {
  if (!subjectKey || typeof progressData !== "object") return;

  const existingProgress = subjectProgress[subjectKey] || {};
  const updatedEntry = {
    ...existingProgress,
    ...progressData
  };

  const updatedProgress = {
    ...subjectProgress,
    [subjectKey]: updatedEntry
  };

  localStorage.setItem(subjectProgressKey, JSON.stringify(updatedProgress));
  setSubjectProgress(updatedProgress);

  if (updatedEntry.completed && !completedSubjectMemory[subjectKey]) {
    const updatedSubjectMemory = {
      ...completedSubjectMemory,
      [subjectKey]: true
    };

    localStorage.setItem(
      completedSubjectMemoryKey,
      JSON.stringify(updatedSubjectMemory)
    );
    setCompletedSubjectMemory(updatedSubjectMemory);

    const newCertificateMemory = getUpdatedCertificateMemory(updatedSubjectMemory);
    updateCertificateProgressMemory(newCertificateMemory);
  }
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

  const totalModules = Object.values(certificateSubjectIdsByLevel).flat().length;
  const completedModulesCount = Object.values(completedSubjectMemory).filter(Boolean).length;

  const certificateProgress = Math.round(
    (Object.values(certificateProgressMemory).filter(Boolean).length /
      Object.keys(certificateProgressMemory).length) *
      100
  );

  const studentData = {
    completedModules: completedModulesCount,
    totalModules,
    progressPercent: Math.round((completedModulesCount / totalModules) * 100),
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
    localStorage.removeItem("username");
    localStorage.removeItem("loggedInUser");
    setCurrentUser(null);
    setActivePage("login");
  };

 const handleEnroll = (subject) => {

  localStorage.setItem(
    "currentModule",
    subject.title
  );

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
          setCurrentUser={setCurrentUser}
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
        onPremiumPlan={handleOpenPremiumUpgrade}
        onStandardPlan={handleSwitchToStandard}
        onPremiumPaymentSuccess={handlePremiumPaymentSuccess}
        dashboardTargetTab={dashboardTargetTab}
        setDashboardTargetTab={setDashboardTargetTab}
      />
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