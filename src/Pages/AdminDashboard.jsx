import { useEffect, useState } from "react";
import "../App.css";
import { getStudentSubjectsByLevel } from "../data/subjectData.js";

const defaultSubjectsByLevel = {
  beginner: [
    {
      id: 1,
      title: "What is Data Science?",
      description: "Understanding the basics of data science.",
      icon: "📊",
      level: "beginner",
      status: "Available",
    },
    {
      id: 2,
      title: "Python for Data Science",
      description: "Learn Python basics for data science.",
      icon: "🐍",
      level: "beginner",
      status: "Available",
    },
  ],
  intermediate: [
    {
      id: 3,
      title: "Statistics Fundamentals",
      description: "Learn probability, mean, and data analysis.",
      icon: "📈",
      level: "intermediate",
      status: "Available",
    },
    {
      id: 4,
      title: "Exploratory Data Analysis",
      description: "Learn how to inspect and understand datasets.",
      icon: "🔍",
      level: "intermediate",
      status: "Available",
    },
  ],
  advanced: [
    {
      id: 5,
      title: "Machine Learning Basics",
      description: "Understand models, training, and prediction.",
      icon: "🤖",
      level: "advanced",
      status: "Available",
    },
    {
      id: 6,
      title: "Data Visualization",
      description: "Present insights using charts and dashboards.",
      icon: "🎨",
      level: "advanced",
      status: "Available",
    },
  ],
};

const emptyQuizQuestions = [
  { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" },
  { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" },
  { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" },
  { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" },
  { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" },
];


function AdminDashboard() {
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [subjectsByLevel, setSubjectsByLevel] = useState(defaultSubjectsByLevel);
  const studentSubjectsByLevel = getStudentSubjectsByLevel(subjectsByLevel);

  const [adminView, setAdminView] = useState("");
  const [showSubjectList, setShowSubjectList] = useState(false);
  const [showQuizList, setShowQuizList] = useState(false);

  const [editingSubject, setEditingSubject] = useState(null);
  const [editSubjectLevel, setEditSubjectLevel] = useState("");

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    level: "beginner",
    moduleTitle: "",
    readingTitle: "",
    videoTitle: "",
    quizTitle: "",
    practicalTitle: "",
  });

  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectDesc, setSubjectDesc] = useState("");
  const [subjectIcon, setSubjectIcon] = useState("📘");

  const [adminQuizzes, setAdminQuizzes] = useState([]);
const [studentQuizzes, setStudentQuizzes] = useState([]);
const [editingQuizSource, setEditingQuizSource] = useState(null);

  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editQuizForm, setEditQuizForm] = useState({
    title: "",
    level: "beginner",
    icon: "📝",
    premium: false,
    questions: [],
  });

  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizLevel, setNewQuizLevel] = useState("beginner");
  const [newQuizPremium, setNewQuizPremium] = useState(false);
  const [newQuizIcon, setNewQuizIcon] = useState("📝");
  const [quizQuestions, setQuizQuestions] = useState(emptyQuizQuestions);

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
  const savedSubjects = JSON.parse(localStorage.getItem("bbSubjectsByLevel") || "null");

  if (savedSubjects) {
    const isEmpty =
      (savedSubjects.beginner || []).length === 0 &&
      (savedSubjects.intermediate || []).length === 0 &&
      (savedSubjects.advanced || []).length === 0;

    if (isEmpty) {
      setSubjectsByLevel(defaultSubjectsByLevel);
      localStorage.setItem("bbSubjectsByLevel", JSON.stringify(defaultSubjectsByLevel));
    } else {
      setSubjectsByLevel(savedSubjects);
    }
  } else {
    setSubjectsByLevel(defaultSubjectsByLevel);
    localStorage.setItem("bbSubjectsByLevel", JSON.stringify(defaultSubjectsByLevel));
  }

  const savedQuizzes = JSON.parse(localStorage.getItem("bbAdminQuizzes") || "[]");
  setAdminQuizzes(savedQuizzes);

  const loadStudentQuizzes = () => {
    const savedStudentQuizzes = JSON.parse(
      localStorage.getItem("bbStudentQuizzes") || "[]"
    );
    setStudentQuizzes(savedStudentQuizzes);
  };

  loadStudentQuizzes();

  window.addEventListener("bbStudentQuizzesUpdated", loadStudentQuizzes);

  return () => {
    window.removeEventListener("bbStudentQuizzesUpdated", loadStudentQuizzes);
  };
}, []);

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    background: "#F5F3FF",
    color: "#111827",
    marginBottom: "14px",
    fontSize: "15px",
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
    resize: "vertical",
  };

  const saveSubjects = (updated) => {
    setSubjectsByLevel(updated);
    localStorage.setItem("bbSubjectsByLevel", JSON.stringify(updated));
  };

  const saveQuizzes = (updated) => {
    setAdminQuizzes(updated);
    localStorage.setItem("bbAdminQuizzes", JSON.stringify(updated));
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

  const handleEditSubject = (subject, level) => {
    const firstModule = subject.modules?.[0];
    const moduleItems = firstModule?.items || [];

    const readingItem = moduleItems.find((item) => item.type === "Reading");
    const videoItem = moduleItems.find((item) => item.type === "Video");
    const quizItem = moduleItems.find((item) => item.type === "Quiz");
    const practicalItem = moduleItems.find(
      (item) => item.type === "Practical Assignment"
    );

    setEditingSubject(subject);
    setEditSubjectLevel(level);

    setEditForm({
      title: subject.title || "",
      description: subject.description || "",
      level: level || "beginner",
      moduleTitle: firstModule?.heading || subject.moduleTitle || "Fundamentals",
      readingTitle:
        readingItem?.title ||
        subject.readingTitle ||
        `Master the Basics: ${subject.title}`,
      videoTitle:
        videoItem?.title ||
        subject.videoTitle ||
        `Watch and Learn: ${subject.title} Overview`,
      quizTitle:
        quizItem?.title ||
        subject.quizTitle ||
        "Test Your Knowledge: Fundamentals Quiz",
      practicalTitle:
        practicalItem?.title ||
        subject.practicalTitle ||
        "Practical Assignment: Basic Data Exploration",
    });

    setAdminView("editSubjectForm");
    setShowSubjectList(false);
    setShowQuizList(false);
  };

  const handleSaveEditSubject = () => {
    if (!editingSubject) return;

    const oldLevel = editSubjectLevel || editingSubject.level || "beginner";
    const newLevel = editForm.level || oldLevel;
    const subjectKey = editingSubject.id || editingSubject.title;

    const updated = {
      beginner: [...(subjectsByLevel.beginner || [])],
      intermediate: [...(subjectsByLevel.intermediate || [])],
      advanced: [...(subjectsByLevel.advanced || [])],
    };

    updated[oldLevel] = updated[oldLevel].filter(
      (subject) => (subject.id || subject.title) !== subjectKey
    );

    const updatedModules =
      editingSubject.modules?.map((module, index) => {
        if (index !== 0) return module;

        return {
          ...module,
          heading: editForm.moduleTitle,
          items: module.items?.map((item) => {
            if (item.type === "Reading") return { ...item, title: editForm.readingTitle };
            if (item.type === "Video") return { ...item, title: editForm.videoTitle };
            if (item.type === "Quiz") return { ...item, title: editForm.quizTitle };
            if (item.type === "Practical Assignment") {
              return { ...item, title: editForm.practicalTitle };
            }
            return item;
          }),
        };
      }) || editingSubject.modules;

    const editedSubject = {
      ...editingSubject,
      title: editForm.title,
      description: editForm.description,
      level: newLevel,
      moduleTitle: editForm.moduleTitle,
      readingTitle: editForm.readingTitle,
      videoTitle: editForm.videoTitle,
      quizTitle: editForm.quizTitle,
      practicalTitle: editForm.practicalTitle,
      modules: updatedModules,
    };

    updated[newLevel] = [...(updated[newLevel] || []), editedSubject];

    saveSubjects(updated);

    setEditingSubject(null);
    setEditSubjectLevel("");
    setAdminView("subjects");
    setShowSubjectList(true);
    setShowQuizList(false);
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
              content: readingContent,
            },
            {
              id: `video-1-${now}`,
              type: "Video",
              title: videoTitle,
              videoLink,
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
                  correctAnswer,
                },
              ],
            },
            {
              id: `practical-1-${now}`,
              type: "Practical Assignment",
              title: practicalTitle,
              instruction: practicalInstruction,
            },
          ],
        },
        {
          id: `module-2-${now}`,
          heading: "Module 2",
          items: [
            {
              id: `reading-2-${now}`,
              type: "Reading",
              title: readingTitle2,
              content: readingContent2,
            },
            {
              id: `video-2-${now}`,
              type: "Video",
              title: videoTitle2,
              videoLink: videoLink2,
            },
            {
              id: `quiz-2-${now}`,
              type: "Quiz",
              title: quizTitle2,
              questions: [
                {
                  id: 1,
                  question: quizQuestion2,
                  options: [
                    quizOption1_2,
                    quizOption2_2,
                    quizOption3_2,
                    quizOption4_2,
                  ],
                  correctAnswer: correctAnswer2,
                },
              ],
            },
            {
              id: `practical-2-${now}`,
              type: "Practical Assignment",
              title: practicalTitle2,
              instruction: practicalInstruction2,
            },
          ],
        },
      ],
    };

    const updated = {
      ...subjectsByLevel,
      [selectedLevel]: [...(subjectsByLevel[selectedLevel] || []), newSubject],
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
      source: "Admin Added Quiz",
      questions: quizQuestions.map((q, index) => ({
        id: index + 1,
        level: newQuizLevel,
        question: q.question,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctAnswer: q.correctAnswer,
        explanation: "This question was added by admin.",
      })),
    };

    const updatedQuizzes = [...adminQuizzes, newQuiz];

    saveQuizzes(updatedQuizzes);
    resetQuizForm();
    alert("Quiz released successfully and is now visible on the Quiz Page.");
  };

  const handleEditQuiz = (quizWrapper) => {
  const quiz = quizWrapper.rawQuiz || quizWrapper;

  setEditingQuiz(quiz);

  setEditingQuizSource({
    type: quizWrapper.sourceType || "admin",
    realId: quizWrapper.realId || quiz.id,
    studentEditKey: quizWrapper.studentEditKey || null,
    subjectLevel: quizWrapper.subjectLevel || null,
    subjectId: quizWrapper.subjectId || null,
    moduleId: quizWrapper.moduleId || null,
    quizItemId: quizWrapper.quizItemId || null,
  });

  setEditQuizForm({
    title: quiz.title || "",
    level: quizWrapper.level || quiz.level || "beginner",
    icon: quiz.icon || quizWrapper.icon || "📝",
    premium: quiz.premium || false,
    questions: (quiz.questions || []).map((q) => ({
      question: q.question || "",
      optionA: q.options?.[0] || "",
      optionB: q.options?.[1] || "",
      optionC: q.options?.[2] || "",
      optionD: q.options?.[3] || "",
      correctAnswer: q.correctAnswer || "",
    })),
  });

  setAdminView("editQuizForm");
  setShowQuizList(false);
  setShowSubjectList(false);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  const updateEditQuizQuestion = (index, field, value) => {
    setEditQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleSaveEditQuiz = () => {
  if (!editingQuiz || !editingQuizSource) return;

  const updatedQuiz = {
    ...editingQuiz,
    title: editQuizForm.title,
    level: editQuizForm.level,
    icon: editQuizForm.icon,
    premium: editQuizForm.premium,
    questions: editQuizForm.questions.map((q, index) => ({
      id: index + 1,
      level: editQuizForm.level,
      question: q.question,
      options: [q.optionA, q.optionB, q.optionC, q.optionD],
      correctAnswer: q.correctAnswer,
      explanation: "This question was edited by admin.",
    })),
  };

  if (editingQuizSource.type === "student") {
    const existingEdits = JSON.parse(
      localStorage.getItem("bbStudentQuizEdits") || "{}"
    );

    const updatedEdits = {
      ...existingEdits,
      [editingQuizSource.studentEditKey]: updatedQuiz,
    };

    localStorage.setItem("bbStudentQuizEdits", JSON.stringify(updatedEdits));

    const updatedStudentQuizzes = studentQuizzes.map((quiz) =>
      quiz.studentEditKey === editingQuizSource.studentEditKey
        ? { ...quiz, ...updatedQuiz }
        : quiz
    );

    localStorage.setItem("bbStudentQuizzes", JSON.stringify(updatedStudentQuizzes));
    setStudentQuizzes(updatedStudentQuizzes);
    window.dispatchEvent(new Event("bbStudentQuizzesUpdated"));
  }

  if (editingQuizSource.type === "subject") {
    const level = editingQuizSource.subjectLevel;

    const updatedSubjects = {
      ...subjectsByLevel,
      [level]: (subjectsByLevel[level] || []).map((subject) => {
        if (subject.id !== editingQuizSource.subjectId) return subject;

        return {
          ...subject,
          modules: (subject.modules || []).map((moduleItem) => {
            if (moduleItem.id !== editingQuizSource.moduleId) return moduleItem;

            return {
              ...moduleItem,
              items: (moduleItem.items || []).map((item) => {
                if (item.id !== editingQuizSource.quizItemId) return item;

                return {
                  ...item,
                  title: updatedQuiz.title,
                  questions: updatedQuiz.questions,
                };
              }),
            };
          }),
        };
      }),
    };

    saveSubjects(updatedSubjects);
  }

  if (editingQuizSource.type === "admin") {
    const updatedQuizzes = adminQuizzes.map((quiz) =>
      quiz.id === editingQuizSource.realId ? updatedQuiz : quiz
    );

    saveQuizzes(updatedQuizzes);
  }

  setEditingQuiz(null);
  setEditingQuizSource(null);
  setAdminView("quizzes");
  setShowQuizList(true);
  setShowSubjectList(false);
};

  const deleteQuiz = (id) => {
    if (!window.confirm("Delete this quiz?")) return;

    const updatedQuizzes = adminQuizzes.filter((quiz) => quiz.id !== id);
    saveQuizzes(updatedQuizzes);
  };

  const deleteSubject = (id, level) => {
    if (!window.confirm("Delete this subject?")) return;

    const updatedSubjects = (subjectsByLevel[level] || []).filter(
      (subject) => subject.id !== id
    );

    saveSubjects({
      ...subjectsByLevel,
      [level]: updatedSubjects,
    });
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("name");
    window.location.href = "/";
  };

  const getAllSystemQuizzes = () => {
    const savedStudentQuizzes = JSON.parse(
      localStorage.getItem("bbStudentQuizzes") || "[]"
    );
    const savedAdminQuizzes = JSON.parse(
      localStorage.getItem("bbAdminQuizzes") || "[]"
    );
    const savedDefaultStudentQuizzes = JSON.parse(
      localStorage.getItem("bbDefaultStudentQuizzes") || "[]"
    );
    const savedSubjects = JSON.parse(
      localStorage.getItem("bbSubjectsByLevel") || "{}"
    );

    const allQuizzes = [];

    savedDefaultStudentQuizzes.forEach((quiz, index) => {
      allQuizzes.push({
        id: `default-${quiz.id || index}`,
        realId: quiz.id || null,
        title: quiz.title || "Default Student Quiz",
        level: (quiz.level || "beginner").toLowerCase(),
        icon: quiz.icon || "🧠",
        sourceType: "defaultStudent",
        rawQuiz: quiz,
        canEdit: false,
        canDelete: false,
      });
    });

    savedStudentQuizzes.forEach((quiz, index) => {
      allQuizzes.push({
        id: `student-${quiz.id || index}`,
        realId: quiz.id || null,
        studentEditKey: quiz.studentEditKey || null,
        title: quiz.title || "Student Added Quiz",
        level: (quiz.level || "beginner").toLowerCase(),
        icon: quiz.icon || "📝",
        sourceType: "student",
        rawQuiz: quiz,
        canEdit: true,
        canDelete: false,
      });
    });

    Object.entries(savedSubjects).forEach(([level, subjects]) => {
      (subjects || []).forEach((subject) => {
        (subject.modules || []).forEach((moduleItem) => {
          (moduleItem.items || [])
            .filter((item) => item.type === "Quiz")
            .forEach((quizItem, index) => {
              allQuizzes.push({
                id: `subject-${subject.id}-${quizItem.id || index}`,
                realId: quizItem.id || null,
                title: quizItem.title || "Subject Quiz",
                level: (level || subject.level || "beginner").toLowerCase(),
                icon: subject.icon || "📝",
                sourceType: "subject",
                subjectLevel: level,
                subjectId: subject.id,
                moduleId: moduleItem.id,
                quizItemId: quizItem.id,
                rawQuiz: quizItem,
                canEdit: true,
                canDelete: false,
              });
            });
        });
      });
    });

    savedAdminQuizzes.forEach((quiz, index) => {
      allQuizzes.push({
        id: `admin-${quiz.id || index}`,
        realId: quiz.id || null,
        title: quiz.title || "Admin Quiz",
        level: (quiz.level || "beginner").toLowerCase(),
        icon: quiz.icon || "📝",
        sourceType: "admin",
        rawQuiz: quiz,
        canEdit: true,
        canDelete: true,
      });
    });

    return allQuizzes.filter(
      (quiz, index, self) =>
        index ===
        self.findIndex(
          (q) =>
            `${q.sourceType}:${q.level}:${q.title}` ===
            `${quiz.sourceType}:${quiz.level}:${quiz.title}`
        )
    );
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
          border: "1px solid #E9D5FF",
        }}
      >
        <p
          style={{
            fontWeight: "800",
            margin: "0 0 16px",
            color: "#7C3AED",
            fontSize: "18px",
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

  if (adminView === "editSubjectForm" && editingSubject) {
    return (
      <div
        className="dashboard-page"
        style={{
          background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
          color: "#111827",
          minHeight: "100vh",
          padding: "30px",
        }}
      >
        <main className="dashboard-main-single" style={{ background: "transparent" }}>
          <div
            className="module-card"
            style={{
              padding: "35px",
              borderRadius: "24px",
              background: "#ffffff",
              boxShadow: "0 8px 20px rgba(124,58,237,0.08)",
            }}
          >
            <button
              className="hero-button"
              onClick={() => {
                setEditingSubject(null);
                setEditSubjectLevel("");
                setAdminView("subjects");
                setShowSubjectList(true);
              }}
              style={{ marginBottom: "20px" }}
            >
              ← Back
            </button>

            <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
              Edit Subject Content
            </h1>

            <label>Subject Title</label>
            <input
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              style={inputStyle}
            />

            <label>Subject Description</label>
            <input
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              style={inputStyle}
            />

            <label>Level</label>
            <select
              value={editForm.level}
              onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
              style={inputStyle}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <label>Module Name</label>
            <input
              value={editForm.moduleTitle}
              onChange={(e) =>
                setEditForm({ ...editForm, moduleTitle: e.target.value })
              }
              style={inputStyle}
            />

            <label>Reading Title</label>
            <input
              value={editForm.readingTitle}
              onChange={(e) =>
                setEditForm({ ...editForm, readingTitle: e.target.value })
              }
              style={inputStyle}
            />

            <label>Video Title</label>
            <input
              value={editForm.videoTitle}
              onChange={(e) =>
                setEditForm({ ...editForm, videoTitle: e.target.value })
              }
              style={inputStyle}
            />

            <label>Quiz Title</label>
            <input
              value={editForm.quizTitle}
              onChange={(e) =>
                setEditForm({ ...editForm, quizTitle: e.target.value })
              }
              style={inputStyle}
            />

            <label>Practical Assignment Title</label>
            <input
              value={editForm.practicalTitle}
              onChange={(e) =>
                setEditForm({ ...editForm, practicalTitle: e.target.value })
              }
              style={inputStyle}
            />

            <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
              <button className="hero-button" onClick={handleSaveEditSubject}>
                Save
              </button>

              <button
                className="hero-button"
                style={{ background: "#ef4444" }}
                onClick={() => {
                  setEditingSubject(null);
                  setEditSubjectLevel("");
                  setAdminView("subjects");
                  setShowSubjectList(true);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (adminView === "editQuizForm" && editingQuiz) {
    return (
      <div
        className="dashboard-page"
        style={{
          background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
          color: "#111827",
          minHeight: "100vh",
          padding: "30px",
        }}
      >
        <main className="dashboard-main-single" style={{ background: "transparent" }}>
          <div
            className="module-card"
            style={{
              padding: "35px",
              borderRadius: "24px",
              background: "#ffffff",
              boxShadow: "0 8px 20px rgba(124,58,237,0.08)",
            }}
          >
            <button
              className="hero-button"
              onClick={() => {
                setEditingQuiz(null);
                setAdminView("quizzes");
                setShowQuizList(true);
              }}
              style={{ marginBottom: "20px" }}
            >
              ← Back
            </button>

            <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
              Edit Quiz
            </h1>

            <p style={{ textAlign: "center", marginBottom: "30px" }}>
              Current Level: <b>{editQuizForm.level}</b>
            </p>

            <label>Quiz Title</label>
            <input
              value={editQuizForm.title}
              onChange={(e) =>
                setEditQuizForm({ ...editQuizForm, title: e.target.value })
              }
              style={inputStyle}
            />

            <label>Level</label>
            <select
              value={editQuizForm.level}
              onChange={(e) =>
                setEditQuizForm({ ...editQuizForm, level: e.target.value })
              }
              style={inputStyle}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <label>Quiz Icon</label>
            <input
              value={editQuizForm.icon}
              onChange={(e) =>
                setEditQuizForm({ ...editQuizForm, icon: e.target.value })
              }
              style={inputStyle}
            />

            <button
              type="button"
              className="hero-button"
              onClick={() =>
                setEditQuizForm({
                  ...editQuizForm,
                  premium: !editQuizForm.premium,
                })
              }
              style={{
                marginBottom: "25px",
                background: editQuizForm.premium ? "#7C3AED" : "#E9D5FF",
                color: editQuizForm.premium ? "#fff" : "#7C3AED",
              }}
            >
              {editQuizForm.premium ? "💎 Premium Quiz" : "🆓 Free Quiz"}
            </button>

            {editQuizForm.questions.map((q, index) => (
              <div
                key={index}
                style={{
                  marginTop: "25px",
                  padding: "25px",
                  borderRadius: "20px",
                  background: "#FAF7FF",
                  border: "1px solid #E9D5FF",
                }}
              >
                <h2 style={{ marginBottom: "20px" }}>Question {index + 1}</h2>

                <label>Question</label>
                <input
                  value={q.question}
                  onChange={(e) =>
                    updateEditQuizQuestion(index, "question", e.target.value)
                  }
                  style={inputStyle}
                />

                <label>Option A</label>
                <input
                  value={q.optionA}
                  onChange={(e) =>
                    updateEditQuizQuestion(index, "optionA", e.target.value)
                  }
                  style={inputStyle}
                />

                <label>Option B</label>
                <input
                  value={q.optionB}
                  onChange={(e) =>
                    updateEditQuizQuestion(index, "optionB", e.target.value)
                  }
                  style={inputStyle}
                />

                <label>Option C</label>
                <input
                  value={q.optionC}
                  onChange={(e) =>
                    updateEditQuizQuestion(index, "optionC", e.target.value)
                  }
                  style={inputStyle}
                />

                <label>Option D</label>
                <input
                  value={q.optionD}
                  onChange={(e) =>
                    updateEditQuizQuestion(index, "optionD", e.target.value)
                  }
                  style={inputStyle}
                />

                <label>Correct Answer</label>
                <input
                  value={q.correctAnswer}
                  onChange={(e) =>
                    updateEditQuizQuestion(index, "correctAnswer", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
              <button className="hero-button" onClick={handleSaveEditQuiz}>
                Save
              </button>

              <button
                className="hero-button"
                style={{ background: "#ef4444" }}
                onClick={() => {
                  setEditingQuiz(null);
                  setAdminView("quizzes");
                  setShowQuizList(true);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="dashboard-page"
      style={{
        background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
        color: "#111827",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <main className="dashboard-main-single" style={{ background: "transparent" }}>
        <header style={{ marginBottom: "40px" }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "28px",
              boxShadow: "0 10px 25px rgba(124,58,237,0.12)",
              position: "relative",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontSize: "52px",
                fontWeight: "800",
                color: "#111827",
                margin: 0,
              }}
            >
              Admin Panel
            </h1>

            <button
              className="hero-button"
              onClick={logout}
              style={{
                position: "absolute",
                right: "30px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <section className="dashboard-content-section">
          <h2 className="section-title">Manage Learning Content</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
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
                  boxShadow: "0 8px 20px rgba(124,58,237,0.08)",
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
                  boxShadow: "0 8px 20px rgba(124,58,237,0.08)",
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
                    background: newQuizPremium ? "#7C3AED" : "#E9D5FF",
                    color: newQuizPremium ? "#fff" : "#7C3AED",
                  }}
                >
                  {newQuizPremium ? "💎 Premium Quiz" : "🆓 Free Quiz"}
                </button>

                {quizQuestions.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginTop: "20px",
                      padding: "20px",
                      borderRadius: "18px",
                      background: "#FAF7FF",
                      border: "1px solid #E9D5FF",
                    }}
                  >
                    <h4>Question {index + 1}</h4>

                    <input
                      placeholder={`Question ${index + 1}`}
                      value={item.question}
                      onChange={(e) =>
                        updateQuizQuestion(index, "question", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="Option A"
                      value={item.optionA}
                      onChange={(e) =>
                        updateQuizQuestion(index, "optionA", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="Option B"
                      value={item.optionB}
                      onChange={(e) =>
                        updateQuizQuestion(index, "optionB", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="Option C"
                      value={item.optionC}
                      onChange={(e) =>
                        updateQuizQuestion(index, "optionC", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="Option D"
                      value={item.optionD}
                      onChange={(e) =>
                        updateQuizQuestion(index, "optionD", e.target.value)
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="Correct answer must match option text"
                      value={item.correctAnswer}
                      onChange={(e) =>
                        updateQuizQuestion(index, "correctAnswer", e.target.value)
                      }
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

          {showQuizList && (
  <div style={{ marginTop: "30px" }}>
    {["beginner", "intermediate", "advanced"].map((level) => {
      const quizzesByLevel = getAllSystemQuizzes().filter(
        (quiz) => quiz.level === level
      );

      return (
        <div
          key={`quiz-level-${level}`}
          className="module-card"
          style={{
            marginBottom: "25px",
            padding: "28px",
            borderRadius: "24px",
            background: "#ffffff",
            border: "2px solid #22C55E",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              color: "#111827",
              textTransform: "uppercase",
              marginBottom: "18px",
              textAlign: "left",
            }}
          >
            {level.toUpperCase()}
          </h2>

          {quizzesByLevel.length === 0 ? (
            <p>No quizzes added yet.</p>
          ) : (
            <ol style={{ paddingLeft: "25px", margin: 0 }}>
              {quizzesByLevel.map((quiz, index) => (
                <li
                  key={`${quiz.id}-${index}`}
                  style={{
                    marginBottom: "16px",
                    paddingBottom: "14px",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <strong>
                        {quiz.icon} {quiz.title}
                      </strong>
                    </div>

                    <button
                      className="hero-button"
                      onClick={() => handleEditQuiz(quiz)}
                    >
                      Edit
                    </button>

                    <button
                      className="hero-button"
                      style={{ background: "#ef4444" }}
                      onClick={() => {
                        if (quiz.canDelete) {
                          deleteQuiz(quiz.realId);
                        } else {
                          alert("Quiz dari student/system tidak boleh delete.");
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      );
    })}
  </div>
)}

          {showSubjectList && (
            <div style={{ marginTop: "30px" }}>
              {["beginner", "intermediate", "advanced"].map((level) => (
                <div
                  key={level}
                  className="module-card"
                  style={{
                    marginBottom: "25px",
                    padding: "28px",
                    borderRadius: "24px",
                    background: "#ffffff",
                    border: "2px solid #22C55E",
                    textAlign: "left",
                  }}
                >
                  <h2
                    style={{
                      color: "#7C3AED",
                      textTransform: "uppercase",
                      marginBottom: "18px",
                      textAlign: "left",
                    }}
                  >
                    {level.toUpperCase()}
                  </h2>

                  {(studentSubjectsByLevel[level] || []).length === 0 ? (
                    <p>No subjects available in the student view yet.</p>
                  ) : (
                    <ol style={{ paddingLeft: "25px", margin: 0 }}>
                      {(studentSubjectsByLevel[level] || []).map((subject, index) => (
                        <li
                          key={`${level}-${subject.id}-${index}`}
                          style={{
                            marginBottom: "16px",
                            paddingBottom: "14px",
                            borderBottom: "1px solid #E5E7EB",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr auto auto",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div>
                              <strong>
                                {subject.icon} {subject.title}
                              </strong>

                              <p style={{ margin: "5px 0 0" }}>
                                {subject.description}
                              </p>
                            </div>

                            <button
                              className="hero-button"
                              onClick={() => handleEditSubject(subject, level)}
                            >
                              Edit
                            </button>

                            <button
                              className="hero-button"
                              style={{ background: "#ef4444" }}
                              onClick={() => deleteSubject(subject.id, level)}
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
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