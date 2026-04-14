import React from "react";
import { contents } from "../data/contentData";

const Recommendation = () => {
  const recommendations = contents.filter(
    (content) => content.category === "Machine Learning"
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Recommendations</h2>
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