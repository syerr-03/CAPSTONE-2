import { useState } from "react"; 
import SubjectGrid from "../components/SubjectGrid.jsx"; 
import QuizPage from "../components/QuizPage.jsx"; 
import Drawer from "../components/Drawer.jsx"; 
import PerformancePage from "../ProgressManagement/PerformancePage.jsx"; 
import "../App.css"; 

function Dashboard({ handleEnroll, studentData, setActivePage, handleLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ===== SCHEDULE STATES =====
  const [step, setStep] = useState(0);
  const [days, setDays] = useState([]);
  const [time, setTime] = useState([]);
  const [duration, setDuration] = useState([]);

  // ===== GOALS STATES =====
  const [goalStep, setGoalStep] = useState(0);
  const [goalType, setGoalType] = useState("");
  const [target, setTarget] = useState("");
  const [style, setStyle] = useState("");

  const performanceData = studentData || {
    completedModules: 0,
    progressPercent: 0,
    quizScore: 0,
    practicalScore: 0,
    difficultyLevel: "Medium"
  };

  const certificateProgress = performanceData.progressPercent || 0;
  const isCertificateUnlocked = certificateProgress >= 100;

  const handleCertificateClick = () => {
    if (!isCertificateUnlocked) return;
    setActivePage("certificate-preview");
  };

  const toggleDay = (day) => {
    setDays(days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);
  };

  const toggleTime = (t) => {
    setTime(time.includes(t) ? time.filter((x) => x !== t) : [...time, t]);
  };

  const toggleDuration = (d) => {
    setDuration(duration.includes(d) ? duration.filter((x) => x !== d) : [...duration, d]);
  };

  const goToTab = (tab) => {
    setActiveTab(tab);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSchedule = () => {
    setGoalStep(0);
    setStep(1);
    setDrawerOpen(false);
  };

  const openGoals = () => {
    setStep(0);
    setGoalStep(1);
    setDrawerOpen(false);
  };

  const enrollSubject = (subject) => {
    if (handleEnroll) {
      handleEnroll(subject);
    } else {
      console.log("No handleEnroll function received:", subject);
    }
  };

  const streakDays = [
    { day: "Mon", active: true },
    { day: "Tue", active: true },
    { day: "Wed", active: true },
    { day: "Thu", active: true },
    { day: "Fri", active: true },
    { day: "Sat", active: false },
    { day: "Sun", active: false }
  ];

  return (
    <div className="dashboard-page">
      <div className={`dashboard-layout-single ${drawerOpen ? "drawer-open" : ""}`}>
        {/* DRAWER */}
        {drawerOpen && (
          <Drawer
            drawerOpen={drawerOpen}
            closeDrawer={() => setDrawerOpen(false)}
            openSchedule={openSchedule}
            openGoals={openGoals}
          />
        )}

        {/* MAIN CONTENT */}
        <main className="dashboard-main-single">
          {/* MENU BAR */}
          <header className="simple-menu-bar">
            <button
              className="simple-menu-icon"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              ☰
            </button>

            <h1 className="simple-menu-logo">BrainyBits</h1>
            <button
              className="simple-menu-tab"
              onClick={handleLogout}
              style={{ marginLeft: "auto", position: "relative", zIndex: 9999 }}
            >
              Logout
            </button>

            <nav className="simple-menu-tabs">
              <button
                className={`simple-menu-tab ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => goToTab("dashboard")}
              >
                Dashboard
              </button>

              <button
                className={`simple-menu-tab ${activeTab === "subjects" ? "active" : ""}`}
                onClick={() => goToTab("subjects")}
              >
                Subjects
              </button>

              <button
                className={`simple-menu-tab ${activeTab === "quiz" ? "active" : ""}`}
                onClick={() => goToTab("quiz")}
              >
                Quiz
              </button>

              <button
                className={`simple-menu-tab ${activeTab === "performance" ? "active" : ""}`}
                onClick={() => goToTab("performance")}
              >
                Performance
              </button>
            </nav>
          </header>

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <>
              {/* WELCOME + ACTIONS */}
              <section className="dashboard-compact-top">
                <div className="compact-welcome-card">
                  <span className="compact-welcome-pill">Welcome</span>

                  <h2>Welcome!</h2>

                  <p>Keep going. Small progress still counts.</p>
                </div>
              </section>

              {/* STREAK */}
              <section className="compact-streak-card">
                <div className="compact-streak-info">
                  <div className="main-fire-circle">
                   <span className="streak-fire-emoji">🔥</span>
                  </div>

                  <div className="streak-info-text">
                    <h3>Learning Streak</h3>

                    <div className="compact-streak-number">
                      <strong>7</strong>
                      <span>Day Streak</span>
                    </div>

                    <p>Amazing! You’re on fire. Keep it up!</p>
                  </div>
                </div>

                <div className="compact-streak-divider"></div>

                <div className="compact-streak-days">
                  {streakDays.map((item) => (
                    <div className="compact-streak-day" key={item.day}>
                      <span>{item.day}</span>

                      <div className={item.active ? "compact-fire active" : "compact-fire"}>
                        <span className="streak-fire-emoji small">🔥</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CERTIFICATE SECTION */}
              <section className="certificate-dashboard-card">
                <div className="certificate-visual">
                  <div className="certificate-paper">
                    <div className="paper-line short"></div>
                    <div className="paper-line"></div>
                    <div className="paper-line"></div>
                    <div className="paper-medal">🏅</div>
                  </div>

                  <div className={`certificate-lock ${isCertificateUnlocked ? "unlocked" : ""}`}>
                    {isCertificateUnlocked ? "✓" : "🔒"}
                  </div>
                </div>

                <div className="certificate-info">
                  <div className="certificate-title-row">
                    <h2>E-Certificate</h2>

                    <span className={`certificate-status ${isCertificateUnlocked ? "unlocked" : ""}`}>
                      {isCertificateUnlocked ? "Unlocked" : "Locked"}
                    </span>
                  </div>

                  <p>
                    Complete the requirements below to unlock your professional certificate.
                  </p>

                  <ul className="certificate-requirements">
                    <li className={certificateProgress >= 100 ? "done" : ""}>
                      <span>{certificateProgress >= 100 ? "✓" : ""}</span>
                      Complete all modules
                    </li>

                    <li className={certificateProgress >= 100 ? "done" : ""}>
                      <span>{certificateProgress >= 100 ? "✓" : ""}</span>
                      Complete quiz and practical
                    </li>

                    <li className={certificateProgress >= 100 ? "done" : ""}>
                      <span>{certificateProgress >= 100 ? "✓" : ""}</span>
                      Reach 100% progress
                    </li>
                  </ul>
                </div>

                <div className="certificate-progress-area">
                  <p>
                    Current progress: <strong>{certificateProgress}%</strong>
                  </p>

                  <div className="certificate-progress-bar">
                    <div
                      className="certificate-progress-fill"
                      style={{ width: `${certificateProgress}%` }}
                    ></div>
                  </div>

                  <button
                    className={`certificate-claim-btn ${isCertificateUnlocked ? "active" : ""}`}
                    disabled={!isCertificateUnlocked}
                    onClick={handleCertificateClick}
                  >
                    {isCertificateUnlocked
                      ? "Purchase Certificate - RM40"
                      : "🔒 Claim Certificate"}
                  </button>

                  <small>
                    {isCertificateUnlocked
                      ? "You can now purchase and download your certificate."
                      : "Complete all requirements to claim your certificate."}
                  </small>
                </div>
              </section>

              {/* MY COURSES */}
              <section className="dashboard-content-section">
                <h2 className="section-title">My Courses</h2>
                <SubjectGrid onEnroll={enrollSubject} />
              </section>
            </>
          )}

          {/* SUBJECTS TAB */}
          {activeTab === "subjects" && (
            <section className="dashboard-content-section">
              <h2 className="section-title">Available Subjects</h2>
              <SubjectGrid onEnroll={enrollSubject} />
            </section>
          )}

          {/* QUIZ TAB */}
          {activeTab === "quiz" && (
            <section className="dashboard-content-section">
              <QuizPage />
            </section>
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === "performance" && (
            <section className="dashboard-content-section">
              <PerformancePage studentData={performanceData} />
            </section>
          )}
        </main>
      </div>

      {/* SCHEDULE POPUP */}
      {step !== 0 && (
        <div style={overlay}>
          <div className="module-card popup-card">
            {step === 1 && (
              <>
                <h3 className="section-title">Learning Days</h3>

                <div style={optionWrap}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      style={option(days.includes(day))}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div style={navRow}>
                  <span style={back} onClick={() => setStep(0)}>←</span>

                  <button
                    className="hero-button"
                    style={{ padding: "10px 25px" }}
                    onClick={() => setStep(2)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="section-title">Learning Time</h3>

                <div style={optionWrap}>
                  {["Morning", "Afternoon", "Evening", "Night"].map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTime(t)}
                      style={option(time.includes(t))}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div style={navRow}>
                  <span style={back} onClick={() => setStep(1)}>←</span>

                  <button
                    className="hero-button"
                    style={{ padding: "10px 25px" }}
                    onClick={() => setStep(3)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="section-title">Study Duration</h3>

                <div style={optionWrap}>
                  {["15 min", "30 min", "45 min", "1 hour"].map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDuration(d)}
                      style={option(duration.includes(d))}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div style={navRow}>
                  <span style={back} onClick={() => setStep(2)}>←</span>

                  <button
                    className="hero-button"
                    style={{ padding: "10px 25px" }}
                    onClick={() => setStep(4)}
                  >
                    Save
                  </button>
                </div>
              </>
            )}

            {step === 4 && (
              <div style={{ textAlign: "center" }}>
                <h3 className="section-title">Saved. ✅</h3>

                <button
                  className="hero-button"
                  style={{ marginTop: "15px" }}
                  onClick={() => setStep(0)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GOALS POPUP */}
      {goalStep !== 0 && (
        <div style={overlay}>
          <div className="module-card popup-card">
            {goalStep === 1 && (
              <>
                <h3 className="section-title">Goal Type</h3>

                <div style={optionWrap}>
                  {["Skill 🧠", "Exam 📚", "Coding 💻", "Language 🌍", "Consistency 🔥"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoalType(g)}
                      style={option(goalType === g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <div style={navRow}>
                  <span style={back} onClick={() => setGoalStep(0)}>←</span>

                  <button
                    className="hero-button"
                    style={{ padding: "10px 25px" }}
                    disabled={!goalType}
                    onClick={() => setGoalStep(2)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {goalStep === 2 && (
              <>
                <h3 className="section-title">Target Progress</h3>

                <div style={optionWrap}>
                  {["1 topic/week", "5 lessons", "Improve level", "Maintain"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTarget(t)}
                      style={option(target === t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div style={navRow}>
                  <span style={back} onClick={() => setGoalStep(1)}>←</span>

                  <button
                    className="hero-button"
                    style={{ padding: "10px 25px" }}
                    disabled={!target}
                    onClick={() => setGoalStep(3)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {goalStep === 3 && (
              <>
                <h3 className="section-title">Study Style</h3>

                <div style={optionWrap}>
                  {["Casual 😌", "Serious ⚡", "Intensive 🚀"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      style={option(style === s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div style={navRow}>
                  <span style={back} onClick={() => setGoalStep(2)}>←</span>

                  <button
                    className="hero-button"
                    style={{ padding: "10px 25px" }}
                    onClick={() => setGoalStep(4)}
                  >
                    Save
                  </button>
                </div>
              </>
            )}

            {goalStep === 4 && (
              <div style={{ textAlign: "center" }}>
                <h3 className="section-title">Saved. 🎯</h3>

                <button
                  className="hero-button"
                  style={{ marginTop: "15px" }}
                  onClick={() => setGoalStep(0)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== INLINE STYLES =====
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 5000
};

const optionWrap = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "15px",
  marginBottom: "15px"
};

const option = (active) => ({
  padding: "10px 18px",
  borderRadius: "999px",
  border: "none",
  cursor: "pointer",
  backgroundColor: active ? "#7C3AED" : "#EEE8FF",
  color: active ? "white" : "#5b4b8a",
  fontSize: "14px",
  fontWeight: "500",
  transition: "0.2s"
});

const navRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "20px"
};

const back = {
  cursor: "pointer",
  fontSize: "24px",
  color: "#7C3AED",
  fontWeight: "700"
};

export default Dashboard;