import React from "react";
import { contents } from "../data/contentData";
import { Link } from "react-router-dom";

const LearningContent = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Learning Content</h2>
      {contents.map((content) => (
        <div key={content.id} style={{ marginBottom: "15px" }}>
          <h3>{content.title}</h3>
          <p>{content.description}</p>
          <a href={content.url} target="_blank" rel="noreferrer">
            Open Content
          </a>
          <br />
          <Link to={`/notes/${content.id}`}>Write Notes</Link>
        </div>
      ))}
      <Link to="/recommendations">View AI Recommendations</Link>
    </div>
  );
};

export default LearningContent;