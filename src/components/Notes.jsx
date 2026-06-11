import React, { useState, useEffect } from "react";
import { auth } from "../firebase";

const Notes = ({ onBack, darkMode }) => {
  const [showInput, setShowInput] = useState(false);
  const [search, setSearch] = useState("");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteColor, setNoteColor] = useState("#7C3AED");
  const [aiExplanation, setAiExplanation] = useState("");

  const [selectedNote, setSelectedNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editColor, setEditColor] = useState("#7C3AED");

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteType, setDeleteType] = useState("");

  const colors = ["#7C3AED", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const getUserKey = () => {
    return (
      localStorage.getItem("loggedInUser") ||
      localStorage.getItem("email") ||
      "guest"
    );
  };

  const notesStorageKey = `notes_${getUserKey()}`;

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem(notesStorageKey);
    const legacyNotes = localStorage.getItem("notes");

    if (savedNotes) {
      return JSON.parse(savedNotes);
    }

    if (legacyNotes) {
      try {
        return JSON.parse(legacyNotes);
      } catch {
        return [];
      }
    }

    return [
          {
            id: "sample-1",
            level: "beginner",
            title: "Python List Comprehensions",
            subject: "Python for Data Analysis",
            content:
              "• List comprehensions provide a concise way to create lists.\n• Syntax: [expression for item in iterable if condition].",
            color: "#3B82F6",
            dateTime: "Jan 14, 2026, 10:30 AM"
          },
          {
            id: "sample-2",
            level: "intermediate",
            title: "Supervised vs Unsupervised Learning",
            subject: "Machine Learning Fundamentals",
            content:
              "• Supervised learning uses labelled data.\n• Unsupervised learning finds patterns in unlabelled data.",
            color: "#A855F7",
            dateTime: "Jan 13, 2026, 9:15 PM"
          },
          {
            id: "sample-3",
            level: "advanced",
            title: "Normal Distribution",
            subject: "Statistics for Data Science",
            content:
              "• Bell-shaped curve.\n• Symmetric around the mean.\n• Mean = Median = Mode.",
            color: "#10B981",
            dateTime: "Jan 12, 2026, 2:45 PM"
          }
        ];
  });

  useEffect(() => {
    localStorage.setItem(notesStorageKey, JSON.stringify(notes));
  }, [notes, notesStorageKey]);

  useEffect(() => {
    const refreshNotes = () => {
      const savedNotes = localStorage.getItem(notesStorageKey);
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
          console.log("Notes refreshed from storage:", JSON.parse(savedNotes));
        } catch (error) {
          console.error("Failed to parse notes storage on refresh:", error);
        }
      }
    };

    const onStorage = (event) => {
      if (event.key === notesStorageKey || event.key === null) {
        refreshNotes();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("notesUpdated", refreshNotes);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("notesUpdated", refreshNotes);
    };
  }, [notesStorageKey]);

  const addBullet = () => {
    setNoteContent((prev) => prev + (prev ? "\n• " : "• "));
  };

  const addEditBullet = () => {
    setEditContent((prev) => prev + (prev ? "\n• " : "• "));
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

  const addNote = () => {
    if (noteTitle.trim() === "" || noteContent.trim() === "") return;

  const newNote = {
    id: `personal-${Date.now()}`,
    level: "self",
    title: noteTitle,
    subject: "Personal Note",
    content: noteContent,
    color: noteColor,
    dateTime: getDateTime()
  };

    setNotes([newNote, ...notes]);
    setNoteTitle("");
    setNoteContent("");
    setNoteColor("#7C3AED");
    setAiExplanation("");
    setShowInput(false);
  };

  const openNote = (item, index) => {
    if (isSelectMode) {
      toggleSelect(index);
      return;
    }

    setSelectedNote({ ...item, index });
    setEditTitle(item.title || "");
    setEditContent(item.content || "");
    setEditColor(item.color || "#7C3AED");
  };

  const saveEditNote = () => {
    if (!selectedNote) return;

    const updatedNotes = notes.map((item, index) =>
      index === selectedNote.index
        ? {
            ...item,
            title: editTitle,
            content: editContent,
            color: editColor,
            dateTime: getDateTime()
          }
        : item
    );

    setNotes(updatedNotes);
    setSelectedNote(null);
  };

  const toggleSelect = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((item) => item !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const cancelSelect = () => {
    setIsSelectMode(false);
    setSelectedIndexes([]);
  };

  const askDeleteSingle = () => {
    setDeleteType("single");
    setDeletePopup(true);
  };

  const askDeleteMany = () => {
    if (selectedIndexes.length === 0) return;
    setDeleteType("many");
    setDeletePopup(true);
  };

  const confirmDelete = () => {
    if (deleteType === "single" && selectedNote) {
      setNotes(notes.filter((_, index) => index !== selectedNote.index));
      setSelectedNote(null);
    }

    if (deleteType === "many") {
      setNotes(notes.filter((_, index) => !selectedIndexes.includes(index)));
      setSelectedIndexes([]);
      setIsSelectMode(false);
    }

    setDeletePopup(false);
    setDeleteType("");
  };

  const cancelDelete = () => {
    setDeletePopup(false);
    setDeleteType("");
  };

  const explainNote = () => {
    if (!noteContent.trim()) return;

    const q = noteContent.toLowerCase();

    if (q.includes("data science")) {
      setAiExplanation(
        "Data Science involves analyzing data using statistics and machine learning."
      );
    } else if (q.includes("python")) {
      setAiExplanation(
        "Python is used in data science for coding, automation, and analysis."
      );
    } else if (q.includes("statistics")) {
      setAiExplanation(
        "Statistics helps us understand data using probability and averages."
      );
    } else if (q.includes("machine learning")) {
      setAiExplanation(
        "Machine learning allows systems to learn patterns from data."
      );
    } else {
      setAiExplanation(
        "This note relates to your learning. Try reviewing it again."
      );
    }
  };

  const searchedNotes = notes
    .map((item, originalIndex) => ({ ...item, originalIndex }))
    .filter((item) => {
      const keyword = search.toLowerCase();

      return (
        (item.title || "").toLowerCase().includes(keyword) ||
        (item.subject || "").toLowerCase().includes(keyword) ||
        (item.content || "").toLowerCase().includes(keyword)
      );
    });

  const beginnerNotes = searchedNotes.filter(
    (note) => (note.level || "beginner") === "beginner"
  );

  const intermediateNotes = searchedNotes.filter(
    (note) => note.level === "intermediate"
  );

  const advancedNotes = searchedNotes.filter(
    (note) => note.level === "advanced"
  );

  const selfNotes = searchedNotes.filter((note) => note.level === "self");

  useEffect(() => {
    console.log("Notes storage key:", notesStorageKey);
    console.log("Notes loaded:", notes);
    console.log("Filtered beginner notes:", beginnerNotes);
    console.log("Filtered intermediate notes:", intermediateNotes);
    console.log("Filtered advanced notes:", advancedNotes);
    console.log("Filtered self notes:", selfNotes);
  }, [notesStorageKey, notes, beginnerNotes, intermediateNotes, advancedNotes, selfNotes]);

  const getShortContent = (content) => {
    const cleanContent = (content || "").replace(/\n/g, " ");

    return cleanContent.length > 95
      ? `${cleanContent.slice(0, 95)}...`
      : cleanContent;
  };

const getLevelName = (level) => {
  if (level === "self") return "Self Note";

  const noteLevel = level || "beginner";
  return noteLevel.charAt(0).toUpperCase() + noteLevel.slice(1);
};

const getSectionInfo = (title) => {
  if (title === "All Notes") {
    return {
      icon: "▦",
      color: "#7C3AED",
      bg: "#F3E8FF",
      badgeBg: "#F3E8FF"
    };
  }

  if (title === "Self Notes") {
    return {
      icon: "✍️",
      color: "#7C3AED",
      bg: "#F3E8FF",
      badgeBg: "#F3E8FF"
    };
  }

  if (title === "Beginner") {
    return {
      icon: "🌱",
      color: "#7C3AED",
      bg: "#F3E8FF",
      badgeBg: "#F3E8FF"
    };
  }

  if (title === "Intermediate") {
    return {
      icon: "🎓",
      color: "#7C3AED",
      bg: "#F3E8FF",
      badgeBg: "#F3E8FF"
    };
  }

  return {
    icon: "★",
    color: "#7C3AED",
    bg: "#F3E8FF",
    badgeBg: "#F3E8FF"
  };
};

  const renderNoteRow = (item) => (
    <div
  style={{
    ...styles.noteRow,

    background: darkMode ? "#2a2a2a" : "#FFFFFF",

    border: darkMode
      ? "1px solid #444"
      : "1px solid #E5E7EB",

    ...(selectedIndexes.includes(item.originalIndex)
      ? styles.selectedRow
      : {})
  }}
>
      {isSelectMode && (
        <div style={styles.checkBox}>
          {selectedIndexes.includes(item.originalIndex) ? "✓" : ""}
        </div>
      )}

      <div style={styles.rowIconBox}>📄</div>

      <div style={styles.rowTitleBox}>
       <p
        style={{
          ...styles.rowTitle,
          color: darkMode ? "#FFFFFF" : "#111827"
        }}
      >
        {item.title}
      </p>
      </div>

      <div style={styles.rowSubjectBox}>
        <span style={styles.bookIcon}>📖</span>
        <span
        style={{
          ...styles.rowSubject,
          color: darkMode ? "#D1D5DB" : "#6B7280"
        }}
      >
        {item.subject}
      </span>
      </div>

      <div style={styles.rowLevelBox}>
        <span style={styles.levelBadge(item.level || "beginner")}>
          {getLevelName(item.level)}
        </span>
      </div>

      <div style={styles.rowPreviewBox}>
        <p
  style={{
    ...styles.rowPreview,
    color: darkMode ? "#D1D5DB" : "#6B7280"
  }}
>• {getShortContent(item.content)}</p>
      </div>

      <div style={styles.rowDateBox}>
        <p
  style={{
    ...styles.rowDate,
    color: darkMode ? "#D1D5DB" : "#6B7280"
  }}
>🕒 {item.dateTime}</p>
      </div>
    </div>
  );

  const renderNoteSection = (title, sectionNotes) => {
    const info = getSectionInfo(title);

    return (
      <section
  style={{
    ...styles.listSection,
    background: darkMode ? "#1e1e1e" : "#FFFFFF",
    border: darkMode
      ? "1px solid #333"
      : "1px solid #E9D5FF"
  }}
>
        <div style={styles.sectionTopRow}>
          <div style={styles.sectionTitleGroup}>
            <div style={styles.sectionIcon(info.bg, info.color)}>
              {info.icon}
            </div>

            <div>
              <div style={styles.sectionTitlePill(info.bg, info.color)}>
                {title}
              </div>
              <div style={styles.sectionLine(info.color)}></div>
            </div>
          </div>

          <span style={styles.sectionCount(info.badgeBg, info.color)}>
            {sectionNotes.length} notes
          </span>
        </div>

        {sectionNotes.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>✦</div>
            <p style={styles.emptyText}>No notes in this level yet.</p>
            <small style={styles.emptySmall}>
              Write your own notes!
            </small>
          </div>
        ) : (
          <div style={styles.listContainer}>
            {sectionNotes.map((item) => renderNoteRow(item))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div style={styles.page}>
      
      <div style={styles.container}>
        <section style={styles.heroCard}>
          <div style={styles.heroLeft}>
            <div style={styles.iconBox}>📄</div>

            <div>
              <h1 style={styles.title}>My Notes</h1>
              <p style={styles.subtitle}>
                Your personal learning notes and insights
              </p>
            </div>
          </div>

          <button style={styles.newBtn} onClick={() => setShowInput(!showInput)}>
            + New Note
          </button>
        </section>

        {showInput && (
          <section style={styles.inputCard}>
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Enter note title..."
              style={styles.titleInput}
            />

            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows="6"
              placeholder="Write your note here..."
              style={styles.textarea}
            />

            <div style={styles.toolRow}>
              <button style={styles.dotBtn} onClick={addBullet}>
                • Bullet
              </button>

              <div style={styles.colorSection}>
                <span style={styles.colorLabel}>Note Color:</span>

                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNoteColor(color)}
                    style={styles.colorDot(color, noteColor === color)}
                  ></button>
                ))}
              </div>
            </div>

            <div style={styles.actionRow}>
  <button style={styles.saveBtn} onClick={addNote}>
    Save Note
  </button>
</div>

            {aiExplanation && (
              <div style={styles.aiBox}>
                <strong>AI Explanation:</strong>
                <p>{aiExplanation}</p>
              </div>
            )}
          </section>
        )}

<div
  style={{
    ...styles.searchBox,
    background: darkMode ? "#1e1e1e" : "white",
    border: darkMode
      ? "1px solid #333"
      : "1px solid #E5E7EB"
  }}
>
  <span>🔍</span>

  <input
    type="text"
    placeholder="Search notes..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={styles.searchInput}
  />

  {!isSelectMode ? (
    <button style={styles.selectBtn} onClick={() => setIsSelectMode(true)}>
      Select
    </button>
  ) : (
    <div style={styles.selectActionBox}>
      <button style={styles.cancelBtn} onClick={cancelSelect}>
        Cancel
      </button>

      <button style={styles.deleteBtn} onClick={askDeleteMany}>
        Delete
      </button>
    </div>
  )}
</div>

        {renderNoteSection("All Notes", searchedNotes)}

        {renderNoteSection("Self Notes", selfNotes)}

        {renderNoteSection("Beginner", beginnerNotes)}

        {renderNoteSection("Intermediate", intermediateNotes)}

        {renderNoteSection("Advanced", advancedNotes)}
      </div>

      {selectedNote && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button style={styles.closeBtn} onClick={() => setSelectedNote(null)}>
              ×
            </button>

            <button style={styles.trashBtn} onClick={askDeleteSingle}>
              🗑
            </button>

            <div style={styles.modalColorLine(editColor)}></div>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={styles.modalTitleInput}
            />

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows="10"
              style={styles.modalTextarea}
            />

            <div style={styles.toolRow}>
              <button style={styles.dotBtn} onClick={addEditBullet}>
                • Bullet
              </button>

              <div style={styles.colorSection}>
                <span style={styles.colorLabel}>Note Color:</span>

                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditColor(color)}
                    style={styles.colorDot(color, editColor === color)}
                  ></button>
                ))}
              </div>
            </div>

            <p style={styles.modalDate}>🗓 Last updated: {selectedNote.dateTime}</p>

            <button style={styles.saveBtn} onClick={saveEditNote}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {deletePopup && (
        <div style={styles.confirmOverlay}>
          <div style={styles.confirmBox}>
            <h3 style={styles.confirmTitle}>Delete note?</h3>

            <p style={styles.confirmText}>
              Are you sure you want to delete this note?
            </p>

            <div style={styles.confirmActionRow}>
              <button style={styles.cancelBtn} onClick={cancelDelete}>
                Cancel
              </button>

              <button style={styles.deleteBtn} onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#FAFAFA",
    color: "#111827",
    fontFamily: "Inter, Arial, sans-serif",
    position: "relative",
    paddingTop: "0px"
  },

  backBtn: {
    position: "absolute",
    top: "25px",
    left: "28px",
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "1px solid #DDD6FE",
    background: "#ffffff",
    color: "#7C3AED",
    fontSize: "22px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(17, 24, 39, 0.08)"
  },

  container: {
    width: "84%",
    margin: "10px auto"
  },

  heroCard: {
    background: "linear-gradient(135deg, #7C3AED, #A78BFA)",
    borderRadius: "22px",
    padding: "34px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 18px 40px rgba(124, 58, 237, 0.25)"
  },

  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: "18px"
  },

  iconBox: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px"
  },

  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "800"
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#F3E8FF",
    fontSize: "15px"
  },

  newBtn: {
    background: "white",
    color: "#7C3AED",
    border: "none",
    borderRadius: "14px",
    padding: "13px 22px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
  },

  inputCard: {
    marginTop: "25px",
    background: "white",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 10px 25px rgba(17, 24, 39, 0.08)",
    border: "1px solid #E5E7EB"
  },

  titleInput: {
    width: "100%",
    border: "1px solid #DDD6FE",
    borderRadius: "14px",
    padding: "14px 15px",
    fontSize: "16px",
    fontWeight: "700",
    outline: "none",
    marginBottom: "12px",
    fontFamily: "inherit"
  },

  textarea: {
    width: "100%",
    border: "1px solid #DDD6FE",
    borderRadius: "14px",
    padding: "15px",
    fontSize: "15px",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    lineHeight: "1.6",
    background: "#F9FAFB",
    color: "#111827"
  },

  toolRow: {
    marginTop: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap"
  },

  dotBtn: {
    background: "#F5F3FF",
    color: "#6D28D9",
    border: "1px solid #DDD6FE",
    borderRadius: "12px",
    padding: "10px 15px",
    fontWeight: "700",
    cursor: "pointer"
  },

  colorSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  colorLabel: {
    fontSize: "14px",
    color: "#6B7280",
    fontWeight: "700"
  },

  colorDot: (color, active) => ({
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    border: active ? "3px solid #111827" : "2px solid white",
    background: color,
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
  }),

  actionRow: {
    marginTop: "15px",
    display: "flex",
    gap: "10px"
  },

  saveBtn: {
    background: "#7C3AED",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "11px 18px",
    fontWeight: "700",
    cursor: "pointer"
  },

  aiBtn: {
    background: "#DDD6FE",
    color: "#5B21B6",
    border: "none",
    borderRadius: "12px",
    padding: "11px 18px",
    fontWeight: "700",
    cursor: "pointer"
  },

  aiBox: {
    marginTop: "15px",
    background: "#F5F3FF",
    padding: "15px",
    borderRadius: "12px",
    color: "#4C1D95"
  },

  searchBox: {
    marginTop: "28px",
    background: "white",
    border: "1px solid #E5E7EB",
    borderRadius: "16px",
    padding: "15px 18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 8px 22px rgba(17, 24, 39, 0.06)"
  },

  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "15px",
    background: "transparent",
    color: "#111827"
  },

  noteActionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "26px",
    marginBottom: "18px"
  },

  noteCount: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "800"
  },

  smallPurpleLine: {
    width: "38px",
    height: "4px",
    borderRadius: "999px",
    background: "#7C3AED",
    marginTop: "6px",
    opacity: 0.75
  },

  selectBtn: {
    background: "#7C3AED",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 18px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(124, 58, 237, 0.2)"
  },

  selectActionBox: {
    display: "flex",
    gap: "10px"
  },

  cancelBtn: {
    background: "#F3F4F6",
    color: "#374151",
    border: "none",
    borderRadius: "12px",
    padding: "10px 18px",
    fontWeight: "800",
    cursor: "pointer"
  },

  deleteBtn: {
    background: "#EF4444",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 18px",
    fontWeight: "800",
    cursor: "pointer"
  },

  listSection: {
    marginTop: "24px",
    background: "#FFFFFF",
    border: "1px solid #E9D5FF",
    borderRadius: "18px",
    padding: "18px 20px",
    boxShadow: "0 8px 24px rgba(17, 24, 39, 0.05)"
  },

  sectionTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },

  sectionTitleGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  sectionIcon: (bg, color) => ({
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    background: bg,
    color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "900"
  }),

  sectionTitlePill: (bg, color) => ({
    display: "inline-block",
    background: bg,
    color,
    fontWeight: "900",
    fontSize: "18px",
    padding: "8px 16px",
    borderRadius: "10px"
  }),

  sectionLine: (color) => ({
    width: "100%",
    height: "4px",
    background: color,
    borderRadius: "999px",
    marginTop: "6px"
  }),

  sectionCount: (bg, color) => ({
    background: bg,
    color,
    borderRadius: "999px",
    padding: "7px 14px",
    fontSize: "13px",
    fontWeight: "900"
  }),

  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  noteRow: {
    display: "grid",
    gridTemplateColumns: "36px 210px 180px 110px 1fr 190px",
    alignItems: "center",
    gap: "14px",
    minHeight: "58px",
    padding: "12px 14px",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    background: "#FFFFFF",
    cursor: "pointer",
    boxShadow: "0 3px 10px rgba(17, 24, 39, 0.03)"
  },

  selectedRow: {
    border: "2px solid #7C3AED",
    background: "#FAF5FF"
  },

  rowIconBox: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "#F3E8FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px"
  },

  rowTitleBox: {
    minWidth: 0
  },

  rowTitle: {
    margin: 0,
    fontWeight: "800",
    fontSize: "14px",
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },

  rowSubjectBox: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minWidth: 0,
    color: "#6B7280",
    fontSize: "13px"
  },

  bookIcon: {
    flexShrink: 0,
    fontSize: "13px"
  },

  rowSubject: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },

  rowLevelBox: {
    display: "flex",
    alignItems: "center"
  },

levelBadge: (level) => ({
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "800",
  background: "#F3E8FF",
  color: "#7C3AED"
}),

  rowPreviewBox: {
    minWidth: 0
  },

  rowPreview: {
    margin: 0,
    color: "#6B7280",
    fontSize: "13px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },

  rowDateBox: {
    minWidth: 0
  },

  rowDate: {
    margin: 0,
    color: "#6B7280",
    fontSize: "12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },

  checkBox: {
    width: "26px",
    height: "26px",
    borderRadius: "8px",
    background: "#7C3AED",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800"
  },

  emptyState: {
    minHeight: "80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#6B7280",
    textAlign: "center"
  },

  emptyIcon: {
    fontSize: "22px",
    color: "#2563EB",
    marginBottom: "4px"
  },

  emptyText: {
    margin: 0,
    color: "#111827",
    fontSize: "14px",
    fontWeight: "700"
  },

  emptySmall: {
    marginTop: "4px",
    color: "#6B7280",
    fontSize: "12px"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },

  modalCard: {
    width: "55%",
    background: "white",
    borderRadius: "22px",
    padding: "30px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
    position: "relative",
    overflow: "hidden"
  },

  modalColorLine: (color) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "7px",
    background: color
  }),

  closeBtn: {
    position: "absolute",
    top: "15px",
    right: "18px",
    border: "none",
    background: "transparent",
    fontSize: "28px",
    cursor: "pointer",
    color: "#6B7280"
  },

  trashBtn: {
    position: "absolute",
    top: "19px",
    right: "58px",
    border: "none",
    background: "#FEE2E2",
    color: "#DC2626",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer",
    fontSize: "16px"
  },

  modalTitleInput: {
    width: "100%",
    border: "1px solid #DDD6FE",
    borderRadius: "14px",
    padding: "14px",
    fontSize: "22px",
    fontWeight: "800",
    marginTop: "20px",
    marginBottom: "15px",
    outline: "none",
    fontFamily: "inherit"
  },

  modalTextarea: {
    width: "100%",
    border: "1px solid #DDD6FE",
    borderRadius: "14px",
    padding: "15px",
    fontSize: "15px",
    lineHeight: "1.7",
    resize: "none",
    outline: "none",
    fontFamily: "inherit",
    background: "#F9FAFB",
    color: "#111827"
  },

  modalDate: {
    fontSize: "13px",
    color: "#6B7280",
    marginTop: "14px",
    marginBottom: "15px"
  },

  confirmOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 12000
  },

  confirmBox: {
    width: "350px",
    background: "white",
    borderRadius: "20px",
    padding: "25px",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)"
  },

  confirmTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "800",
    color: "#111827"
  },

  confirmText: {
    color: "#6B7280",
    fontSize: "14px",
    marginTop: "10px",
    marginBottom: "20px"
  },

  confirmActionRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px"
  }
};

export default Notes;