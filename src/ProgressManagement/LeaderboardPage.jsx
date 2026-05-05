import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function LeaderboardPage({ learningLevel = "beginner", selectedQuiz }) {
  const [leaderboard, setLeaderboard] = useState({});

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "leaderboard"));

        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        const filtered = results.filter((item) => {
          const itemLevel = item.level || item.learningLevel;

          const sameLevel =
            itemLevel?.toLowerCase() ===
            (learningLevel || "beginner").toLowerCase();

          const sameQuiz = selectedQuiz ? item.quizId === selectedQuiz : true;

          return sameLevel && sameQuiz;
        });

        const grouped = {};

        filtered.forEach((item) => {
          const quiz = item.subject || "Unknown Quiz";

          if (!grouped[quiz]) {
            grouped[quiz] = [];
          }

          grouped[quiz].push(item);
        });

        Object.keys(grouped).forEach((quiz) => {
          grouped[quiz].sort((a, b) => b.score - a.score);
        });

        setLeaderboard(grouped);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [learningLevel, selectedQuiz]);

  const currentUser =
    localStorage.getItem("name") ||
    localStorage.getItem("username") ||
    "Student";

  const quizNames = Object.keys(leaderboard);

  return (
    <div className="page-wrapper">
      <div className="hero-section">
        <h2 className="main-title">🏅 Leaderboard</h2>
        <p className="subtitle-text">
          Highest quiz score ranking for {learningLevel || "beginner"}
        </p>
      </div>

      <div className="dashboard-card white-card">
        {quizNames.length === 0 ? (
          <p className="content-text">No quiz scores yet.</p>
        ) : (
          quizNames.map((quiz) => (
            <div key={quiz} style={{ marginBottom: "25px" }}>
              <h3 style={{ marginBottom: "10px", color: "#7C3AED" }}>
                {quiz}
              </h3>

              {leaderboard[quiz].map((s, index) => {
                const isYou = s.name === currentUser;
                const displayName = `${s.name} (${s.attemptNo || index + 1})`;

                return (
                  <div
                    className="list-row"
                    key={s.id || index}
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
                      #{index + 1} {displayName}
                    </span>

                    <span className="score-badge">{s.score}%</span>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;