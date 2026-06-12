import React, { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import StarRating from "../components/StarRating.jsx";
import "../App.css";

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const userName = useMemo(() => localStorage.getItem("name") || "", []);
  const userEmail = useMemo(() => localStorage.getItem("email") || "", []);
  const userId = useMemo(() => localStorage.getItem("uid") || "", []);

  const onSubmit = async () => {
    setMessage("");

    if (!rating) {
      setMessage("Please rate your overall experience.");
      return;
    }

    if (!feedback.trim()) {
      setMessage("Please write your feedback or suggestions.");
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, "feedbacks"), {
        rating,
        feedback: feedback.trim(),
        name: userName || "Anonymous",
        email: userEmail,
        userId,
        createdAt: serverTimestamp(),
      });

      setRating(0);
      setFeedback("");
      setMessage("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage("Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-card">
        <h1>Feedback Form</h1>
        <p>Share your feedback to help us improve BrainyBits.</p>

        <div className="feedback-rating-box">
          <label className="feedback-question">
            1. How would you rate your overall experience?{" "}
            <span>*</span>
          </label>

          <div className="feedback-stars">
            <StarRating rating={rating} onChange={setRating} />
          </div>

          <div className="feedback-rating-labels">
            <span>Very Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        <div className="feedback-input-section">
          <label className="feedback-question">
            2. What can we improve or any suggestions for us?{" "}
            <span>*</span>
          </label>

          <div className="feedback-textarea-wrapper">
            <textarea
              placeholder="Write your feedback, suggestions or ideas..."
              className="feedback-textarea"
              value={feedback}
              maxLength={500}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="feedback-counter">{feedback.length} / 500</div>
          </div>
        </div>

        <button
          className="feedback-submit"
          disabled={submitting}
          onClick={onSubmit}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <p
            className={
              message.includes("success")
                ? "feedback-message success"
                : "feedback-message error"
            }
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;