import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LearningContent from "./components/LearningContent";
import Recommendation from "./components/Recommendation";
import Notes from "./components/Notes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LearningContent />} />
        <Route path="/recommendations" element={<Recommendation />} />
        <Route path="/notes/:id" element={<Notes />} />
      </Routes>
    </Router>
  );
}

export default App;