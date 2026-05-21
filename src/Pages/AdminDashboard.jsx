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

  // ===== MODULE 1 STATES =====
  const [readingTitle, setReadingTitle] = useState("");
  const [readingContent, setReadingContent] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOption1, setQuizOption1] = useState("");
  const [quizOption2, setQuizOption2] = useState("");
  const [quizOption3, setQuizOption3] = useState("");
  const [quizOption4, setQuizOption4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [practicalTitle, setPracticalTitle] = useState("");
  const [practicalInstruction, setPracticalInstruction] = useState("");

  // ===== MODULE 2 STATES =====
  const [readingTitle2, setReadingTitle2] = useState("");
  const [readingContent2, setReadingContent2] = useState("");
  const [videoTitle2, setVideoTitle2] = useState("");
  const [videoLink2, setVideoLink2] = useState("");
  const [quizTitle2, setQuizTitle2] = useState("");
  const [quizQuestion2, setQuizQuestion2] = useState("");
  const [quizOption1_2, setQuizOption1_2] = useState("");
  const [quizOption2_2, setQuizOption2_2] = useState("");
  const [quizOption3_2, setQuizOption3_2] = useState("");
  const [quizOption4_2, setQuizOption4_2] = useState("");
  const [correctAnswer2, setCorrectAnswer2] = useState("");
  const [practicalTitle2, setPracticalTitle2] = useState("");
  const [practicalInstruction2, setPracticalInstruction2] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bbSubjectsByLevel"));

    if (saved) {
      setSubjectsByLevel(saved);
    } else {
      localStorage.setItem(
        "bbSubjectsByLevel",
        JSON.stringify(defaultSubjectsByLevel)
      );
    }
  }, []);

  const saveSubjects = (updated) => {
    setSubjectsByLevel(updated);
    localStorage.setItem("bbSubjectsByLevel", JSON.stringify(updated));
  };

  const currentSubjects = subjectsByLevel[selectedLevel] || [];

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    background: "#F5F3FF",
    color: "#111827",
    marginBottom: "14px",
    fontSize: "15px"
  };

  const textareaStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    background: "#F5F3FF",
    color: "#111827",
    marginBottom: "14px",
    minHeight: "120px",
    fontSize: "15px",
    resize: "vertical"
  };

  const resetForm = () => {
    setSubjectTitle("");
    setSubjectDesc("");
    setSubjectIcon("📘");

    setReadingTitle("");
    setReadingContent("");
    setVideoTitle("");
    setVideoLink("");
    setQuizTitle("");
    setQuizQuestion("");
    setQuizOption1("");
    setQuizOption2("");
    setQuizOption3("");
    setQuizOption4("");
    setCorrectAnswer("");
    setPracticalTitle("");
    setPracticalInstruction("");

    setReadingTitle2("");
    setReadingContent2("");
    setVideoTitle2("");
    setVideoLink2("");
    setQuizTitle2("");
    setQuizQuestion2("");
    setQuizOption1_2("");
    setQuizOption2_2("");
    setQuizOption3_2("");
    setQuizOption4_2("");
    setCorrectAnswer2("");
    setPracticalTitle2("");
    setPracticalInstruction2("");
  };

  const addSubject = () => {
    if (!subjectTitle.trim()) {
      alert("Please enter subject title first.");
      return;
    }

    const newSubject = {
      id: Date.now(),
      title: subjectTitle,
      description: subjectDesc,
      icon: subjectIcon,
      level: selectedLevel,
      modules: [
        {
          id: `module-1-${Date.now()}`,
          heading: "Module 1",
          items: [
            {
              id: "reading-1",
              type: "Reading",
              title: readingTitle || "Reading Material",
              content: readingContent
            },
            {
              id: "video-1",
              type: "Video",
              title: videoTitle || "Video Lesson",
              videoLink
            },
            {
              id: "quiz-1",
              type: "Quiz",
              title: quizTitle || "Module Quiz",
              questions:
                quizQuestion || quizOption1 || quizOption2 || quizOption3 || quizOption4
                  ? [
                      {
                        id: 1,
                        question: quizQuestion,
                        options: [
                          quizOption1,
                          quizOption2,
                          quizOption3,
                          quizOption4
                        ].filter(Boolean),
                        correctAnswer
                      }
                    ]
                  : []
            },
            {
              id: "practical-1",
              type: "Practical Assignment",
              title: practicalTitle || "Practical Task",
              instruction: practicalInstruction
            }
          ]
        },
        {
          id: `module-2-${Date.now()}`,
          heading: "Module 2",
          items: [
            {
              id: "reading-2",
              type: "Reading",
              title: readingTitle2 || "Reading Material",
              content: readingContent2
            },
            {
              id: "video-2",
              type: "Video",
              title: videoTitle2 || "Video Lesson",
              videoLink: videoLink2
            },
            {
              id: "quiz-2",
              type: "Quiz",
              title: quizTitle2 || "Module Quiz",
              questions:
                quizQuestion2 ||
                quizOption1_2 ||
                quizOption2_2 ||
                quizOption3_2 ||
                quizOption4_2
                  ? [
                      {
                        id: 1,
                        question: quizQuestion2,
                        options: [
                          quizOption1_2,
                          quizOption2_2,
                          quizOption3_2,
                          quizOption4_2
                        ].filter(Boolean),
                        correctAnswer: correctAnswer2
                      }
                    ]
                  : []
            },
            {
              id: "practical-2",
              type: "Practical Assignment",
              title: practicalTitle2 || "Practical Task",
              instruction: practicalInstruction2
            }
          ]
        }
      ]
    };

    const updated = {
      ...subjectsByLevel,
      [selectedLevel]: [...currentSubjects, newSubject]
    };

    saveSubjects(updated);
    resetForm();
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

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("name");
    window.location.href = "/";
  };

  const renderModuleForm = (moduleNumber) => {
    const isModule1 = moduleNumber === 1;

    return (
      <div
        style={{
          marginTop: "22px",
          padding: "22px",
          borderRadius: "20px",
          background: "#FAF7FF",
          border: "1px solid #E9D5FF"
        }}
      >
        <p
          style={{
            fontWeight: "800",
            margin: "0 0 16px",
            color: "#7C3AED",
            fontSize: "18px"
          }}
        >
          Complete Module {moduleNumber} Details
        </p>

        <input
          className="search-input"
          placeholder={`Module ${moduleNumber} reading title`}
          value={isModule1 ? readingTitle : readingTitle2}
          onChange={(e) =>
            isModule1 ? setReadingTitle(e.target.value) : setReadingTitle2(e.target.value)
          }
          style={inputStyle}
        />

        <textarea
          placeholder={`Module ${moduleNumber} reading content`}
          value={isModule1 ? readingContent : readingContent2}
          onChange={(e) =>
            isModule1
              ? setReadingContent(e.target.value)
              : setReadingContent2(e.target.value)
          }
          style={textareaStyle}
        />

        <input
          className="search-input"
          placeholder={`Module ${moduleNumber} video title`}
          value={isModule1 ? videoTitle : videoTitle2}
          onChange={(e) =>
            isModule1 ? setVideoTitle(e.target.value) : setVideoTitle2(e.target.value)
          }
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder={`Module ${moduleNumber} video link`}
          value={isModule1 ? videoLink : videoLink2}
          onChange={(e) =>
            isModule1 ? setVideoLink(e.target.value) : setVideoLink2(e.target.value)
          }
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder={`Module ${moduleNumber} quiz title`}
          value={isModule1 ? quizTitle : quizTitle2}
          onChange={(e) =>
            isModule1 ? setQuizTitle(e.target.value) : setQuizTitle2(e.target.value)
          }
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder={`Module ${moduleNumber} quiz question`}
          value={isModule1 ? quizQuestion : quizQuestion2}
          onChange={(e) =>
            isModule1 ? setQuizQuestion(e.target.value) : setQuizQuestion2(e.target.value)
          }
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder="Option 1"
          value={isModule1 ? quizOption1 : quizOption1_2}
          onChange={(e) =>
            isModule1 ? setQuizOption1(e.target.value) : setQuizOption1_2(e.target.value)
          }
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder="Option 2"
          value={isModule1 ? quizOption2 : quizOption2_2}
          onChange={(e) =>
            isModule1 ? setQuizOption2(e.target.value) : setQuizOption2_2(e.target.value)
          }
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder="Option 3"
          value={isModule1 ? quizOption3 : quizOption3_2}
          onChange={(e) =>
            isModule1 ? setQuizOption3(e.target.value) : setQuizOption3_2(e.target.value)
          }
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder="Option 4"
          value={isModule1 ? quizOption4 : quizOption4_2}
          onChange={(e) =>
            isModule1 ? setQuizOption4(e.target.value) : setQuizOption4_2(e.target.value)
          }
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder="Correct answer"
          value={isModule1 ? correctAnswer : correctAnswer2}
          onChange={(e) =>
            isModule1 ? setCorrectAnswer(e.target.value) : setCorrectAnswer2(e.target.value)
          }
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder={`Module ${moduleNumber} practical assignment title`}
          value={isModule1 ? practicalTitle : practicalTitle2}
          onChange={(e) =>
            isModule1
              ? setPracticalTitle(e.target.value)
              : setPracticalTitle2(e.target.value)
          }
          style={inputStyle}
        />

        <textarea
          placeholder={`Module ${moduleNumber} practical instruction`}
          value={isModule1 ? practicalInstruction : practicalInstruction2}
          onChange={(e) =>
            isModule1
              ? setPracticalInstruction(e.target.value)
              : setPracticalInstruction2(e.target.value)
          }
          style={textareaStyle}
        />
      </div>
    );
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
      <main className="dashboard-main-single" style={{ background: "transparent" }}>
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "28px",
              boxShadow: "0 10px 25px rgba(124,58,237,0.12)"
            }}
          >
            <h1
              style={{
                fontSize: "52px",
                fontWeight: "800",
                color: "#111827",
                margin: 0
              }}
            >
              Admin Panel
            </h1>
          </div>

          <button className="hero-button" onClick={logout} style={{ marginTop: "18px" }}>
            Logout
          </button>
        </header>

        <section className="dashboard-content-section">
          <h2 className="section-title">Manage Learning Content</h2>

          <div
            className="module-card"
            style={{
              marginBottom: "25px",
              padding: "30px",
              borderRadius: "24px",
              background: "#ffffff",
              boxShadow: "0 8px 20px rgba(124,58,237,0.08)"
            }}
          >
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

          <div
            className="module-card"
            style={{
              marginBottom: "25px",
              padding: "35px",
              borderRadius: "24px",
              background: "#ffffff",
              boxShadow: "0 8px 20px rgba(124,58,237,0.08)"
            }}
          >
            <h3>Add Subject for {selectedLevel}</h3>

            <input
              className="search-input"
              placeholder="Subject title"
              value={subjectTitle}
              onChange={(e) => setSubjectTitle(e.target.value)}
              style={inputStyle}
            />

            <input
              className="search-input"
              placeholder="Subject description"
              value={subjectDesc}
              onChange={(e) => setSubjectDesc(e.target.value)}
              style={inputStyle}
            />

            <input
              className="search-input"
              placeholder="Icon"
              value={subjectIcon}
              onChange={(e) => setSubjectIcon(e.target.value)}
              style={inputStyle}
            />

            {subjectTitle.trim() !== "" && (
              <>
                {renderModuleForm(1)}
                {renderModuleForm(2)}
              </>
            )}

            <button className="hero-button" onClick={addSubject}>
              Add Subject
            </button>
          </div>

          {currentSubjects.map((subject) => (
            <div
              className="module-card"
              key={subject.id}
              style={{
                marginBottom: "20px",
                textAlign: "center",
                padding: "30px",
                borderRadius: "24px"
              }}
            >
              <h3>
                {subject.icon} {subject.title}
              </h3>

              <p>{subject.description}</p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "14px",
                  flexWrap: "wrap",
                  marginTop: "20px"
                }}
              >
                <button className="hero-button" onClick={() => editSubject(subject.id)}>
                  Edit Subject
                </button>

                <button
                  className="hero-button"
                  style={{ background: "#ef4444" }}
                  onClick={() => deleteSubject(subject.id)}
                >
                  Remove Subject
                </button>

                <button className="hero-button" onClick={() => addModule(subject.id)}>
                  Add Module
                </button>
              </div>

              {subject.modules.map((module) => (
                <div
                  key={module.id}
                  style={{
                    borderTop: "1px solid #ddd",
                    marginTop: "20px",
                    paddingTop: "20px"
                  }}
                >
                  <h4>{module.heading}</h4>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      marginTop: "15px"
                    }}
                  >
                    {module.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          background: "#F5F3FF",
                          border: "1px solid #E9D5FF",
                          borderRadius: "14px",
                          padding: "14px 18px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <span>
                          <strong>{item.type}</strong> — {item.title || "No title added"}
                        </span>

                        <span
                          style={{
                            background: "#7C3AED",
                            color: "white",
                            borderRadius: "999px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}
                        >
                          Added
                        </span>
                      </div>
                    ))}
                  </div>
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
