import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Notes = () => {
  const { id } = useParams();
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [aiExplanation, setAiExplanation] = useState("");

  const addNote = () => {
    if (note.trim() === "") return;
    setNotes([...notes, note]);
    setNote("");
  };

  const explainNote = () => {
    if (!note.trim()) return;

    const q = note.toLowerCase();

    if (q.includes("data science")) {
      setAiExplanation("Data Science involves analyzing data using statistics and machine learning.");
    } else if (q.includes("python")) {
      setAiExplanation("Python is used in data science for coding, automation, and analysis.");
    } else if (q.includes("statistics")) {
      setAiExplanation("Statistics helps us understand data using probability and averages.");
    } else if (q.includes("machine learning")) {
      setAiExplanation("Machine learning allows systems to learn patterns from data.");
    } else {
      setAiExplanation("This note relates to your learning. Try reviewing it again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Notes for Content {id}</h2>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows="4"
        cols="50"
      />

      <br />

      <button onClick={addNote}>Save Note</button>

      <button onClick={explainNote} style={{ marginLeft: "10px" }}>
        Explain with AI
      </button>

      {aiExplanation && (
        <div style={{ marginTop: "10px", background: "#eee", padding: "10px" }}>
          <strong>AI Explanation:</strong>
          <p>{aiExplanation}</p>
        </div>
      )}

      <ul>
        {notes.map((n, index) => (
          <li key={index}>{n}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;