import React, { useState } from "react";
import { Link } from "react-router-dom";
import MyTeam from "./MyTeam";
import Invites from "./Invites";
import plusIcon from "../../assets/svg/plus-icon.svg";
import closeIcon from "../../assets/svg/cancel-icon.svg";

export default function Colleagues() {
  const [index, setIndex] = useState(0);

  return (
    <div className="colleagues-container">
      <div className="add-colleague-btn-section">
        <button
          className="add-colleague-btn"
          data-bs-toggle="modal"
          data-bs-target="#inviteModal"
        >
          <img
            src={plusIcon}
            alt="plus-icon"
            className="add-colleague-btn-icon"
            width={"30px"}
          />
        </button>
      </div>

      <div
        className="modal fade"
        id="inviteModal"
        tabIndex="-1"
        aria-labelledby="inviteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content invite-modal">
            <div className="modal-header invite-modal-header">
              <h5
                className="modal-title invite-modal-title"
                id="inviteModalLabel"
              >
                Send Invite
              </h5>
              <button
                type="button"
                className="invite-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <img
                  src={closeIcon}
                  alt="close-icon"
                  width={"30px"}
                  className="invite-modal-close-icon"
                />
              </button>
            </div>
            <div className="modal-body invite-modal-body">
              <input
                type="text"
                placeholder="Enter phone number"
                className="invite-modal-input"
              />
              <input
                type="text"
                placeholder="Role of the member"
                className="invite-modal-input"
              />
              <button type="button" className="invite-modal-btn">
                Send invite
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="colleague-btn-section">
        <button
          onClick={() => setIndex(0)}
          className={`colleagues-btn ${index === 0 ? "active" : ""}`}
        >
          My Team
        </button>
        <button
          onClick={() => setIndex(1)}
          className={`colleagues-btn ${index === 1 ? "active" : ""}`}
        >
          Invites
        </button>
      </div>

      {index === 0 && <MyTeam />}
      {index === 1 && <Invites />}
    </div>
  );
}
