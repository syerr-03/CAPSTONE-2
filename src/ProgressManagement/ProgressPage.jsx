import React, { useState } from "react";

function ProgressPage({ studentData = {}, onBack }) {
  const [selectedSection, setSelectedSection] = useState("overview");

  const hasProgress = (studentData.completedModules || 0) > 0;

  if (!hasProgress) {
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
        <p className="subtitle-text">Click any card below to view more details.</p>
      </div>

      <div className="dashboard-card white-card progress-hero-card">
        <div className="metric-row">
          <span className="content-text">Overall Progress</span>
          <span className="big-number">{studentData.progressPercent || 0}%</span>
        </div>

        <div className="progress-strip">
          <div
            className="progress-strip-fill"
            style={{ width: `${studentData.progressPercent || 0}%` }}
          ></div>
        </div>

        <p className="small-text">
          {studentData.completedModules || 0} of {studentData.totalModules || 0} learning items completed
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
          <p className="big-number">{studentData.progressPercent || 0}%</p>
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
            {studentData.completedModules || 0} / {studentData.totalModules || 0}
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
          <p className="big-number">{studentData.averageScore || 0}%</p>
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
              <p className="metric-value">{studentData.streak || 0} days</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Difficulty Level</p>
              <p className="metric-value">{studentData.difficultyLevel || "Medium"}</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Quiz Score</p>
              <p className="metric-value">{studentData.quizScore || 0}%</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Practical Score</p>
              <p className="metric-value">{studentData.practicalScore || 0}%</p>
            </div>
          </div>

          <div className="divider"></div>
          <h3 className="section-title">Feedback</h3>
          <p className="content-text">
            {studentData.adaptiveMessage ||
              "Complete quiz and practical task to get adaptive feedback."}
          </p>
        </div>
      )}

      {selectedSection === "completed" && (
        <div className="dashboard-card white-card detail-card">
          <h3 className="section-title">Completed Content List</h3>
          <div className="divider"></div>

          {(studentData.completedContent || []).length === 0 ? (
            <p className="content-text">No completed content yet.</p>
          ) : (
            (studentData.completedContent || []).map((item, index) => (
              <div className="list-row" key={index}>
                <div>
                  <p className="content-text">
                    <strong>{item.title}</strong>
                  </p>
                  <p className="small-text">{item.type}</p>
                </div>
                <span className="status-pill strong-pill">Completed</span>
              </div>
            ))
          )}
        </div>
      )}

      {selectedSection === "scores" && (
        <div className="dashboard-card white-card detail-card">
          <h3 className="section-title">Assessment Details</h3>
          <div className="divider"></div>

          <div className="mini-grid">
            <div className="mini-stat-box">
              <p className="small-text">Quiz Score</p>
              <p className="metric-value">{studentData.quizScore || 0}%</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Practical Score</p>
              <p className="metric-value">{studentData.practicalScore || 0}%</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Average Score</p>
              <p className="metric-value">{studentData.averageScore || 0}%</p>
            </div>

            <div className="mini-stat-box">
              <p className="small-text">Current Difficulty</p>
              <p className="metric-value">{studentData.difficultyLevel || "Medium"}</p>
            </div>
          </div>

          <div className="divider"></div>
          <h3 className="section-title">Recent Quiz Scores</h3>

          {(studentData.recentQuizScores || []).length === 0 ? (
            <p className="content-text">No quiz scores yet.</p>
          ) : (
            (studentData.recentQuizScores || []).map((item, index) => (
              <div className="list-row" key={index}>
                <span className="content-text">{item.quiz}</span>
                <span className="score-badge">{item.score}%</span>
              </div>
            ))
          )}

          <div className="divider"></div>
          <h3 className="section-title">Weak Areas</h3>

          {(studentData.weakTopics || []).length === 0 ? (
            <p className="content-text">No weak areas detected yet.</p>
          ) : (
            (studentData.weakTopics || []).map((area, index) => (
              <div className="tag-item" key={index}>
                {area}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ProgressPage;