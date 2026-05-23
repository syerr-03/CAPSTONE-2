import React, { useEffect, useState } from "react";
import SubjectGrid from "../components/SubjectGrid.jsx";
import QuizPage from "../components/QuizPage.jsx";
import Drawer from "../components/Drawer.jsx";
import PerformancePage from "../ProgressManagement/PerformancePage.jsx";
import ProgressPage from "../ProgressManagement/ProgressPage.jsx";
import AchievementPage from "../ProgressManagement/AchievementPage.jsx";
import ForumPage from "../ProgressManagement/ForumPage.jsx";
import LeaderboardPage from "../ProgressManagement/LeaderboardPage.jsx";
import AiChat from "../components/aiChat.jsx";
import Notes from "../components/Notes.jsx";
import QuickHelpModal from "../components/QuickHelpModal";

import "../App.css";

import {Copy, Mail, MessageCircle, X} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function Dashboard({
  handleEnroll,
  studentData,
  leaderboard,
  updateLeaderboard,
  setQuizScore,
  setActivePage,
  handleLogout,
  learningLevel,
  showLevelPopup,
  handleSelectLevel
}) {

  const [subjectsForLevel, setSubjectsForLevel] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("bbSubjectsByLevel");
    if (!raw) {
      setSubjectsForLevel([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw) || {};
      const level = (learningLevel || "beginner").toLowerCase();

      const adminBeginner = parsed.beginner || [];
const adminIntermediate = parsed.intermediate || [];
const adminAdvanced = parsed.advanced || [];

const defaultSubjects = [
  {
    id: 1,
    title: "What is Data Science?",
    description: "Start with the basic meaning, purpose, and use of data science.",
    icon: "📊",
    level: "beginner"
  },
  {
    id: 2,
    title: "Python for Data Science",
    description: "Learn basic Python syntax, variables, and simple coding skills.",
    icon: "🐍",
    level: "beginner"
  },
  {
    id: 3,
    title: "Statistics Fundamentals",
    description: "Improve your understanding of probability, mean, and data analysis.",
    icon: "📈",
    level: "intermediate"
  },
  {
    id: 4,
    title: "Exploratory Data Analysis",
    description: "Learn how to inspect, clean, and understand datasets.",
    icon: "🔍",
    level: "intermediate"
  },
  {
    id: 5,
    title: "Machine Learning Basics",
    description: "Understand model training, prediction, and evaluation.",
    icon: "🤖",
    level: "advanced"
  },
  {
    id: 6,
    title: "Data Visualization",
    description: "Learn advanced ways to present insights using charts and dashboards.",
    icon: "🎨",
    level: "advanced"
  }
];

const defaultBeginner = defaultSubjects.filter((s) => s.level === "beginner");
const defaultIntermediate = defaultSubjects.filter((s) => s.level === "intermediate");
const defaultAdvanced = defaultSubjects.filter((s) => s.level === "advanced");

const allowed = {
  beginner: [...defaultBeginner, ...adminBeginner],
  intermediate: [
    ...defaultBeginner,
    ...defaultIntermediate,
    ...adminBeginner,
    ...adminIntermediate
  ],
  advanced: [
    ...defaultBeginner,
    ...defaultIntermediate,
    ...defaultAdvanced,
    ...adminBeginner,
    ...adminIntermediate,
    ...adminAdvanced
  ]
};

setSubjectsForLevel(allowed[level] || allowed.beginner);
    } catch (e) {
      setSubjectsForLevel([]);
    }
  }, [learningLevel]);

  const [weeklyLoginDays, setWeeklyLoginDays] = useState({});
  useEffect(() => {
    const fetchStreak = async () => {
      if (!auth.currentUser) return;

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setWeeklyLoginDays(userSnap.data().weeklyLoginDays || {});
      }
    };

    fetchStreak();
  }, []);


  const studentName = localStorage.getItem("name") || "Student";
  const welcomeType = localStorage.getItem("welcomeType");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [levelMessage, setLevelMessage] = useState("");

  const [showHelp, setShowHelp] = useState(false);

  // ===== SCHEDULE STATES =====
const [step, setStep] = useState(0);
const [days, setDays] = useState([]);
const [time, setTime] = useState([]);
const [duration, setDuration] = useState([]);

const [scheduleReminder, setScheduleReminder] = useState(
  localStorage.getItem("scheduleReminder") || ""
);

const currentUser = localStorage.getItem("loggedInUser");
const scheduleKey = `schedule_${currentUser}`;

const getCurrentTimeSlot = () => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const currentTime = hour + minute / 60;

  if (currentTime >= 8 && currentTime < 12) {
    return "Morning";
  } else if (currentTime >= 12 && currentTime <= 14) {
    return "Afternoon";
  } else if (currentTime > 14 && currentTime <= 19) {
    return "Evening";
  } else if (currentTime > 19 && currentTime <= 24) {
    return "Night";
  }

  return "";
};
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
    setDuration(
      duration.includes(d) ? duration.filter((x) => x !== d) : [...duration, d]
    );
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

 const handleSaveSchedule = () => {
  const reminderText = "Reminder: Complete one module today.";
  const currentUser = localStorage.getItem("loggedInUser");

  localStorage.setItem(`scheduleReminder_${currentUser}`, reminderText);

  localStorage.setItem(
    `studentSchedule_${currentUser}`,
    JSON.stringify({ days, time, duration })
  );

  setScheduleReminder(reminderText);
  setStep(4);
};

// ===== CHECK REMINDER BASED ON USER + TIME =====
const checkScheduleReminder = () => {
  const currentUser = localStorage.getItem("loggedInUser");

  const savedSchedule = JSON.parse(
    localStorage.getItem(`studentSchedule_${currentUser}`)
  );

  if (!savedSchedule) return;

  const currentSlot = getCurrentTimeSlot();

  if (savedSchedule.time.includes(currentSlot)) {
    alert("Reminder: It's your scheduled study time today!");
  }
};

useEffect(() => {
  checkScheduleReminder();
}, []);

  const enrollSubject = (subject) => {
    if (handleEnroll) {
      handleEnroll(subject);
    } else {
      console.log("No handleEnroll function received:", subject);
    }
  };

  
  const saveSelectedLevel = (level) => {
    localStorage.setItem("learningLevel", level);

    if (typeof handleSelectLevel === "function") {
      handleSelectLevel(level);
    }

    setLevelMessage(`Level has been set to ${level}.`);

    setTimeout(() => {
      setLevelMessage("");
      goToTab("dashboard");
    }, 2000);
  };
  const todayName = new Date().toLocaleDateString("en-US", {
  weekday: "short"
  });

  const todayKey = new Date().toISOString().split("T")[0];

  const completedToday =
    localStorage.getItem(`completedToday_${todayKey}`) === "true";

  const shouldShowScheduleReminder =
    scheduleReminder &&
    days.includes(todayName) &&
    !completedToday;

  const streakDays = [
    { day: "Mon", key: "monday" },
    { day: "Tue", key: "tuesday" },
    { day: "Wed", key: "wednesday" },
    { day: "Thu", key: "thursday" },
    { day: "Fri", key: "friday" },
    { day: "Sat", key: "saturday" },
    { day: "Sun", key: "sunday" }
  ];

  const allCourses = [
    {
      id: 1,
      title: "What is Data Science?",
      description: "Start with the basic meaning, purpose, and use of data science.",
      icon: "📊",
      level: "Beginner",
      topic: "Data Science Basics"
    },
    {
      id: 2,
      title: "Python for Data Science",
      description: "Learn basic Python syntax, variables, and simple coding skills.",
      icon: "🐍",
      level: "Beginner",
      topic: "Python Basics"
    },
    {
      id: 3,
      title: "Statistics Fundamentals",
      description: "Improve your understanding of probability, mean, and data analysis.",
      icon: "📈",
      level: "Intermediate",
      topic: "Statistics"
    },
    {
      id: 4,
      title: "Exploratory Data Analysis",
      description: "Learn how to inspect, clean, and understand datasets.",
      icon: "🔍",
      level: "Intermediate",
      topic: "EDA"
    },
    {
      id: 5,
      title: "Machine Learning Basics",
      description: "Understand model training, prediction, and evaluation.",
      icon: "🤖",
      level: "Advanced",
      topic: "Machine Learning"
    },
    {
      id: 6,
      title: "Data Visualization",
      description: "Learn advanced ways to present insights using charts and dashboards.",
      icon: "🎨",
      level: "Advanced",
      topic: "Data Visualization"
    }
  ];

  const weakTopics = performanceData.weakTopics || [];

  const recommendedCourses =
    weakTopics.length > 0
      ? allCourses.filter((course) => weakTopics.includes(course.topic))
      : allCourses.filter(
          (course) =>
            course.level.toLowerCase() === learningLevel.toLowerCase()
        );

  return (
    <div className="dashboard-page">
      <div className={`dashboard-layout-single ${drawerOpen ? "drawer-open" : ""}`}>
        {/* DRAWER */}
        {drawerOpen && (
         <Drawer
          drawerOpen={drawerOpen}
          closeDrawer={() => setDrawerOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openSchedule={openSchedule}
          openGoals={openGoals}
          openProgress={() => goToTab("progress")}
          openAchievement={() => goToTab("achievement")}
          openForum={() => goToTab("forum")}
          openSettings={() => goToTab("settings")}
          openFeedback={() => goToTab("feedback")}
          handleLogout={handleLogout}
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexShrink: 0
              }}
            >
              <img
                src="/logo.jpg"
                alt="BrainyBits Logo"
                style={{
                  width: "42px",
                  height: "42px",
                  objectFit: "cover",
                  borderRadius: "20px"
                }}
              />

              <h1
                className="simple-menu-logo"
                style={{
                  margin: 0,
                  marginLeft: "-30px"
                }}
              >
                BrainyBits
              </h1>
            </div>

            <nav
              className="simple-menu-tabs"
              style={{
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                display: "flex",
                flexWrap: "nowrap",
                scrollbarWidth: "none",
                padding: "8px 12px",
                paddingLeft: "50px"
              }}
            >
              <button
                className={`simple-menu-tab ${
                  activeTab === "dashboard" ? "active" : ""
                }`}
                style={{ flexShrink: 0 }}
                onClick={() => goToTab("dashboard")}
              >
                Dashboard
              </button>

              <button
                className={`simple-menu-tab ${
                  activeTab === "subjects" ? "active" : ""
                }`}
                style={{ flexShrink: 0 }}
                onClick={() => goToTab("subjects")}
              >
                Subjects
              </button>

              <button
                className={`simple-menu-tab ${
                  activeTab === "content" ? "active" : ""
                }`}
                style={{ flexShrink: 0 }}
                onClick={() => goToTab("content")}
              >
                Content
              </button>

              <button
                className={`simple-menu-tab ${
                  activeTab === "quiz" ? "active" : ""
                }`}
                style={{ flexShrink: 0 }}
                onClick={() => goToTab("quiz")}
              >
                Quiz
              </button>

              <button
                className={`simple-menu-tab ${
                  activeTab === "performance" ? "active" : ""
                }`}
                style={{ flexShrink: 0 }}
                onClick={() => goToTab("performance")}
              >
                Performance
              </button>

              <button
                className={`simple-menu-tab ${
                  activeTab === "notes" ? "active" : ""
                }`}
                style={{ flexShrink: 0 }}
                onClick={() => goToTab("notes")}
              >
                Notes
              </button>
            </nav>
          </header>

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <>
              <section className="dashboard-compact-top">
                <div className="compact-welcome-card">
                  <h2>
                    {welcomeType === "new"
                      ? `Welcome, ${studentName}!`
                      : `Welcome Back, ${studentName}!`}
                  </h2>
                  <p>Keep going. Small progress still counts.</p>
                </div>
              </section>

              {shouldShowScheduleReminder && (
              <section
                className="compact-streak-card"
                onClick={() => goToTab("subjects")}
                style={{
                  marginTop: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  minHeight: "120px",
                  background: "linear-gradient(135deg, #F3E8FF, #E9D5FF)",
                  border: "1px solid #DDD6FE",
                  cursor: "pointer"
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "28px",
                      fontWeight: "700",
                      color: "#312E81",
                      marginBottom: "12px"
                    }}
                  >
                    ⏰ Study Reminder
                  </h3>

                  <p
                    style={{
                      fontSize: "18px",
                      color: "#5B21B6",
                      fontWeight: "500",
                      margin: 0
                    }}
                  >
                    📚 You still haven’t completed today’s study session. Click here to continue learning 🔥✨
                  </p>
                </div>
              </section>
            )}
                          

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
                      <div
                        className={
                          weeklyLoginDays?.[item.key]
                            ? "compact-fire active"
                            : "compact-fire"
                        }
                      >
                        <span className="streak-fire-emoji small">🔥</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              

              <section className="certificate-dashboard-card">
                <div className="certificate-visual">
                  <div className="certificate-paper">
                    <div className="paper-line short"></div>
                    <div className="paper-line"></div>
                    <div className="paper-line"></div>
                    <div className="paper-medal">🏅</div>
                  </div>

                  <div
                    className={`certificate-lock ${
                      isCertificateUnlocked ? "unlocked" : ""
                    }`}
                  >
                    {isCertificateUnlocked ? "✓" : "🔒"}
                  </div>
                </div>

                <div className="certificate-info">
                  <div className="certificate-title-row">
                    <h2>E-Certificate</h2>
                    <span
                      className={`certificate-status ${
                        isCertificateUnlocked ? "unlocked" : ""
                      }`}
                    >
                      {isCertificateUnlocked ? "Unlocked" : "Locked"}
                    </span>
                  </div>

                  <p>
                    Complete the requirements below to unlock your professional
                    certificate.
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
                    className={`certificate-claim-btn ${
                      isCertificateUnlocked ? "active" : ""
                    }`}
                    disabled={!isCertificateUnlocked}
                    onClick={handleCertificateClick}
                  >
                    {isCertificateUnlocked
                      ? "Purchase Certificate - RM40"
                      : "🔒Claim Certificate"}
                  </button>

                  <small>
                    {isCertificateUnlocked
                      ? "You can now purchase and download your certificate."
                      : "Complete all requirements to claim your certificate."}
                  </small>
                </div>
              </section>

              {/* RECOMMENDED COURSE */}
              <section className="dashboard-content-section">
                <h2 className="section-title">Recommended Course</h2>
                <SubjectGrid onEnroll={enrollSubject} subjects={recommendedCourses} />
              </section>
            </>
          )}

          {/* SUBJECTS TAB */}
          {activeTab === "subjects" && (
            <section className="dashboard-content-section">
              <h2 className="section-title">Available Subjects</h2>
              <SubjectGrid
                onEnroll={enrollSubject}
                subjects={subjectsForLevel}
                learningLevel={learningLevel}
              />
            </section>
          )}

          {/* CONTENT TAB */}
          {activeTab === "content" && (
            <section className="dashboard-content-section">
              <h2 className="section-title">AI Learning Assistant & Notes</h2>
              <AiChat />
              <Notes />
            </section>
          )}

          {/* QUIZ TAB */}
          {activeTab === "quiz" && (
            <section className="dashboard-content-section">
              <QuizPage
                onSubmitQuiz={setQuizScore}
                quizScore={performanceData.quizScore}
                difficultyLevel={performanceData.difficultyLevel}
                practicalScore={performanceData.practicalScore}
                leaderboard={leaderboard}
                updateLeaderboard={updateLeaderboard}
                learningLevel={learningLevel}
              />
            </section>
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === "performance" && (
            <section className="dashboard-content-section">
              <PerformancePage
                studentData={performanceData}
                leaderboard={leaderboard}
                learningLevel={learningLevel}
              />
            </section>
          )}

          {/* NOTES TAB */}
          {activeTab === "notes" && (
            <section
              className="dashboard-content-section"
              style={{ marginTop: "-30px" }}
            >
              <Notes />
            </section>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === "leaderboard" && (
            <section className="dashboard-content-section">
              <LeaderboardPage learningLevel={learningLevel} />
            </section>
          )}

          {/* PROGRESS TAB */}
          {activeTab === "progress" && (
            <section className="dashboard-content-section">
              <button className="back-btn" onClick={() => goToTab("dashboard")}>
                ← Back
              </button>

              <ProgressPage
                studentData={performanceData}
                onBack={() => goToTab("dashboard")}
              />
            </section>
          )}

          {/* ACHIEVEMENT TAB */}
          {activeTab === "achievement" && (
            <>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  paddingLeft: "90px",
                  marginBottom: "20px"
                }}
              >
                <button
                  className="back-btn"
                  onClick={() => goToTab("dashboard")}
                >
                  ← Back
                </button>
              </div>

              <section
                className="dashboard-content-section"
                style={{ marginTop: "-40px" }}
              >
                <AchievementPage studentData={performanceData} />
              </section>
            </>
          )}

          {/* FORUM TAB */}
          {activeTab === "forum" && (
            <section className="dashboard-content-section">
              <button className="back-btn" onClick={() => goToTab("dashboard")}>
                ← Back
              </button>

              <ForumPage />
            </section>
          )}

          {/* FEEDBACK TAB */}
          {activeTab === "feedback" && (
            <section
              className="dashboard-content-section"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%"
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: "20px"
                }}
              >
                <button
                  className="back-btn"
                  onClick={() => goToTab("dashboard")}
                >
                  ← Back
                </button>
              </div>

              <div className="feedback-card">
                <h1>Feedback Form</h1>

                <p>
                  Share your feedback to help us improve BrainyBits.
                </p>

                <textarea
                  placeholder="Write your feedback..."
                  className="feedback-textarea"
                />

                <button
                  className="feedback-submit"
                  onClick={() => {
                    alert("Feedback submitted successfully!");
                  }}
                >
                  Submit
                </button>
              </div>
            </section>
          )}

          {/* SUBSCRIPTIONS TAB */}
          {activeTab === "subscriptions" && (
            <>
              <section className="subscription-page">
                <button
                  className="subscription-back-btn"
                  onClick={() => setActiveTab("dashboard")}
                >
                  ← Back
                </button>

                <div className="subscription-header">
                  <h1>Subscriptions</h1>
                  <p>Choose the plan that best suits your learning needs.</p>
                </div>

                <div className="subscription-grid">
                  <div className="subscription-card standard-card">
                    <div className="plan-icon">🌱</div>
                    <h2>Standard</h2>
                    <span>Free Plan</span>
                    <p>Access essential learning materials and basic features.</p>
                    <ul>
                      <li>Access to basic subjects</li>
                      <li>Limited quizzes</li>
                      <li>Limited AI Chatbot</li>
                      <li>Community support</li>
                    </ul>
                    <button>Current Plan</button>
                  </div>

                  <div className="subscription-card premium-card">
                    <div className="plan-icon">💎</div>
                    <h2>Premium</h2>
                    <span>RM200/month</span>
                    <p>Unlock more content and advanced learning features.</p>
                    <ul>
                      <li>Access all subjects</li>
                      <li>Unlimited quizzes</li>
                      <li>Unlimited AI Chatbot</li>
                      <li>Priority support</li>
                    </ul>
                    <button>Upgrade to Premium</button>
                  </div>

                  <div className="subscription-card institutional-card">
                    <div className="plan-icon">🏛️</div>
                    <h2>Institutional</h2>
                    <span>Institutional Plan</span>
                    <p>Designed for schools, universities and organizations.</p>
                    <ul>
                      <li>All Premium features</li>
                      <li>Institutional analytics</li>
                      <li>User & role management</li>
                      <li>Dedicated account manager</li>
                    </ul>
                    <button onClick={() => setShowContactPopup(true)}>
                      Contact Us
                    </button>
                  </div>
                </div>
              </section>

              {showContactPopup && (
                <div className="contact-popup-overlay">
                  <div className="contact-popup">
                    <button
                      className="contact-close-btn"
                      onClick={() => setShowContactPopup(false)}
                    >
                      <X size={20} />
                    </button>

                    <h2>Contact Us</h2>
                    <p>Reach us for Institutional subscription inquiries.</p>

                    <div className="contact-item">
                      <div className="contact-left">
                        <div className="contact-icon">
                          <MessageCircle size={28} />
                        </div>

                        <div className="contact-text">
                          <h4>WhatsApp Support</h4>

                          <p
                            onClick={() =>
                              window.open("https://wa.me/60133152376", "_blank")
                            }
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            +60 13-315 2376
                          </p>
                        </div>
                      </div>

                      <button
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText("+60 13-315 2376");
                          alert("Phone number copied!");
                        }}
                      >
                        <Copy size={26} />
                      </button>
                    </div>

                    <div className="contact-item">
                      <div className="contact-left">
                        <div className="contact-icon email-icon">
                          <Mail size={28} />
                        </div>

                        <div className="contact-text">
                          <h4>Email Us</h4>

                          <p
                            onClick={() =>
                              window.open(
                                "mailto:syarifahnaniey@gmail.com",
                                "_blank"
                              )
                            }
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            syarifahnaniey@gmail.com
                          </p>
                        </div>
                      </div>

                      <button
                        className="copy-btn email-copy"
                        onClick={() => {
                          navigator.clipboard.writeText("syarifahnaniey@gmail.com");
                          alert("Email copied!");
                        }}
                      >
                        <Copy size={26} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

         {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginLeft: "50px"
                }}
              >
                <button
                  className="back-btn"
                  onClick={() => goToTab("dashboard")}
                >
                  ← Back
                </button>
              </div>

              <section className="dashboard-content-section">

              <div className="module-card" style={{ textAlign: "center" }}>
                <h2 className="section-title">Learning Level Settings</h2>

                <p style={{ marginBottom: "20px" }}>
                  Current level:{" "}
                  <strong>{learningLevel || "Not selected"}</strong>
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center"
                  }}
                >
                  <button
                    className="hero-button"
                    onClick={() => saveSelectedLevel("beginner")}
                  >
                    Beginner
                  </button>

                  <button
                    className="hero-button"
                    onClick={() => saveSelectedLevel("intermediate")}
                  >
                    Intermediate
                  </button>

                  <button
                    className="hero-button"
                    onClick={() => saveSelectedLevel("advanced")}
                  >
                    Advanced
                  </button>
                </div>
              </div>
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
                  {streakDays.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => toggleDay(item.day)}
                      style={option(days.includes(item.day))}
                    >
                      {item.day}
                    </button>
                  ))}
                </div>

                <div style={navRow}>
                  <span style={back} onClick={() => setStep(0)}>
                    ←
                  </span>
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
                  <span style={back} onClick={() => setStep(1)}>
                    ←
                  </span>
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
                  <span style={back} onClick={() => setStep(2)}>
                    ←
                  </span>
                  <button
                    className="hero-button"
                    style={{ padding: "10px 25px" }}
                    onClick={handleSaveSchedule}
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
                  {[
                    "Skill 🧠",
                    "Exam 📚",
                    "Coding 💻",
                    "Language 🌍",
                    "Consistency 🔥"
                  ].map((g) => (
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
                  <span style={back} onClick={() => setGoalStep(0)}>
                    ←
                  </span>
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
                  {["1 topic/week", "5 lessons", "Improve level", "Maintain"].map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setTarget(t)}
                        style={option(target === t)}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>

                <div style={navRow}>
                  <span style={back} onClick={() => setGoalStep(1)}>
                    ←
                  </span>
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
                  <span style={back} onClick={() => setGoalStep(2)}>
                    ←
                  </span>
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

      {/* LEVEL POPUP */}
      {levelMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#7C3AED",
            color: "white",
            padding: "14px 24px",
            borderRadius: "14px",
            fontWeight: "700",
            boxShadow: "0 10px 25px rgba(124,58,237,0.35)",
            zIndex: 9999
          }}
        >
          {levelMessage}
        </div>
      )}
      
      {showLevelPopup && (
        <div style={overlay}>
          <div
            className="module-card popup-card"
            style={{ textAlign: "center" }}
          >
            <h2 className="section-title">Choose Your Learning Level</h2>

            <p style={{ marginBottom: "20px", color: "#6b7280" }}>
              Select your current learning level to personalize your modules and
              quizzes.
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              <button
                className="hero-button"
                onClick={() => saveSelectedLevel("beginner")}
              >
                Beginner
              </button>

              <button
                className="hero-button"
                onClick={() => saveSelectedLevel("intermediate")}
              >
                Intermediate
              </button>

              <button
                className="hero-button"
                onClick={() => saveSelectedLevel("advanced")}
              >
                Advanced
              </button>
            </div>
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
  overflowX: "auto",
  whiteSpace: "nowrap",
  flexWrap: "nowrap",
  paddingBottom: "5px",
  scrollbarWidth: "none"
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
  transition: "0.2s",
  flexShrink: 0
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