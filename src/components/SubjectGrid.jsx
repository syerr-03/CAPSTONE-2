import React from "react";
import "../App.css";

const SubjectGrid = ({ onEnroll, subjects, learningLevel = "beginner" }) => {
  const defaultSubjects = [
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

  const normalizedLevel = (learningLevel || "beginner").toLowerCase();

  const courseList =
    subjects && Array.isArray(subjects)
      ? subjects
      : defaultSubjects.filter((subject) =>
          allowedLevels[normalizedLevel]?.includes(subject.level)
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
      {courseList.map((subject) => (
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

            {subject.level && (
              <span className="course-level-badge">
                {subject.level.toUpperCase()}
              </span>
            )}

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