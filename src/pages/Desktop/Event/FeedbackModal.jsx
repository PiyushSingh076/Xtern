import React, { useState } from "react";
import './FeedbackModal.css'; 

const FeedbackModal = ({ isOpen, onClose, onSubmit, status }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (feedback.trim() === "") {
      alert("Please provide feedback.");
      return;
    }
    onSubmit(feedback);
    setFeedback("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2 className={status === "accepted" ? "accepted-title" : "rejected-title"}>
        {status === "accepted" ? "Provide Feedback for Acceptance" : "Provide Feedback for Rejection"}
      </h2>
      <br/>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback here"
        ></textarea>
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Submit Feedback</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
