import React, { useState } from "react";
import "./YouTubePreview.css";

export default function YouTubePreview() {
  const [showModal, setShowModal] = useState(false);

  const handlePreviewClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="youtube-preview-container">
      {/* Video Preview */}
      <img
        src="https://img.youtube.com/vi/1SZle1skb84/maxresdefault.jpg"
        alt="Video Preview"
        className="youtube-preview"
        onClick={handlePreviewClick}
      />

      {/* Modal */}
      {showModal && (
        <div className="video-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <iframe
              src="https://www.youtube.com/embed/1SZle1skb84"
              title="YouTube Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
