import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import "../App.css";

const defaultSubjectsByLevel = {
  beginner: [],
  intermediate: [],
  advanced: []
};

function AdminDashboard() {
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [viewMode, setViewMode] = useState("manage"); // 'manage' | 'list' | 'listQuizzes' | 'manageQuizContents'
  const [subjectsByLevel, setSubjectsByLevel] = useState(defaultSubjectsByLevel);
  const [showSelectLevel, setShowSelectLevel] = useState(false);
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);

  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectDesc, setSubjectDesc] = useState("");
  const [subjectIcon, setSubjectIcon] = useState("📘");

  const [moduleForms, setModuleForms] = useState([
    {
      id: 1,
      heading: "Module 1",
      readingTitle: "",
      readingContent: "",
      videoTitle: "",
      videoLink: "",
      quizTitle: "",
      quizQuestion: "",
      quizOption1: "",
      quizOption2: "",
      quizOption3: "",
      quizOption4: "",
      correctAnswer: "",
      practicalTitle: "",
      practicalInstruction: ""
    }
  ]);

  const addModuleForm = () => {
    setModuleForms((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        heading: `Module ${prev.length + 1}`,
        readingTitle: "",
        readingContent: "",
        videoTitle: "",
        videoLink: "",
        quizTitle: "",
        quizQuestion: "",
        quizOption1: "",
        quizOption2: "",
        quizOption3: "",
        quizOption4: "",
        correctAnswer: "",
        practicalTitle: "",
        practicalInstruction: ""
      }
    ]);
  };

  const updateModuleForm = (index, field, value) => {
    setModuleForms((prev) =>
      prev.map((module, idx) =>
        idx === index ? { ...module, [field]: value } : module
      )
    );
  };

  const resetForm = () => {
    setSubjectTitle("");
    setSubjectDesc("");
    setSubjectIcon("📘");
    setModuleForms([
      {
        id: 1,
        heading: "Module 1",
        readingTitle: "",
        readingContent: "",
        videoTitle: "",
        videoLink: "",
        quizTitle: "",
        quizQuestion: "",
        quizOption1: "",
        quizOption2: "",
        quizOption3: "",
        quizOption4: "",
        correctAnswer: "",
        practicalTitle: "",
        practicalInstruction: ""
      }
    ]);
  };

  // Quiz (standalone) states
  const [quizTitleStandalone, setQuizTitleStandalone] = useState("");
  const [quizDescStandalone, setQuizDescStandalone] = useState("");
  const [quizLevelStandalone, setQuizLevelStandalone] = useState("beginner");
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizFormQuestions, setQuizFormQuestions] = useState([
    { id: 1, question: "", option1: "", option2: "", option3: "", option4: "", correctAnswer: "" }
  ]);
  const [quizFormTitle, setQuizFormTitle] = useState("");
  const [quizFormDesc, setQuizFormDesc] = useState("");
  const [quizFormLevel, setQuizFormLevel] = useState("beginner");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bbQuizzes")) || [];
      setQuizzes(saved);
    } catch (e) {
      setQuizzes([]);
    }
  }, []);

  const saveQuizzes = async (next) => {
    setQuizzes(next);
    localStorage.setItem("bbQuizzes", JSON.stringify(next));
    try {
      await setDoc(doc(db, "config", "bbQuizzes"), { quizzes: next, updatedAt: serverTimestamp() });
    } catch (e) {
      // ignore firestore write failures
      console.warn("Failed to persist quizzes to Firestore", e);
    }
    try {
      window.dispatchEvent(new Event("bbQuizzesUpdated"));
    } catch (e) {
      // ignore
    }
  };

  const editQuiz = (id) => {
    const q = quizzes.find((x) => x.id === id);
    if (!q) return;
    // open manage quiz contents with the quiz preloaded
    setEditingQuiz(q);
    setQuizFormTitle(q.title || "");
    setQuizFormDesc(q.description || "");
    setQuizFormLevel(q.level || "beginner");
    setQuizFormQuestions(
      (q.questions || []).map((ques, idx) => ({
        id: idx + 1,
        question: ques.question || "",
        option1: ques.options?.[0] || "",
        option2: ques.options?.[1] || "",
        option3: ques.options?.[2] || "",
        option4: ques.options?.[3] || "",
        correctAnswer: ques.correctAnswer || ""
      }))
    );
    setViewMode("manageQuizContents");
  };

  const deleteQuiz = (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    const updated = quizzes.filter((x) => x.id !== id);
    saveQuizzes(updated);
  };

  const addQuizQuestionForm = () => {
    setQuizFormQuestions((prev) => [
      ...prev,
      { id: prev.length + 1, question: "", option1: "", option2: "", option3: "", option4: "", correctAnswer: "" }
    ]);
  };

  const updateQuizQuestionField = (index, field, value) => {
    setQuizFormQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  };

  const saveQuizFromForm = () => {
    if (!quizFormTitle.trim()) { alert("Please enter quiz title"); return; }
    const questions = quizFormQuestions
      .filter((q) => q.question.trim())
      .map((q) => ({
        id: Date.now() + Math.random(),
        question: q.question,
        options: [q.option1, q.option2, q.option3, q.option4].filter(Boolean),
        correctAnswer: q.correctAnswer
      }));

    if (editingQuiz) {
      const updated = quizzes.map((x) => (x.id === editingQuiz.id ? { ...x, title: quizFormTitle, description: quizFormDesc, level: quizFormLevel, questions } : x));
      saveQuizzes(updated);
      setEditingQuiz(null);
    } else {
      const newQuiz = { id: Date.now(), title: quizFormTitle, description: quizFormDesc, level: quizFormLevel, questions };
      saveQuizzes([...quizzes, newQuiz]);
    }

    setQuizFormTitle(""); setQuizFormDesc(""); setQuizFormLevel("beginner"); setQuizFormQuestions([{ id: 1, question: "", option1: "", option2: "", option3: "", option4: "", correctAnswer: "" }]);
    setViewMode("listQuizzes");
  };

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const docRef = doc(db, "config", "bbSubjectsByLevel");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const firestoreData = docSnap.data().subjectsByLevel;
          console.log("Loading subjects from Firestore:", firestoreData);
          setSubjectsByLevel(firestoreData);
          localStorage.setItem("bbSubjectsByLevel", JSON.stringify(firestoreData));
        } else {
          const saved = JSON.parse(localStorage.getItem("bbSubjectsByLevel"));
          console.log("Loading subjects from localStorage:", saved);
          if (saved) {
            setSubjectsByLevel(saved);
          } else {
            localStorage.setItem(
              "bbSubjectsByLevel",
              JSON.stringify(defaultSubjectsByLevel)
            );
          }
        }
      } catch (e) {
        console.warn("Failed to load subjects from Firestore, falling back to localStorage", e);
        const saved = JSON.parse(localStorage.getItem("bbSubjectsByLevel"));
        console.log("Loading subjects from localStorage:", saved);
        if (saved) {
          setSubjectsByLevel(saved);
        } else {
          localStorage.setItem(
            "bbSubjectsByLevel",
            JSON.stringify(defaultSubjectsByLevel)
          );
        }
      }
    };

    loadSubjects();

    const handleSubjectsUpdate = () => {
      const updated = JSON.parse(localStorage.getItem("bbSubjectsByLevel"));
      console.log("Subjects updated event:", updated);
      if (updated) {
        setSubjectsByLevel(updated);
      }
    };

    window.addEventListener("bbSubjectsUpdated", handleSubjectsUpdate);

    return () => {
      window.removeEventListener("bbSubjectsUpdated", handleSubjectsUpdate);
    };
  }, []);

  const saveSubjects = async (updated) => {
    console.log("Saving subjects:", updated);
    setSubjectsByLevel(updated);
    localStorage.setItem("bbSubjectsByLevel", JSON.stringify(updated));
    try {
      await setDoc(doc(db, "config", "bbSubjectsByLevel"), { subjectsByLevel: updated, updatedAt: serverTimestamp() });
    } catch (e) {
      console.warn("Failed to persist subjects to Firestore", e);
    }
    try {
      window.dispatchEvent(new Event("bbSubjectsUpdated"));
    } catch (e) {
      // ignore
    }
  };

  const currentSubjects = subjectsByLevel[selectedLevel] || [];

  console.log("Current subjects for", selectedLevel, ":", currentSubjects);
  console.log("All subjects by level:", subjectsByLevel);

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

  const addSubject = () => {
    if (!subjectTitle.trim()) {
      alert("Please enter subject title first.");
      return;
    }

    const subjectId = Date.now();
    const newSubject = {
      id: subjectId,
      title: subjectTitle,
      description: subjectDesc,
      icon: subjectIcon,
      level: selectedLevel,
      modules: moduleForms.map((module, index) => ({
        id: `module-${index + 1}-${subjectId}`,
        heading: module.heading,
        items: [
          {
            id: `reading-${index + 1}`,
            type: "Reading",
            title: module.readingTitle || "Reading Material",
            content: module.readingContent
          },
          {
            id: `video-${index + 1}`,
            type: "Video",
            title: module.videoTitle || "Video Lesson",
            videoLink: module.videoLink
          },
          {
            id: `quiz-${index + 1}`,
            type: "Quiz",
            title: module.quizTitle || "Module Quiz",
            questions:
              module.quizQuestion ||
              module.quizOption1 ||
              module.quizOption2 ||
              module.quizOption3 ||
              module.quizOption4
                ? [
                    {
                      id: 1,
                      question: module.quizQuestion,
                      options: [
                        module.quizOption1,
                        module.quizOption2,
                        module.quizOption3,
                        module.quizOption4
                      ].filter(Boolean),
                      correctAnswer: module.correctAnswer
                    }
                  ]
                : []
          },
          {
            id: `practical-${index + 1}`,
            type: "Practical Assignment",
            title: module.practicalTitle || "Practical Task",
            instruction: module.practicalInstruction
          }
        ]
      }))
    };

    const updated = {
      ...subjectsByLevel,
      [selectedLevel]: [...currentSubjects, newSubject]
    };

    saveSubjects(updated);
    resetForm();
    setViewMode("list");
  };

  const editSubject = (id, level = selectedLevel) => {
    const levelSubjects = subjectsByLevel[level] || [];
    const newTitle = prompt("New subject title:");
    if (!newTitle) return;

    const updatedSubjects = levelSubjects.map((subject) =>
      subject.id === id ? { ...subject, title: newTitle } : subject
    );

    saveSubjects({
      ...subjectsByLevel,
      [level]: updatedSubjects
    });
  };

  const deleteSubject = (id, level = selectedLevel) => {
    if (!window.confirm("Delete this subject?")) return;

    const levelSubjects = subjectsByLevel[level] || [];
    const updatedSubjects = levelSubjects.filter((subject) => subject.id !== id);

    saveSubjects({
      ...subjectsByLevel,
      [level]: updatedSubjects
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

  const saveStandaloneQuiz = () => {
    if (!quizTitleStandalone.trim()) {
      alert("Please enter quiz title");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("bbQuizzes")) || [];
    const quiz = {
      id: Date.now(),
      title: quizTitleStandalone,
      description: quizDescStandalone,
      level: quizLevelStandalone
    };

    const updated = [...stored, quiz];
    saveQuizzes(updated);
    setQuizTitleStandalone("");
    setQuizDescStandalone("");
    setQuizLevelStandalone("beginner");
    setShowAddQuiz(false);
    alert("Quiz saved.");
  };

  const renderModuleForm = (module, index) => {
    return (
      <div
        key={module.id}
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
          Complete {module.heading} Details
        </p>

        <input
          className="search-input"
          placeholder={`${module.heading} reading title`}
          value={module.readingTitle}
          onChange={(e) => updateModuleForm(index, "readingTitle", e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder={`${module.heading} reading content`}
          value={module.readingContent}
          onChange={(e) => updateModuleForm(index, "readingContent", e.target.value)}
          style={textareaStyle}
        />

        <input
          className="search-input"
          placeholder={`${module.heading} video title`}
          value={module.videoTitle}
          onChange={(e) => updateModuleForm(index, "videoTitle", e.target.value)}
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder={`${module.heading} video link`}
          value={module.videoLink}
          onChange={(e) => updateModuleForm(index, "videoLink", e.target.value)}
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder={`${module.heading} quiz title`}
          value={module.quizTitle}
          onChange={(e) => updateModuleForm(index, "quizTitle", e.target.value)}
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder={`${module.heading} quiz question`}
          value={module.quizQuestion}
          onChange={(e) => updateModuleForm(index, "quizQuestion", e.target.value)}
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder="Option 1"
          value={module.quizOption1}
          onChange={(e) => updateModuleForm(index, "quizOption1", e.target.value)}
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder="Option 2"
          value={module.quizOption2}
          onChange={(e) => updateModuleForm(index, "quizOption2", e.target.value)}
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder="Option 3"
          value={module.quizOption3}
          onChange={(e) => updateModuleForm(index, "quizOption3", e.target.value)}
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder="Option 4"
          value={module.quizOption4}
          onChange={(e) => updateModuleForm(index, "quizOption4", e.target.value)}
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder="Correct answer"
          value={module.correctAnswer}
          onChange={(e) => updateModuleForm(index, "correctAnswer", e.target.value)}
          style={inputStyle}
        />

        <input
          className="search-input"
          placeholder={`${module.heading} practical assignment title`}
          value={module.practicalTitle}
          onChange={(e) => updateModuleForm(index, "practicalTitle", e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder={`${module.heading} practical instruction`}
          value={module.practicalInstruction}
          onChange={(e) => updateModuleForm(index, "practicalInstruction", e.target.value)}
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

          <button className="hero-button" onClick={logout} style={{ marginTop: "18px", background: "#ef4444" }}>
            Logout
          </button>
        </header>

        <section className="dashboard-content-section">

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 18 }}>
            <button
              className={"hero-button"}
              onClick={() => setViewMode(viewMode === "list" ? null : "list")}
              style={{ background: viewMode === "list" ? "#7C3AED" : undefined }}
            >
              List Subjects
            </button>

            <button
              className={"hero-button"}
              onClick={() => setViewMode(viewMode === "listQuizzes" ? null : "listQuizzes")}
              style={{ background: viewMode === "listQuizzes" ? "#7C3AED" : undefined }}
            >
              List Quizzes
            </button>

            <button
              className={"hero-button"}
              onClick={() => {
                if (viewMode === "manage") {
                  setViewMode(null);
                  setShowSelectLevel(false);
                  setShowAddSubjectForm(false);
                } else {
                  setViewMode("manage");
                  setShowSelectLevel(true);
                  setShowAddSubjectForm(true);
                }
              }}
              style={{ background: viewMode === "manage" ? "#7C3AED" : undefined }}
            >
              Manage Learning Content
            </button>
          </div>

          {viewMode === "manage" && showSelectLevel && (
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

              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 12 }}>
                <button
                  className="hero-button"
                  onClick={() => {
                    const el = document.getElementById("add-subject-form");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Add Subject
                </button>

                <button
                  className="hero-button"
                  onClick={() => setShowAddQuiz((s) => !s)}
                >
                  {showAddQuiz ? "Cancel" : "Add Quiz"}
                </button>
              </div>

              {showAddQuiz && (
                <div style={{ marginBottom: 12 }}>
                  <input
                    className="search-input"
                    placeholder="Quiz title"
                    value={quizTitleStandalone}
                    onChange={(e) => setQuizTitleStandalone(e.target.value)}
                    style={inputStyle}
                  />

                  <input
                    className="search-input"
                    placeholder="Short description"
                    value={quizDescStandalone}
                    onChange={(e) => setQuizDescStandalone(e.target.value)}
                    style={inputStyle}
                  />

                  <select
                    className="search-input"
                    value={quizLevelStandalone}
                    onChange={(e) => setQuizLevelStandalone(e.target.value)}
                    style={{ ...inputStyle, maxWidth: 260 }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  <div style={{ marginTop: 8 }}>
                    <button className="hero-button" onClick={saveStandaloneQuiz}>
                      Save Quiz
                    </button>
                  </div>
                </div>
              )}

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
          )}

          {viewMode === "manage" && showAddSubjectForm && (
            <div
              id="add-subject-form"
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
                  {moduleForms.map((module, index) => renderModuleForm(module, index))}

                  <button
                    type="button"
                    className="hero-button"
                    style={{ marginTop: "16px", background: "#7C3AED" }}
                    onClick={addModuleForm}
                  >
                    + Add Module
                  </button>
                </>
              )}

              <button className="hero-button" onClick={addSubject}>
                Add Subject
              </button>
            </div>
          )}

          {viewMode === "manage" ? (
            currentSubjects.map((subject) => (
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
            ))
          ) : viewMode === "list" ? (
            // existing list subjects view
            ["beginner", "intermediate", "advanced"].map((lvl) => (
              <div key={lvl} style={{ marginBottom: 18 }}>
                <h3 style={{ textAlign: "left" }}>{lvl.toUpperCase()}</h3>
                {(subjectsByLevel[lvl] || []).length === 0 && (
                  <p style={{ color: "#666" }}>No subjects</p>
                )}
                {(subjectsByLevel[lvl] || []).map((subject) => (
                  <div
                    key={subject.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "#fff",
                      border: "1px solid #eee",
                      borderRadius: 12,
                      marginBottom: 8
                    }}
                  >
                    <div>
                      <strong style={{ marginRight: 8 }}>{subject.icon}</strong>
                      <strong>{subject.title}</strong>
                      <div style={{ color: "#666" }}>{subject.description}</div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="hero-button" onClick={() => editSubject(subject.id, lvl)}>
                        Edit
                      </button>
                      <button
                        className="hero-button"
                        style={{ background: "#ef4444" }}
                        onClick={() => deleteSubject(subject.id, lvl)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : viewMode === "listQuizzes" ? (
            // list quizzes grouped by level
            ["beginner", "intermediate", "advanced"].map((lvl) => (
              <div key={lvl} style={{ marginBottom: 18 }}>
                <h3 style={{ textAlign: "left" }}>{lvl.toUpperCase()}</h3>
                {(quizzes.filter((qq) => qq.level === lvl) || []).length === 0 && (
                  <p style={{ color: "#666" }}>No quizzes</p>
                )}
                {(quizzes.filter((qq) => qq.level === lvl) || []).map((q) => (
                  <div
                    key={q.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "#fff",
                      border: "1px solid #eee",
                      borderRadius: 12,
                      marginBottom: 8
                    }}
                  >
                    <div>
                      <strong>{q.title}</strong>
                      <div style={{ color: "#666" }}>{q.description}</div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="hero-button" onClick={() => editQuiz(q.id)}>
                        Edit
                      </button>
                      <button className="hero-button" style={{ background: "#ef4444" }} onClick={() => deleteQuiz(q.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>Invalid view mode</p>
          )}

          {/* Standalone quizzes section (only in list mode) */}
          {viewMode === "list" && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ textAlign: "left" }}>Standalone Quizzes</h3>
              {quizzes.length === 0 && <p style={{ color: "#666" }}>No quizzes created</p>}
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: 12,
                    marginBottom: 8
                  }}
                >
                  <div>
                    <strong>{q.title}</strong>
                    <div style={{ color: "#666" }}>{q.description}</div>
                    <div style={{ color: "#999", fontSize: 12 }}>Level: {q.level}</div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="hero-button" onClick={() => editQuiz(q.id)}>
                      Edit
                    </button>
                    <button className="hero-button" style={{ background: "#ef4444" }} onClick={() => deleteQuiz(q.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
