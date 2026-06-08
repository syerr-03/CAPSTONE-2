import { useEffect, useState } from "react";
import "../App.css";

const defaultSubjectsByLevel = {
  beginner: [],
  intermediate: [],
  advanced: []
};

const emptyQuizQuestions = [
  { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" },
  { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" },
  { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" },
  { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" },
  { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" }
];

function AdminDashboard() {
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [subjectsByLevel, setSubjectsByLevel] = useState(defaultSubjectsByLevel);
  const [showSubjectList, setShowSubjectList] = useState(false);
  const [adminView, setAdminView] = useState("");

  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectDesc, setSubjectDesc] = useState("");
  const [subjectIcon, setSubjectIcon] = useState("📘");

  const [showQuizList, setShowQuizList] = useState(false);
  const [adminQuizzes, setAdminQuizzes] = useState([]);

  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizLevel, setNewQuizLevel] = useState("beginner");
  const [newQuizPremium, setNewQuizPremium] = useState(false);
  const [newQuizIcon, setNewQuizIcon] = useState("📝");
  const [quizQuestions, setQuizQuestions] = useState(emptyQuizQuestions);

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
    const savedSubjects = JSON.parse(localStorage.getItem("bbSubjectsByLevel"));

    if (savedSubjects) {
      setSubjectsByLevel(savedSubjects);
    } else {
      localStorage.setItem("bbSubjectsByLevel", JSON.stringify(defaultSubjectsByLevel));
    }

    const savedQuizzes = JSON.parse(localStorage.getItem("bbAdminQuizzes") || "[]");
    setAdminQuizzes(savedQuizzes);
  }, []);

  const saveSubjects = (updated) => {
    setSubjectsByLevel(updated);
    localStorage.setItem("bbSubjectsByLevel", JSON.stringify(updated));
  };

  const saveQuizzes = (updated) => {
    setAdminQuizzes(updated);
    localStorage.setItem("bbAdminQuizzes", JSON.stringify(updated));
  };

  const currentSubjects = subjectsByLevel[selectedLevel] || [];

  const allSubjects = [
    ...(subjectsByLevel.beginner || []),
    ...(subjectsByLevel.intermediate || []),
    ...(subjectsByLevel.advanced || [])
  ];

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

  const resetSubjectForm = () => {
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

  const resetQuizForm = () => {
    setNewQuizTitle("");
    setNewQuizLevel("beginner");
    setNewQuizPremium(false);
    setNewQuizIcon("📝");
    setQuizQuestions(emptyQuizQuestions);
  };

  const updateQuizQuestion = (index, field, value) => {
    setQuizQuestions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addSubject = () => {
    if (!subjectTitle.trim() || !subjectDesc.trim()) {
      alert("Please fill in subject title and description.");
      return;
    }

    if (
      !readingTitle.trim() ||
      !readingContent.trim() ||
      !videoTitle.trim() ||
      !videoLink.trim() ||
      !quizTitle.trim() ||
      !quizQuestion.trim() ||
      !quizOption1.trim() ||
      !quizOption2.trim() ||
      !quizOption3.trim() ||
      !quizOption4.trim() ||
      !correctAnswer.trim() ||
      !practicalTitle.trim() ||
      !practicalInstruction.trim() ||
      !readingTitle2.trim() ||
      !readingContent2.trim() ||
      !videoTitle2.trim() ||
      !videoLink2.trim() ||
      !quizTitle2.trim() ||
      !quizQuestion2.trim() ||
      !quizOption1_2.trim() ||
      !quizOption2_2.trim() ||
      !quizOption3_2.trim() ||
      !quizOption4_2.trim() ||
      !correctAnswer2.trim() ||
      !practicalTitle2.trim() ||
      !practicalInstruction2.trim()
    ) {
      alert("Please complete all Module 1 and Module 2 details before releasing this subject.");
      return;
    }

    const now = Date.now();

    const newSubject = {
      id: now,
      title: subjectTitle,
      description: subjectDesc,
      icon: subjectIcon,
      level: selectedLevel,
      status: "Released",
      modules: [
        {
          id: `module-1-${now}`,
          heading: "Module 1",
          items: [
            {
              id: `reading-1-${now}`,
              type: "Reading",
              title: readingTitle,
              content: readingContent
            },
            {
              id: `video-1-${now}`,
              type: "Video",
              title: videoTitle,
              videoLink
            },
            {
              id: `quiz-1-${now}`,
              type: "Quiz",
              title: quizTitle,
              questions: [
                {
                  id: 1,
                  question: quizQuestion,
                  options: [quizOption1, quizOption2, quizOption3, quizOption4],
                  correctAnswer
                }
              ]
            },
            {
              id: `practical-1-${now}`,
              type: "Practical Assignment",
              title: practicalTitle,
              instruction: practicalInstruction
            }
          ]
        },
        {
          id: `module-2-${now}`,
          heading: "Module 2",
          items: [
            {
              id: `reading-2-${now}`,
              type: "Reading",
              title: readingTitle2,
              content: readingContent2
            },
            {
              id: `video-2-${now}`,
              type: "Video",
              title: videoTitle2,
              videoLink: videoLink2
            },
            {
              id: `quiz-2-${now}`,
              type: "Quiz",
              title: quizTitle2,
              questions: [
                {
                  id: 1,
                  question: quizQuestion2,
                  options: [quizOption1_2, quizOption2_2, quizOption3_2, quizOption4_2],
                  correctAnswer: correctAnswer2
                }
              ]
            },
            {
              id: `practical-2-${now}`,
              type: "Practical Assignment",
              title: practicalTitle2,
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
    resetSubjectForm();
    alert("Subject released successfully and is now visible to students.");
  };

  const releaseQuiz = () => {
    if (!newQuizTitle.trim()) {
      alert("Please enter quiz title.");
      return;
    }

    const hasIncompleteQuestion = quizQuestions.some(
      (q) =>
        !q.question.trim() ||
        !q.optionA.trim() ||
        !q.optionB.trim() ||
        !q.optionC.trim() ||
        !q.optionD.trim() ||
        !q.correctAnswer.trim()
    );

    if (hasIncompleteQuestion) {
      alert("Please complete all 5 quiz questions before releasing.");
      return;
    }

    const invalidAnswer = quizQuestions.some(
      (q) => ![q.optionA, q.optionB, q.optionC, q.optionD].includes(q.correctAnswer)
    );

    if (invalidAnswer) {
      alert("Correct answer must exactly match one of the option texts.");
      return;
    }

    const newQuiz = {
      id: `adminQuiz_${Date.now()}`,
      title: newQuizTitle,
      description: "Admin released quiz.",
      level: newQuizLevel,
      premium: newQuizPremium,
      icon: newQuizIcon,
      status: "Released",
      questions: quizQuestions.map((q, index) => ({
        id: index + 1,
        level: newQuizLevel,
        question: q.question,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctAnswer: q.correctAnswer,
        explanation: "This question was added by admin."
      }))
    };

    const updatedQuizzes = [...adminQuizzes, newQuiz];

    saveQuizzes(updatedQuizzes);
    resetQuizForm();
    alert("Quiz released successfully and is now visible on the Quiz Page.");
  };

  const deleteQuiz = (id) => {
    if (!window.confirm("Delete this quiz?")) return;

    const updatedQuizzes = adminQuizzes.filter((quiz) => quiz.id !== id);
    saveQuizzes(updatedQuizzes);
  };

  const editSubject = (id, level) => {
    const newTitle = prompt("New subject title:");
    if (!newTitle) return;

    const levelSubjects = subjectsByLevel[level] || [];

    const updatedSubjects = levelSubjects.map((subject) =>
      subject.id === id ? { ...subject, title: newTitle } : subject
    );

    saveSubjects({
      ...subjectsByLevel,
      [level]: updatedSubjects
    });
  };

  const deleteSubject = (id, level) => {
    if (!window.confirm("Delete this subject?")) return;

    const levelSubjects = subjectsByLevel[level] || [];

    const updatedSubjects = levelSubjects.filter((subject) => subject.id !== id);

    saveSubjects({
      ...subjectsByLevel,
      [level]: updatedSubjects
    });
  };

  const addModule = (subjectId, level) => {
    const moduleName = prompt("Module name:");
    if (!moduleName) return;

    const levelSubjects = subjectsByLevel[level] || [];

    const updatedSubjects = levelSubjects.map((subject) =>
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
      [level]: updatedSubjects
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
            isModule1 ? setReadingContent(e.target.value) : setReadingContent2(e.target.value)
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
            isModule1 ? setPracticalTitle(e.target.value) : setPracticalTitle2(e.target.value)
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
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "30px"
  }}
>
  <button
    className="module-card"
    style={{ cursor: "pointer", textAlign: "center" }}
    onClick={() => {
  setAdminView("subjects");
  setShowSubjectList(true);
  setShowQuizList(false);
}}
  >
    <h3>📚 List Subject</h3>
    <p>View all subjects by level.</p>
  </button>

  <button
    className="module-card"
    style={{ cursor: "pointer", textAlign: "center" }}
    onClick={() => {
  setAdminView("quizzes");
  setShowQuizList(true);
  setShowSubjectList(false);
}}
  >
    <h3>📝 List Quizzes</h3>
    <p>View all released quizzes.</p>
  </button>

  <button
    className="module-card"
    style={{ cursor: "pointer", textAlign: "center" }}
    onClick={() => {
  setAdminView("manage");
  setShowSubjectList(false);
  setShowQuizList(false);
}}
  >
    <h3>⚙️ Manage Learning Content</h3>
    <p>Add subjects, modules, readings, videos and quizzes.</p>
  </button>
</div>

{adminView === "manage" && (
  <>
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
              Release Subject
            </button>
          </div>

          <div className="module-card" style={{ padding: "35px", marginBottom: "25px" }}>
            <h3>Add Quiz</h3>

            <input
              placeholder="Quiz title"
              value={newQuizTitle}
              onChange={(e) => setNewQuizTitle(e.target.value)}
              style={inputStyle}
            />

            <select
              value={newQuizLevel}
              onChange={(e) => setNewQuizLevel(e.target.value)}
              style={inputStyle}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <input
              placeholder="Quiz icon, example: 🧪"
              value={newQuizIcon}
              onChange={(e) => setNewQuizIcon(e.target.value)}
              style={inputStyle}
            />

            <button
              type="button"
              onClick={() => setNewQuizPremium(!newQuizPremium)}
              className="hero-button"
              style={{
                marginBottom: "20px",
                background: newQuizPremium
                  ? "#7C3AED"
                  : "#E9D5FF",
                color: newQuizPremium
                  ? "#fff"
                  : "#7C3AED"
              }}
            >
              {newQuizPremium
                ? "💎 Premium Quiz"
                : "🆓 Free Quiz"}
            </button>

                        {quizQuestions.map((item, index) => (
              <div
                key={index}
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  borderRadius: "18px",
                  background: "#FAF7FF",
                  border: "1px solid #E9D5FF"
                }}
              >
                <h4>Question {index + 1}</h4>

                <input
                  placeholder={`Question ${index + 1}`}
                  value={item.question}
                  onChange={(e) => updateQuizQuestion(index, "question", e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Option A"
                  value={item.optionA}
                  onChange={(e) => updateQuizQuestion(index, "optionA", e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Option B"
                  value={item.optionB}
                  onChange={(e) => updateQuizQuestion(index, "optionB", e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Option C"
                  value={item.optionC}
                  onChange={(e) => updateQuizQuestion(index, "optionC", e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Option D"
                  value={item.optionD}
                  onChange={(e) => updateQuizQuestion(index, "optionD", e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Correct answer must match option text"
                  value={item.correctAnswer}
                  onChange={(e) => updateQuizQuestion(index, "correctAnswer", e.target.value)}
                  style={inputStyle}
                />
              </div>
            ))}

            <button className="hero-button" onClick={releaseQuiz}>
              Release Quiz
            </button>
          </div>

  </>
)}

          {showQuizList &&
            adminQuizzes.map((quiz) => (
              <div
                className="module-card"
                key={quiz.id}
                style={{
                  marginBottom: "20px",
                  textAlign: "center",
                  padding: "30px",
                  borderRadius: "24px"
                }}
              >
                <h3>
                  {quiz.icon || "📝"} {quiz.title}
                </h3>
                <p>
                  Level: {quiz.level.toUpperCase()} | Status: {quiz.status || "Released"}
                </p>
                <p>{quiz.premium ? "🔒 Premium" : "✅ Free"}</p>
                <p>{quiz.questions?.length || 0} questions added</p>

                <button
                  className="hero-button"
                  style={{ background: "#ef4444", marginTop: "15px" }}
                  onClick={() => deleteQuiz(quiz.id)}
                >
                  Delete Quiz
                </button>
              </div>
            ))}

          {showSubjectList &&
            allSubjects.map((subject) => (
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
                <p style={{ color: "#7C3AED", fontWeight: "700" }}>
                  Level: {subject.level.toUpperCase()} | Status: {subject.status || "Released"}
                </p>

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
                  <button
                    className="hero-button"
                    onClick={() => editSubject(subject.id, subject.level)}
                  >
                    Edit Subject
                  </button>

                  <button
                    className="hero-button"
                    style={{ background: "#ef4444" }}
                    onClick={() => deleteSubject(subject.id, subject.level)}
                  >
                    Remove Subject
                  </button>

                  <button
                    className="hero-button"
                    onClick={() => addModule(subject.id, subject.level)}
                  >
                    Add Module
                  </button>
                </div>

                {subject.modules?.map((module) => (
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
                      {module.items?.map((item) => (
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
