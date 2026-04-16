import React, { useState } from 'react';

function QuizPage({
  title,
  content,
  onBack,
  onSubmitQuiz,
  quizScore,
  difficultyLevel,
  practicalScore
}) {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleAnswerChange = (questionId, answer) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const getQuizScore = () => {
    return content.questions.reduce((score, q) => {
      return score + (quizAnswers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);

    const score = getQuizScore();
    const total = content.questions.length;
    const percent = Math.round((score / total) * 100);

    onSubmitQuiz(percent);
  };

  const score = getQuizScore();

  return (
    <div className="content-page">
      <button className="back-button" onClick={onBack}>←</button>
      <h1 className="content-title">{title}</h1>

      <div className="content-card">
        {content.questions.map((q, index) => (
          <div key={q.id} className="quiz-question">
            <h3>{index + 1}. {q.question}</h3>

            <div className="quiz-options">
              {q.options.map((option) => (
                <label key={option} className="quiz-option">
                  <input
                    type="radio"
                    name={q.id}
                    value={option}
                    checked={quizAnswers[q.id] === option}
                    onChange={() => handleAnswerChange(q.id, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            {quizSubmitted && quizAnswers[q.id] !== q.correctAnswer && (
              <div className="quiz-feedback wrong">
                <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                <p><strong>Explanation:</strong> {q.explanation}</p>
              </div>
            )}

            {quizSubmitted && quizAnswers[q.id] === q.correctAnswer && (
              <div className="quiz-feedback correct">
                <p><strong>Correct!</strong> Good job.</p>
              </div>
            )}
          </div>
        ))}

        {!quizSubmitted ? (
          <button className="primary-button" onClick={handleQuizSubmit}>
            Submit Quiz
          </button>
        ) : (
          <div className="quiz-result-box">
            <h3>Your Score: {score} / {content.questions.length}</h3>
            <p className="result-line"><strong>Quiz Score:</strong> {quizScore}%</p>
            <p className="result-line"><strong>Current Difficulty:</strong> {difficultyLevel}</p>
            {practicalScore === null && (
              <p className="adaptive-waiting">
                Complete the practical assignment to get your final adaptive feedback.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;