import React from "react";
import { contents } from "../data/contentData";
import { Link } from "react-router-dom";
import AiChat from "./AiChat"; 

const LearningContent = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Learning Content</h2>

      {contents.map((content) => (
        <div
          key={content.id}
          style={{
            marginBottom: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "16px",
            background: "#fff"
          }}
        >
          <h3>{content.title}</h3>

          <p>{content.description}</p>

          <a href={content.url} target="_blank" rel="noreferrer">
            Open Content
          </a>

          <br />
          <br />

          <Link to={`/notes/${content.id}`}>
            Write Notes
          </Link>

          {/* AI CHAT */}
          <div style={{ marginTop: "25px" }}>
            <AiChat />
          </div>
        </div>
      ))}

      <Link to="/recommendations">
        View AI Recommendations
      </Link>
    </div>
  );
};

export default LearningContent;