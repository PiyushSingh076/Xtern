import React, { useState } from "react";

const DetailModal = ({ modalType, handleSubmit, closeModal }) => {
  const [modalFormData, setModalFormData] = useState({
    startDate: "",
    endDate: "",
  });
  const [dateError, setDateError] = useState("");

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setModalFormData((prev) => ({
      ...prev,
      startDate: newStartDate,
      endDate: prev.endDate && new Date(newStartDate) > new Date(prev.endDate) ? "" : prev.endDate, // Reset invalid end date
    }));
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (new Date(newEndDate) < new Date(modalFormData.startDate)) {
      setDateError("⚠️ Please select a correct date.");
    } else {
      setDateError("");
    }
    setModalFormData((prev) => ({
      ...prev,
      endDate: newEndDate,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h4>Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h4>
        <br />
        <form onSubmit={handleSubmit}>
          {modalType === "education" && (
            <>
              <label>Degree:</label>
              <input type="text" name="degree" placeholder="Degree" required />
              <label>Stream:</label>
              <input type="text" name="stream" placeholder="Stream" required />
              <label>College:</label>
              <input
                type="text"
                name="college"
                placeholder="College"
                required
              />
              <div className="main-date-container">
                <div className="date-container">
                  <span>Start</span>
                  <input
                    type="date"
                    name="startDate"
                    className="input-date"
                    required
                    value={modalFormData.startDate}
                    onChange={handleStartDateChange}
                  />
                </div>
                <div className="date-container">
                  <span>End</span>
                  <input
                    type="date"
                    name="endDate"
                    className={`input-date ${dateError ? "error" : ""}`}
                    required
                    value={modalFormData.endDate}
                    onChange={handleEndDateChange}
                  />
                  {dateError && (
                    <p className="error-message">{dateError}</p>
                  )}
                </div>
              </div>
              <label>CGPA:</label>
              <input
                type="number"
                name="cgpa"
                placeholder="CGPA"
                step="0.1"
                required
              />
            </>
          )}
          {modalType === "skill" && (
            <>
              <input
                type="text"
                name="skill"
                placeholder="Skill Name"
                required
              />
            </>
          )}
          {modalType === "work" && (
            <>
              <label>Position:</label>
              <input
                type="text"
                name="position"
                placeholder="Job Title"
                required
              />
              <label>Company:</label>
              <input
                type="text"
                name="company"
                placeholder="Company Name"
                required
              />
              <label>Company Logo:</label>
              <input type="file" 
                      name="companyLogo" 
                      accept="image/*" 
                      onChange={handleFileChange} />

              <div className="main-date-container">
                <div className="date-container">
                  <span>Start</span>
                  <input
                    type="date"
                    name="startDate"
                    className="input-date"
                    required
                    value={modalFormData.startDate}
                    onChange={handleStartDateChange}
                  />
                </div>
                <div className="date-container">
                  <span>End</span>
                  <input
                    type="date"
                    name="endDate"
                    className={`input-date ${dateError ? "error" : ""}`}
                    required
                    value={modalFormData.endDate}
                    onChange={handleEndDateChange}
                  />
                  {dateError && (
                    <p className="error-message">{dateError}</p>
                  )}
                </div>
              </div>
            </>
          )}
          {modalType === "project" && (
            <>
              <label>Project Name:</label>
              <input
                type="text"
                name="projectName"
                placeholder="Project Name"
                required
              />
              <label>Duration:</label>
              <input
                type="text"
                name="duration"
                placeholder="Duration"
                required
              />
              <label>Live Link:</label>
              <input type="text" name="liveLink" placeholder="Link" />
              <label>Description:</label>
              <textarea
                name="description"
                placeholder="Description"
                required
              ></textarea>
            </>
          )}
          {modalType === "service" && (
            <>
              <label>Service Name:</label>
              <input
                type="text"
                name="serviceName"
                placeholder="Service Name"
                required
              />
              <label>Service Description:</label>
              <textarea
                name="serviceDescription"
                placeholder="Service Description"
                required
              ></textarea>
              <label>Service Price:</label>
              <input
                type="number"
                name="servicePrice"
                placeholder="Service Price"
                required
              />
            </>
          )}
          <div className="modal-buttons">
            <button type="submit" disabled={dateError}>
              Save
            </button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailModal;
