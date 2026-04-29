import React, { useState, useMemo } from 'react';
import '../App.css';

// 1. IMPORT PAGES
import Dashboard from './Pages/Dashboard.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';

// 2. IMPORT MODUL PROGRESS
import PerformancePage from './ProgressManagement/PerformancePage.jsx';
import AchievementPage from './ProgressManagement/AchievementPage.jsx';

// 3. IMPORT COMPONENTS
import SubjectGrid from './components/SubjectGrid.jsx';
import QuizPage from './components/QuizPage.jsx';
import NewQuizSystem from './components/NewQuizSystem.jsx';

function App() {
  // STATE UNTUK NAVIGASI
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState(null);

  // STATE UNTUK LOGIK PEMBELAJARAN (DARI APP.JS ASAL)
  const [activeContent, setActiveContent] = useState(null);
  const [completedItems, setCompletedItems] = useState({});
  const [practicalSubmission, setPracticalSubmission] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Medium');
  const [quizScore, setQuizScore] = useState(null);
  const [practicalScore, setPracticalScore] = useState(null);
  const [adaptiveMessage, setAdaptiveMessage] = useState('');

  // 1. FUNGSI ENROLL (Bila tekan subjek)
  const handleEnroll = (subject) => {
    setSelectedSubject(subject);
    setActivePage('learning-content'); // Terus ke sistem belajar
    // Reset state pembelajaran untuk subjek baru
    setActiveContent(null);
    setCompletedItems({});
    setPracticalSubmission('');
    setDifficultyLevel('Medium');
    setQuizScore(null);
    setPracticalScore(null);
    setAdaptiveMessage('');
  };

  // 2. LOGIK ADAPTIVE FEEDBACK
  const getAdaptiveMessage = (level) => {
    if (level === 'Easy') return 'You may need more support. Review the reading and video.';
    if (level === 'Medium') return 'You are making steady progress.';
    return 'Excellent performance. Ready for advanced content.';
  };

  const updateAdaptiveLevel = (newQuizScore, newPracticalScore) => {
    if (newQuizScore === null || newPracticalScore === null) return;
    const finalScore = (newQuizScore * 0.4) + (newPracticalScore * 0.6);

    let newLevel = 'Easy';
    if (finalScore >= 75) newLevel = 'Hard';
    else if (finalScore >= 50) newLevel = 'Medium';

    setDifficultyLevel(newLevel);
    setAdaptiveMessage(getAdaptiveMessage(newLevel));
  };

  // 3. DUMMY STUDENT DATA (Untuk Performance Page)
  const studentData = {
    completedModules: Object.values(completedItems).filter(Boolean).length,
    progressPercent: selectedSubject ? Math.round((Object.values(completedItems).filter(Boolean).length / 12) * 100) : 0,
    quizScore: quizScore || 0,
    practicalScore: practicalScore || 0,
    difficultyLevel: difficultyLevel
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: '#f3f0ff' }}>
      
      {/* NAVIGATION BAR */}
      <nav className="module-card" style={{ 
        display: 'flex', gap: '12px', justifyContent: 'center', 
        margin: '15px 20px', padding: '12px', background: '#111827',
        borderRadius: '12px', position: 'sticky', top: '10px', zIndex: 100 
      }}>
        <button className="tag" style={{ background: activePage === 'dashboard' ? '#7C3AED' : 'transparent', color: 'white', border: 'none', cursor: 'pointer' }} onClick={() => setActivePage('dashboard')}>🏠 Dashboard</button>
        <button className="tag" style={{ background: activePage === 'subjects' || activePage === 'learning-content' ? '#7C3AED' : 'transparent', color: 'white', border: 'none', cursor: 'pointer' }} onClick={() => setActivePage('subjects')}>📚 Subjects</button>
        <button className="tag" style={{ background: activePage === 'quiz' ? '#7C3AED' : 'transparent', color: 'white', border: 'none', cursor: 'pointer' }} onClick={() => setActivePage('quiz')}>📝 Quiz</button>
        <button className="tag" style={{ background: activePage === 'performance' ? '#7C3AED' : 'transparent', color: 'white', border: 'none', cursor: 'pointer' }} onClick={() => setActivePage('performance')}>📊 Performance</button>
        <button className="tag" style={{ color: '#ff4d4d', border: 'none', cursor: 'pointer' }} onClick={() => setActivePage('login')}>🚪 Logout</button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main style={{ padding: '0 20px 40px' }}>
        
        {activePage === 'dashboard' && <Dashboard />}
        
        {activePage === 'login' && <Login goToRegister={() => setActivePage('register')} goToDashboard={() => setActivePage('dashboard')} />}
        
        {activePage === 'register' && <Register goToLogin={() => setActivePage('login')} />}
        
        {activePage === 'subjects' && (
          <div className="app">
             <h2 className="main-title" style={{ textAlign: 'center', marginTop: '20px' }}>Available Subjects</h2>
             <SubjectGrid onEnroll={handleEnroll} />
          </div>
        )}

        {/* SISTEM PEMBELAJARAN BARU (NEW QUIZ SYSTEM) */}
        {activePage === 'learning-content' && selectedSubject && (
          <NewQuizSystem 
            module={selectedSubject} 
            onBack={() => setActivePage('subjects')}
            // Props tambahan untuk sokong logik adaptive
            setQuizScore={setQuizScore}
            setPracticalScore={setPracticalScore}
            completedItems={completedItems}
            setCompletedItems={setCompletedItems}
            difficultyLevel={difficultyLevel}
            updateAdaptiveLevel={updateAdaptiveLevel}
          />
        )}

        {activePage === 'quiz' && <QuizPage />}
        
        {activePage === 'performance' && <PerformancePage studentData={studentData} />}
        
      </main>
    </div>
  );
}

export default App;