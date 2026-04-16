import React, { useState } from "react";

function AchievementPage({ studentData }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const achievements = [
    {
      id: 1,
      title: "Starter Badge",
      description: "Complete at least 1 learning item.",
      unlocked: studentData.completedModules >= 1,
      unlockedBy: ["First completed learning activity"],
      reason:
        "Yayy!! You unlocked this badge by completing your first learning item in the adaptive module.",
    },
    {
      id: 2,
      title: "Steady Progress",
      description: "Reach at least 50% overall progress.",
      unlocked: studentData.progressPercent >= 50,
      unlockedBy: [`Progress reached ${studentData.progressPercent}%`],
      reason:
        "Yayy!! You unlocked this badge by reaching the expected minimum progress in the learning journey.",
    },
    {
      id: 3,
      title: "Quiz Performer",
      description: "Achieve a quiz score of at least 60%.",
      unlocked: studentData.quizScore >= 60,
      unlockedBy: [`Quiz score: ${studentData.quizScore}%`],
      reason:
        "Yayy!! You unlocked this badge by performing well in the quiz assessment.",
    },
    {
      id: 4,
      title: "Practical Achiever",
      description: "Achieve a practical score of at least 80%.",
      unlocked: studentData.practicalScore >= 80,
      unlockedBy: [`Practical score: ${studentData.practicalScore}%`],
      reason:
        "Yayy!! You unlocked this badge by showing strong performance in the practical assignment.",
    },
    {
      id: 5,
      title: "Adaptive Explorer",
      description: "Reach Medium or Hard adaptive difficulty.",
      unlocked:
        studentData.difficultyLevel === "Medium" ||
        studentData.difficultyLevel === "Hard",
      unlockedBy: [`Adaptive level: ${studentData.difficultyLevel}`],
      reason:
        "Yayy!! You unlocked this badge because the system recognized your progress and placed you at a higher adaptive level.",
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="hero-section">
        <h2 className="main-title">Earn Achievement</h2>
        <p className="subtitle-text">
          Click a badge to view which performance condition unlocked it.
        </p>
      </div>

      <div className="achievement-grid">
        {achievements.map((item) => (
          <button
            key={item.id}
            className={`dashboard-card achievement-button ${
              item.unlocked ? "purple-card" : "white-card"
            } ${selectedBadge?.id === item.id ? "selected-card" : ""}`}
            onClick={() => setSelectedBadge(item)}
          >
            <div className="achievement-header">
              <div className="achievement-icon">
                {item.unlocked ? "🏆" : "🔒"}
              </div>
              <div>
                <h3 className="card-title">{item.title}</h3>
                <p className="content-text">{item.description}</p>
              </div>
            </div>

            <div className="achievement-footer">
              <span
                className={
                  item.unlocked
                    ? "status-pill unlocked-pill"
                    : "status-pill locked-pill"
                }
              >
                {item.unlocked ? "Unlocked" : "Locked"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedBadge && (
        <div className="dashboard-card white-card detail-card">
          <h3 className="section-title">{selectedBadge.title} Details</h3>
          <div className="divider"></div>

          <p className="content-text">{selectedBadge.reason}</p>

          <div className="divider"></div>
          <h3 className="section-title">Unlocked By</h3>

          {selectedBadge.unlockedBy.length > 0 ? (
            selectedBadge.unlockedBy.map((item, index) => (
              <div className="list-row" key={index}>
                <span className="content-text">{item}</span>
                <span className="status-pill strong-pill">Matched</span>
              </div>
            ))
          ) : (
            <p className="content-text">
              No condition has been met yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AchievementPage;