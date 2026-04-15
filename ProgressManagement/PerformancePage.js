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

function PerformancePage({ studentData }) {
  const [selectedMetric, setSelectedMetric] = useState("quiz");

  const chartData = [
    { name: "Quiz", score: studentData.quizScore },
    { name: "Practical", score: studentData.practicalScore },
    { name: "Average", score: studentData.averageScore },
  ];

  const derivedCorrectAnswers = Math.round((studentData.quizScore / 100) * 3);
  const derivedWrongAnswers = 3 - derivedCorrectAnswers;

  return (
    <div className="page-wrapper">
      <div className="hero-section">
        <h2 className="main-title">Performance Report</h2>
        <p className="subtitle-text">
          Click the cards below to view detailed performance evaluation.
        </p>
      </div>

      <div className="stats-grid">
        <button
          className={`info-card clickable-card white-card ${
            selectedMetric === "quiz" ? "selected-card" : ""
          }`}
          onClick={() => setSelectedMetric("quiz")}
        >
          <h3 className="section-title">Quiz Score</h3>
          <p className="big-number">{studentData.quizScore}%</p>
          <p className="small-text">Click to view quiz evaluation</p>
        </button>

        <button
          className={`info-card clickable-card white-card ${
            selectedMetric === "practical" ? "selected-card" : ""
          }`}
          onClick={() => setSelectedMetric("practical")}
        >
          <h3 className="section-title">Practical Score</h3>
          <p className="big-number">{studentData.practicalScore}%</p>
          <p className="small-text">Click to view practical evaluation</p>
        </button>

        <button
          className={`info-card clickable-card purple-soft ${
            selectedMetric === "difficulty" ? "selected-card" : ""
          }`}
          onClick={() => setSelectedMetric("difficulty")}
        >
          <h3 className="section-title">Difficulty Level</h3>
          <p className="big-number">{studentData.difficultyLevel}</p>
          <p className="small-text">Click to view adaptive feedback</p>
        </button>
      </div>

      {selectedMetric === "quiz" && (
        <div className="dashboard-card white-card detail-card">
          <h3 className="section-title">Quiz Score Details</h3>
          <div className="divider"></div>

          <div className="list-row">
            <span className="content-text">Quiz Score Percentage</span>
            <span className="score-badge">{studentData.quizScore}%</span>
          </div>

          <div className="list-row">
            <span className="content-text">Correct Answers</span>
            <span className="status-pill strong-pill">
              {derivedCorrectAnswers} / 3
            </span>
          </div>

          <div className="list-row">
            <span className="content-text">Wrong Answers</span>
            <span className="status-pill weak-pill">
              {derivedWrongAnswers} / 3
            </span>
          </div>

          <div className="divider"></div>
          <h3 className="section-title">Weak Topics</h3>

          {studentData.weakTopics.map((topic, index) => (
            <div className="list-row" key={index}>
              <span className="content-text">{topic}</span>
              <span className="status-pill weak-pill">Needs Improvement</span>
            </div>
          ))}
        </div>
      )}

      {selectedMetric === "practical" && (
        <div className="dashboard-card white-card detail-card">
          <h3 className="section-title">Practical Score Details</h3>
          <div className="divider"></div>

          <div className="list-row">
            <span className="content-text">Practical Score Percentage</span>
            <span className="score-badge">{studentData.practicalScore}%</span>
          </div>

          <div className="list-row">
            <span className="content-text">Performance Category</span>
            <span className="status-pill strong-pill">
              {studentData.practicalScore >= 80
                ? "Strong"
                : studentData.practicalScore >= 60
                ? "Moderate"
                : "Needs Improvement"}
            </span>
          </div>

          <div className="divider"></div>
          <p className="content-text">
            This practical result reflects the student’s applied understanding
            and task completion quality based on the assignment submission.
          </p>
        </div>
      )}

      {selectedMetric === "difficulty" && (
        <div className="dashboard-card purple-card detail-card">
          <h3 className="section-title purple-title">Difficulty Level Details</h3>
          <div className="divider purple-divider"></div>

          <div className="list-row">
            <span className="content-text">Current Adaptive Level</span>
            <span className="score-badge">{studentData.difficultyLevel}</span>
          </div>

          <div className="divider purple-divider"></div>
          <h3 className="section-title purple-title">System Adaptive Message</h3>
          <p className="content-text">{studentData.adaptiveMessage}</p>

          <div className="divider purple-divider"></div>
          <p className="content-text">
            This difficulty level is determined by combining quiz score and
            practical score.
          </p>
        </div>
      )}

      <div className="dashboard-card purple-card">
        <h3 className="section-title purple-title">Performance Chart</h3>
        <div className="divider purple-divider"></div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#5f5c78", fontSize: 14 }}
            />
            <YAxis tick={{ fill: "#5f5c78", fontSize: 14 }} />
            <Tooltip />
            <Bar dataKey="score" fill="#7C3AED" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PerformancePage;