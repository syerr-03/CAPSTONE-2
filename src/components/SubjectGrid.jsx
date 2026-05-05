import React from "react";
import "../App.css";

const SubjectGrid = ({ onEnroll, learningLevel = "beginner" }) => {
  const subjects = [
    {
      id: 1,
      title: "What is Data Science?",
      description:
        "Understanding the basics of data science and its real-world applications.",
      icon: "📊",
      level: "beginner"
    },
    {
      id: 2,
      title: "Python for Data Science",
      description:
        "Learn Python syntax, libraries, and coding skills for data tasks.",
      icon: "🐍",
      level: "beginner"
    },
    {
      id: 3,
      title: "Statistics Fundamentals",
      description:
        "Build strong foundations in probability and data analysis.",
      icon: "📈",
      level: "intermediate"
    },
    {
      id: 4,
      title: "Data Visualization",
      description:
        "Present insights clearly using charts and dashboards.",
      icon: "🎨",
      level: "intermediate"
    },
    {
      id: 5,
      title: "Machine Learning Basics",
      description:
        "Understand models, training, prediction, and evaluation.",
      icon: "🤖",
      level: "advanced"
    },
    {
      id: 6,
      title: "Exploratory Data Analysis",
      description:
        "Learn how to inspect and understand datasets before modeling.",
      icon: "🔍",
      level: "advanced"
    }
  ];

  const allowedLevels = {
    beginner: ["beginner"],
    intermediate: ["beginner", "intermediate"],
    advanced: ["beginner", "intermediate", "advanced"]
  };

  const filteredSubjects = subjects.filter((subject) =>
    allowedLevels[learningLevel || "beginner"]?.includes(subject.level)
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "25px",
        padding: "20px"
      }}
    >
      {filteredSubjects.map((subject) => (
        <div
          className="module-card"
          key={subject.id}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "transform 0.2s",
            cursor: "default"
          }}
        >
          <div>
            <div style={{ fontSize: "40px", marginBottom: "15px" }}>
              {subject.icon}
            </div>

            <h3 className="section-title" style={{ marginBottom: "10px" }}>
              {subject.title}
            </h3>

            <p
              style={{
                fontSize: "11px",
                background: "#EDE9FE",
                color: "#7C3AED",
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "999px",
                fontWeight: "600",
                marginBottom: "8px"
              }}
            >
              {subject.level.toUpperCase()}
            </p>

            <p
              className="hero-subtitle"
              style={{
                fontSize: "14px",
                textAlign: "left",
                lineHeight: "1.5"
              }}
            >
              {subject.description}
            </p>
          </div>

          <button
            className="hero-button"
            style={{ width: "100%", marginTop: "20px", padding: "10px" }}
            onClick={() => onEnroll && onEnroll(subject)}
          >
            Enroll Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubjectGrid;