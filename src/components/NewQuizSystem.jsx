import { useEffect, useMemo, useState } from "react";
import "../App.css";
import FloatingAiChat from "./FloatingAiChat.jsx";

export const getSystemQuizSets = (topic = "this topic") => ({
  "quiz-1": [
    {
      id: 1,
      question: `What is the main purpose of learning ${topic}?`,
      options: [
        "To ignore data completely",
        "To understand important concepts and applications",
        "To replace all programming languages",
        "To avoid practical work"
      ],
      correctAnswer: "To understand important concepts and applications",
      explanation:
        "Learning helps understand important concepts and how they are applied in real situations."
    },
    {
      id: 2,
      question: `Why is ${topic} important in real-world situations?`,
      options: [
        "It helps solve problems using knowledge and skills",
        "It makes learning unnecessary",
        "It removes the need for practice",
        "It is only useful for games"
      ],
      correctAnswer: "It helps solve problems using knowledge and skills",
      explanation:
        `${topic} is important because it helps learners apply knowledge to solve real-world problems.`
    }
  ],

  "quiz-2": [
    {
      id: 1,
      question: `Which of the following is a key concept in ${topic}?`,
      options: [
        "Understanding data and information",
        "Ignoring analysis",
        "Deleting all results",
        "Avoiding decision making"
      ],
      correctAnswer: "Understanding data and information",
      explanation:
        `A key concept in ${topic} is understanding data, information, and how they can support better decisions.`
    },
    {
      id: 2,
      question: `What should students do to improve their understanding of ${topic}?`,
      options: [
        "Practice using examples and exercises",
        "Avoid reading materials",
        "Skip all quizzes",
        "Only memorize without understanding"
      ],
      correctAnswer: "Practice using examples and exercises",
      explanation:
        "Practice helps students understand concepts more clearly and apply them in different situations."
    }
  ]
});

export const getSystemQuizList = (topic = "Data Science") => {
  const quizSets = getSystemQuizSets(topic);

  return [
    {
      id: "quiz-1",
      title: "Test Your Knowledge: Fundamentals Quiz",
      description: `${quizSets["quiz-1"].length} questions available`,
      level: "Beginner",
      questions: quizSets["quiz-1"]
    },
    {
      id: "quiz-2",
      title: "Check Your Understanding",
      description: `${quizSets["quiz-2"].length} questions available`,
      level: "Beginner",
      questions: quizSets["quiz-2"]
    }
  ];
};

function NewQuizSystem({
  module,
  onBack,
  setQuizScore,
  setPracticalScore,
  updateAdaptiveLevel,
  completedItems = [],
  setCompletedItems,
  saveSubjectProgress,
}) {
  const topic = module?.title || "What is Data Science?";
  const currentLevel = localStorage.getItem("learningLevel") || "beginner";
  const safeCompletedItems = Array.isArray(completedItems) ? completedItems : [];

  const getSubjectKey = () => {
    const normalizedLevel = currentLevel.toLowerCase();

    if (module?.id != null && module?.level) {
      return `${module.id}_${module.level.toLowerCase()}`;
    }

    const normalizedTitle = topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return `${normalizedTitle}_${normalizedLevel}`;
  };

  const getSubjectPrefix = () => `${getSubjectKey()}`;

  const resolveBaseId = (item) => item.baseId || item.id;

  const [activeItem, setActiveItem] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeModuleNumber, setActiveModuleNumber] = useState(null);

  const [showModuleNote, setShowModuleNote] = useState(false);
  const [noteMode, setNoteMode] = useState("write");
  const [selectedModuleItem, setSelectedModuleItem] = useState(null);
  const [selectedBookModuleId, setSelectedBookModuleId] = useState(null);
  const [moduleNote, setModuleNote] = useState("");
  const [, setNotesVersion] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [practicalText, setPracticalText] = useState("");
  const [practicalSubmitted, setPracticalSubmitted] = useState(false);
  const [apiModuleContent, setApiModuleContent] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

useEffect(() => {
  if (currentLevel !== "beginner" || !activeModuleNumber) {
    setApiModuleContent(null);
    return;
  }

  const subjectKey = getSubjectKey();

  setApiLoading(true);

  fetch(`http://localhost:5000/api/beginner/${subjectKey}/${activeModuleNumber}`)
    .then((response) => response.json())
    .then((data) => {
      setApiModuleContent(data);
      setApiLoading(false);
    })
    .catch((error) => {
      console.error("Failed to fetch beginner API:", error);
      setApiModuleContent(null);
      setApiLoading(false);
    });
}, [activeModuleNumber, topic, currentLevel]);
const getModuleApiContent = () => {
  return apiModuleContent;
};
const getYoutubeEmbedUrl = (url) => {
  if (!url) return "";

  const videoId = url.includes("v=")
    ? url.split("v=")[1]?.split("&")[0]
    : url.split("/").pop();

  return `https://www.youtube.com/embed/${videoId}`;
};

const isAdminCreatedSubject =
  module?.modules && Array.isArray(module.modules) && module.modules.length > 0;

const getAdminItemContent = (item) => {
  if (!item) return null;

  return {
    readingContent: item.content || "",
    videoLink: item.videoLink || "",
    quizQuestions: item.questions || [],
    practicalInstruction: item.instruction || ""
  };
};

const moduleSections = useMemo(() => {
  const subjectPrefix = getSubjectPrefix();

  if (module?.modules && Array.isArray(module.modules) && module.modules.length > 0) {
    return module.modules.map((moduleItem, index) => {
      const moduleNumber = moduleItem.moduleNumber || moduleItem.number || index + 1;
      const sectionId = moduleItem.id || `${subjectPrefix}-module-${moduleNumber}`;

      if (Array.isArray(moduleItem.items) && moduleItem.items.length > 0) {
        return {
          id: sectionId,
          moduleNumber,
          heading: moduleItem.heading || moduleItem.title || `Module ${moduleNumber}`,
          items: moduleItem.items.map((item, itemIndex) => ({
            ...item,
            id: item.id || `${sectionId}-item-${itemIndex + 1}`,
            baseId:
              item.baseId ||
              item.id ||
              `${String(item.type || "item").toLowerCase().replace(/\s+/g, "-")}-${moduleNumber}`,
            type: item.type || "Reading",
            title: item.title || `${item.type || "Learning"} ${moduleNumber}`
          }))
        };
      }

      return {
        id: sectionId,
        moduleNumber,
        heading: moduleItem.heading || moduleItem.title || `Module ${moduleNumber}`,
        items: [
          {
            id: `${sectionId}-reading`,
            baseId: `reading-${moduleNumber}`,
            type: "Reading",
            title: moduleItem.readingTitle || `Reading: ${moduleItem.title || topic}`,
            content: moduleItem.content || moduleItem.readingContent || ""
          },
          {
            id: `${sectionId}-video`,
            baseId: `video-${moduleNumber}`,
            type: "Video",
            title: moduleItem.videoTitle || `Video: ${moduleItem.title || topic}`,
            videoLink: moduleItem.videoLink || moduleItem.video || ""
          },
          {
            id: `${sectionId}-quiz`,
            baseId: `quiz-${moduleNumber}`,
            type: "Quiz",
            title: moduleItem.quizTitle || `Quiz: ${moduleItem.title || topic}`,
            questions: moduleItem.questions || []
          },
          {
            id: `${sectionId}-practical`,
            baseId: `practical-${moduleNumber}`,
            type: "Practical Assignment",
            title: moduleItem.practicalTitle || `Practical: ${moduleItem.title || topic}`,
            instruction: moduleItem.instruction || moduleItem.practicalInstruction || ""
          }
        ]
      };
    });
  }

  return [
    {
      id: `${subjectPrefix}-module-1`,
      moduleNumber: 1,
      heading: `Introduction to ${topic}`,
      items: [
        {
          id: `${subjectPrefix}-reading-1`,
          baseId: "reading-1",
          type: "Reading",
          title: `Reading: Introduction to ${topic}`
        },
        {
          id: `${subjectPrefix}-video-1`,
          baseId: "video-1",
          type: "Video",
          title: `Video: Introduction to ${topic}`
        },
        {
          id: `${subjectPrefix}-quiz-1`,
          baseId: "quiz-1",
          type: "Quiz",
          title: "Test Your Knowledge: Fundamentals Quiz",
          questions: getSystemQuizSets(topic)["quiz-1"]
        },
        {
          id: `${subjectPrefix}-practical-1`,
          baseId: "practical-1",
          type: "Practical Assignment",
          title: `Practical Activity: ${topic}`
        }
      ]
    },
    {
      id: `${subjectPrefix}-module-2`,
      moduleNumber: 2,
      heading: `Applying ${topic}`,
      items: [
        {
          id: `${subjectPrefix}-reading-2`,
          baseId: "reading-2",
          type: "Reading",
          title: `Reading: Applying ${topic}`
        },
        {
          id: `${subjectPrefix}-video-2`,
          baseId: "video-2",
          type: "Video",
          title: `Video: Applying ${topic}`
        },
        {
          id: `${subjectPrefix}-quiz-2`,
          baseId: "quiz-2",
          type: "Quiz",
          title: "Check Your Understanding",
          questions: getSystemQuizSets(topic)["quiz-2"]
        },
        {
          id: `${subjectPrefix}-practical-2`,
          baseId: "practical-2",
          type: "Practical Assignment",
          title: `Practical Activity: Applying ${topic}`
        }
      ]
    }
  ];
}, [module, topic, currentLevel]);
  const getStudentQuizEditKey = (quizBaseId) => {
  return `${getSubjectKey()}_${quizBaseId}`;
};

const getStudentQuizEdits = () => {
  try {
    return JSON.parse(localStorage.getItem("bbStudentQuizEdits") || "{}");
  } catch {
    return {};
  }
};

const getEditedQuizItem = (item) => {
  if (!item || item.type !== "Quiz") return item;

  const quizBaseId = resolveBaseId(item);
  const editKey = getStudentQuizEditKey(quizBaseId);
  const edits = getStudentQuizEdits();

  if (!edits[editKey]) return item;

  return {
    ...item,
    title: edits[editKey].title || item.title,
    questions: edits[editKey].questions || item.questions,
  };
};

  useEffect(() => {
    if (typeof saveSubjectProgress !== "function") return;

    const subjectKey = getSubjectKey();
    if (!subjectKey) return;

    const currentModuleItemIds = moduleSections.flatMap((section) =>
      section.items.map((item) => item.id)
    );

    if (
      currentModuleItemIds.length > 0 &&
      currentModuleItemIds.every((id) => safeCompletedItems.includes(id))
    ) {
      saveSubjectProgress(subjectKey, { completed: true, percentage: 100 });
    }
  }, [safeCompletedItems, moduleSections, saveSubjectProgress]);

  const moduleContent = {
  "reading-1": {
    intro: `${topic} is the foundation of understanding how data, algorithms, and technology work together. In this module, you will learn the basic meaning, purpose, and real-world use of ${topic}.`,
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80"
  },

  "video-1": {
    video:
      topic === "Data Visualization"
        ? "https://www.youtube.com/embed/AdSZJzb-aX8"
        : "https://www.youtube.com/embed/ukzFI9rgwfU"
  },

  "practical-1": {
    task:
      topic === "Data Visualization"
        ? [
            "Choose one dataset that contains categories and numbers.",
            "Create one bar chart to compare categories.",
            "Create one pie chart to show percentage distribution.",
            "Explain which chart is easier to understand and why."
          ]
        : [
            "Choose one simple dataset from Kaggle or Google Dataset Search.",
            "Identify the number of rows, columns, and data types.",
            "Write three important findings from the dataset.",
            "Explain how this dataset can be applied in a real-world scenario."
          ]
  },

  "reading-2": {
    intro:
      topic === "Data Visualization"
        ? "Data Visualization is the process of presenting data using charts, graphs, and dashboards. It helps users understand patterns, trends, comparisons, and insights more easily. Good visualization makes complex data simple and supports better decision making."
        : `${topic} becomes more meaningful when learners understand how theory connects with programming and data analysis. This module focuses on intermediate concepts such as data preparation, pattern recognition, visualization, and analytical thinking that are useful for solving practical problems.`,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  },

  "video-2": {
    video:
      topic === "Data Visualization"
        ? "https://www.youtube.com/embed/GPVsHOlRBBI"
        : "https://www.youtube.com/embed/GwIo3gDZCVQ"
  },

  "practical-2": {
    task:
      topic === "Data Visualization"
        ? [
            "Prepare a dataset using CSV or Excel format.",
            "Create at least two visualizations such as a bar chart and line chart.",
            "Add proper chart titles, labels, and legends.",
            "Write a short explanation about the insight shown by each chart."
          ]
        : [
            "Prepare a small dataset using CSV or Excel format.",
            "Check for missing values and incorrect data types.",
            "Create one simple chart such as a bar chart or line chart.",
            "Write a short explanation describing the results of your analysis."
          ]
  }
};

  const getUserKey = () =>
    localStorage.getItem("loggedInUser") ||
    localStorage.getItem("email") ||
    "guest";

  const notesStorageKey = `notes_${getUserKey()}`;
  const draftNotesStorageKey = `moduleDraftNotes_${getUserKey()}`;
  const subjectId = module?.id ||
    topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const getDraftNotes = () => {
    try {
      return JSON.parse(localStorage.getItem(draftNotesStorageKey)) || [];
    } catch {
      return [];
    }
  };

  const getMyNotes = () => {
    try {
      return JSON.parse(localStorage.getItem(notesStorageKey)) || [];
    } catch {
      return [];
    }
  };

  const getDateTime = () => {
    return new Date().toLocaleString("en-MY", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const findDraftNote = (section) => {
    const draftNotes = getDraftNotes();

    return draftNotes.find(
      (note) =>
        note.level === currentLevel &&
        note.subject === topic &&
        note.moduleId === section.id
    );
  };

  const getSubjectDraftNotes = () => {
    const draftNotes = getDraftNotes();

    return draftNotes.filter(
      (note) => note.level === currentLevel && note.subject === topic
    );
  };

  const getGroupedBookNotes = () => {
    const subjectDraftNotes = getSubjectDraftNotes();

    return moduleSections
      .map((section) => {
        const note = subjectDraftNotes.find(
          (draftNote) => draftNote.moduleId === section.id
        );

        return {
          moduleId: section.id,
          moduleNumber: section.moduleNumber,
          moduleName: section.heading,
          note: note || null
        };
      })
      .filter((moduleGroup) => moduleGroup.note);
  };

  const getSelectedBookModule = () => {
    const groupedNotes = getGroupedBookNotes();

    if (selectedBookModuleId) {
      const selected = groupedNotes.find(
        (moduleGroup) => moduleGroup.moduleId === selectedBookModuleId
      );

      if (selected) return selected;
    }

    return groupedNotes[0] || null;
  };

  const openWriteNote = (item, section) => {
    const savedNote = findDraftNote(section);

    setSelectedModuleItem({ ...item, section });
    setSelectedBookModuleId(null);
    setModuleNote(savedNote ? savedNote.content : "");
    setNoteMode("write");
    setShowModuleNote(true);
  };

  const openViewNote = (item, section) => {
    const groupedNotes = getGroupedBookNotes();

    setSelectedModuleItem({ ...item, section });

    if (groupedNotes.length > 0) {
      const currentModuleHasNote = groupedNotes.find(
        (moduleGroup) => moduleGroup.moduleId === section.id
      );

      setSelectedBookModuleId(
        currentModuleHasNote
          ? currentModuleHasNote.moduleId
          : groupedNotes[0].moduleId
      );
    } else {
      setSelectedBookModuleId(null);
    }

    setModuleNote("");
    setNoteMode("view");
    setShowModuleNote(true);
  };

  const saveModuleNote = () => {
    if (!selectedModuleItem || !moduleNote.trim()) return;

    const existingDraftNotes = getDraftNotes();
    const section = selectedModuleItem.section;
    const currentDateTime = getDateTime();

    const newDraftNote = {
      id: `${currentLevel}-${topic}-${section.id}`,
      level: currentLevel,
      subject: topic,
      moduleId: section.id,
      moduleNumber: section.moduleNumber,
      moduleName: section.heading,
      title: `Module ${section.moduleNumber}`,
      content: moduleNote.trim(),
      color: "#7C3AED",
      dateTime: currentDateTime
    };

    const noteExists = existingDraftNotes.some(
      (note) =>
        note.level === currentLevel &&
        note.subject === topic &&
        note.moduleId === section.id
    );

    const updatedDraftNotes = noteExists
      ? existingDraftNotes.map((note) =>
          note.level === currentLevel &&
          note.subject === topic &&
          note.moduleId === section.id
            ? newDraftNote
            : note
        )
      : [newDraftNote, ...existingDraftNotes];

    localStorage.setItem(draftNotesStorageKey, JSON.stringify(updatedDraftNotes));

    const existingMyNotes = getMyNotes();

    const myNoteExists = existingMyNotes.some(
      (note) =>
        note.level === currentLevel &&
        note.subject === topic &&
        note.moduleId === section.id
    );

    if (myNoteExists) {
      const updatedMyNotes = existingMyNotes.map((note) =>
        note.level === currentLevel &&
        note.subject === topic &&
        note.moduleId === section.id
          ? {
              ...note,
              title: topic,
              subject: topic,
              moduleId: section.id,
              moduleNumber: section.moduleNumber,
              moduleName: section.heading,
              content: moduleNote.trim(),
              color: "#7C3AED",
              dateTime: currentDateTime
            }
          : note
      );

      localStorage.setItem(notesStorageKey, JSON.stringify(updatedMyNotes));
      alert("Note saved to Book and updated in My Notes!");
    } else {
      alert("Note saved to Book!");
    }

    setNotesVersion((prev) => prev + 1);
    setShowModuleNote(false);
  };

  const saveModuleGroupToMyNotes = (moduleGroup) => {
    if (!moduleGroup || !moduleGroup.note) return;

    const existingNotes = getMyNotes();
    const draftNote = moduleGroup.note;

    const newMyNote = {
      id: `note-${Date.now()}`,
      userId: getUserKey(),
      subjectId,
      subject: draftNote.subject,
      subjectName: draftNote.subject,
      level: draftNote.level || currentLevel || "beginner",
      moduleId: draftNote.moduleId,
      moduleNumber: draftNote.moduleNumber,
      moduleName: draftNote.moduleName,
      content: draftNote.content,
      color: draftNote.color || "#7C3AED",
      createdAt: new Date().toISOString(),
      dateTime: getDateTime()
    };

    const noteExists = existingNotes.some(
      (note) =>
        note.subjectId === subjectId &&
        note.moduleId === draftNote.moduleId
    );

    const updatedNotes = noteExists
      ? existingNotes.map((note) =>
          note.subjectId === subjectId &&
          note.moduleId === draftNote.moduleId
            ? { ...note, ...newMyNote }
            : note
        )
      : [newMyNote, ...existingNotes];

    console.log("Saving note:", newMyNote);
    console.log("Notes storage before save:", existingNotes);
    console.log("Notes storage after save:", updatedNotes);

    localStorage.setItem(notesStorageKey, JSON.stringify(updatedNotes));
    window.dispatchEvent(new Event("notesUpdated"));
    alert("Note saved to My Notes!");
  };

  const deleteModuleBookNote = (moduleGroup) => {
    if (!moduleGroup || !moduleGroup.note) return;

    const confirmDelete = window.confirm(
      `Delete Module ${moduleGroup.moduleNumber} note from Book?`
    );

    if (!confirmDelete) return;

    const existingDraftNotes = getDraftNotes();

    const updatedDraftNotes = existingDraftNotes.filter(
      (note) =>
        !(
          note.level === currentLevel &&
          note.subject === topic &&
          note.moduleId === moduleGroup.moduleId
        )
    );

    localStorage.setItem(draftNotesStorageKey, JSON.stringify(updatedDraftNotes));

    setSelectedBookModuleId(null);
    setNotesVersion((prev) => prev + 1);

    alert("Note deleted from Book only.");
  };

  const renderModuleNotePanel = () => {
    if (!showModuleNote || !selectedModuleItem) return null;

    const section = selectedModuleItem.section;
    const shortTitle = `Module ${section.moduleNumber}`;
    const groupedBookNotes = getGroupedBookNotes();
    const selectedBookModule = getSelectedBookModule();

    return (
      <div
        className="module-note-panel"
        style={{
          width: noteMode === "view" ? "430px" : "320px",
          maxHeight: "470px",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "18px"
        }}
      >
        <div className="module-note-header">
          <div>
            <h3 style={{ margin: 0 }}>
              {noteMode === "write" ? shortTitle : "Saved Notes"}
            </h3>

            <p
              style={{
                margin: "6px 0 0",
                fontSize: "13px",
                color: "#6B7280"
              }}
            >
              {noteMode === "write"
                ? "Write / edit module note"
                : `Book notes for ${topic}`}
            </p>
          </div>

          <button onClick={() => setShowModuleNote(false)}>×</button>
        </div>

        {noteMode === "write" && (
          <>
            <textarea
              value={moduleNote}
              onChange={(e) => setModuleNote(e.target.value)}
              placeholder="Write your module note here..."
              className="module-note-textarea"
              style={{
                minHeight: "160px",
                fontSize: "14px"
              }}
            />

            <button className="module-note-save-btn" onClick={saveModuleNote}>
              Save Note
            </button>

            <p
              style={{
                margin: "12px 0 0",
                color: "#6B7280",
                fontSize: "12px",
                textAlign: "center"
              }}
            >
              This note will be saved in Book only.
            </p>
          </>
        )}

        {noteMode === "view" && (
          <>
            {groupedBookNotes.length === 0 ? (
              <div
                style={{
                  background: "#F5F3FF",
                  border: "1px solid #DDD6FE",
                  borderRadius: "14px",
                  padding: "14px",
                  marginTop: "14px",
                  color: "#6B7280",
                  fontSize: "14px"
                }}
              >
                No notes saved in this subject yet.
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                    marginTop: "14px"
                  }}
                >
                  {groupedBookNotes.map((moduleGroup) => (
                    <button
                      key={moduleGroup.moduleId}
                      onClick={() =>
                        setSelectedBookModuleId(moduleGroup.moduleId)
                      }
                      style={{
                        width: "100%",
                        border:
                          selectedBookModule?.moduleId === moduleGroup.moduleId
                            ? "2px solid #7C3AED"
                            : "1px solid #DDD6FE",
                        background:
                          selectedBookModule?.moduleId === moduleGroup.moduleId
                            ? "#F3E8FF"
                            : "white",
                        color: "#111827",
                        borderRadius: "14px",
                        padding: "12px 14px",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px"
                      }}
                    >
                      <span>
                        <strong style={{ color: "#7C3AED" }}>
                          Module {moduleGroup.moduleNumber}
                        </strong>
                        <br />
                        <span style={{ fontSize: "12px", color: "#6B7280" }}>
                          1 saved note
                        </span>
                      </span>

                      <span style={{ color: "#7C3AED", fontWeight: "700" }}>
                        ›
                      </span>
                    </button>
                  ))}
                </div>

                {selectedBookModule && selectedBookModule.note && (
                  <div
                    style={{
                      background: "#F5F3FF",
                      border: "1px solid #DDD6FE",
                      borderRadius: "14px",
                      padding: "14px",
                      marginTop: "14px"
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 10px",
                        color: "#111827",
                        fontSize: "15px",
                        textAlign: "center"
                      }}
                    >
                      Module {selectedBookModule.moduleNumber} Notes
                    </h4>

                    <div
                      style={{
                        background: "white",
                        border: "1px solid #E9D5FF",
                        borderRadius: "12px",
                        padding: "12px"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          alignItems: "flex-start"
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              whiteSpace: "pre-line",
                              fontSize: "14px",
                              lineHeight: "1.6",
                              color: "#374151",
                              textAlign: "center",
                              wordBreak: "break-word",
                              overflowWrap: "anywhere"
                            }}
                          >
                            {selectedBookModule.note.content}
                          </p>

                          <p
                            style={{
                              margin: "10px 0 0",
                              color: "#6B7280",
                              fontSize: "12px",
                              textAlign: "center",
                              wordBreak: "break-word"
                            }}
                          >
                            {selectedBookModule.note.dateTime}
                          </p>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px"
                          }}
                        >
                          <button
                            style={{
                              border: "1px solid #DDD6FE",
                              background: "white",
                              color: "#7C3AED",
                              borderRadius: "10px",
                              padding: "8px 10px",
                              fontWeight: "700",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                            onClick={() => {
                              const editSection = moduleSections.find(
                                (moduleSection) =>
                                  moduleSection.id ===
                                  selectedBookModule.moduleId
                              );

                              if (!editSection) return;

                              setSelectedModuleItem({
                                id: `module-${selectedBookModule.moduleId}`,
                                type: "Module Note",
                                title: `Module ${selectedBookModule.moduleNumber}`,
                                section: editSection
                              });

                              setModuleNote(selectedBookModule.note.content);
                              setNoteMode("write");
                            }}
                          >
                            Edit
                          </button>

                          <button
                            style={{
                              border: "1px solid #FCA5A5",
                              background: "#FEE2E2",
                              color: "#DC2626",
                              borderRadius: "10px",
                              padding: "8px 10px",
                              fontWeight: "700",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                            onClick={() =>
                              deleteModuleBookNote(selectedBookModule)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      className="module-note-save-btn"
                      style={{ marginTop: "14px" }}
                      onClick={() => saveModuleGroupToMyNotes(selectedBookModule)}
                    >
                      Save My Notes
                    </button>

                    <p
                      style={{
                        margin: "10px 0 0",
                        color: "#6B7280",
                        fontSize: "12px",
                        textAlign: "center"
                      }}
                    >
                      My Notes will only update after this button is clicked.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const ContentNoteActions = ({ item, section }) => {
    return (
      <>
        <div className="content-note-actions">
          <button
            className="content-note-btn"
            onClick={() => openWriteNote(item, section)}
            title="Write note"
          >
            ✏️
          </button>

          <button
            className="content-note-btn"
            onClick={() => openViewNote(item, section)}
            title="View saved notes"
          >
            📒
          </button>
        </div>

        <FloatingAiChat />
      </>
    );
  };

  const allItems = moduleSections.flatMap((section) => section.items);

  const markItemCompleted = (itemId) => {
    const todayKey = new Date().toISOString().split("T")[0];

    localStorage.setItem(`completedToday_${todayKey}`, "true");

    if (typeof setCompletedItems !== "function") return;

    setCompletedItems((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      return current.includes(itemId) ? current : [...current, itemId];
    });
  };

const openContent = (item, section) => {
  const moduleKey = `${topic}_Module_${section.moduleNumber}`;

  localStorage.setItem("currentModule", moduleKey);

  setActiveItem(getEditedQuizItem(item));
  setActiveSection(section);
  setActiveModuleNumber(section.moduleNumber);

  // Auto complete Reading, Video & Practical
  if (item.type !== "Quiz") {
    markItemCompleted(item.id);
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

  const goBackToModuleList = () => {
    setActiveItem(null);
    setActiveSection(null);
    setActiveModuleNumber(null);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setShowModuleNote(false);
    setSelectedBookModuleId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

const currentSubjectCompleted = safeCompletedItems.filter(id =>
  allItems.some(item => item.id === id)
);

const progress =
  allItems.length > 0
    ? Math.min(
        100,
        Math.round(
          (currentSubjectCompleted.length / allItems.length) * 100
        )
      )
    : 0;

  const quizSets = getSystemQuizSets(topic);

  const handleAnswerSelect = (quizId, questionId, option) => {
    if (quizSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [`${quizId}-${questionId}`]: option
    }));
  };

  const handleQuizSubmit = () => {
    const quizId = resolveBaseId(activeItem);
    const questions = quizSets[quizId] || [];

    let correct = 0;

    questions.forEach((question) => {
      if (
        selectedAnswers[`${quizId}-${question.id}`] === question.correctAnswer
      ) {
        correct++;
      }
    });

    const percent = questions.length
      ? Math.round((correct / questions.length) * 100)
      : 0;

    setQuizSubmitted(true);
    markItemCompleted(activeItem.id);

    if (typeof setQuizScore === "function") setQuizScore(percent);


    if (typeof updateAdaptiveLevel === "function") {
      updateAdaptiveLevel(percent, null);
    }
  };

  const handlePracticalSubmit = () => {
    setPracticalSubmitted(true);
    markItemCompleted(activeItem.id);

    const percent = practicalText.trim().length > 10 ? 80 : 40;

    if (typeof setPracticalScore === "function") setPracticalScore(percent);

    if (typeof updateAdaptiveLevel === "function") {
      updateAdaptiveLevel(null, percent);
    }
  };

  if (activeItem?.type === "Reading") {
    return (
      <div className="quiz-page">
        <div className="content-card module-content-card">
          <button className="module-back-btn" onClick={goBackToModuleList}>
            ← Back to Module
          </button>

<h2 className="content-title">
  {getModuleApiContent()?.reading?.title || activeItem.title}
</h2>
{apiLoading && (
  <p style={{ textAlign: "center", color: "#6B7280" }}>
    Loading reading material...
  </p>
)}

{getModuleApiContent()?.reading?.image && (
  <img
    src={getModuleApiContent().reading.image}
    alt={getModuleApiContent().reading.title}
    style={{
      width: "100%",
      maxWidth: "850px",
      borderRadius: "18px",
      margin: "22px auto",
      display: "block",
      boxShadow: "0 12px 28px rgba(124, 58, 237, 0.18)"
    }}
  />
)}

{getModuleApiContent()?.reading?.url && (
  <a
    href={getModuleApiContent().reading.url}
    target="_blank"
    rel="noreferrer"
    className="hero-button"
    style={{
      display: "block",
      textAlign: "center",
      margin: "20px auto",
      maxWidth: "260px"
    }}
  >
    Open Reading Material
  </a>
)}

          <div className="reading-block">
            <h3>Introduction</h3>

            <img
              src={moduleContent[resolveBaseId(activeItem)]?.image}
              alt={activeItem.title}
              style={{
                width: "100%",
                maxHeight: "260px",
                objectFit: "cover",
                borderRadius: "16px",
                marginBottom: "16px"
              }}
            />
<p className="content-text">
  {isAdminCreatedSubject
    ? activeItem.content || "No reading content added yet."
    : moduleContent[resolveBaseId(activeItem)]?.intro || "No reading content added yet."}
</p>
</div>

<ContentNoteActions item={activeItem} section={activeSection} />
        </div>

        {renderModuleNotePanel()}
      </div>
    );
  }

  if (activeItem?.type === "Video") {
    return (
      <div className="quiz-page">
        <div className="content-card module-content-card">
          <button className="module-back-btn" onClick={goBackToModuleList}>
            ← Back to Module
          </button>

          <h2 className="content-title">
  {getModuleApiContent()?.video?.title || activeItem.title}
</h2>

 {moduleContent[resolveBaseId(activeItem)]?.video ? (
  <div
    style={{
      marginTop: "20px",
      position: "relative",
      textAlign: "center"
    }}
  >
    <img
      src={`https://img.youtube.com/vi/${
        moduleContent[resolveBaseId(activeItem)]?.video
          .split("embed/")[1]
          ?.split("?")[0]
      }/hqdefault.jpg`}
      alt="Video Preview"
      style={{
        width: "100%",
        maxWidth: "850px",
        borderRadius: "18px",
        boxShadow: "0 12px 28px rgba(124, 58, 237, 0.18)"
      }}
    />

    <a
      href={moduleContent[resolveBaseId(activeItem)]?.video.replace(
        "/embed/",
        "/watch?v="
      )}
      target="_blank"
      rel="noreferrer"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#7C3AED",
        color: "white",
        padding: "14px 24px",
        borderRadius: "999px",
        textDecoration: "none",
        fontWeight: "700",
        fontSize: "16px",
        boxShadow: "0 10px 25px rgba(124,58,237,0.35)"
      }}
    >
      ▶ Open in YouTube
    </a>
  </div>
) : (
  <div className="fake-video-frame">
    <div className="play-button">No Video Available</div>
  </div>
)}
          <ContentNoteActions item={activeItem} section={activeSection} />
        </div>

        {renderModuleNotePanel()}
      </div>
    );
  }

  if (activeItem?.type === "Quiz") {
    const quizId = resolveBaseId(activeItem);
    const savedQuizEdits = getStudentQuizEdits();
    const editKey = getStudentQuizEditKey(quizId);
    const questions =
      savedQuizEdits[editKey]?.questions ||
      activeItem.questions ||
      quizSets[quizId] ||
      [];

    let correctCount = 0;

    if (quizSubmitted) {
      questions.forEach((question) => {
        if (
          selectedAnswers[`${quizId}-${question.id}`] === question.correctAnswer
        ) {
          correctCount++;
        }
      });
    }

    return (
      <div className="quiz-page">
        <div className="content-card module-content-card">
          <button className="module-back-btn" onClick={goBackToModuleList}>
            ← Back to Module
          </button>

          <h2 className="content-title">{activeItem.title}</h2>

          {questions.map((question) => {
            const answerKey = `${quizId}-${question.id}`;
            const selected = selectedAnswers[answerKey];
            const isCorrect = selected === question.correctAnswer;
            const showWrong = quizSubmitted && selected && !isCorrect;

            return (
              <div className="quiz-block" key={question.id}>
                <h3 className="quiz-question">
                  {question.id}. {question.question}
                </h3>

                <div className="options-list">
                  {question.options.map((option) => (
                    <label className="option-item" key={option}>
                      <input
                        type="radio"
                        name={answerKey}
                        value={option}
                        checked={selected === option}
                        onChange={() =>
                          handleAnswerSelect(quizId, question.id, option)
                        }
                        disabled={quizSubmitted}
                      />

                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                {quizSubmitted && isCorrect && (
                  <div className="correct-box">
                    <p>
                      <strong>Correct!</strong> Good job.
                    </p>
                  </div>
                )}

                {showWrong && (
                  <div className="feedback-box">
                    <p>
                      <strong>Correct Answer:</strong> {question.correctAnswer}
                    </p>
                    <p>
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {!quizSubmitted ? (
            <button
              className="hero-button"
              style={{ marginTop: "20px", width: "100%" }}
              onClick={handleQuizSubmit}
            >
              Submit Quiz
            </button>
          ) : (
            <>
              <div
                className="quiz-result-box"
                style={{ marginTop: "20px", textAlign: "center" }}
              >
                <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                  Score: {correctCount} / {questions.length} (
                  {questions.length
                    ? Math.round((correctCount / questions.length) * 100)
                    : 0}
                  %)
                </p>
              </div>


            </>
          )}

          <ContentNoteActions item={activeItem} section={activeSection} />
        </div>

        {renderModuleNotePanel()}
      </div>
    );
  }

  if (activeItem?.type === "Practical Assignment") {
    return (
      <div className="quiz-page">
        <div className="content-card module-content-card">
          <button className="module-back-btn" onClick={goBackToModuleList}>
            ← Back to Module
          </button>

          <h2 className="content-title">{activeItem.title}</h2>

          <p className="practical-intro">
            Complete this simple task based on <strong>{topic}</strong>.
          </p>

          <div className="practical-task-box">
            <h3>Task</h3>

            <ul className="practical-list">
              {(moduleContent[resolveBaseId(activeItem)]?.task || []).map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>

          <p
  style={{
    marginTop: "20px",
    textAlign: "center",
    color: "#6B7280",
    fontSize: "14px",
    lineHeight: "1.6"
  }}
>
  This practical activity is designed for self-learning. Students are encouraged
  to complete the task independently using suitable tools such as Excel, CSV,
  or data visualization software to strengthen their understanding of the topic.
</p>

          <ContentNoteActions item={activeItem} section={activeSection} />
        </div>

        {renderModuleNotePanel()}
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="content-card module-content-card">
        <button className="module-back-btn" onClick={onBack}>
          ← Back
        </button>

        <div className="quiz-header">
          <h1 className="quiz-main-title">{topic}</h1>

          <div className="progress-row">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <span className="progress-text">{progress}% Completed</span>
          </div>
        </div>

        {moduleSections.map((section, index) => (
          <div
            className="module-section-container"
            key={section.id}
            style={{ position: "relative", marginTop: "16px" }}
          >
            <span
              style={{
                display: "inline-block",
                background: "#7C3AED",
                color: "white",
                padding: "4px 14px",
                borderRadius: "8px 8px 0 0",
                fontSize: "12px",
                fontWeight: "600",
                marginLeft: "10px"
              }}
            >
              Module {index + 1}
            </span>

            <h2
              className="module-heading-text"
              style={{ marginTop: "0px", paddingTop: "10px" }}
            >
              {section.heading}
            </h2>

            <div className="learning-list-wrapper">
              {section.items.map((item) => {
                const isCompleted = safeCompletedItems.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="learning-row-item"
                    onClick={() => openContent(item, section)}
                  >
                    <div className="learning-info-left">
                      <h3 className="learning-item-title">
                        {getEditedQuizItem(item).title}
                      </h3>
                      <p className="learning-item-type">{item.type}</p>
                    </div>

                    <div className="learning-status-right">
                      <span
                        className={`status-pill ${
                          isCompleted ? "pill-completed" : "pill-incomplete"
                        }`}
                      >
                        {isCompleted ? "Completed" : "Incomplete"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default NewQuizSystem;