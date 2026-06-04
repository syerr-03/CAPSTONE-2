import React from "react";
import { contents } from "../data/contentData";

const Recommendation = () => {
  const weakQuizId = localStorage.getItem("weakQuizId");
  const weakTopic = localStorage.getItem("weakTopic");
  const weaknessStatus = localStorage.getItem("weaknessStatus");

  const recommendations = weakQuizId
    ? contents.filter((content) => content.quizId === weakQuizId)
    : contents.slice(0, 3);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Recommended Courses</h2>

      {weakTopic ? (
        <p>
          Based on your quiz result, your weak area is{" "}
          <strong>{weakTopic}</strong>. Status:{" "}
          <strong>{weaknessStatus}</strong>
        </p>
      ) : (
        <p>Complete a quiz to get personalized recommendations.</p>
      )}

      {recommendations.map((content) => (
        <div key={content.id}>
          <h3>{content.title}</h3>
          <p>{content.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Recommendation;