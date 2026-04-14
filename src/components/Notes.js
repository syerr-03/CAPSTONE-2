import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Notes = () => {
  const { id } = useParams();
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    if (note.trim() === "") return;
    setNotes([...notes, note]);
    setNote("");
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
      <ul>
        {notes.map((n, index) => (
          <li key={index}>{n}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;