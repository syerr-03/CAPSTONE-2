import React, { useState } from "react";
import "../App.css";

function QuizPage({
  title = "Data Science Quiz",
  content,
  onSubmitQuiz,
  quizScore = 0,
  difficultyLevel = "Medium",
  practicalScore = null
}) {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const defaultQuestions = [
    {
      id: 1,
      question: "What is the primary language used in Data Science?",
      options: ["Java", "Python", "C++", "HTML"],
      correctAnswer: "Python",
      explanation: "Python is widely used due to its rich libraries like Pandas and Scikit-Learn."
    },
    {
      id: 2,
      question: "What does EDA stand for?",
      options: [
        "Exploratory Data Analysis",
        "Every Day Analysis",
        "External Data Assets",
        "Efficient Data Access"
      ],
      correctAnswer: "Exploratory Data Analysis",
      explanation: "EDA is the process of investigating datasets to summarize their main characteristics."
    }
  ];

  const activeQuestions = content?.questions || defaultQuestions;

  const handleAnswerChange = (questionId, answer) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const getQuizScore = () => {
    return activeQuestions.reduce((score, q) => {
      return score + (quizAnswers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);

    const scoreValue = getQuizScore();
    const total = activeQuestions.length;
    const percent = Math.round((scoreValue / total) * 100);

    if (onSubmitQuiz) {
      onSubmitQuiz(percent);
    }
  };

  const currentScore = getQuizScore();

  return (
    <div className="quiz-page-wrapper">
      <div className="quiz-container-box">

        <div className="quiz-page-header no-back">
          <div>
            <p className="quiz-small-label">Assessment</p>
            <h1 className="quiz-page-title">{title}</h1>
          </div>
        </div>

        <div className="quiz-main-card">
          {activeQuestions.map((q, index) => (
            <div key={q.id} className="quiz-question-card">
              <h3 className="quiz-question-title">
                {index + 1}. {q.question}
              </h3>

              <div className="quiz-options-grid">
                {q.options.map((option) => {
                  const isSelected = quizAnswers[q.id] === option;

                  return (
                    <label
                      key={option}
                      className={`quiz-answer-card ${isSelected ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(q.id, option)}
                        disabled={quizSubmitted}
                      />

                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div
                  className={
                    quizAnswers[q.id] === q.correctAnswer
                      ? "quiz-feedback-correct"
                      : "quiz-feedback-wrong"
                  }
                >
                  {quizAnswers[q.id] === q.correctAnswer ? (
                    <p>
                      <strong>Correct!</strong> Good job.
                    </p>
                  ) : (
                    <>
                      <p>
                        <strong>Wrong Answer.</strong>
                      </p>
                      <p>
                        <strong>Correct:</strong> {q.correctAnswer}
                      </p>
                      <p>
                        <strong>Why:</strong> {q.explanation}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {!quizSubmitted ? (
            <button className="quiz-submit-button" onClick={handleQuizSubmit}>
              Submit Quiz
            </button>
          ) : (
            <div className="quiz-result-card">
              <h3>Quiz Results</h3>

              <p className="quiz-score-text">
                {currentScore} / {activeQuestions.length}
              </p>

              <p>
                <strong>Percentage:</strong>{" "}
                {Math.round((currentScore / activeQuestions.length) * 100)}%
              </p>
              <p>
                <strong>Difficulty Level:</strong> {difficultyLevel}
              </p>

              {practicalScore === null && (
                <p className="quiz-note">
                  Complete the practical assignment for adaptive feedback.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;