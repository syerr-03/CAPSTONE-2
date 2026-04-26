import { useState } from 'react';
import './App.css';

// 1. IMPORT PAGES (Halaman Besar)
import Dashboard from './Pages/Dashboard.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';

// 2. IMPORT MODUL ROSE (Progress Management)
import PerformancePage from './ProgressManagement/PerformancePage.jsx';
import AchievementPage from './ProgressManagement/AchievementPage.jsx';

// 3. IMPORT COMPONENTS (Halaman Kecil/Sub-halaman)
import SubjectGrid from './components/SubjectGrid.jsx';
import QuizPage from './components/QuizPage.jsx';

// DATA DUMMY (Supaya Performance & Achievement tak blank)
const dummyStudentData = {
  completedModules: 3,
  progressPercent: 65,
  quizScore: 85,
  practicalScore: 90,
  difficultyLevel: "Medium"
};

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: '#f3f0ff' }}>
      
      {/* NAVIGATION BAR - Tema Dark Purple/Gaming */}
      <nav className="module-card" style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'center', 
        margin: '15px 20px', 
        padding: '12px', 
        background: '#111827',
        borderRadius: '12px',
        position: 'sticky',
        top: '10px',
        zIndex: 100
      }}>
        <button 
          className={activePage === 'dashboard' ? "tag active-tag" : "tag"} 
          style={{ background: activePage === 'dashboard' ? '#7C3AED' : 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}
          onClick={() => setActivePage('dashboard')}
        >
          🏠 Dashboard
        </button>

        <button 
          className="tag" 
          style={{ background: activePage === 'subjects' ? '#7C3AED' : 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}
          onClick={() => setActivePage('subjects')}
        >
          📚 Subjects
        </button>

        <button 
          className="tag" 
          style={{ background: activePage === 'quiz' ? '#7C3AED' : 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}
          onClick={() => setActivePage('quiz')}
        >
          📝 Quiz
        </button>

        <button 
          className="tag" 
          style={{ background: activePage === 'performance' ? '#7C3AED' : 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}
          onClick={() => setActivePage('performance')}
        >
          📊 Performance
        </button>

        <button 
          className="tag" 
          style={{ color: '#ff4d4d', border: 'none', cursor: 'pointer' }}
          onClick={() => setActivePage('login')}
        >
          🚪 Logout
        </button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main style={{ padding: '0 20px 40px' }}>
        
        {/* Navigasi Logic */}
        {activePage === 'dashboard' && <Dashboard />}
        
        {activePage === 'login' && (
          <Login 
            goToRegister={() => setActivePage('register')} 
            goToDashboard={() => setActivePage('dashboard')} 
          />
        )}
        
        {activePage === 'register' && (
          <Register goToLogin={() => setActivePage('login')} />
        )}
        
        {activePage === 'subjects' && (
          <div className="app">
             <h2 className="main-title" style={{ textAlign: 'center', marginTop: '20px' }}>Available Subjects</h2>
             <SubjectGrid onEnroll={(s) => alert(`Enrolled in ${s.title}`)} />
          </div>
        )}

        {activePage === 'quiz' && <QuizPage />}
        
        {activePage === 'performance' && (
          <PerformancePage studentData={dummyStudentData} />
        )}
        
        {activePage === 'achievement' && (
          <AchievementPage studentData={dummyStudentData} />
        )}

      </main>
    </div>
  );
}

export default App;