import React, { useEffect, useState } from "react";
import SubjectGrid from "../components/SubjectGrid.jsx";
import QuizPage from "../components/QuizPage.jsx";
import { getStudentSubjectsForLevel } from "../data/subjectData.js";
import Drawer from "../components/Drawer.jsx";
import PerformancePage from "../ProgressManagement/PerformancePage.jsx";
import ProgressPage from "../ProgressManagement/ProgressPage.jsx";
import AchievementPage from "../ProgressManagement/AchievementPage.jsx";
import ForumPage from "../ProgressManagement/ForumPage.jsx";
import LeaderboardPage from "../ProgressManagement/LeaderboardPage.jsx";
import AiChat from "../components/aiChat.jsx";
import Notes from "../components/Notes.jsx";
import QuickHelpModal from "../components/QuickHelpModal";
import StarRating from "../components/StarRating";

import "../App.css";
import jsPDF from "jspdf";

import { Copy, Mail, MessageCircle, X } from "lucide-react";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
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
  handleSelectLevel,
  userPlan,
  onPremiumPlan,
  onStandardPlan,
  dashboardTargetTab,
  setDashboardTargetTab,
  onPremiumPaymentSuccess,
}) {

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const [subjectsForLevel, setSubjectsForLevel] = useState([]);
  const [reminderShown, setReminderShown] = useState(
  sessionStorage.getItem("reminderShown") === "true"
);

  useEffect(() => {
    const raw = localStorage.getItem("bbSubjectsByLevel");
    if (!raw) {
      setSubjectsForLevel([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw) || {};
      const level = (learningLevel || "beginner").toLowerCase();

      const subjectList = getStudentSubjectsForLevel(level, parsed);
      setSubjectsForLevel(subjectList);
    } catch (e) {
      setSubjectsForLevel([]);
    }
  }, [learningLevel]);


const [weeklyLoginDays, setWeeklyLoginDays] = useState({});

const [currentStreak, setCurrentStreak] = useState(0);

const [motivationalText, setMotivationalText] = useState(
  "Let's start learning today!"
);
useEffect(() => {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const completedDates =
    JSON.parse(
      localStorage.getItem("completedDates")
    ) || [];

  if (!completedDates.includes(today)) {
    completedDates.push(today);

    localStorage.setItem(
      "completedDates",
      JSON.stringify(completedDates)
    );
  }
}, []);
  const welcomeType = localStorage.getItem("welcomeType");
  const studentName =
  localStorage.getItem("name") || "Student";
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!dashboardTargetTab) return;

    setActiveTab(dashboardTargetTab);
    if (typeof setDashboardTargetTab === "function") {
      setDashboardTargetTab(null);
    }
  }, [dashboardTargetTab, setDashboardTargetTab]);

  const [editName, setEditName] = useState(
    localStorage.getItem("name") || ""
  );

  const [editPhone, setEditPhone] = useState(
    localStorage.getItem("phone") || ""
  );

  const [editProfilePic, setEditProfilePic] = useState(
    localStorage.getItem("profilePic") || ""
  );

  const [showContactPopup, setShowContactPopup] = useState(false);
const [drawerOpen, setDrawerOpen] = useState(false);

const [darkMode, setDarkMode] = useState(
  localStorage.getItem("darkMode") === "true"
);

useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);

  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    };
  }, [drawerOpen]);
  const [showStandardModal, setShowStandardModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showInstitutionalModal, setShowInstitutionalModal] = useState(false);
  const [showSubscriptionPaymentModal, setShowSubscriptionPaymentModal] = useState(false);
  const [showSubscriptionPaymentSuccess, setShowSubscriptionPaymentSuccess] = useState(false);
  const [subscriptionFullName, setSubscriptionFullName] = useState("");
  const [subscriptionIcNumber, setSubscriptionIcNumber] = useState("");
  const [subscriptionPaymentMethod, setSubscriptionPaymentMethod] = useState("");
  const [subscriptionPaymentStep, setSubscriptionPaymentStep] = useState("method");
  const [subscriptionBank, setSubscriptionBank] = useState("");
  const [subscriptionBankUsername, setSubscriptionBankUsername] = useState("");
  const [subscriptionBankPassword, setSubscriptionBankPassword] = useState("");
  const [subscriptionCardNumber, setSubscriptionCardNumber] = useState("");
  const [subscriptionCardExpiry, setSubscriptionCardExpiry] = useState("");
  const [subscriptionCardCvv, setSubscriptionCardCvv] = useState("");
  const [subscriptionCardHolderName, setSubscriptionCardHolderName] = useState("");
  const [subscriptionPaymentError, setSubscriptionPaymentError] = useState("");

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

  const openStandardPlanModal = () => {
    setShowStandardModal(true);
    setShowPremiumModal(false);
    setShowSubscriptionPaymentModal(false);
    setShowSubscriptionPaymentSuccess(false);
    setSubscriptionPaymentError("");
  };

  const openPremiumPlanModal = () => {
    setShowPremiumModal(true);
    setShowStandardModal(false);
    setShowInstitutionalModal(false);
    setShowSubscriptionPaymentModal(false);
    setShowSubscriptionPaymentSuccess(false);
    setSubscriptionPaymentError("");
  };

  const openInstitutionalPlanModal = () => {
    setShowInstitutionalModal(true);
    setShowStandardModal(false);
    setShowPremiumModal(false);
    setShowSubscriptionPaymentModal(false);
    setShowSubscriptionPaymentSuccess(false);
    setSubscriptionPaymentError("");
  };

  const resetSubscriptionPaymentFlow = () => {
    setSubscriptionFullName("");
    setSubscriptionIcNumber("");
    setSubscriptionPaymentMethod("");
    setSubscriptionPaymentStep("method");
    setSubscriptionBank("");
    setSubscriptionBankUsername("");
    setSubscriptionBankPassword("");
    setSubscriptionCardNumber("");
    setSubscriptionCardExpiry("");
    setSubscriptionCardCvv("");
    setSubscriptionCardHolderName("");
    setSubscriptionPaymentError("");
  };

  const closeSubscriptionModals = () => {
    setShowStandardModal(false);
    setShowPremiumModal(false);
    setShowInstitutionalModal(false);
    setShowSubscriptionPaymentModal(false);
    setShowSubscriptionPaymentSuccess(false);
    resetSubscriptionPaymentFlow();
  };

  const handleContinueStandard = () => {
    setShowStandardModal(false);
  };

  const handleProceedInstitutional = () => {
    setShowInstitutionalModal(false);
  };

  const handleStartPremiumPayment = () => {
    setShowPremiumModal(false);
    resetSubscriptionPaymentFlow();
    setShowSubscriptionPaymentModal(true);
  };

  const handleSubscriptionPaymentNext = () => {
    if (!subscriptionFullName.trim()) {
      setSubscriptionPaymentError("Please enter your full name.");
      return;
    }

    if (!subscriptionIcNumber.trim()) {
      setSubscriptionPaymentError("Please enter your IC number.");
      return;
    }

    if (!subscriptionPaymentMethod) {
      setSubscriptionPaymentError("Please select a payment method.");
      return;
    }

    setSubscriptionPaymentError("");
    setSubscriptionPaymentStep("details");
  };

  const handleSubscriptionPaymentBack = () => {
    setSubscriptionPaymentStep("method");
    setSubscriptionPaymentError("");
  };

  const getMaskedSubscriptionCardNumber = () => {
    const digits = subscriptionCardNumber.replace(/\D/g, "");
    return digits.length >= 4 ? `**** **** **** ${digits.slice(-4)}` : "N/A";
  };

  const handleSubscriptionPaymentSubmit = () => {
    if (subscriptionPaymentMethod === "onlineBanking") {
      if (!subscriptionBank) {
        setSubscriptionPaymentError("Please select a bank.");
        return;
      }
      if (!subscriptionBankUsername.trim()) {
        setSubscriptionPaymentError("Please enter your bank username.");
        return;
      }
      if (!subscriptionBankPassword.trim()) {
        setSubscriptionPaymentError("Please enter your bank password.");
        return;
      }
    }

    if (subscriptionPaymentMethod === "card") {
      if (!subscriptionCardNumber.trim()) {
        setSubscriptionPaymentError("Please enter your card number.");
        return;
      }
      if (!subscriptionCardExpiry.trim()) {
        setSubscriptionPaymentError("Please enter your card expiry date.");
        return;
      }
      if (!subscriptionCardCvv.trim()) {
        setSubscriptionPaymentError("Please enter your CVV.");
        return;
      }
      if (!subscriptionCardHolderName.trim()) {
        setSubscriptionPaymentError("Please enter the cardholder name.");
        return;
      }
    }

    setSubscriptionPaymentError("");
setShowSubscriptionPaymentModal(false);
setShowSubscriptionPaymentSuccess(true);

localStorage.setItem("userPlan", "premium");
localStorage.setItem("plan", "premium");

// Activate premium subscription after payment success
if (onPremiumPaymentSuccess) {
  onPremiumPaymentSuccess();
}
  };

  const handleCloseSubscriptionSuccess = () => {
    setShowSubscriptionPaymentSuccess(false);
    closeSubscriptionModals();
  };

  const handleDownloadSubscriptionReceipt = () => {
    const receipt = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = receipt.internal.pageSize.getWidth();
    const margin = 40;
    const lineHeight = 20;
    const now = new Date();
    const formattedDate = now.toLocaleString();
    const receiptNumber = `R-${Math.floor(100000 + Math.random() * 900000)}`;

    receipt.setFont("helvetica", "bold");
    receipt.setFontSize(22);
    receipt.setTextColor("#3b0768");
    receipt.text("Payment Receipt", pageWidth / 2, 72, { align: "center" });

    receipt.setDrawColor("#7c3aed");
    receipt.setLineWidth(1);
    receipt.line(margin, 86, pageWidth - margin, 86);

    receipt.setFont("helvetica", "normal");
    receipt.setFontSize(11);
    receipt.setTextColor("#6b7280");
    receipt.text(
      "Thank you for your payment.",
      pageWidth / 2,
      108,
      { align: "center" }
    );

    const tableWidth = 400;
    const tableX = (pageWidth - tableWidth) / 2;
    let currentY = 138;
    receipt.setFontSize(12);
    receipt.setTextColor("#7c3aed");
    receipt.text("PAYER DETAILS", pageWidth / 2, currentY, { align: "center" });

    currentY += 18;
    const rowHeight = 24;
    const labelWidth = 150;
    const valueStart = tableX + labelWidth + 12;

    const payerRows = [
      ["Full Name", subscriptionFullName || "N/A"],
      ["IC Number", subscriptionIcNumber || "N/A"]
    ];

    payerRows.forEach(([label, value]) => {
      receipt.setFillColor("#f5efff");
      receipt.roundedRect(tableX, currentY, labelWidth, rowHeight, 6, 6, "F");
      receipt.setDrawColor("#d8c2f7");
      receipt.roundedRect(tableX, currentY, tableWidth, rowHeight, 6, 6);

      receipt.setFontSize(11);
      receipt.setTextColor("#4b1e9a");
      receipt.text(label, tableX + 10, currentY + 16);
      receipt.setTextColor("#111827");
      receipt.text(value, valueStart, currentY + 16);
      currentY += rowHeight + 8;
    });

    currentY += 12;
    receipt.setFontSize(12);
    receipt.setTextColor("#7c3aed");
    receipt.text("PAYMENT DETAILS", pageWidth / 2, currentY, { align: "center" });

    currentY += 16;
    const paymentRows = [
      ["Payment Item", "Premium Subscription"],
      ["Amount", "RM200/month"],
      ["Payment Method", subscriptionPaymentMethod === "card" ? "Debit / Credit Card" : "Online Banking"],
      [subscriptionPaymentMethod === "card" ? "Card Number" : "Bank Name", subscriptionPaymentMethod === "card" ? getMaskedSubscriptionCardNumber() : subscriptionBank || "N/A"],
      ["Payment Status", "Successful"],
      ["Date and Time", formattedDate],
      ["Receipt Number", receiptNumber]
    ];

    paymentRows.forEach(([label, value]) => {
      receipt.setFillColor("#f5efff");
      receipt.roundedRect(tableX, currentY, labelWidth, rowHeight, 6, 6, "F");
      receipt.setDrawColor("#d8c2f7");
      receipt.roundedRect(tableX, currentY, tableWidth, rowHeight, 6, 6);

      receipt.setFontSize(11);
      receipt.setTextColor("#4b1e9a");
      receipt.text(label, tableX + 10, currentY + 16);
      receipt.setTextColor("#111827");
      receipt.text(value, valueStart, currentY + 16);
      currentY += rowHeight + 8;
    });

    currentY += 10;
    receipt.setDrawColor("#7c3aed");
    receipt.setLineWidth(0.5);
    receipt.line(tableX, currentY, tableX + tableWidth, currentY);

    receipt.save(`premium-receipt-${subscriptionFullName || "user"}-${Date.now()}.pdf`);
  };

  const performanceData = studentData || {
    completedModules: 0,
    progressPercent: 0,
    certificateProgress: 0,
    certificateProgressMemory: {
      beginner: false,
      intermediate: false,
      advanced: false
    },
    quizScore: 0,
    practicalScore: 0,
    difficultyLevel: "Medium"
  };

  const certificateMemory =
    performanceData.certificateProgressMemory || {
      beginner: false,
      intermediate: false,
      advanced: false
    };

  const certificateProgress = performanceData.certificateProgress || 0;
  const isCertificateUnlocked =
    certificateMemory.beginner &&
    certificateMemory.intermediate &&
    certificateMemory.advanced;

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

 const handleSaveSchedule = () => {
  const reminderText = "Reminder: Complete one module today.";
  const currentUser = localStorage.getItem("loggedInUser");

  localStorage.setItem(`scheduleReminder_${currentUser}`, reminderText);

  localStorage.setItem(
    `studentSchedule_${currentUser}`,
    JSON.stringify({ days, time, duration })
  );
  sessionStorage.removeItem(`reminderShown_${currentUser}`);
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

  // NEW
  const reminderShown = sessionStorage.getItem(
    `reminderShown_${currentUser}`
  );

  if (reminderShown) return;

  const currentSlot = getCurrentTimeSlot();

  if (savedSchedule.time.includes(currentSlot)) {
    alert("Reminder: It's your scheduled study time today!");

    // NEW
    sessionStorage.setItem(
      `reminderShown_${currentUser}`,
      "true"
    );
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
    const completedDates =
  JSON.parse(localStorage.getItem("completedDates")) || [];

const weekDays = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun"
];

const streakDays = weekDays.map(day => ({
  day,
  active: completedDates.some(date => {
    const dayName = new Date(date)
      .toLocaleDateString("en-US", {
        weekday: "short"
      });

    return dayName === day;
  })
}));
  useEffect(() => {
  const completedDates =
    JSON.parse(localStorage.getItem("completedDates")) || [];

  const uniqueDates = [...new Set(completedDates)].sort();

  if (uniqueDates.length === 0) {
    setCurrentStreak(0);
    setMotivationalText("Let's start learning today!");
    return;
  }

  let streak = 1;

  for (let i = uniqueDates.length - 1; i > 0; i--) {
    const current = new Date(uniqueDates[i]);
    const previous = new Date(uniqueDates[i - 1]);

    const diff =
      (current - previous) /
      (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  setCurrentStreak(streak);

if (streak === 0) {
  setMotivationalText("Let's start learning today!");
} else if (streak <= 3) {
  setMotivationalText("Great start!");
} else if (streak <= 7) {
  setMotivationalText("You're building consistency!");
} else if (streak <= 14) {
  setMotivationalText(
    "Amazing! You're on fire. Keep it up!"
  );
} else {
  setMotivationalText(
    "Outstanding dedication! Keep the momentum going!"
  );
}
}, []);

  const allCourses = [
  {
    id: 1,
    title: "What is Data Science?",
    description: "Start with the basic meaning, purpose, and use of data science.",
    icon: "📊",
    level: "Beginner",
    topic: "Data Science Basics",
    quizId: "dataScience"
  },
  {
    id: 2,
    title: "Python for Data Science",
    description: "Learn basic Python syntax, variables, and simple coding skills.",
    icon: "🐍",
    level: "Beginner",
    topic: "Python Basics",
    quizId: "pythonBasics"
  },
  {
    id: 3,
    title: "Statistics Fundamentals",
    description: "Improve your understanding of probability, mean, and data analysis.",
    icon: "📈",
    level: "Intermediate",
    topic: "Statistics",
    quizId: "dataScience"
  },
  {
    id: 4,
    title: "Exploratory Data Analysis",
    description: "Learn how to inspect, clean, and understand datasets.",
    icon: "🔍",
    level: "Intermediate",
    topic: "EDA",
    quizId: "dataScience"
  },
  {
    id: 5,
    title: "Machine Learning Basics",
    description: "Understand model training, prediction, and evaluation.",
    icon: "🤖",
    level: "Advanced",
    topic: "Machine Learning",
    quizId: "machineLearning"
  },
  {
    id: 6,
    title: "Artificial Intelligence Fundamentals",
    description: "Understand AI concepts, applications, and ethical AI.",
    icon: "🧠",
    level: "Advanced",
    topic: "Artificial Intelligence",
    quizId: "artificialIntelligence"
  }
];

 const weakQuizId = localStorage.getItem("weakQuizId");

const recommendedCourses = weakQuizId
  ? allCourses.filter((course) => course.quizId === weakQuizId)
  : allCourses.filter(
      (course) =>
        course.level.toLowerCase() === learningLevel.toLowerCase()
    );

  return (
  <div className={`dashboard-page ${darkMode ? "dark-mode" : ""}`}>
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

        {showStandardModal && (
          <div className="subscription-modal-overlay">
            <div className="subscription-modal-card">
              <button className="subscription-modal-close" onClick={closeSubscriptionModals}>
                ×
              </button>

              <div className="subscription-modal-icon">⭐</div>

              <div style={{ textAlign: "center" }}>
                <h3 className="subscription-modal-title">Standard Plan</h3>
                <p className="subscription-modal-subtitle">Basic access for normal learning.</p>
              </div>

              <div className="subscription-modal-price-group">
                <span className="subscription-modal-price-main">Free</span>
                <span className="subscription-modal-price-detail">RM 0 / month</span>
              </div>

              <div>
                <div className="subscription-modal-section-title">Includes</div>
                <ul className="subscription-modal-include-list">
                  <li>Access to basic learning materials</li>
                  <li>Basic quizzes</li>
                  <li>Limited AI ChatBot</li>
                </ul>
              </div>

              <div className="subscription-modal-info">No payment is required for this plan.</div>

              <div className="subscription-modal-footer">
                <button
                  type="button"
                  className="cert-preview-primary-btn"
                  onClick={handleContinueStandard}
                >
                  Continue with Standard
                </button>
                <button
                  type="button"
                  className="cert-preview-secondary-btn"
                  onClick={closeSubscriptionModals}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showPremiumModal && (
          <div className="subscription-modal-overlay">
            <div className="subscription-modal-card">
              <button className="subscription-modal-close" onClick={closeSubscriptionModals}>
                ×
              </button>

              <div className="subscription-modal-icon">👑</div>

              <div style={{ textAlign: "center" }}>
                <h3 className="subscription-modal-title">Premium Subscription</h3>
                <p className="subscription-modal-subtitle">Premium access for extended learning support.</p>
              </div>

              <div className="subscription-modal-price-group">
                <span className="subscription-modal-price-main">RM200/month</span>
              </div>

              <div>
                <div className="subscription-modal-section-title">Includes</div>
                <ul className="subscription-modal-include-list">
                  <li>Access all subjects</li>
                  <li>Unlimited quizzes</li>
                  <li>Unlimited AI ChatBot</li>
                  <li>Priority support</li>
                </ul>
              </div>

              <div className="subscription-modal-info">Secure checkout for your premium subscription.</div>

              <div className="subscription-modal-footer">
                <button
                  type="button"
                  className="cert-preview-primary-btn"
                  onClick={handleStartPremiumPayment}
                >
                  Make Payment
                </button>
                <button
                  type="button"
                  className="cert-preview-secondary-btn"
                  onClick={closeSubscriptionModals}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showInstitutionalModal && (
          <div className="subscription-modal-overlay">
            <div className="subscription-modal-card">
              <button className="subscription-modal-close" onClick={closeSubscriptionModals}>
                ×
              </button>

              <div className="subscription-modal-icon">🏛️</div>

              <div style={{ textAlign: "center" }}>
                <h3 className="subscription-modal-title">Institutional Plan</h3>
                <p className="subscription-modal-subtitle">Subscription for institutions based on yearly student count.</p>
              </div>

              <div className="subscription-modal-price-group">
                <span className="subscription-modal-price-main">RM150</span>
                <span className="subscription-modal-price-detail">per student / year</span>
              </div>

              <div>
                <div className="subscription-modal-section-title">Includes</div>
                <ul className="subscription-modal-include-list">
                  <li>Access for institutional student users</li>
                  <li>Yearly pricing based on student total</li>
                  <li>Centralized learning access</li>
                </ul>
              </div>

              <div className="subscription-modal-info">Final total payment depends on number of students per year.</div>

              <div className="subscription-modal-footer">
                <button
                  type="button"
                  className="cert-preview-primary-btn"
                  onClick={handleProceedInstitutional}
                >
                  Proceed with Institutional
                </button>
                <button
                  type="button"
                  className="cert-preview-secondary-btn"
                  onClick={closeSubscriptionModals}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showSubscriptionPaymentModal && (
          <div className="payment-modal-overlay">
            <div className="payment-modal-card" style={{ paddingTop: "18px", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="payment-modal-icon">
                  <span style={{ fontSize: "20px", lineHeight: 1 }}>💳</span>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <h2 className="payment-modal-title">Make Payment</h2>
                <p className="payment-modal-subtitle">
                  {subscriptionPaymentStep === "method"
                    ? "Premium Subscription · RM200/month"
                    : subscriptionPaymentMethod === "onlineBanking"
                    ? "Complete your payment using online banking."
                    : "Enter your card details to complete payment."}
                </p>
              </div>

              <div className="payment-modal-form">
                <div className="payment-modal-field">
                  <span className="payment-modal-input-icon">👤</span>
                  <input
                    type="text"
                    aria-label="Full name"
                    value={subscriptionFullName}
                    onChange={(e) => setSubscriptionFullName(e.target.value.toUpperCase())}
                    placeholder="Enter full name"
                    className="payment-modal-input"
                  />
                </div>

                <div className="payment-modal-field">
                  <span className="payment-modal-input-icon">🆔</span>
                  <input
                    type="text"
                    aria-label="IC number"
                    value={subscriptionIcNumber}
                    onChange={(e) => {
                      const numbersOnly = e.target.value.replace(/\D/g, "");
                      setSubscriptionIcNumber(numbersOnly.slice(0, 12));
                    }}
                    placeholder="12 digit IC number"
                    maxLength="12"
                    className="payment-modal-input"
                  />
                </div>

                {subscriptionPaymentStep === "method" && (
                  <div className="payment-method-grid">
                    <button
                      type="button"
                      className={`payment-method-card ${subscriptionPaymentMethod === "onlineBanking" ? "selected" : ""}`}
                      onClick={() => setSubscriptionPaymentMethod("onlineBanking")}
                    >
                      <div className="payment-method-card-icon">🏦</div>
                      <span className="payment-method-card-title">Online Banking</span>
                      <span className="payment-method-card-text">Pay securely using your bank account</span>
                    </button>

                    <button
                      type="button"
                      className={`payment-method-card ${subscriptionPaymentMethod === "card" ? "selected" : ""}`}
                      onClick={() => setSubscriptionPaymentMethod("card")}
                    >
                      <div className="payment-method-card-icon">💳</div>
                      <span className="payment-method-card-title">Debit / Credit Card</span>
                      <span className="payment-method-card-text">Pay securely using your card</span>
                    </button>
                  </div>
                )}

                {subscriptionPaymentStep === "details" && subscriptionPaymentMethod === "onlineBanking" && (
                  <>
                    <div className="payment-modal-field">
                      <span className="payment-modal-input-icon">🏦</span>
                      <select
                        aria-label="Select your bank"
                        value={subscriptionBank}
                        onChange={(e) => setSubscriptionBank(e.target.value)}
                        className="payment-modal-input"
                      >
                        <option value="" hidden>
                          Select your bank
                        </option>
                        <option value="Maybank">Maybank</option>
                        <option value="CIMB Bank">CIMB Bank</option>
                        <option value="Bank Islam">Bank Islam</option>
                        <option value="RHB Bank">RHB Bank</option>
                        <option value="Public Bank">Public Bank</option>
                        <option value="Hong Leong Bank">Hong Leong Bank</option>
                      </select>
                    </div>

                    <div className="payment-modal-field">
                      <span className="payment-modal-input-icon">👤</span>
                      <input
                        type="text"
                        aria-label="Bank username"
                        value={subscriptionBankUsername}
                        onChange={(e) => setSubscriptionBankUsername(e.target.value)}
                        placeholder="Enter bank username"
                        className="payment-modal-input"
                      />
                    </div>

                    <div className="payment-modal-field">
                      <span className="payment-modal-input-icon">🔒</span>
                      <input
                        type="password"
                        aria-label="Bank password"
                        value={subscriptionBankPassword}
                        onChange={(e) => setSubscriptionBankPassword(e.target.value)}
                        placeholder="Enter bank password"
                        className="payment-modal-input"
                      />
                    </div>
                  </>
                )}

                {subscriptionPaymentStep === "details" && subscriptionPaymentMethod === "card" && (
                  <>
                    <div className="payment-modal-field">
                      <span className="payment-modal-input-icon">💳</span>
                      <input
                        type="text"
                        aria-label="Card number"
                        value={subscriptionCardNumber}
                        onChange={(e) => setSubscriptionCardNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="Card number"
                        className="payment-modal-input"
                      />
                    </div>

                    <div className="payment-modal-field">
                      <span className="payment-modal-input-icon">📅</span>
                      <input
                        type="text"
                        aria-label="Expiry date"
                        value={subscriptionCardExpiry}
                        onChange={(e) => setSubscriptionCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="payment-modal-input"
                      />
                    </div>

                    <div className="payment-modal-field">
                      <span className="payment-modal-input-icon">🔒</span>
                      <input
                        type="text"
                        aria-label="CVV"
                        value={subscriptionCardCvv}
                        onChange={(e) => setSubscriptionCardCvv(e.target.value.replace(/\D/g, ""))}
                        placeholder="CVV"
                        className="payment-modal-input"
                      />
                    </div>

                    <div className="payment-modal-field">
                      <span className="payment-modal-input-icon">👤</span>
                      <input
                        type="text"
                        aria-label="Cardholder name"
                        value={subscriptionCardHolderName}
                        onChange={(e) => setSubscriptionCardHolderName(e.target.value.toUpperCase())}
                        placeholder="Cardholder name"
                        className="payment-modal-input"
                      />
                    </div>
                  </>
                )}
              </div>

              <p className="payment-modal-error">{subscriptionPaymentError}</p>

              <div className="payment-modal-footer">
                {subscriptionPaymentStep === "method" ? (
                  <>
                    <button
                      type="button"
                      className="cert-preview-primary-btn"
                      onClick={handleSubscriptionPaymentNext}
                      style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
                    >
                      Next
                    </button>
                    <button
                      type="button"
                      className="cert-preview-secondary-btn"
                      onClick={() => {
                        setShowSubscriptionPaymentModal(false);
                        setShowPremiumModal(true);
                        resetSubscriptionPaymentFlow();
                      }}
                      style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="cert-preview-primary-btn"
                      onClick={handleSubscriptionPaymentSubmit}
                      style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
                    >
                      Make Payment
                    </button>
                    <button
                      type="button"
                      className="cert-preview-secondary-btn"
                      onClick={handleSubscriptionPaymentBack}
                      style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="cert-preview-secondary-btn"
                      onClick={() => {
                        setShowSubscriptionPaymentModal(false);
                        setShowPremiumModal(true);
                        resetSubscriptionPaymentFlow();
                      }}
                      style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {showSubscriptionPaymentSuccess && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.42)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "16px"
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "520px",
                background: "#ffffff",
                borderRadius: "24px",
                boxShadow: "0 24px 48px rgba(124, 58, 237, 0.18)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #9f67ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "26px"
                  }}
                >
                  ✓
                </div>
              </div>

              <div>
                <h2 style={{ margin: 0, color: "#4b1e9a", fontSize: "22px" }}>
                  Payment Successful
                </h2>
                <p style={{ margin: "10px 0 0", color: "#6b7280", fontSize: "14px" }}>
                  Payment successful. Your Premium Subscription payment has been completed.
                </p>
              </div>

              <p style={{ margin: 0, color: "#4b1e9a", fontWeight: 600, fontSize: "14px" }}>
                Do you want to download your receipt?
              </p>

              <button
                type="button"
                className="cert-preview-primary-btn"
                onClick={handleDownloadSubscriptionReceipt}
                style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
              >
                Download Receipt
              </button>

              <button
                type="button"
                className="cert-preview-secondary-btn"
                onClick={handleCloseSubscriptionSuccess}
                style={{ width: "100%", padding: "12px 0", fontSize: "15px" }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <main
          className="dashboard-main-single"
          onWheel={(event) => {
            if (drawerOpen) {
              setDrawerOpen(false);
            }
          }}
          onTouchMove={(event) => {
            if (drawerOpen) {
              setDrawerOpen(false);
            }
          }}
        >
          {/* MENU BAR */}
          <header className="simple-menu-bar">
            <button
              className="simple-menu-icon"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              ☰
            </button>

            <h1 className="simple-menu-logo">BrainyBits</h1>

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
  className={`simple-menu-tab ${
    activeTab === "forum" ? "active" : ""
  }`}
  style={{ flexShrink: 0 }}
  onClick={() => goToTab("forum")}
>
  Forum
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

<button
  className={`simple-menu-tab ${
    activeTab === "notes" ? "active" : ""
  }`}
  onClick={() => goToTab("notes")}
>
  Notes
</button>
            </nav>
          </header>

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <>
              {/* WELCOME + ACTIONS */}
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
                      <strong>{currentStreak}</strong>
                      <span>Day Streak</span>
                    </div>
                    <p>{motivationalText}</p>
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
                    <li className={certificateMemory.beginner ? "done" : ""}>
                      <span>{certificateMemory.beginner ? "✓" : ""}</span>
                      Complete all Beginner modules
                    </li>
                    <li className={certificateMemory.intermediate ? "done" : ""}>
                      <span>{certificateMemory.intermediate ? "✓" : ""}</span>
                      Complete all Intermediate modules
                    </li>
                    <li className={certificateMemory.advanced ? "done" : ""}>
                      <span>{certificateMemory.advanced ? "✓" : ""}</span>
                      Complete all Advanced modules
                    </li>
                    <li className={isCertificateUnlocked ? "done" : ""}>
                      <span>{isCertificateUnlocked ? "✓" : ""}</span>
                      Reach 100% overall progress
                    </li>
                  </ul>

                  <div className="certificate-info-note">
                    <span className="certificate-info-icon">i</span>
                    <p>
                      This certificate will be unlocked once you complete the full learning path, including Beginner, Intermediate, and Advanced levels.
                    </p>
                  </div>
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
                      : "🔒 Certificate Locked"}
                  </button>

                  <small>
                    {isCertificateUnlocked
                      ? "You can now purchase and download your certificate."
                      : "Complete all Beginner, Intermediate, and Advanced levels to claim your certificate."}
                  </small>
                </div>
              </section>

              {/* MY COURSES */}
              <section className="dashboard-content-section">
  <h2 className="section-title">
    {weakQuizId ? "Recommended Based on Your Quiz Score" : "Recommended Courses"}
  </h2>
                <SubjectGrid
                subjects={recommendedCourses}
                onEnroll={enrollSubject}
                learningLevel={learningLevel}
                userPlan={userPlan}
              />
              </section>
            </>
          )}

          {/* SUBJECTS TAB */}
          {activeTab === "subjects" && (
  <section className="dashboard-content-section">
    <h2 className="section-title">Available Subjects</h2>

              <SubjectGrid
            subjects={subjectsForLevel}
            onEnroll={enrollSubject}
            learningLevel={learningLevel}
            userPlan={userPlan}
          />
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
                userPlan={userPlan}
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
                darkMode={darkMode}
                studentData={performanceData}
                leaderboard={leaderboard}
                learningLevel={learningLevel}
              />
            </section>
          )}

         {activeTab === "notes" && (
          <section className="dashboard-content-section">
            <Notes darkMode={darkMode} />
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
            studentData={studentData}
            learningLevel={learningLevel}
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

              <AchievementPage studentData={performanceData} />
            </>
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

  <div className="feedback-rating-box">
    <label className="feedback-question">
      1. How would you rate your overall experience? <span>*</span>
    </label>

    <div className="feedback-stars">
      <StarRating
        rating={rating}
        onChange={setRating}
      />
    </div>

    <div className="feedback-rating-labels">
      <span>Very Poor</span>
      <span>Excellent</span>
    </div>
  </div>

  <div className="feedback-input-section">
    <label className="feedback-question">
      2. What can we improve or any suggestions for us? <span>*</span>
    </label>

    <div className="feedback-textarea-wrapper">
      <textarea
        placeholder="Write your feedback, suggestions or ideas..."
        className="feedback-textarea"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <div className="feedback-counter">
        {feedback.length}/500
      </div>
    </div>
  </div>

  <button
  className="feedback-submit"
  onClick={async () => {
    if (!rating) {
      alert("Please rate your overall experience.");
      return;
    }

    if (!feedback.trim()) {
      alert("Please write your feedback or suggestions.");
      return;
    }

     try {
      await addDoc(collection(db, "feedbacks"), {
        rating: rating,
        feedback: feedback.trim(),
        name: localStorage.getItem("name") || "Anonymous",
        email: localStorage.getItem("email") || "",
        userId: localStorage.getItem("uid") || "",
        createdAt: serverTimestamp(),
      });

    setRating(0);
    setFeedback("");
    alert("Feedback submitted successfully!");
     } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(error.message);
     }
  }}
>
  Submit
</button>
</div>
            </section>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === "account" && (
            <section className="account-page">

              <div className="account-back-wrapper">
                <button
                  className="account-back-btn"
                  onClick={() => setActiveTab("dashboard")}
                >
                  ← Back
                </button>
              </div>

              <div className="account-header">
                <h1>My Account</h1>
                <p>Manage your personal information and account settings.</p>
              </div>

              <div className="account-profile-card">
                <div className="account-avatar-empty">
                  👤
                </div>

                <div className="account-profile-info">
                  <h2>
                    {localStorage.getItem("name") || "Student Name"}
                  </h2>

                  <p className="account-info-line">
                    📧 {localStorage.getItem("userEmail") || "student@email.com"}
                  </p>

                  <p className="account-info-line muted">
                    📞 {localStorage.getItem("phone") || "Not set"}
                  </p>
                </div>

                <button
                  className="account-edit-btn"
                  onClick={() => setActiveTab("editProfile")}
                >
                  ✎ Edit Profile
                </button>
              </div>

              <h3 className="account-section-title">Account Details</h3>

              <div className="account-details-grid">
                <div className="account-detail-card">
                  <div className="account-detail-icon">🎓</div>
                  <div>
                    <h4>Learning Level</h4>
                    <p>{learningLevel || "Not set"}</p>
                  </div>
                </div>

                <div className="account-detail-card">
                  <div className="account-detail-icon">👑</div>
                  <div>
                    <h4>Current Plan</h4>
                    <p>{userPlan === "premium" ? "Premium Plan" : "Standard Plan"}</p>
                    {userPlan === "premium" && (
                      <span className="premium-status-badge">💎 Premium Active</span>
                    )}
                  </div>
                </div>

                <div className="account-detail-card">
                  <div className="account-detail-icon">📅</div>
                  <div>
                    <h4>Member Since</h4>
                    <p>{localStorage.getItem("memberSince") || "Not available"}</p>
                  </div>
                </div>
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
                    <button
                      onClick={userPlan === "standard" ? undefined : onStandardPlan}
                      disabled={userPlan === "standard"}
                      style={{
                        cursor: userPlan === "standard" ? "not-allowed" : "pointer",
                        opacity: userPlan === "standard" ? 0.65 : 1
                      }}
                    >
                      {userPlan === "standard"
                        ? "Current Plan"
                        : "Switch to Standard"}
                    </button>
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
                    <button
                      onClick={userPlan === "premium" ? undefined : openPremiumPlanModal}
                      disabled={userPlan === "premium"}
                      style={{
                        cursor: userPlan === "premium" ? "not-allowed" : "pointer",
                        opacity: userPlan === "premium" ? 0.65 : 1
                      }}
                    >
                      {userPlan === "premium"
                        ? "Premium Active"
                        : "Upgrade to Premium"}
                    </button>
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

          {/* EDIT PROFILE TAB */}
          {activeTab === "editProfile" && (
            <section className="edit-profile-page">
              <button
                className="drawer-link"
                onClick={() => {
                  setActiveTab("account");
                  setDrawerOpen(false);
                }}
              >
                ← Back
              </button>

              <div className="account-header">
                <h1>Edit Profile</h1>
                <p>Update your profile picture, username and phone number.</p>
              </div>

              <div className="edit-profile-card">
                <div className="edit-profile-avatar">
                  {editProfilePic ? (
                    <img src={editProfilePic} alt="Profile" />
                  ) : (
                    <span>👤</span>
                  )}
                </div>

                <label className="edit-input-label">Username</label>
                <input
                  className="edit-profile-input"
                  type="text"
                  placeholder="Enter username"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <label className="edit-input-label">Phone Number</label>
                <input
                  className="edit-profile-input"
                  type="text"
                  placeholder="Enter phone number"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />

                <button className="save-profile-btn" onClick={handleSaveProfile}>
                  Save Profile
                </button>
              </div>
              </section>
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
          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <section className="dashboard-content-section">
              <button className="back-btn" onClick={() => goToTab("dashboard")}>
                ← Back
              </button>

              <div className="module-card" style={{ textAlign: "center" }}>
                <h2 className="section-title">Learning Level Settings</h2>

                <p style={{ marginBottom: "20px" }}>
                  Current level: <strong>{learningLevel || "Not selected"}</strong>
                </p>

                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button className="hero-button" onClick={() => handleSelectLevel("beginner")}>
                    Beginner
                  </button>

                  <button className="hero-button" onClick={() => handleSelectLevel("intermediate")}>
                    Intermediate
                  </button>

                  <button className="hero-button" onClick={() => handleSelectLevel("advanced")}>
                    Advanced
                  </button>
                </div>
              </div>
            </section>

          )}

          {/* APPEARANCE TAB */}
{activeTab === "appearance" && (
  <section className="dashboard-content-section">

    <button
      className="back-btn"
      onClick={() => goToTab("dashboard")}
    >
      ← Back
    </button>

    <div
      className="module-card"
      style={{
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto"
      }}
    >
      <h2 className="section-title">
        Appearance
      </h2>

      <p>
        Choose your preferred theme.
      </p>

      <button
        className="hero-button"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode
          ? "☀️ Switch to Light Mode"
          : "🌙 Switch to Dark Mode"}
      </button>

    </div>

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

      {showLevelPopup && (
        <div style={overlay}>
          <div className="module-card popup-card" style={{ textAlign: "center" }}>
            <h2 className="section-title">Choose Your Learning Level</h2>
            <p style={{ marginBottom: "20px", color: "#6b7280" }}>
              Select your current learning level to personalize your modules and quizzes.
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              <button className="hero-button" onClick={() => handleSelectLevel("beginner")}>
                Beginner
              </button>

              <button className="hero-button" onClick={() => handleSelectLevel("intermediate")}>
                Intermediate
              </button>

              <button className="hero-button" onClick={() => handleSelectLevel("advanced")}>
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
