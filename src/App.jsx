import React, { useState } from "react";
import "./App.css";

import Dashboard from "./Pages/Dashboard.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import NewQuizSystem from "./components/NewQuizSystem.jsx";
import CertificatePreview from "./components/CertificatePreview.jsx";
import "./ProgressManagement/ProgressManagement.css";
import ProgressPage from "./ProgressManagement/ProgressPage.jsx";
import AchievementPage from "./ProgressManagement/AchievementPage.jsx";
import ForumPage from "./ProgressManagement/ForumPage.jsx";

function App() {
  const [activePage, setActivePage] = useState(
    localStorage.getItem("isLoggedIn") === "true" ? "dashboard" : "login"
  );

 const [selectedSubject, setSelectedSubject] = useState(null);
const [completedItems, setCompletedItems] = useState([]);
const [difficultyLevel, setDifficultyLevel] = useState("Medium");
const [quizScore, setQuizScore] = useState(null);
const [practicalScore, setPracticalScore] = useState(null);
const [leaderboard, setLeaderboard] = useState([
  { name: "Aina", score: 80 },
  { name: "Amar", score: 88 },
  { name: "Kevin", score: 70 }
]);
const [adaptiveMessage, setAdaptiveMessage] = useState("");
  const totalLearningItems = 8;

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
    localStorage.removeItem("isLoggedIn");
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

  const updateLeaderboard = (studentName, score) => {
  const newEntry = {
    name: studentName || "Student",
    score: score
  };

  setLeaderboard((prev) => {
    const updated = [...prev, newEntry].sort(
      (a, b) => b.score - a.score
    );
    return updated;
  });
};

  const studentData = {
    completedModules: completedItems.length,
    totalModules: totalLearningItems,
    progressPercent: selectedSubject
      ? Math.round((completedItems.length / totalLearningItems) * 100)
      : 0,
    quizScore: quizScore || 0,
    practicalScore: practicalScore || 0,
    averageScore: Math.round(((quizScore || 0) + (practicalScore || 0)) / 2),
    difficultyLevel: difficultyLevel,
    adaptiveMessage: adaptiveMessage || "Complete quiz and practical task to get adaptive feedback.",
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
      {activePage === "progress" && (
  <ProgressPage
    studentData={studentData}
    onBack={() => setActivePage("dashboard")}
  />
)}

{activePage === "achievement" && (
  <AchievementPage
    studentData={studentData}
    onBack={() => setActivePage("dashboard")}
  />
)}

{activePage === "forum" && (
  <ForumPage onBack={() => setActivePage("dashboard")} />
)}
    </div>
  );
}

import React, { useState } from "react"; 
import "./App.css"; 
 
import Dashboard from "./Pages/Dashboard.jsx"; 
import Login from "./Pages/Login.jsx"; 
import Register from "./Pages/Register.jsx"; 
import NewQuizSystem from "./components/NewQuizSystem.jsx"; 
import CertificatePreview from "./components/CertificatePreview.jsx"; 
 
function App() { 
  const [activePage, setActivePage] = useState( 
  localStorage.getItem("isLoggedIn") === "true" ? "dashboard" : "login" 
); 
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
 
  const handleLogout = () => { 
  console.log("APP LOGOUT"); 
  localStorage.removeItem("isLoggedIn"); 
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
  handleLogout={handleLogout} 
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