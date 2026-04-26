import React, { useState } from "react";

function ProgressPage({ studentData }) {
  const [selectedSection, setSelectedSection] = useState("overview");

  if (!studentData.hasProgress) {
    return (
      <div className="page-wrapper">
        <div className="hero-section">
          <h2 className="main-title">Track Progress</h2>
          <p className="subtitle-text">
            View streaks, completed content, quiz scores, and learning progress.
          </p>
        </div>

        <div className="empty-state-card">
          <h3 className="card-title">No progress yet!</h3>
          <p className="content-text">
            The student has not completed any learning activity yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="hero-section">
        <h2 className="main-title">Track Progress</h2>
        <p className="subtitle-text">
          Click any card below to view more details.
        </p>
      </div>

      <div className="dashboard-card white-card progress-hero-card">
        <div className="metric-row">
          <span className="content-text">Overall Progress</span>
          <span className="big-number">{studentData.progressPercent}%</span>
        </div>
        <div className="progress-strip">
          <div
            className="progress-strip-fill"
            style={{ width: `${studentData.progressPercent}%` }}
          ></div>
        </div>
        <p className="small-text">
          {studentData.completedModules} of {studentData.totalModules} learning items completed
        </p>
      </div>

      <div className="stats-grid">
        <button
          className={`info-card clickable-card purple-soft ${
            selectedSection === "overview" ? "selected-card" : ""
          }`}
          onClick={() => setSelectedSection("overview")}
        >
          <h3 className="section-title">Overview</h3>
          <p className="big-number">{studentData.progressPercent}%</p>
          <p className="small-text">Completion progress</p>
        </button>

        <button
          className={`info-card clickable-card white-card ${
            selectedSection === "completed" ? "selected-card" : ""
          }`}
          onClick={() => setSelectedSection("completed")}
        >
          <h3 className="section-title">Completed Content</h3>
          <p className="big-number">
            {studentData.completedModules} / {studentData.totalModules}
          </p>
          <p className="small-text">Click to see completed content</p>
        </button>

        <button
          className={`info-card clickable-card white-card ${
            selectedSection === "scores" ? "selected-card" : ""
          }`}
          onClick={() => setSelectedSection("scores")}
        >
          <h3 className="section-title">Assessment</h3>
          <p className="big-number">{studentData.averageScore}%</p>
          <p className="small-text">Quiz + practical performance</p>
        </button>
      </div>

      {selectedSection === "overview" && (
        <div className="dashboard-card white-card detail-card">
          <h3 className="section-title">Progress Overview</h3>
          <div className="divider"></div>

          <div className="mini-grid">
            <div className="mini-stat-box">
              <p className="small-text">Learning Streak</p>
              <p className="metric-value">{studentData.streak} days</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Difficulty Level</p>
              <p className="metric-value">{studentData.difficultyLevel}</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Quiz Score</p>
              <p className="metric-value">{studentData.quizScore}%</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Practical Score</p>
              <p className="metric-value">{studentData.practicalScore}%</p>
            </div>
          </div>

          <div className="divider"></div>
          <h3 className="section-title">Feedback</h3>
          <p className="content-text">{studentData.adaptiveMessage}</p>
        </div>
      )}

      {selectedSection === "completed" && (
        <div className="dashboard-card white-card detail-card">
          <h3 className="section-title">Completed Content List</h3>
          <div className="divider"></div>

          {studentData.completedContent.map((item, index) => (
            <div className="list-row" key={index}>
              <div>
                <p className="content-text">
                  <strong>{item.title}</strong>
                </p>
                <p className="small-text">{item.type}</p>
              </div>
              <span className="status-pill strong-pill">Completed</span>
            </div>
          ))}
        </div>
      )}

      {selectedSection === "scores" && (
        <div className="dashboard-card white-card detail-card">
          <h3 className="section-title">Assessment Details</h3>
          <div className="divider"></div>

          <div className="mini-grid">
            <div className="mini-stat-box">
              <p className="small-text">Quiz Score</p>
              <p className="metric-value">{studentData.quizScore}%</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Practical Score</p>
              <p className="metric-value">{studentData.practicalScore}%</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Average Score</p>
              <p className="metric-value">{studentData.averageScore}%</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Current Difficulty</p>
              <p className="metric-value">{studentData.difficultyLevel}</p>
            </div>
          </div>

          <div className="divider"></div>
          <h3 className="section-title">Recent Quiz Scores</h3>

          {studentData.recentQuizScores.map((item, index) => (
            <div className="list-row" key={index}>
              <span className="content-text">{item.quiz}</span>
              <span className="score-badge">{item.score}%</span>
            </div>
          ))}

          <div className="divider"></div>
          <h3 className="section-title">Weak Areas</h3>
          {studentData.weakTopics.map((area, index) => (
            <div className="tag-item" key={index}>
              {area}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProgressPage;