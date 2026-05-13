import { useMemo, useState } from "react";
import "../App.css";
import LeaderboardPage from "../ProgressManagement/LeaderboardPage.jsx";
import FloatingAiChat from "./FloatingAiChat.jsx";

function NewQuizSystem({
  module,
  onBack,
  setQuizScore,
  setPracticalScore,
  updateAdaptiveLevel,
  completedItems = [],
  setCompletedItems,
  updateLeaderboard,
  leaderboard
}) {
  const topic = module?.title || "What is Data Science?";
  const currentLevel = localStorage.getItem("learningLevel") || "beginner";
  const safeCompletedItems = Array.isArray(completedItems) ? completedItems : [];

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

  const moduleSections = useMemo(
    () => [
      {
        id: "module1",
        moduleNumber: 1,
        heading: "Fundamentals",
        items: [
          {
            id: "reading-1",
            type: "Reading",
            title: `Master the Basics: What is ${topic}?`
          },
          {
            id: "video-1",
            type: "Video",
            title: `Watch and Learn: ${topic} Overview`
          },
          {
            id: "quiz-1",
            type: "Quiz",
            title: "Test Your Knowledge: Fundamentals Quiz"
          },
          {
            id: "practical-1",
            type: "Practical Assignment",
            title: "Practical Assignment: Basic Data Exploration"
          }
        ]
      },
      {
        id: "module2",
        moduleNumber: 2,
        heading: "Programming Basics",
        items: [
          {
            id: "reading-2",
            type: "Reading",
            title: `Core Concepts of ${topic}`
          },
          {
            id: "video-2",
            type: "Video",
            title: `Intermediate ${topic} Techniques`
          },
          {
            id: "quiz-2",
            type: "Quiz",
            title: "Check Your Understanding"
          },
          {
            id: "practical-2",
            type: "Practical Assignment",
            title: "Mini Exercise"
          }
        ]
      }
    ],
    [topic]
  );

  const getDraftNotes = () => {
    try {
      return JSON.parse(localStorage.getItem("moduleDraftNotes")) || [];
    } catch {
      return [];
    }
  };

  const getMyNotes = () => {
    try {
      return JSON.parse(localStorage.getItem("notes")) || [];
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

    localStorage.setItem("moduleDraftNotes", JSON.stringify(updatedDraftNotes));

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

      localStorage.setItem("notes", JSON.stringify(updatedMyNotes));
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
      id: `${currentLevel}-${draftNote.subject}-${draftNote.moduleId}`,
      level: currentLevel,
      title: draftNote.subject,
      subject: draftNote.subject,
      moduleId: draftNote.moduleId,
      moduleNumber: draftNote.moduleNumber,
      moduleName: draftNote.moduleName,
      content: draftNote.content,
      color: draftNote.color || "#7C3AED",
      dateTime: getDateTime()
    };

    const noteExists = existingNotes.some(
      (note) =>
        note.level === currentLevel &&
        note.subject === draftNote.subject &&
        note.moduleId === draftNote.moduleId
    );

    const updatedNotes = noteExists
      ? existingNotes.map((note) =>
          note.level === currentLevel &&
          note.subject === draftNote.subject &&
          note.moduleId === draftNote.moduleId
            ? { ...note, ...newMyNote }
            : note
        )
      : [newMyNote, ...existingNotes];

    localStorage.setItem("notes", JSON.stringify(updatedNotes));
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

  localStorage.setItem("moduleDraftNotes", JSON.stringify(updatedDraftNotes));

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
    if (typeof setCompletedItems !== "function") return;

    setCompletedItems((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      return current.includes(itemId) ? current : [...current, itemId];
    });
  };

  const openContent = (item, section) => {
    setActiveItem(item);
    setActiveSection(section);
    setActiveModuleNumber(section.moduleNumber);
    markItemCompleted(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const progress =
    allItems.length > 0
      ? Math.round((safeCompletedItems.length / allItems.length) * 100)
      : 0;
  const isStatisticsSubject = topic === "Statistics Fundamentals";
  const statisticsContent = {
 reading: {
  "reading-1": {
    title: "Statistics Fundamentals Overview",
    paragraphs: [
      "Statistics is the process of collecting, organizing, analyzing, interpreting, and presenting data to gain useful information and support decision-making.",
      "In data science, statistics is important because it helps identify patterns, trends, and relationships within data.",
      "It allows data scientists to understand datasets, make predictions, and draw accurate conclusions based on evidence.",
      "Basic statistical concepts include mean (average value), median (middle value), mode (most frequent value), probability (chance of an event occurring), distribution (spread of data), and standard deviation (measure of data variability).",
      "These concepts provide the foundation for data analysis and machine learning in data science."
    ],
    articleText: "Read this book for better understanding",
    articleLink:
      "https://books.google.com/books?hl=en&lr=&id=dZxSmsvdzIQC&oi=fnd&pg=PA3&dq=statistic+fundamental&ots=HbdwciIiCU&sig=eOag2t1jRWiP--iqaS_YIFqzg1Y"
  },

  "reading-2": {
    title: "Intermediate Statistics Techniques",
    paragraphs: [
     "Intermediate statistics includes concepts such as sampling, hypothesis testing, correlation, regression, and outlier detection, which are commonly used in data analysis and decision-making.",
     "Sampling is the process of selecting a smaller group from a larger population to collect representative data efficiently and accurately.",
     "Hypothesis testing is a statistical method used to determine whether an assumption or claim is supported by the collected data.",
     "Correlation measures the strength and direction of the relationship between two variables, helping identify whether variables are related.",
     "Regression analysis is used to explain relationships between variables and predict future values based on existing data patterns.",
     "Outlier detection helps identify unusual or extreme values in a dataset that may affect the accuracy of analysis and predictions."
    
    ],
    articleText: "Read this article for better understanding",
    articleLink:
      "https://journals.physiology.org/doi/abs/10.1152/jappl.1998.85.3.775"
  }
},

  videos: {
    "video-1": "https://www.youtube.com/embed/XZo4xyJXCak",
    "video-2": "https://www.youtube.com/embed/FmUJSbo_z74"
  },

  quiz: {
    "quiz-1": [
      {
        id: 1,
        question: "What is statistics mainly used for?",
        options: [
          "Collecting and analyzing data",
          "Designing websites",
          "Playing games",
          "Editing photos"
        ],
        correctAnswer: "Collecting and analyzing data",
        explanation: "Statistics helps collect, organize, analyze, and interpret data."
      },
      {
        id: 2,
        question: "Which measure represents the average value?",
        options: ["Median", "Mode", "Mean", "Range"],
        correctAnswer: "Mean",
        explanation: "Mean is the average value of a dataset."
      },
      {
        id: 3,
        question: "Why is statistics important in data science?",
        options: [
          "It helps understand data patterns",
          "It replaces all programming",
          "It removes the need for analysis",
          "It is only used for design"
        ],
        correctAnswer: "It helps understand data patterns",
        explanation: "Statistics helps data scientists understand patterns and make decisions."
      }
    ],

    "quiz-2": [
      {
        id: 1,
        question: "What is sampling used for?",
        options: [
          "Collecting representative data",
          "Deleting data",
          "Changing colors",
          "Avoiding research"
        ],
        correctAnswer: "Collecting representative data",
        explanation: "Sampling collects a smaller group of data that represents a larger population."
      },
      {
        id: 2,
        question: "What does correlation measure?",
        options: [
          "The relationship between variables",
          "The size of a file",
          "The color of a chart",
          "The number of folders"
        ],
        correctAnswer: "The relationship between variables",
        explanation: "Correlation explains how two variables are related."
      },
      {
        id: 3,
        question: "Why is outlier detection important?",
        options: [
          "Outliers may affect analysis accuracy",
          "Outliers always improve data",
          "Outliers remove all errors",
          "Outliers are not related to statistics"
        ],
        correctAnswer: "Outliers may affect analysis accuracy",
        explanation: "Outliers are unusual values that can influence statistical results."
      }
    ]
  },

  practical: {
    "practical-1": [
      "Create a small dataset of 10 student marks.",
      "Calculate the mean, median, and mode.",
      "Identify the highest and lowest marks.",
      "Write a short conclusion about the student performance."
    ],
    "practical-2": [
      "Choose a simple dataset such as sales, marks, or study hours.",
      "Create one chart to show the data pattern.",
      "Identify any trend, relationship, or outlier.",
      "Explain your findings in 3 to 5 sentences."
    ]
  }
};

const isExploratorySubject = topic === "Exploratory Data Analysis";
const exploratoryContent = {
  reading: {
    "reading-1": {
      title: "Introduction to Exploratory Data Analysis",
      paragraphs: [
        "Exploratory Data Analysis (EDA) is the process of examining and analyzing datasets to understand patterns, trends, relationships, and important characteristics within the data.",
        "EDA helps data scientists explore and summarize data before applying machine learning or statistical models, ensuring the data is accurate and meaningful for analysis.",
        "The main purpose of EDA is to detect errors, missing values, unusual patterns, and hidden insights that may affect the performance of data analysis.",
        "Common EDA techniques include data cleaning, data visualization, identifying outliers, checking data distributions, and analyzing relationships between variables.",
        "Visualization tools such as bar charts, histograms, scatter plots, and box plots are often used in EDA to present data in a clearer and more understandable way."
      
      ],
      articleText: "Read this article for better understanding",
      articleLink:
        "https://www.sciencedirect.com/science/article/pii/0377221786902092"
    },

    "reading-2": {
      title: "Core Concepts of Exploratory Data Analysis",
      paragraphs: [
        "Advanced Exploratory Data Analysis (EDA) includes techniques such as correlation analysis, feature relationship analysis, trend analysis, and detecting missing or inconsistent values in datasets.",
        "These techniques help data scientists gain deeper insights into the data and understand how different variables interact with each other.",
        "Visualization tools such as histograms, scatter plots, boxplots, and heatmaps are commonly used to identify patterns, trends, distributions, and possible outliers in the dataset.",
        "Correlation analysis helps measure the strength of relationships between variables, while trend analysis helps identify changes and patterns over time.",
        "EDA is important because it improves data quality, supports better decision-making, and helps data scientists choose suitable machine learning models and analysis techniques."
      ],
      articleText: "Read this article for deeper understanding",
      articleLink:
        "https://link.springer.com/content/pdf/10.1007/978-3-031-20719-8_2?pdf=chapter%20toc"
    }
  },

  videos: {
    "video-1": "https://www.youtube.com/embed/a4KiExvYJKo",
    "video-2": "https://www.youtube.com/embed/QiqZliDXCCg"
  },

  quiz: {
    "quiz-1": [
      {
        id: 1,
        question: "What is the main purpose of Exploratory Data Analysis?",
        options: [
          "To understand and summarize data",
          "To design websites",
          "To create games",
          "To replace machine learning"
        ],
        correctAnswer: "To understand and summarize data",
        explanation:
          "EDA helps understand patterns, trends, and relationships in datasets."
      },

      {
        id: 2,
        question: "Which tool is commonly used in EDA?",
        options: [
          "Histograms",
          "Video editing software",
          "Music player",
          "Compiler"
        ],
        correctAnswer: "Histograms",
        explanation:
          "Histograms are used to visualize data distribution."
      },

      {
        id: 3,
        question: "Why is EDA important before machine learning?",
        options: [
          "It improves understanding of the dataset",
          "It deletes all errors automatically",
          "It replaces programming",
          "It removes the need for data cleaning"
        ],
        correctAnswer: "It improves understanding of the dataset",
        explanation:
          "EDA helps identify problems and patterns before modeling."
      }
    ],

    "quiz-2": [
      {
        id: 1,
        question: "What does a scatter plot show?",
        options: [
          "Relationship between variables",
          "Sound quality",
          "Network speed",
          "Video resolution"
        ],
        correctAnswer: "Relationship between variables",
        explanation:
          "Scatter plots visualize relationships between two variables."
      },

      {
        id: 2,
        question: "Why are heatmaps useful in EDA?",
        options: [
          "They show correlations between variables",
          "They increase internet speed",
          "They remove datasets",
          "They create animations"
        ],
        correctAnswer: "They show correlations between variables",
        explanation:
          "Heatmaps help identify strong and weak relationships in data."
      },

      {
        id: 3,
        question: "What is an outlier?",
        options: [
          "An unusual data value",
          "A chart title",
          "A coding language",
          "A type of database"
        ],
        correctAnswer: "An unusual data value",
        explanation:
          "Outliers are values that differ significantly from other observations."
      }
    ]
  },

  practical: {
    "practical-1": [
      "Collect a small dataset such as student marks or sales records.",
      "Identify the highest, lowest, and average values.",
      "Create a simple table to organize the data.",
      "Write a short explanation about the observed patterns."
    ],

    "practical-2": [
      "Choose a dataset and create one histogram or scatter plot.",
      "Identify any trend, relationship, or outlier in the data.",
      "Explain what the chart represents.",
      "Write 3 to 5 sentences summarizing your findings."
    ]
  }
};
  const quizSets = {
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
        question: `Which statement best describes ${topic}?`,
        options: [
          "A topic used only for memorizing facts",
          "A field that combines understanding, analysis, and application",
          "Something only graphic designers use",
          "A topic that removes the need for thinking"
        ],
        correctAnswer:
          "A field that combines understanding, analysis, and application",
        explanation:
          "Best understood through concepts, examples, and practical use."
      },
      {
        id: 3,
        question: `Why is practical understanding important in ${topic}?`,
        options: [
          "Because theory is never useful",
          "Because practical work connects ideas to real situations",
          "Because it replaces all study",
          "Because it is only useful during exams"
        ],
        correctAnswer:
          "Because practical work connects ideas to real situations",
        explanation:
          "Practical understanding helps learners apply knowledge with more confidence."
      }
    ],
    "quiz-2": [
      {
        id: 1,
        question: `Which skill is important when learning intermediate ${topic}?`,
        options: [
          "Ignoring examples",
          "Connecting theory with analysis",
          "Avoiding all tools",
          "Skipping practice"
        ],
        correctAnswer: "Connecting theory with analysis",
        explanation:
          "Intermediate learning requires understanding how ideas connect and how to apply them in practice."
      },
      {
        id: 2,
        question: "Why should learners study core concepts more deeply?",
        options: [
          "To build stronger understanding",
          "To make the topic more confusing",
          "To avoid real-world use",
          "To remove the need for problem solving"
        ],
        correctAnswer: "To build stronger understanding",
        explanation:
          "Stronger conceptual understanding helps learners solve problems more effectively."
      },
      {
        id: 3,
        question: "What helps improve understanding at this level?",
        options: [
          "Memorizing without thinking",
          "Examples, reflection, and practice",
          "Skipping all quizzes",
          "Avoiding feedback"
        ],
        correctAnswer: "Examples, reflection, and practice",
        explanation:
          "Examples and practice help learners connect concepts to situations they may face later."
      }
    ]
  };

  const handleAnswerSelect = (quizId, questionId, option) => {
    if (quizSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [`${quizId}-${questionId}`]: option
    }));
  };

  const handleQuizSubmit = () => {
    const quizId = activeItem.id;
    const questions =
  isStatisticsSubject
    ? statisticsContent.quiz[quizId] || []
    : quizSets[quizId] || [];

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

    if (typeof updateLeaderboard === "function") {
      const studentName = localStorage.getItem("username") || "Student";
      updateLeaderboard(studentName, percent, currentLevel);
    }

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

          <h2 className="content-title">{activeItem.title}</h2>

          <div className="reading-block">
           <h3>
  {isStatisticsSubject
    ? statisticsContent.reading[activeItem.id]?.title
    : "Introduction"}
</h3>

{isStatisticsSubject || isExploratorySubject ? (
  (isStatisticsSubject
    ? statisticsContent
    : exploratoryContent
  ).reading[activeItem.id]?.paragraphs.map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ))
) : (
  <p>{topic} content goes here...</p>
)}

{(isStatisticsSubject || isExploratorySubject) &&
  (isStatisticsSubject ? statisticsContent : exploratoryContent).reading[
    activeItem.id
  ]?.articleLink && (
    <a
      href={
        (isStatisticsSubject ? statisticsContent : exploratoryContent).reading[
          activeItem.id
        ].articleLink
      }
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-block",
        marginTop: "16px",
        color: "#7C3AED",
        fontWeight: "600",
        textDecoration: "underline"
      }}
    >
      {
        (isStatisticsSubject ? statisticsContent : exploratoryContent).reading[
          activeItem.id
        ].articleText
      }
    </a>
  )}
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

          <h2 className="content-title">{activeItem.title}</h2>

          {isStatisticsSubject || isExploratorySubject ? (
  <iframe
    width="100%"
    height="400"
    src={
  (isStatisticsSubject ? statisticsContent : exploratoryContent).videos[
    activeItem.id
  ]
}
    title={activeItem.title}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
) : (
  <div className="fake-video-frame">
    <div className="play-button">Play Video</div>
  </div>
)}

          <ContentNoteActions item={activeItem} section={activeSection} />
        </div>

        {renderModuleNotePanel()}
      </div>
    );
  }

  if (activeItem?.type === "Quiz") {
    const quizId = activeItem.id;
    const questions =
  isStatisticsSubject || isExploratorySubject
    ? (isStatisticsSubject ? statisticsContent : exploratoryContent).quiz[
        quizId
      ] || []
    : quizSets[quizId] || [];

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

              <div style={{ marginTop: "30px" }}>
                <LeaderboardPage leaderboard={leaderboard} />
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
  {isStatisticsSubject || isExploratorySubject
  ? (isStatisticsSubject
      ? statisticsContent
      : exploratoryContent
    ).practical[activeItem.id]?.map((task, index) => (
      <li key={index}>{task}</li>
    ))
  : (
      <>
        <li>Write 3 simple points about what you learned from the topic.</li>
        <li>Give 1 real-world example related to the topic.</li>
        <li>Explain in 2 to 3 sentences why this topic is important.</li>
      </>
    )}
</ul>
          </div>

          <textarea
            className="assignment-textarea"
            placeholder="Type your answer here..."
            value={practicalText}
            onChange={(event) => setPracticalText(event.target.value)}
            disabled={practicalSubmitted}
          />

          {!practicalSubmitted ? (
            <button
              className="hero-button"
              style={{ marginTop: "16px", width: "100%" }}
              onClick={handlePracticalSubmit}
            >
              Submit Assignment
            </button>
          ) : (
            <div
              className="quiz-result-box"
              style={{ marginTop: "16px", textAlign: "center" }}
            >
              <p>
                <strong>Submitted!</strong>
              </p>
            </div>
          )}

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
                      <h3 className="learning-item-title">{item.title}</h3>
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