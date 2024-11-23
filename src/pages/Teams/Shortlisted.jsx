import React, { useState } from "react";
import profile from "../../assets/images/banner/mentor.png";
import share from "../../assets/svg/share.svg";
import chat from "../../assets/svg/chat.png";
import useFetchShortlistedInterns from "../../hooks/Teams/useFetchShortlistedInterns";
import useSubscribeIntern from "../../hooks/Teams/useSubscribeIntern";
import { FaRegSadCry } from "react-icons/fa";
export default function Shortlisted() {
  const { shortlistedInterns, loading } = useFetchShortlistedInterns();
  const { subscribeIntern, loading: subscribing, error } = useSubscribeIntern();
  const [selectedIntern, setSelectedIntern] = useState(null);

  const handleScheduleInterview = (intern) => {
    setSelectedIntern(intern);
  };

  const handleSubscribe = (intern) => {
    subscribeIntern(intern.uid); // Pass intern's ID as `internRef`
    console.log(intern.uid, "pppppppp");
  };

  console.log(shortlistedInterns, "lllllllll");

  if (loading) {
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  return (
    <div className="info-card-container">
      {/* Display a message and icon if no data is found */}
      {shortlistedInterns.length === 0 ? (
        <div
          className="no-data"
          style={{ textAlign: "center", marginTop: "50px" }}
        >
          <FaRegSadCry size={50} color="#ccc" />{" "}
          {/* Icon with size and color */}
          <p style={{ fontSize: "18px", color: "#555" }}>
            No shortlisted interns found.
          </p>
        </div>
      ) : (
        shortlistedInterns.map((intern, index) => (
          <div key={index} className="info-card-container-inner">
            <div className="info-card-shortlisted">
              <div className="share-icon">
                <img src={share} alt="share" width={"20px"} />
              </div>
              <div className="info-card-img-section">
                <img
                  src={intern.photo_url || profile}
                  alt="profile"
                  width={"70px"}
                  className="rounded-circle"
                />
              </div>
              <div className="info-card-content">
                <div className="info-card-name-section">
                  <h4>{intern.display_name || "No Name Available"}</h4>
                  <div className="chat-icon">
                    <img src={chat} alt="chat" width={"15px"} />
                    <span>Chat</span>
                  </div>
                </div>
                <div className="info-card-skills-section">
                  {intern.skillSet?.map((skill, skillIndex) => (
                    <span className="info-card-skill" key={skillIndex}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="info-card-action-section">
              <button
                className="subscribe-btn"
                onClick={() => handleSubscribe(intern)}
                disabled={subscribing}
              >
                {subscribing ? "Subscribing..." : "Subscribe xtern"}
              </button>
              <button
                className="replace-btn"
                data-bs-toggle="modal"
                data-bs-target="#scheduleModal"
                onClick={() => handleScheduleInterview(intern.uid)}
              >
                Schedule Interview
              </button>
              <button className="unsubscribe-btn">Reject</button>
            </div>
          </div>
        ))
      )}

      {/* Display error message if any */}
      {error && <div className="error-message">{error}</div>}

      {/* Schedule Interview Modal */}
      <div
        className="modal fade"
        id="scheduleModal"
        tabIndex="-1"
        aria-labelledby="scheduleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="scheduleModalLabel">
                Schedule Interview
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedIntern && (
                <p>
                  Schedule interview for{" "}
                  {selectedIntern.display_name || "No Name Available"}
                </p>
              )}
              <div className="mb-3">
                <label htmlFor="interviewDate" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="interviewDate"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="interviewTime" className="form-label">
                  Time
                </label>
                <input
                  type="time"
                  className="form-control"
                  id="interviewTime"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
