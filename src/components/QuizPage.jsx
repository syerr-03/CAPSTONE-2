import React, { useState } from "react";
import "../App.css";
import LeaderboardPage from "../ProgressManagement/LeaderboardPage.jsx";
import { useEffect } from "react";

import { auth, db } from "../firebase";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

function QuizPage({
  difficultyLevel = "Medium",
  practicalScore = null,
  leaderboard = [],
  updateLeaderboard,
  onSubmitQuiz,
  learningLevel = "beginner"
}) {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
    useEffect(() => {
    setSelectedQuiz(null);
  }, [learningLevel]);

  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
  const allowedLevels = {
    beginner: ["beginner"],
    intermediate: ["beginner", "intermediate"],
    advanced: ["beginner", "intermediate", "advanced"]
  };
  
 const quizCategories = {
  dataScience: {
    title: "Data Science Quiz",
    description: "Test your understanding of data analysis and decision-making.",
    questions: [
      {
        id: 1,
        level: "beginner",
        question: "What is the main purpose of Data Science?",
        options: [
          "To collect data without using it",
          "To extract meaningful insights from data",
          "To replace all human decision-making",
          "To design websites only"
        ],
        correctAnswer: "To extract meaningful insights from data",
        explanation: "Data Science focuses on using data to discover patterns, support decisions, and solve problems."
      },
      {
        id: 2,
        level: "beginner",
        question: "Why is data cleaning important before analysis?",
        options: [
          "It makes the dataset look colorful",
          "It removes errors, missing values, and inconsistencies",
          "It increases file size",
          "It changes all data into images"
        ],
        correctAnswer: "It removes errors, missing values, and inconsistencies",
        explanation: "Clean data improves the accuracy and reliability of analysis results."
      },
      {
        id: 3,
        level: "intermediate",
        question: "Which method is commonly used to understand relationships between variables?",
        options: [
          "Correlation analysis",
          "Password encryption",
          "Screen recording",
          "File compression"
        ],
        correctAnswer: "Correlation analysis",
        explanation: "Correlation analysis helps identify how strongly two variables are related."
      },
      {
        id: 4,
        level: "intermediate",
        question: "What does data visualization help users do?",
        options: [
          "Hide important patterns",
          "Understand trends and patterns more easily",
          "Delete raw data automatically",
          "Convert charts into code only"
        ],
        correctAnswer: "Understand trends and patterns more easily",
        explanation: "Charts and graphs make complex data easier to interpret."
      },
      {
        id: 5,
        level: "advanced",
        question: "Which example best represents a data-driven decision?",
        options: [
          "Choosing a strategy based on sales trends",
          "Guessing without evidence",
          "Ignoring customer feedback",
          "Selecting randomly"
        ],
        correctAnswer: "Choosing a strategy based on sales trends",
        explanation: "Data-driven decisions are based on evidence, patterns, and measurable results."
      }
    ]
  },

  artificialIntelligence: {
    title: "Artificial Intelligence Quiz",
    description: "Test your knowledge of AI concepts and applications.",
    questions: [
      {
        id: 1,
        level: "beginner",
        question: "What best describes Artificial Intelligence?",
        options: [
          "A system that performs tasks requiring human-like intelligence",
          "A normal calculator only",
          "A device used only for storage",
          "A software that never learns"
        ],
        correctAnswer: "A system that performs tasks requiring human-like intelligence",
        explanation: "AI allows systems to perform tasks such as reasoning, learning, recognition, and decision-making."
      },
      {
        id: 2,
        level: "beginner",
        question: "Which application is an example of AI in daily life?",
        options: [
          "Voice assistants such as Siri or Google Assistant",
          "A wooden table",
          "A printed textbook",
          "A manual light switch"
        ],
        correctAnswer: "Voice assistants such as Siri or Google Assistant",
        explanation: "Voice assistants use AI to understand speech and respond to user requests."
      },
      {
        id: 3,
        level: "intermediate",
        question: "Why is ethical AI important?",
        options: [
          "To ensure AI is fair, transparent, and responsible",
          "To make AI more confusing",
          "To prevent users from learning",
          "To remove all security rules"
        ],
        correctAnswer: "To ensure AI is fair, transparent, and responsible",
        explanation: "Ethical AI reduces risks such as bias, privacy issues, and unfair decisions."
      },
      {
        id: 4,
        level: "intermediate",
        question: "Which AI task involves identifying objects in pictures?",
        options: [
          "Image recognition",
          "Typing speed test",
          "File naming",
          "Battery charging"
        ],
        correctAnswer: "Image recognition",
        explanation: "Image recognition allows AI systems to detect and classify objects in images."
      },
      {
        id: 5,
        level: "advanced",
        question: "What is one limitation of AI systems?",
        options: [
          "They may produce biased results if trained on biased data",
          "They can never process information",
          "They do not require data",
          "They always make perfect decisions"
        ],
        correctAnswer: "They may produce biased results if trained on biased data",
        explanation: "AI systems depend heavily on the quality and fairness of their training data."
      }
    ]
  },

  machineLearning: {
    title: "Machine Learning Quiz",
    description: "Test your understanding of machine learning principles.",
    questions: [
      {
        id: 1,
        level: "beginner",
        question: "What is Machine Learning?",
        options: [
          "A method where computers learn patterns from data",
          "A method for designing posters",
          "A rule that blocks all data",
          "A hardware repair process"
        ],
        correctAnswer: "A method where computers learn patterns from data",
        explanation: "Machine Learning enables systems to improve performance by learning from data."
      },
      {
        id: 2,
        level: "beginner",
        question: "What is the difference between training data and testing data?",
        options: [
          "Training data teaches the model, while testing data evaluates it",
          "Both are always unused",
          "Testing data is used to delete the model",
          "Training data is only for decoration"
        ],
        correctAnswer: "Training data teaches the model, while testing data evaluates it",
        explanation: "Training data is used for learning, while testing data checks how well the model performs."
      },
      {
        id: 3,
        level: "intermediate",
        question: "Which problem is suitable for classification?",
        options: [
          "Predicting whether an email is spam or not spam",
          "Calculating the size of a folder",
          "Changing screen brightness",
          "Renaming a document"
        ],
        correctAnswer: "Predicting whether an email is spam or not spam",
        explanation: "Classification predicts categories or labels."
      },
      {
        id: 4,
        level: "intermediate",
        question: "What does overfitting mean?",
        options: [
          "A model performs well on training data but poorly on new data",
          "A model has no data",
          "A model runs without any input",
          "A model is always perfect"
        ],
        correctAnswer: "A model performs well on training data but poorly on new data",
        explanation: "Overfitting happens when a model memorizes training data instead of learning general patterns."
      },
      {
        id: 5,
        level: "advanced",
        question: "Why do we evaluate a machine learning model?",
        options: [
          "To measure how accurately it performs on unseen data",
          "To make the dataset disappear",
          "To stop the computer permanently",
          "To avoid using results"
        ],
        correctAnswer: "To measure how accurately it performs on unseen data",
        explanation: "Evaluation helps determine whether the model is reliable and useful."
      }
    ]
  },

  pythonBasics: {
    title: "Python Programming Quiz",
    description: "Test your university-level Python fundamentals.",
    questions: [
      {
        id: 1,
        level: "beginner",
        question: "Which data type is most suitable for storing multiple values in order?",
        options: [
          "List",
          "Boolean",
          "Integer",
          "String only"
        ],
        correctAnswer: "List",
        explanation: "A list stores multiple values in an ordered collection."
      },
      {
        id: 2,
        level: "beginner",
        question: "What is the purpose of an if statement in Python?",
        options: [
          "To make decisions based on conditions",
          "To permanently delete variables",
          "To import images only",
          "To stop all code from running"
        ],
        correctAnswer: "To make decisions based on conditions",
        explanation: "An if statement allows a program to execute code depending on whether a condition is true."
      },
      {
        id: 3,
        level: "beginner",
        question: "Why are functions useful in programming?",
        options: [
          "They allow code reuse and better organization",
          "They make code impossible to read",
          "They remove all variables",
          "They only work without inputs"
        ],
        correctAnswer: "They allow code reuse and better organization",
        explanation: "Functions help avoid repetition and make programs easier to manage."
      },
      {
        id: 4,
        level: "intermediate",
        question: "What will a loop help a programmer do?",
        options: [
          "Repeat a block of code efficiently",
          "Close the laptop",
          "Change font color only",
          "Remove all logic"
        ],
        correctAnswer: "Repeat a block of code efficiently",
        explanation: "Loops are used to repeat tasks without writing the same code many times."
      },
      {
        id: 5,
        level: "intermediate",
        question: "Which statement best describes a variable?",
        options: [
          "A named storage location for data",
          "A type of computer screen",
          "A fixed paragraph in an essay",
          "An error message"
        ],
        correctAnswer: "A named storage location for data",
        explanation: "A variable stores values that can be used and updated in a program."
      }
    ]
  }
};
  const activeQuiz = selectedQuiz ? quizCategories[selectedQuiz] : null;
  
  const activeQuestions = activeQuiz
    ? activeQuiz.questions.filter((q) =>
        allowedLevels[learningLevel || "beginner"]?.includes(q.level)
      )
    : [];

  const getAnswerKey = (questionId) => `${selectedQuiz}_${learningLevel}_${questionId}`;

  const handleAnswerChange = (id, ans) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [getAnswerKey(id)]: ans
    }));
  };

  const getScore = () => {
    return activeQuestions.reduce((acc, q) => {
      const userAnswer = quizAnswers[getAnswerKey(q.id)];
      return acc + (userAnswer === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleSubmit = async () => {
    const percent = Math.round((getScore() / activeQuestions.length) * 100);

    if (onSubmitQuiz) onSubmitQuiz(percent);

    const user = auth.currentUser;

    const name =
      localStorage.getItem("name") ||
      localStorage.getItem("username") ||
      user?.email ||
      "Student";

    const level = learningLevel || "beginner";

    try {
      // ✅ 1. Save quiz history
      await addDoc(collection(db, "quizResults"), {
        uid: user?.uid || "guest",
        name,
        email: user?.email || "",
        score: percent,
        level,
        subject: activeQuiz?.title,
        createdAt: serverTimestamp()
      });

      // ✅ 2. Save leaderboard ikut level + user
      const attemptNo = Number(localStorage.getItem(`${selectedQuiz}_${level}_attempt`)) + 1 || 1;

      localStorage.setItem(`${selectedQuiz}_${level}_attempt`, attemptNo);

      const leaderboardRef = doc(
        db,
        "leaderboard",
        `${selectedQuiz}_${level}_${name}_${attemptNo}_${Date.now()}`
      );

      await setDoc(leaderboardRef, {
        uid: user?.uid || "guest",
        name,
        email: user?.email || "",
        score: percent,
        level, 
        learningLevel: level,
        quizId: selectedQuiz,
        subject: activeQuiz?.title || "Unknown",
        attemptNo: attemptNo,
        createdAt: serverTimestamp()
      });

      // 🔥 PROGRESS TRACKING
const practical = practicalScore || 0;

const assessment = practical
  ? Math.round((percent + practical) / 2)
  : percent;

const progressRef = doc(
  db,
  "progressTracking",
  `${user?.uid || name}_${selectedQuiz}_${level}`
);

await setDoc(
  progressRef,
  {
    uid: user?.uid || "guest",
    name,
    email: user?.email || "",

    level,
    learningLevel: level,

    quizId: selectedQuiz,
    subject: activeQuiz?.title || "Unknown",

    quizScore: percent,
    practicalScore: practical,
    assessment,

    totalQuestions: activeQuestions.length,
    completedQuestions: activeQuestions.length,
    progressPercent: 100,
    status: "Completed",

    updatedAt: serverTimestamp()
  },
  { merge: true }
);

// 🔥 WEAKNESS TRACKING
const wrongQuestions = activeQuestions
  .filter((q) => quizAnswers[getAnswerKey(q.id)] !== q.correctAnswer)
  .map((q) => ({
    questionId: q.id,
    question: q.question,
    selectedAnswer: quizAnswers[getAnswerKey(q.id)] || "Not answered",
    correctAnswer: q.correctAnswer,
    level: q.level,
    explanation: q.explanation
  }));

const weaknessStatus =
  percent >= 80
    ? "Strong"
    : percent >= 60
    ? "Moderate"
    : "Weak";

const recommendation =
  percent >= 80
    ? "You are doing well. Try a higher level quiz."
    : percent >= 60
    ? "Review the questions you answered incorrectly."
    : "You need more revision for this topic.";

const weaknessRef = doc(
  db,
  "weaknessTracking",
  `${user?.uid || name}_${selectedQuiz}_${level}`
);

await setDoc(
  weaknessRef,
  {
    uid: user?.uid || "guest",
    name,
    email: user?.email || "",

    quizId: selectedQuiz,
    subject: activeQuiz?.title || "Unknown",
    level,
    learningLevel: level,

    score: percent,
    weaknessStatus,
    wrongCount: wrongQuestions.length,
    totalQuestions: activeQuestions.length,
    wrongQuestions,
    recommendation,

    updatedAt: serverTimestamp()
  },
  { merge: true }
);

// 🔥 PERFORMANCE HISTORY
await addDoc(collection(db, "performanceHistory"), {
  uid: user?.uid || "guest",
  name,
  email: user?.email || "",

  level,
  learningLevel: level,

  quizId: selectedQuiz,
  subject: activeQuiz?.title || "Unknown",

  score: percent,
  quizScore: percent,
  practicalScore: practical,
  assessment,

  attemptNo: attemptNo,
  totalQuestions: activeQuestions.length,

  createdAt: serverTimestamp()
});

      if (updateLeaderboard) {
        updateLeaderboard(name, percent, level);
      }
      
      setQuizSubmitted(true);

      console.log("✅ Quiz result, leaderboard and progress saved");
    } catch (error) {
      console.error("❌ Error saving quiz:", error);
    }
  };

  // ✅ STEP 1: SHOW CATEGORY LIST
  if (!selectedQuiz) {
    return (
      <div className="quiz-page-wrapper">
        <div className="quiz-container-box">
         <h2 style={{ marginBottom: "20px" }}>✨ Choose Your Quiz to Test Your Knowledge !</h2>

<div
  style={{
    maxWidth: "900px",
    margin: "30px auto 0",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "22px",
    padding: "0 20px"
  }}
>
  {Object.keys(quizCategories).map((key) => (
    <button
      key={key}
      onClick={() => {
        setSelectedQuiz(key);
        setQuizAnswers({});
        setQuizSubmitted(false);
      }}
      style={{
        border: "2px solid #e9d5ff",
        borderRadius: "24px",
        padding: "24px",
        background: "linear-gradient(135deg, #f6edff, #efe4ff)",
        boxShadow: "0 12px 28px rgba(124, 58, 237, 0.14)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        textAlign: "left",
        cursor: "pointer",
        color: "#2f235f"
      }}
    >
      <span
  style={{
    width: "56px",
    height: "56px",
    borderRadius: "18px",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px"
  }}
>
  {key === "dataScience" && "📊"}
  {key === "artificialIntelligence" && "🤖"}
  {key === "machineLearning" && "🧠"}
  {key === "pythonBasics" && "🐍"}
</span>

      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800" }}>
          {quizCategories[key].title}
        </h3>
        <p style={{ margin: "6px 0 0", color: "#7c6aa8", fontSize: "14px" }}>
          {
            quizCategories[key].questions.filter((q) =>
              allowedLevels[learningLevel || "beginner"]?.includes(q.level)
            ).length
          } questions • Test your skills
        </p>
      </div>

      <span style={{ fontSize: "30px", fontWeight: "800", color: "#8b5cf6" }}>
        ›
      </span>
    </button>
  ))}
</div>
        </div>
      </div>
    );
  }

  // ✅ STEP 2: SHOW QUESTIONS
  return (
    <div className="quiz-page-wrapper">
      <div style={{ marginBottom: "15px" }}>
        <button
          className="back-btn"
          onClick={() => {
            setSelectedQuiz(null);
            setQuizAnswers({});
            setQuizSubmitted(false);
          }}
        >
          ← Back
        </button>
      </div>
      <div className="quiz-container-box">

        <p style={{ textAlign: "center", marginBottom: "10px" }}>
          Current Level: <strong>{learningLevel}</strong>
        </p>

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {activeQuiz.title}
        </h2>

        {activeQuestions.map((q, i) => (
          <div key={q.id} className="quiz-question-card">
            <h3>{i + 1}. {q.question}</h3>

            <div className="mcq-option-list">
 <div
  style={{
    display: "grid",
    gap: "14px",
    marginTop: "18px",
    textAlign: "left"
  }}
>
  {q.options.map((opt, optIndex) => {
    const letters = ["A", "B", "C", "D"];
    const isSelected = quizAnswers[getAnswerKey(q.id)] === opt;
    const isCorrect = opt === q.correctAnswer;
    const isWrongSelected = quizSubmitted && isSelected && !isCorrect;
    const showCorrect = quizSubmitted && isCorrect;

    return (
      <label
        key={opt}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "16px 18px",
          borderRadius: "18px",
          border: showCorrect
            ? "2px solid #22C55E"
            : isWrongSelected
            ? "2px solid #EF4444"
            : isSelected
            ? "2px solid #7C3AED"
            : "2px solid #E9D5FF",

          background: showCorrect
            ? "#DCFCE7"
            : isWrongSelected
            ? "#FEE2E2"
            : isSelected
            ? "#EDE9FE"
            : "#FFFFFF",
          cursor: quizSubmitted ? "not-allowed" : "pointer",
          boxShadow: isSelected
            ? "0 8px 20px rgba(124, 58, 237, 0.18)"
            : "0 6px 16px rgba(124, 58, 237, 0.08)"
        }}
      >
        <input
          type="radio"
          name={`question-${q.id}`}
          checked={isSelected}
          onChange={() => handleAnswerChange(q.id, opt)}
          disabled={quizSubmitted}
          style={{ display: "none" }}
        />

        <span
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: isSelected ? "#7C3AED" : "#EDE9FE",
            color: isSelected ? "white" : "#7C3AED",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            flexShrink: 0
          }}
        >
          {letters[optIndex]}
        </span>

        <span
          style={{
            fontSize: "15px",
            fontWeight: "500",
            color: "#2F235F",
            lineHeight: "1.5"
          }}
        >
          {opt}
        </span>
      </label>
    );
  })}
</div>
</div>

{quizSubmitted && (
  <div
    style={{
      marginTop: "16px",
      padding: "14px",
      borderRadius: "14px",
      background:
        quizAnswers[getAnswerKey(q.id)] === q.correctAnswer ? "#DCFCE7" : "#FEE2E2",

      color:
        quizAnswers[getAnswerKey(q.id)] === q.correctAnswer ? "#166534" : "#991B1B",
      textAlign: "left"
    }}
  >
    <strong>
      {quizAnswers[getAnswerKey(q.id)] === q.correctAnswer ? "Correct!" : "Wrong Answer"}
    </strong>

    <p style={{ marginTop: "8px" }}>
      Correct answer: <strong>{q.correctAnswer}</strong>
    </p>

    <p style={{ marginTop: "6px" }}>{q.explanation}</p>
  </div>
)}
          </div>
        ))}

        {!quizSubmitted ? (
          <button
            onClick={handleSubmit}
            className="hero-button"
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "600"
            }}
          >
            Submit Quiz
          </button>
        ) : (
          <>
            <h3>Score: {getScore()} / {activeQuestions.length}</h3>
            <button
              onClick={() => {
                setQuizAnswers({});
                setQuizSubmitted(false);
              }}
              className="hero-button"
              style={{
                marginTop: "15px",
                width: "100%",
                padding: "14px",
                fontSize: "16px",
                fontWeight: "600"
              }}
            >
              Try Again
            </button>

            {/* ✅ LEADERBOARD */}
            <LeaderboardPage
              learningLevel={learningLevel || "beginner"}
              selectedQuiz={selectedQuiz}
              showLeaderboard={true}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default QuizPage;