import React from "react";
import "../App.css";

const FeedbackPage = () => {
  return (
    <div className="feedback-page">
      <div className="feedback-card">
        <h1>Feedback Form</h1>

        <p>
          Share your feedback to help us improve BrainyBits.
        </p>

        <textarea
          placeholder="Write your feedback..."
          className="feedback-textarea"
        />

        <button
          className="feedback-submit"
          onClick={() => {
            alert("Feedback submitted successfully!");
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;