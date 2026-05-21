import { useEffect, useState } from "react";
import "../App.css";

const defaultSubjectsByLevel = {
  beginner: [],
  intermediate: [],
  advanced: []
};

function AdminDashboard() {
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [subjectsByLevel, setSubjectsByLevel] = useState(defaultSubjectsByLevel);

  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectDesc, setSubjectDesc] = useState("");
  const [subjectIcon, setSubjectIcon] = useState("📘");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bbSubjectsByLevel"));

    if (saved) {
      setSubjectsByLevel(saved);
    } else {
      localStorage.setItem("bbSubjectsByLevel", JSON.stringify(defaultSubjectsByLevel));
    }
  }, []);

  const saveSubjects = (updated) => {
    setSubjectsByLevel(updated);
    localStorage.setItem("bbSubjectsByLevel", JSON.stringify(updated));
  };

  const currentSubjects = subjectsByLevel[selectedLevel] || [];

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

    const updated = {
      ...subjectsByLevel,
      [selectedLevel]: [...currentSubjects, newSubject]
    };

    saveSubjects(updated);
    setSubjectTitle("");
    setSubjectDesc("");
    setSubjectIcon("📘");
  };

  const editSubject = (id) => {
    const newTitle = prompt("New subject title:");
    if (!newTitle) return;

    const updatedSubjects = currentSubjects.map((subject) =>
      subject.id === id ? { ...subject, title: newTitle } : subject
    );

    saveSubjects({
      ...subjectsByLevel,
      [selectedLevel]: updatedSubjects
    });
  };

  const deleteSubject = (id) => {
    if (!window.confirm("Delete this subject?")) return;

    const updatedSubjects = currentSubjects.filter((subject) => subject.id !== id);

    saveSubjects({
      ...subjectsByLevel,
      [selectedLevel]: updatedSubjects
    });
  };

  const addModule = (subjectId) => {
    const moduleName = prompt("Module name:");
    if (!moduleName) return;

    const updatedSubjects = currentSubjects.map((subject) =>
      subject.id === subjectId
        ? {
            ...subject,
            modules: [
              ...subject.modules,
              {
                id: Date.now(),
                heading: moduleName,
                items: []
              }
            ]
          }
        : subject
    );

    saveSubjects({
      ...subjectsByLevel,
      [selectedLevel]: updatedSubjects
    });
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

    const updatedSubjects = currentSubjects.map((subject) =>
      subject.id === subjectId
        ? {
            ...subject,
            modules: subject.modules.map((module) =>
              module.id === moduleId
                ? {
                    ...module,
                    items: [
                      ...module.items,
                      {
                        id: Date.now(),
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
                  }
                : module
            )
          }
        : subject
    );

    saveSubjects({
      ...subjectsByLevel,
      [selectedLevel]: updatedSubjects
    });
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
        color: "#111827",
        minHeight: "100vh",
        padding: "30px"
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
          <h1 className="simple-menu-logo">Admin Panel</h1>

          <nav className="simple-menu-tabs">
            <button className="simple-menu-tab" onClick={logout}>
              Logout
            </button>
          </nav>
        </header>

        <section className="dashboard-content-section">
          <h2 className="section-title">Manage Learning Content</h2>

          <div className="module-card" style={{ marginBottom: "25px" }}>
            <h3>Select Level First</h3>

            <select
              className="search-input"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{ marginBottom: "15px", maxWidth: "300px" }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <p>
              You are editing: <b>{selectedLevel.toUpperCase()}</b>
            </p>
          </div>

          <div className="module-card" style={{ marginBottom: "25px" }}>
            <h3>Add Subject for {selectedLevel}</h3>

            <input
              className="search-input"
              placeholder="Subject title"
              value={subjectTitle}
              onChange={(e) => setSubjectTitle(e.target.value)}
              style={{ marginBottom: "10px" }}
            />

            <input
              className="search-input"
              placeholder="Subject description"
              value={subjectDesc}
              onChange={(e) => setSubjectDesc(e.target.value)}
              style={{ marginBottom: "10px" }}
            />

            <input
              className="search-input"
              placeholder="Icon"
              value={subjectIcon}
              onChange={(e) => setSubjectIcon(e.target.value)}
              style={{ marginBottom: "10px" }}
            />

            <button className="hero-button" onClick={addSubject}>
              Add Subject
            </button>
          </div>

          {currentSubjects.map((subject) => (
            <div className="module-card" key={subject.id} style={{ marginBottom: "20px" }}>
              <h3>
                {subject.icon} {subject.title}
              </h3>

              <p>{subject.description}</p>

              <button className="hero-button" onClick={() => editSubject(subject.id)}>
                Edit Subject
              </button>

              <button
                className="hero-button"
                style={{ marginLeft: "10px", background: "#ef4444" }}
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

              {subject.modules.map((module) => (
                <div
                  key={module.id}
                  style={{ borderTop: "1px solid #ddd", marginTop: "15px", paddingTop: "15px" }}
                >
                  <h4>{module.heading}</h4>

                  <button
                    className="hero-button"
                    onClick={() => addQuiz(subject.id, module.id)}
                  >
                    Add Quiz
                  </button>

                  <ul>
                    {module.items.map((item) => (
                      <li key={item.id}>
                        {item.type} - {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;