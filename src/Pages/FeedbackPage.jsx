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

  const onSubmit = async () => {
    setMessage("");

    if (!rating) {
      setMessage("Please rate with stars (1-5). ");
      return;
    }

    if (!feedback.trim()) {
      setMessage("Please write what you want to improve.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "feedback"), {
        rating,
        feedback: feedback.trim(),
        name: userName || "Anonymous",
        createdAt: serverTimestamp(),
      });

      setRating(0);
      setFeedback("");
      setMessage("Feedback submitted successfully!");
    } catch (e) {
      console.error(e);
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

        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <div style={{ marginBottom: 10, fontWeight: 700, color: "#4B5563" }}>
            Rate our app
          </div>
          <StarRating rating={rating} onChange={setRating} />
        </div>

        <textarea
          placeholder="What do you want to improve?"
          className="feedback-textarea"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <button
          className="feedback-submit"
          disabled={submitting}
          onClick={onSubmit}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <p
            style={{
              marginTop: 12,
              color: message.includes("success") ? "#16A34A" : "#B91C1C",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;

