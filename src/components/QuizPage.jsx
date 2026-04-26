import React, { useState } from 'react';
import '../App.css';

function QuizPage({
  title = "Data Science Quiz",
  content,
  onBack,
  onSubmitQuiz,
  quizScore = 0,
  difficultyLevel = "Medium",
  practicalScore = null
}) {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Data kecemasan jika props 'content' kosong
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
      options: ["Exploratory Data Analysis", "Every Day Analysis", "External Data Assets", "Efficient Data Access"],
      correctAnswer: "Exploratory Data Analysis",
      explanation: "EDA is the process of investigating datasets to summarize their main characteristics."
    }
  ];

  // Gunakan content.questions jika ada, jika tidak guna defaultQuestions
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
    <div className="app module-page" style={{ padding: '20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <button className="tag" onClick={onBack} style={{ cursor: 'pointer', border: 'none' }}>
            ← Back
          </button>
          <h1 className="main-title" style={{ margin: 0, fontSize: '28px' }}>{title}</h1>
        </div>

        <div className="module-card">
          {activeQuestions.map((q, index) => (
            <div key={q.id} style={{ marginBottom: '30px', padding: '15px', borderBottom: '1px solid #eee' }}>
              <h3 className="section-title" style={{ color: '#111827' }}>
                {index + 1}. {q.question}
              </h3>

              <div style={{ display: 'grid', gap: '10px', marginTop: '15px' }}>
                {q.options.map((option) => (
                  <label 
                    key={option} 
                    className="module-card" 
                    style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      padding: '12px', 
                      cursor: 'pointer',
                      backgroundColor: quizAnswers[q.id] === option ? '#f3f0ff' : 'white',
                      border: quizAnswers[q.id] === option ? '1px solid #7C3AED' : '1px solid #e5e7eb'
                    }}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={option}
                      checked={quizAnswers[q.id] === option}
                      onChange={() => handleAnswerChange(q.id, option)}
                      disabled={quizSubmitted}
                    />
                    <span style={{ color: '#374151' }}>{option}</span>
                  </label>
                ))}
              </div>

              {/* Feedback Section */}
              {quizSubmitted && (
                <div style={{ marginTop: '15px', padding: '10px', borderRadius: '8px', backgroundColor: quizAnswers[q.id] === q.correctAnswer ? '#ecfdf5' : '#fef2f2' }}>
                  {quizAnswers[q.id] === q.correctAnswer ? (
                    <p style={{ color: '#059669', margin: 0 }}><strong>Correct!</strong> Good job.</p>
                  ) : (
                    <div style={{ color: '#dc2626' }}>
                      <p style={{ margin: '0 0 5px 0' }}><strong>Wrong Answer.</strong></p>
                      <p style={{ margin: 0, fontSize: '14px' }}><strong>Correct:</strong> {q.correctAnswer}</p>
                      <p style={{ margin: 0, fontSize: '14px' }}><strong>Why:</strong> {q.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {!quizSubmitted ? (
            <button 
              className="hero-button" 
              style={{ width: '100%', padding: '15px' }} 
              onClick={handleQuizSubmit}
            >
              Submit Quiz
            </button>
          ) : (
            <div className="module-card" style={{ backgroundColor: '#111827', color: 'white', textAlign: 'center' }}>
              <h3 style={{ color: '#A78BFA' }}>Quiz Results</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
                {currentScore} / {activeQuestions.length}
              </p>
              <div style={{ textAlign: 'left', display: 'inline-block' }}>
                <p><strong>Percentage:</strong> {Math.round((currentScore / activeQuestions.length) * 100)}%</p>
                <p><strong>Difficulty Level:</strong> {difficultyLevel}</p>
              </div>
              {practicalScore === null && (
                <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '15px' }}>
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