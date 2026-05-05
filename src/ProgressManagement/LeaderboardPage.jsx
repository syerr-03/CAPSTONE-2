import React from "react";

function LeaderboardPage({ leaderboard = [] }) {
  const sorted = [...leaderboard].sort((a, b) => b.score - a.score);

  return (
    <div className="page-wrapper">
      <div className="hero-section">
        <h2 className="main-title">🏅 Leaderboard</h2>
        <p className="subtitle-text">Highest quiz score ranking</p>
      </div>

      <div className="dashboard-card white-card">
        {sorted.length === 0 ? (
          <p className="content-text">No quiz scores yet.</p>
        ) : (
          sorted.map((s, index) => {
  const currentUser = localStorage.getItem("username") || "Student";
  const isYou = s.name === currentUser;

  return (
    <div
      className="list-row"
      key={index}
      style={{
        background: isYou ? "#ede9fe" : "transparent",
        borderRadius: "12px",
        padding: "10px",
        marginBottom: "6px"
      }}
    >
      <span className="content-text">
        {index === 0 && "🥇 "}
        {index === 1 && "🥈 "}
        {index === 2 && "🥉 "}
        {isYou && "👉 "}
        #{index + 1} {s.name}
      </span>

      <span className="score-badge">{s.score}%</span>
    </div>
  );
})
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;