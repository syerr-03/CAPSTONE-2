import { useState } from "react";

function AiChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askAI = () => {
    const q = question.toLowerCase();

    if (!question.trim()) {
      setAnswer("Please type a question first.");
      return;
    }

    if (q.includes("data science")) {
      setAnswer(
        "Data Science is the process of collecting, analysing, and interpreting data to find useful insights. It uses statistics, programming, and machine learning to support decision-making."
      );
    } else if (q.includes("python")) {
      setAnswer(
        "Python is a popular programming language used in data science. It is commonly used for data analysis, automation, machine learning, and data visualization."
      );
    } else if (
      q.includes("statistics") ||
      q.includes("statistic") ||
      q.includes("probability")
    ) {
      setAnswer(
        "Statistics fundamentals involve understanding data using concepts such as mean, median, mode, probability, and data distribution."
      );
    } else if (
      q.includes("data visualization") ||
      q.includes("visualization") ||
      q.includes("chart") ||
      q.includes("graph")
    ) {
      setAnswer(
        "Data Visualization is the process of presenting data using charts, graphs, and dashboards so information becomes easier to understand."
      );
    } else if (
      q.includes("machine learning") ||
      q.includes("ml")
    ) {
      setAnswer(
        "Machine Learning is a field of AI where computers learn patterns from data and use them to make predictions or decisions."
      );
    } else if (
      q.includes("exploratory data analysis") ||
      q.includes("eda")
    ) {
      setAnswer(
        "Exploratory Data Analysis, or EDA, is the process of inspecting and understanding datasets before modelling. It helps identify patterns, missing values, and relationships."
      );
    } else if (q.includes("study") || q.includes("learn")) {
      setAnswer(
        "To learn effectively, review the learning content, write short notes, practise examples, and test yourself using quizzes."
      );
    } else if (q.includes("note") || q.includes("notes")) {
      setAnswer(
        "Notes help students remember important points by summarising concepts in their own words."
      );
    } else if (q.includes("quiz")) {
      setAnswer(
        "Quizzes help test student understanding and show which topics need more revision."
      );
    } else {
      setAnswer(
        `I am not sure yet, but "${question}" seems related to your learning subjects. Try asking about Data Science, Python, Statistics, Data Visualization, Machine Learning, or EDA.`
      );
    }
  };

  return (
    <div className="module-card">
      <h2>AI Assistant</h2>
      <p>Ask anything about your learning subjects.</p>

      <input
        type="text"
        placeholder="Example: What is data visualization?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          border: "1px solid #ddd6fe",
          margin: "14px 0",
          fontFamily: "Poppins, sans-serif"
        }}
      />

      <button className="hero-button" onClick={askAI}>
        Ask AI
      </button>

      {answer && (
        <div className="adaptive-feedback-box">
          <h3>AI Answer</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default AiChat;