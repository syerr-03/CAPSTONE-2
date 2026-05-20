import React, { useState, useEffect } from "react";
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
import jsPDF from "jspdf";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [levelMessage, setLevelMessage] = useState("");

  const [showHelp, setShowHelp] = useState(false);
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
    // TODO: Activate premium subscription after payment success when subscription logic is ready.
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
            openSchedule={openSchedule}
            openGoals={openGoals}
            openProgress={() => goToTab("progress")}
            openAchievement={() => goToTab("achievement")}
            openForum={() => goToTab("forum")}
            openSettings={() => goToTab("settings")}
            openFeedback={() => goToTab("feedback")}
            onStandardPlan={openStandardPlanModal}
            onPremiumPlan={openPremiumPlanModal}
            onInstitutionalPlan={openInstitutionalPlanModal}
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
                  <li>Access to premium learning content</li>
                  <li>Unlimited quizzes</li>
                  <li>Unlimited AI ChatBot</li>
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
                    className={`certificate-claim-btn ${
                      isCertificateUnlocked ? "active" : ""
                    }`}
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