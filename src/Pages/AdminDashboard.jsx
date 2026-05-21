import { useEffect, useState } from "react";
import "../App.css";

const defaultSubjects = [
  {
    id: Date.now(),
    title: "What is Data Science?",
    description: "Understanding the basics of data science.",
    icon: "📊",
    modules: [
      {
        id: "module-1",
        heading: "Fundamentals",
        items: [
          { id: "reading-1", type: "Reading", title: "Introduction to Data Science" },
          { id: "video-1", type: "Video", title: "Data Science Overview" },
          {
            id: "quiz-1",
            type: "Quiz",
            title: "Fundamentals Quiz",
            questions: [
              {
                id: 1,
                question: "What is Data Science?",
                options: ["Cooking", "Data analysis field", "Gaming", "Drawing"],
                correctAnswer: "Data analysis field"
              }
            ]
          }
        ]
      }
    ]
  }
];

function AdminDashboard({ goToDashboard }) {
  const [subjects, setSubjects] = useState([]);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectDesc, setSubjectDesc] = useState("");
  const [subjectIcon, setSubjectIcon] = useState("📘");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bbSubjects"));
    if (saved && saved.length > 0) {
      setSubjects(saved);
    } else {
      setSubjects(defaultSubjects);
      localStorage.setItem("bbSubjects", JSON.stringify(defaultSubjects));
    }
  }, []);

  const saveSubjects = (updated) => {
    setSubjects(updated);
    localStorage.setItem("bbSubjects", JSON.stringify(updated));
  };

  const addSubject = () => {
    if (!subjectTitle.trim()) {
      alert("Please enter subject title");
      return;
    }

    const newSubject = {
      id: Date.now(),
      title: subjectTitle,
      description: subjectDesc,
      icon: subjectIcon,
      modules: []
    };

    saveSubjects([...subjects, newSubject]);
    setSubjectTitle("");
    setSubjectDesc("");
    setSubjectIcon("📘");
  };

  const deleteSubject = (id) => {
    const confirmDelete = window.confirm("Delete this subject?");
    if (!confirmDelete) return;

    saveSubjects(subjects.filter((s) => s.id !== id));
  };

  const editSubject = (id) => {
    const newTitle = prompt("New subject title:");
    if (!newTitle) return;

    const updated = subjects.map((s) =>
      s.id === id ? { ...s, title: newTitle } : s
    );

    saveSubjects(updated);
  };

  const addModule = (subjectId) => {
    const heading = prompt("Module heading:");
    if (!heading) return;

    const updated = subjects.map((subject) => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          modules: [
            ...subject.modules,
            {
              id: `module-${Date.now()}`,
              heading,
              items: []
            }
          ]
        };
      }
      return subject;
    });

    saveSubjects(updated);
  };

  const addQuiz = (subjectId, moduleId) => {
    const quizTitle = prompt("Quiz title:");
    if (!quizTitle) return;

    const question = prompt("Question:");
    const option1 = prompt("Option 1:");
    const option2 = prompt("Option 2:");
    const option3 = prompt("Option 3:");
    const option4 = prompt("Option 4:");
    const correctAnswer = prompt("Correct answer:");

    const updated = subjects.map((subject) => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          modules: subject.modules.map((module) => {
            if (module.id === moduleId) {
              return {
                ...module,
                items: [
                  ...module.items,
                  {
                    id: `quiz-${Date.now()}`,
                    type: "Quiz",
                    title: quizTitle,
                    questions: [
                      {
                        id: 1,
                        question,
                        options: [option1, option2, option3, option4],
                        correctAnswer
                      }
                    ]
                  }
                ]
              };
            }
            return module;
          })
        };
      }
      return subject;
    });

    saveSubjects(updated);
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  return (
  <div
    className="dashboard-page"
    style={{
      background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
      minHeight: "100vh",
      padding: "30px",
      color: "#111827"
    }}
  >
    <main
      className="dashboard-main-single"
      style={{
        background: "transparent",
        color: "#111827"
      }}
    >
      <header className="simple-menu-bar">
        <h1
          className="simple-menu-logo"
          style={{
            color: "#111827",
            fontWeight: "700",
            fontSize: "64px"
          }}
        >
          Admin Panel
        </h1>

        <nav className="simple-menu-tabs">
          <button className="simple-menu-tab" onClick={goToDashboard}>
            View Student Dashboard
          </button>

          <button className="simple-menu-tab" onClick={logout}>
            Logout
          </button>
        </nav>
      </header>

      <section className="dashboard-content-section">
        <h2
          className="section-title"
          style={{
            color: "#111827"
          }}
        >
          Manage Learning Content
        </h2>

        {/* LEVEL SELECT */}
        <div
          className="module-card"
          style={{
            marginBottom: "25px",
            background: "#fff"
          }}
        >
          <h3
            style={{
              color: "#111827",
              marginBottom: "15px"
            }}
          >
            Select Level First
          </h3>

          <select
            className="search-input"
            style={{
              marginBottom: "15px",
              maxWidth: "300px",
              color: "#111827",
              background: "#F5F3FF"
            }}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <p style={{ color: "#111827" }}>
            You are editing: <b>BEGINNER</b>
          </p>
        </div>

        {/* ADD SUBJECT */}
        <div
          className="module-card"
          style={{
            marginBottom: "25px",
            background: "#fff"
          }}
        >
          <h3
            style={{
              color: "#111827",
              marginBottom: "15px"
            }}
          >
            Add Subject
          </h3>

          <input
            className="search-input"
            placeholder="Subject title"
            value={subjectTitle}
            onChange={(e) => setSubjectTitle(e.target.value)}
            style={{
              marginBottom: "10px",
              background: "#F5F3FF",
              color: "#111827"
            }}
          />

          <input
            className="search-input"
            placeholder="Subject description"
            value={subjectDesc}
            onChange={(e) => setSubjectDesc(e.target.value)}
            style={{
              marginBottom: "10px",
              background: "#F5F3FF",
              color: "#111827"
            }}
          />

          <input
            className="search-input"
            placeholder="Icon"
            value={subjectIcon}
            onChange={(e) => setSubjectIcon(e.target.value)}
            style={{
              marginBottom: "10px",
              background: "#F5F3FF",
              color: "#111827"
            }}
          />

          <button className="hero-button" onClick={addSubject}>
            Add Subject
          </button>
        </div>

        {/* SUBJECT LIST */}
        {subjects.map((subject) => (
          <div
            className="module-card"
            key={subject.id}
            style={{
              marginBottom: "20px",
              background: "#fff"
            }}
          >
            <h3 style={{ color: "#111827" }}>
              {subject.icon} {subject.title}
            </h3>

            <p style={{ color: "#374151" }}>
              {subject.description}
            </p>

            <button
              className="hero-button"
              onClick={() => editSubject(subject.id)}
            >
              Edit Subject
            </button>

            <button
              className="hero-button"
              style={{
                marginLeft: "10px",
                background: "#ef4444"
              }}
              onClick={() => deleteSubject(subject.id)}
            >
              Remove Subject
            </button>

            <button
              className="hero-button"
              style={{ marginLeft: "10px" }}
              onClick={() => addModule(subject.id)}
            >
              Add Module
            </button>

            <div style={{ marginTop: "20px" }}>
              {subject.modules.map((module) => (
                <div
                  key={module.id}
                  style={{
                    borderTop: "1px solid #ddd",
                    paddingTop: "15px"
                  }}
                >
                  <h4 style={{ color: "#111827" }}>
                    {module.heading}
                  </h4>

                  <button
                    className="hero-button"
                    onClick={() => addQuiz(subject.id, module.id)}
                  >
                    Add Quiz
                  </button>

                  <ul>
                    {module.items.map((item) => (
                      <li
                        key={item.id}
                        style={{ color: "#111827" }}
                      >
                        {item.type} - {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  </div>
);
}

export default AdminDashboard;