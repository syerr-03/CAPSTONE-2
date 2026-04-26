import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import '../App.css'; // Pastikan import CSS utama

function PerformancePage({ studentData }) {
  const [selectedMetric, setSelectedMetric] = useState("quiz");

  // Guna ?. (Optional Chaining) supaya tak crash kalau data tak ada
  const chartData = [
    { name: "Quiz", score: studentData?.quizScore || 0 },
    { name: "Practical", score: studentData?.practicalScore || 0 },
    { name: "Average", score: ((studentData?.quizScore || 0) + (studentData?.practicalScore || 0)) / 2 },
  ];

  const derivedCorrectAnswers = Math.round(((studentData?.quizScore || 0) / 100) * 3);
  const derivedWrongAnswers = 3 - derivedCorrectAnswers;

  return (
    <div className="app module-page" style={{ padding: '20px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 className="main-title">Performance Report</h2>
        <p className="hero-subtitle">Visualizing your learning journey</p>
      </div>

      {/* STATS GRID - Guna module-card style */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        <button 
          className="module-card" 
          style={{ border: selectedMetric === 'quiz' ? '2px solid #7C3AED' : 'none', cursor: 'pointer' }}
          onClick={() => setSelectedMetric("quiz")}
        >
          <h3 className="section-title">Quiz Score</h3>
          <p className="main-title" style={{ fontSize: '32px' }}>{studentData?.quizScore || 0}%</p>
        </button>

        <button 
          className="module-card" 
          style={{ border: selectedMetric === 'practical' ? '2px solid #7C3AED' : 'none', cursor: 'pointer' }}
          onClick={() => setSelectedMetric("practical")}
        >
          <h3 className="section-title">Practical</h3>
          <p className="main-title" style={{ fontSize: '32px' }}>{studentData?.practicalScore || 0}%</p>
        </button>

        <button 
          className="module-card" 
          style={{ border: selectedMetric === 'difficulty' ? '2px solid #7C3AED' : 'none', cursor: 'pointer' }}
          onClick={() => setSelectedMetric("difficulty")}
        >
          <h3 className="section-title">Level</h3>
          <p className="main-title" style={{ fontSize: '32px' }}>{studentData?.difficultyLevel || "Medium"}</p>
        </button>
      </div>

      {/* DETAILS CARD */}
      <div className="module-card" style={{ marginBottom: '30px' }}>
        <h3 className="section-title">{selectedMetric.toUpperCase()} Details</h3>
        <hr style={{ opacity: 0.1, margin: '15px 0' }} />
        
        {selectedMetric === "quiz" && (
          <div>
            <p><strong>Correct:</strong> {derivedCorrectAnswers} / 3</p>
            <p><strong>Wrong:</strong> {derivedWrongAnswers} / 3</p>
          </div>
        )}

        {selectedMetric === "practical" && (
          <p>Applied understanding based on your latest assignment.</p>
        )}

        {selectedMetric === "difficulty" && (
          <p>Current system adaptive level: <strong>{studentData?.difficultyLevel}</strong></p>
        )}
      </div>

      {/* CHART */}
      <div className="module-card">
        <h3 className="section-title">Performance Chart</h3>
        <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#7C3AED" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default PerformancePage;