import { useMemo, useState } from "react";
import "../App.css";

function NewQuizSystem({
  module,
  onBack,
  setQuizScore,
  setPracticalScore,
  updateAdaptiveLevel,
  completedItems = [],
  setCompletedItems
}) {
  const topic = module?.title || "What is Data Science?";

  const safeCompletedItems = Array.isArray(completedItems) ? completedItems : [];

  const moduleSections = useMemo(
    () => [
      {
        id: "module1",
        heading: "Fundamentals",
        items: [
          {
            id: "reading-1",
            type: "Reading",
            title: `Master the Basics: What is ${topic}?`
          },
          {
            id: "video-1",
            type: "Video",
            title: `Watch and Learn: ${topic} Overview`
          },
          {
            id: "quiz-1",
            type: "Quiz",
            title: "Test Your Knowledge: Fundamentals Quiz"
          },
          {
            id: "practical-1",
            type: "Practical Assignment",
            title: "Practical Assignment: Basic Data Exploration"
          }
        ]
      },
      {
        id: "module2",
        heading: "Programming Basics",
        items: [
          {
            id: "reading-2",
            type: "Reading",
            title: `Core Concepts of ${topic}`
          },
          {
            id: "video-2",
            type: "Video",
            title: `Intermediate ${topic} Techniques`
          },
          {
            id: "quiz-2",
            type: "Quiz",
            title: "Check Your Understanding"
          },
          {
            id: "practical-2",
            type: "Practical Assignment",
            title: "Mini Exercise"
          }
        ]
      }
    ],
    [topic]
  );

  const allItems = moduleSections.flatMap((section) => section.items);

  const [activeItem, setActiveItem] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [practicalText, setPracticalText] = useState("");
  const [practicalSubmitted, setPracticalSubmitted] = useState(false);

  const markItemCompleted = (itemId) => {
    if (typeof setCompletedItems !== "function") return;

    setCompletedItems((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      return current.includes(itemId) ? current : [...current, itemId];
    });
  };

  const openContent = (item) => {
    setActiveItem(item);
    markItemCompleted(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBackToModuleList = () => {
    setActiveItem(null);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progress = Math.round((safeCompletedItems.length / allItems.length) * 100);

  const quizSets = {
    "quiz-1": [
      {
        id: 1,
        question: `What is the main purpose of learning ${topic}?`,
        options: [
          "To ignore data completely",
          "To understand important concepts and applications",
          "To replace all programming languages",
          "To avoid practical work"
        ],
        correctAnswer: "To understand important concepts and applications",
        explanation:
          "Learning helps understand important concepts and how they are applied in real situations."
      },
      {
        id: 2,
        question: `Which statement best describes ${topic}?`,
        options: [
          "A topic used only for memorizing facts",
          "A field that combines understanding, analysis, and application",
          "Something only graphic designers use",
          "A topic that removes the need for thinking"
        ],
        correctAnswer:
          "A field that combines understanding, analysis, and application",
        explanation:
          "Best understood through concepts, examples, and practical use."
      },
      {
        id: 3,
        question: `Why is practical understanding important in ${topic}?`,
        options: [
          "Because theory is never useful",
          "Because practical work connects ideas to real situations",
          "Because it replaces all study",
          "Because it is only useful during exams"
        ],
        correctAnswer:
          "Because practical work connects ideas to real situations",
        explanation:
          "Practical understanding helps learners apply knowledge with more confidence."
      }
    ],
    "quiz-2": [
      {
        id: 1,
        question: `Which skill is important when learning intermediate ${topic}?`,
        options: [
          "Ignoring examples",
          "Connecting theory with analysis",
          "Avoiding all tools",
          "Skipping practice"
        ],
        correctAnswer: "Connecting theory with analysis",
        explanation:
          "Intermediate learning requires understanding how ideas connect and how to apply them in practice."
      },
      {
        id: 2,
        question: "Why should learners study core concepts more deeply?",
        options: [
          "To build stronger understanding",
          "To make the topic more confusing",
          "To avoid real-world use",
          "To remove the need for problem solving"
        ],
        correctAnswer: "To build stronger understanding",
        explanation:
          "Stronger conceptual understanding helps learners solve problems more effectively."
      },
      {
        id: 3,
        question: "What helps improve understanding at this level?",
        options: [
          "Memorizing without thinking",
          "Examples, reflection, and practice",
          "Skipping all quizzes",
          "Avoiding feedback"
        ],
        correctAnswer: "Examples, reflection, and practice",
        explanation:
          "Examples and practice help learners connect concepts to situations they may face later."
      }
    ]
  };

  const handleAnswerSelect = (quizId, questionId, option) => {
    if (quizSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [`${quizId}-${questionId}`]: option
    }));
  };

  const handleQuizSubmit = () => {
    const quizId = activeItem.id;
    const questions = quizSets[quizId] || [];

    let correct = 0;

    questions.forEach((question) => {
      if (
        selectedAnswers[`${quizId}-${question.id}`] === question.correctAnswer
      ) {
        correct++;
      }
    });

    const percent = questions.length
      ? Math.round((correct / questions.length) * 100)
      : 0;

    setQuizSubmitted(true);
    markItemCompleted(activeItem.id);

    if (typeof setQuizScore === "function") {
      setQuizScore(percent);
    }

    if (typeof updateAdaptiveLevel === "function") {
      updateAdaptiveLevel(percent, null);
    }
  };

  const handlePracticalSubmit = () => {
    setPracticalSubmitted(true);
    markItemCompleted(activeItem.id);

    const percent = practicalText.trim().length > 10 ? 80 : 40;

    if (typeof setPracticalScore === "function") {
      setPracticalScore(percent);
    }

    if (typeof updateAdaptiveLevel === "function") {
      updateAdaptiveLevel(null, percent);
    }
  };

  if (activeItem?.type === "Reading") {
    return (
      <div className="quiz-page">
        <div className="content-card module-content-card">
          <button className="module-back-btn" onClick={goBackToModuleList}>
            ← Back to Module
          </button>

          <h2 className="content-title">{activeItem.title}</h2>

          <div className="reading-block">
            <h3>Introduction</h3>
            <p>{topic} content goes here...</p>
          </div>
        </div>
      </div>
    );
  }

  if (activeItem?.type === "Video") {
    return (
      <div className="quiz-page">
        <div className="content-card module-content-card">
          <button className="module-back-btn" onClick={goBackToModuleList}>
            ← Back to Module
          </button>

          <h2 className="content-title">{activeItem.title}</h2>

          <div className="fake-video-frame">
            <div className="play-button">Play Video</div>
          </div>
        </div>
      </div>
    );
  }

  if (activeItem?.type === "Quiz") {
    const quizId = activeItem.id;
    const questions = quizSets[quizId] || [];

    let correctCount = 0;

    if (quizSubmitted) {
      questions.forEach((question) => {
        if (
          selectedAnswers[`${quizId}-${question.id}`] ===
          question.correctAnswer
        ) {
          correctCount++;
        }
      });
    }

    return (
      <div className="quiz-page">
        <div className="content-card module-content-card">
          <button className="module-back-btn" onClick={goBackToModuleList}>
            ← Back to Module
          </button>

          <h2 className="content-title">{activeItem.title}</h2>

          {questions.map((question) => {
            const answerKey = `${quizId}-${question.id}`;
            const selected = selectedAnswers[answerKey];
            const isCorrect = selected === question.correctAnswer;
            const showWrong = quizSubmitted && selected && !isCorrect;

            return (
              <div className="quiz-block" key={question.id}>
                <h3 className="quiz-question">
                  {question.id}. {question.question}
                </h3>

                <div className="options-list">
                  {question.options.map((option) => (
                    <label className="option-item" key={option}>
                      <input
                        type="radio"
                        name={answerKey}
                        value={option}
                        checked={selected === option}
                        onChange={() =>
                          handleAnswerSelect(quizId, question.id, option)
                        }
                        disabled={quizSubmitted}
                      />

                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                {quizSubmitted && isCorrect && (
                  <div className="correct-box">
                    <p>
                      <strong>Correct!</strong> Good job.
                    </p>
                  </div>
                )}

                {showWrong && (
                  <div className="feedback-box">
                    <p>
                      <strong>Correct Answer:</strong>{" "}
                      {question.correctAnswer}
                    </p>
                    <p>
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {!quizSubmitted ? (
            <button
              className="hero-button"
              style={{ marginTop: "20px", width: "100%" }}
              onClick={handleQuizSubmit}
            >
              Submit Quiz
            </button>
          ) : (
            <div
              className="quiz-result-box"
              style={{ marginTop: "20px", textAlign: "center" }}
            >
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                Score: {correctCount} / {questions.length} (
                {Math.round((correctCount / questions.length) * 100)}%)
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeItem?.type === "Practical Assignment") {
    return (
      <div className="quiz-page">
        <div className="content-card module-content-card">
          <button className="module-back-btn" onClick={goBackToModuleList}>
            ← Back to Module
          </button>

          <h2 className="content-title">{activeItem.title}</h2>

          <p className="practical-intro">
            Complete this simple task based on <strong>{topic}</strong>.
          </p>

          <div className="practical-task-box">
            <h3>Task</h3>

            <ul className="practical-list">
              <li>Write 3 simple points about what you learned from the topic.</li>
              <li>Give 1 real-world example related to the topic.</li>
              <li>Explain in 2 to 3 sentences why this topic is important.</li>
            </ul>
          </div>

          <textarea
            className="assignment-textarea"
            placeholder="Type your answer here..."
            value={practicalText}
            onChange={(event) => setPracticalText(event.target.value)}
            disabled={practicalSubmitted}
          />

          {!practicalSubmitted ? (
            <button
              className="hero-button"
              style={{ marginTop: "16px", width: "100%" }}
              onClick={handlePracticalSubmit}
            >
              Submit Assignment
            </button>
          ) : (
            <div
              className="quiz-result-box"
              style={{ marginTop: "16px", textAlign: "center" }}
            >
              <p>
                <strong>Submitted!</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="content-card module-content-card">
        <button className="module-back-btn" onClick={onBack}>
          ← Back
        </button>

        <div className="quiz-header">
          <h1 className="quiz-main-title">{topic}</h1>

          <div className="progress-row">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <span className="progress-text">{progress}% Completed</span>
          </div>
        </div>

        {moduleSections.map((section, index) => (
          <div
            className="module-section-container"
            key={section.id}
            style={{ position: "relative", marginTop: "16px" }}
          >
            <span
              style={{
                display: "inline-block",
                background: "#7C3AED",
                color: "white",
                padding: "4px 14px",
                borderRadius: "8px 8px 0 0",
                fontSize: "12px",
                fontWeight: "600",
                marginLeft: "10px"
              }}
            >
              Module {index + 1}
            </span>

            <h2
              className="module-heading-text"
              style={{ marginTop: "0px", paddingTop: "10px" }}
            >
              {section.heading}
            </h2>

            <div className="learning-list-wrapper">
              {section.items.map((item) => {
                const isCompleted = safeCompletedItems.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="learning-row-item"
                    onClick={() => openContent(item)}
                  >
                    <div className="learning-info-left">
                      <h3 className="learning-item-title">{item.title}</h3>
                      <p className="learning-item-type">{item.type}</p>
                    </div>

                    <div className="learning-status-right">
                      <span
                        className={`status-pill ${
                          isCompleted ? "pill-completed" : "pill-incomplete"
                        }`}
                      >
                        {isCompleted ? "Completed" : "Incomplete"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewQuizSystem;