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
import "../App.css";
import LeaderboardPage from "./LeaderboardPage.jsx";

function PerformancePage({ studentData, leaderboard, learningLevel }) {
  const [selectedMetric, setSelectedMetric] = useState("quiz");
  const [mainTab, setMainTab] = useState("performance");
  const studentName =
  localStorage.getItem("name") ||
  localStorage.getItem("username") ||
  "Student";
const level = learningLevel || "beginner";
const scoreKey = `quizScores_${studentName}_${level}`;
const attemptKey = `quizAttempts_${studentName}_${level}`;
const savedQuizScores = JSON.parse(localStorage.getItem(scoreKey)) || {};
const savedAttempts = JSON.parse(localStorage.getItem(attemptKey)) || {};
const quizSource =
  Object.keys(savedQuizScores).length > 0 ? savedQuizScores : savedAttempts;

const quizNameMap = {
  dataScience: "Data Science Quiz",
  artificialIntelligence: "Artificial Intelligence Quiz",
  machineLearning: "Machine Learning Quiz",
  pythonBasics: "Python Programming Quiz"
};

const quizScoreList = Object.entries(quizSource).map(([key, value]) => ({
  ...value,
  quizTitle:
    value.quizTitle ||
    value.subject ||
    value.quizId ||
    quizNameMap[key] ||
    "Unknown Quiz"
}));
  const quiz = studentData?.quizScore ?? 0;
  const practical = studentData?.practicalScore ?? 0;
  const average = Math.round((quiz + practical) / 2);

  const chartData = [
    { name: "Quiz", score: quiz },
    { name: "Practical", score: practical },
    { name: "Average", score: average },
  ];

  const derivedCorrectAnswers = Math.round((quiz / 100) * 3);
  const derivedWrongAnswers = 3 - derivedCorrectAnswers;

  return (
    <div className="app module-page" style={{ padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2 className="main-title">Performance Report</h2>
        <p className="hero-subtitle">Visualizing your learning journey</p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <button
          className="hero-button"
          onClick={() => setMainTab("performance")}
          style={{
            opacity: mainTab === "performance" ? 1 : 0.6,
          }}
        >
          📊 Performance
        </button>

        <button
          className="hero-button"
          onClick={() => setMainTab("leaderboard")}
          style={{
            opacity: mainTab === "leaderboard" ? 1 : 0.6,
          }}
        >
          🏅 Leaderboard
        </button>
      </div>

      {mainTab === "leaderboard" && (
        <LeaderboardPage learningLevel={learningLevel || "beginner"} />
      )}

      {mainTab === "performance" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <button
  className="module-card"
  style={{
    border: selectedMetric === "quiz" ? "2px solid #7C3AED" : "none",
    cursor: "pointer",
    textAlign: "left"
  }}
  onClick={() => setSelectedMetric("quiz")}
>
  <h3 className="section-title" style={{ textAlign: "center" }}>
    Quiz Score Details
  </h3>

  {quizScoreList.length === 0 ? (
    <p style={{ textAlign: "center", color: "#6b7280" }}>
      No quiz records yet.
    </p>
  ) : (
    <div style={{ display: "grid", gap: "10px" }}>
      {quizScoreList.map((item) => (
        <div
          key={item.quizTitle}
          style={{
            background: "#F5F3FF",
            borderRadius: "14px",
            padding: "12px",
            border: "1px solid #E9D5FF"
          }}
        >
          <strong style={{ color: "#4C1D95", display: "block", marginBottom: "6px" }}>
          {item.quizTitle || item.subject || item.quizId || "Unknown Quiz"}
        </strong>

          <p style={{ margin: "6px 0 0" }}>
            Highest: <strong>{item.bestScore}%</strong>
          </p>

          <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
            Last attempt: {item.lastScore}%
          </p>
        </div>
      ))}
    </div>
  )}
</button>

            <button
              className="module-card"
              style={{
                border:
                  selectedMetric === "practical"
                    ? "2px solid #7C3AED"
                    : "none",
                cursor: "pointer",
              }}
              onClick={() => setSelectedMetric("practical")}
            >
              <h3 className="section-title">Practical</h3>
              <p className="main-title" style={{ fontSize: "32px" }}>
                {practical}%
              </p>
            </button>

            <button
              className="module-card"
              style={{
                border:
                  selectedMetric === "difficulty"
                    ? "2px solid #7C3AED"
                    : "none",
                cursor: "pointer",
              }}
              onClick={() => setSelectedMetric("difficulty")}
            >
              <h3 className="section-title">Level</h3>
              <p className="main-title" style={{ fontSize: "32px" }}>
                {studentData?.difficultyLevel || "Medium"}
              </p>
            </button>
          </div>
              
          <div className="module-card" style={{ marginBottom: "30px" }}>
            <h3 className="section-title">
    
              {selectedMetric.toUpperCase()} Details
            </h3>

            <hr style={{ opacity: 0.1, margin: "15px 0" }} />

              <h3 className="section-title">
               Quiz History
          </h3>

            {selectedMetric === "quiz" && (
        <div>
          {quizScoreList.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No quiz records yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "14px", marginTop: "10px" }}>
              {quizScoreList.map((item) => (
                <div
                  key={item.quizTitle}
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    background: "#F5F3FF",
                    border: "1px solid #E9D5FF"
                  }}
          >
            <h4 style={{ margin: "0 0 8px", color: "#4C1D95" }}>
              {item.quizTitle}
            </h4>

            <p>
              <strong>Highest Score:</strong> {item.bestScore}%
            </p>

            <p>
              <strong>Last Attempt:</strong> {item.lastScore}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

            {selectedMetric === "practical" && (
              <p>
                Applied understanding based on your latest assignment.{" "}
                <strong>{practical}%</strong>
              </p>
            )}

            {selectedMetric === "difficulty" && (
              <p>
                Current system adaptive level:{" "}
                <strong>{studentData?.difficultyLevel || "Medium"}</strong>
              </p>
            )}
          </div>

          <div className="module-card">
            <h3 className="section-title">Performance Chart</h3>

            <div style={{ width: "100%", height: 320, marginTop: "20px" }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  key={`chart-${quiz}-${practical}`}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#4b5563", fontSize: 12 }}
                    axisLine={{ stroke: "#d1d5db" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#4b5563", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(124, 58, 237, 0.08)" }}
                    formatter={(value) => [`${value}%`, "Score"]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="#7C3AED"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {quiz === 0 && practical === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "#9ca3af",
                  marginTop: "10px",
                }}
              >
                No quiz or practical score yet. Complete a quiz to see the chart.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PerformancePage;