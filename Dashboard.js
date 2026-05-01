import { useState } from "react";
import SubjectGrid from "../components/SubjectGrid.jsx";
import "../App.css";

function Dashboard({ activePage = "dashboard", setActivePage, showOnlyMenu = false }) {
  // ===== STATES =====
  const [step, setStep] = useState(0);
  const [days, setDays] = useState([]);
  const [time, setTime] = useState([]);
  const [duration, setDuration] = useState([]);

  const [goalStep, setGoalStep] = useState(0);
  const [goalType, setGoalType] = useState("");
  const [target, setTarget] = useState("");
  const [style, setStyle] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);

  // ===== FUNCTIONS =====
  const toggleDay = (day) => {
    setDays(days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);
  };

  const toggleTime = (t) => {
    setTime(time.includes(t) ? time.filter((x) => x !== t) : [...time, t]);
  };

  const toggleDuration = (d) => {
    setDuration(duration.includes(d) ? duration.filter((x) => x !== d) : [...duration, d]);
  };

  const goToPage = (page) => {
    if (setActivePage) {
      setActivePage(page);
    }
    setDrawerOpen(false);
  };

  return (
    <div className={`dashboard-page ${showOnlyMenu ? "menu-only-page" : ""}`}>
      <div className={`dashboard-layout ${drawerOpen ? "drawer-open" : ""}`}>

        {/* LEFT DRAWER */}
        <aside className="side-drawer-panel">
          <div className="drawer-brand-area">
            <div>
              <h2>BrainyBits</h2>
              <p>Learning Companion</p>
            </div>

            <button
              className="drawer-close-btn"
              onClick={() => setDrawerOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="drawer-user-card">
            <div className="drawer-user-icon">👤</div>
            <div>
              <h3>Hello, Learner!</h3>
              <p>learner@example.com</p>
            </div>
          </div>

          <button className="drawer-link active">
            <span>Edit Profile</span>
            <span>›</span>
          </button>

          <button
            className="drawer-link"
            onClick={() => {
              setDrawerOpen(false);
              setGoalStep(0);
              setStep(1);
            }}
          >
            <span>Schedule</span>
            <span>›</span>
          </button>

          <button
            className="drawer-link"
            onClick={() => {
              setDrawerOpen(false);
              setStep(0);
              setGoalStep(1);
            }}
          >
            <span>Learning Goals</span>
            <span>›</span>
          </button>

          <button className="drawer-link">
            <span>Settings</span>
            <span>›</span>
          </button>

          <div className="drawer-divider"></div>

          <button className="drawer-link logout">
            <span>Logout</span>
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dashboard-content">

          {/* MENU BAR */}
          <header className="clean-topbar">
            <button
              className="menu-toggle-btn"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              ☰
            </button>

            <h1 className="topbar-logo">BrainyBits</h1>

            <nav className="topbar-nav">
              <button
                className={`topbar-tab ${activePage === "dashboard" ? "active" : ""}`}
                onClick={() => goToPage("dashboard")}
              >
                Dashboard
              </button>

              <button
                className={`topbar-tab ${activePage === "subjects" ? "active" : ""}`}
                onClick={() => goToPage("subjects")}
              >
                Subjects
              </button>

              <button
                className={`topbar-tab ${activePage === "quiz" ? "active" : ""}`}
                onClick={() => goToPage("quiz")}
              >
                Quiz
              </button>

              <button
                className={`topbar-tab ${activePage === "performance" ? "active" : ""}`}
                onClick={() => goToPage("performance")}
              >
                Performance
              </button>
            </nav>
          </header>

          {!showOnlyMenu && (
            <>
              {/* HERO SECTION */}
              <section className="simple-hero">
                <div className="hero-text-block">
                  <span className="welcome-tag">Welcome back</span>

                  <h2>
                    Let’s keep building <br />
                    your <span>React</span> mastery.
                  </h2>

                  <p>
                    Continue your learning journey with a clear schedule and focused goals.
                  </p>
                </div>

                <div className="hero-action-block">
                  <button
                    className="quick-action primary"
                    onClick={() => {
                      setGoalStep(0);
                      setStep(1);
                    }}
                  >
                    <div>
                      <h3>Set Schedule</h3>
                      <p>Plan your study time and stay consistent.</p>
                    </div>
                    <span>›</span>
                  </button>

                  <button
                    className="quick-action"
                    onClick={() => {
                      setStep(0);
                      setGoalStep(1);
                    }}
                  >
                    <div>
                      <h3>Set Learning Goals</h3>
                      <p>Define your learning path and track progress.</p>
                    </div>
                    <span>›</span>
                  </button>
                </div>
              </section>

              {/* SUBJECT GRID SECTION */}
              <section className="dashboard-course-area">
                <h2 className="section-title">My Courses</h2>
                <SubjectGrid />
              </section>
            </>
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