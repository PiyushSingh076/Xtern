// src/components/StepperForm/DetailSection.js
import React from "react";
import { FiTrash } from "react-icons/fi";

const DetailSection = ({
  title,
  details,
  detailType,
  openModal,
  deleteDetail,
  renderDetail, // Function to render each detail
}) => {
  return (
    <div className="education-section">
      <div className="title-section">
        <span className="label-title">{title}</span>
      </div>

      <div className="add-detail-section">
        <div className="card-list-container">
          {details.map((item, index) => (
            <div className="details-card" key={index}>
              <FiTrash
                onClick={() => deleteDetail(detailType, index)}
                size={20}
                color="red"
                className="trash-icon"
              />
              {renderDetail(item)}
            </div>
          ))}
        </div>
        <button
          onClick={() => openModal(detailType)}
          className="add-detail-btn"
        >
          + Add {title.slice(0, -1)}
        </button>
      </div>
    </div>
  );
};

export default DetailSection;
