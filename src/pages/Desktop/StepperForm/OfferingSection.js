// src/components/StepperForm/OfferingSection.js
import React from "react";
import { FiTrash } from "react-icons/fi";

const OfferingSection = ({
  ConsultingPrice,
  setConsultingPrice,
  ConsultingDuration,
  setConsultingDuration,
  ConsultingDurationType,
  setConsultingDurationType,
  Services,
  openModal,
  deleteDetail,
}) => {
  return (
    <div className="offering-container">
      <div className="offering-section">
        <div className="title-section">
          <span className="label-title">Consulting Charges</span>
        </div>
        <div className="add-offering-section">
          <input
            value={ConsultingPrice}
            onChange={(e) => setConsultingPrice(e.target.value)}
            type="text"
            placeholder="Price in Rs."
            className="input-price"
          />
          <span style={{ width: "40px", textAlign: "center" }}>For </span>

          <input
            value={ConsultingDuration}
            onChange={(e) => setConsultingDuration(e.target.value)}
            type="text"
            placeholder="Time"
          />
          <select
            value={ConsultingDurationType}
            onChange={(e) => setConsultingDurationType(e.target.value)}
            style={{ marginLeft: "3px" }}
          >
            <option value="per hour">Per Hour</option>
            <option value="per day">Per Day</option>
            <option value="per week">Per Week</option>
            <option value="per month">Per Month</option>
          </select>
        </div>
      </div>

      {/* Services Section */}
      <div className="education-section">
        <div className="title-section">
          <span className="label-title">Services</span>
        </div>

        <div className="add-detail-section">
          <div className="card-list-container">
            {Services.map((item, index) => (
              <div className="details-card" key={index}>
                <FiTrash
                  onClick={() => deleteDetail("service", index)}
                  size={20}
                  color="red"
                  className="trash-icon"
                />
                <span>
                  <b>{item.serviceName}</b>
                </span>
                <span>{item.serviceDescription}</span>
                <span>Price: ₹{item.servicePrice}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => openModal("service")}
            className="add-detail-btn"
          >
            + Add Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferingSection;
