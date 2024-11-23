// Colleagues.js
import React, { useState, useEffect, useRef } from "react";
import MyTeam from "./MyTeam";
import Invites from "./Invites";
import plusIcon from "../../assets/svg/plus-icon.svg";
import closeIcon from "../../assets/svg/cancel-icon.svg";
import useSendInvite from "../../hooks/Teams/useSendInvite";
import useFetchOrganizationMembers from "../../hooks/Teams/useFetchOrganizationMembers";
import useFetchInvites from "../../hooks/Teams/useFetchInvites";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

// Import Bootstrap CSS and JS
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

export default function Colleagues({ userAccessRole }) {
  const [index, setIndex] = useState(0);
  const [invitedPhone, setInvitedPhone] = useState("");
  const [accessRole, setAccessRole] = useState("user"); // Default accessRole set to 'user'
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneError, setPhoneError] = useState("");
  const [accessRoleError, setAccessRoleError] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const modalRef = useRef(null); // Reference to the modal DOM element

  const { members, loading: membersLoading } = useFetchOrganizationMembers();
  const { invites, loading: invitesLoading } = useFetchInvites();

  const countryCodes = ["+91", "+92", "+93", "+94", "+95"];
  const { sendInvite, loading, error } = useSendInvite();

  useEffect(() => {
    // Initialize the Bootstrap modal
    if (modalRef.current) {
      const modal = new bootstrap.Modal(modalRef.current);
      modalRef.current.modalInstance = modal;
    }
  }, []);

  const openModal = () => {
    if (modalRef.current && modalRef.current.modalInstance) {
      modalRef.current.modalInstance.show();
    }
  };

  const closeModal = () => {
    if (modalRef.current && modalRef.current.modalInstance) {
      modalRef.current.modalInstance.hide();
    }
  };

  const handleInviteSend = async () => {
    let hasError = false;

    if (!invitedPhone) {
      setPhoneError("Please enter a phone number.");
      hasError = true;
    } else {
      setPhoneError("");
    }

    if (!accessRole) {
      setAccessRoleError("Please select an access role.");
      hasError = true;
    } else {
      setAccessRoleError("");
    }

    if (hasError) {
      return;
    }

    // Remove any existing country code from phone number
    const phoneWithoutCode = invitedPhone.replace(/^\+\d{2}/, "");
    const fullPhoneNumber = countryCode + phoneWithoutCode;

    setIsSendingInvite(true);

    await sendInvite(fullPhoneNumber, accessRole);

    setIsSendingInvite(false);

    if (!error) {
      setInvitedPhone("");
      setAccessRole("user"); // Reset accessRole to default
      toast.success("Invite sent successfully!");
      closeModal(); // Close the modal
    } else {
      console.error(error);
      toast.error(error);
    }
  };

  return (
    <div className="colleagues-container">
      {userAccessRole === "management" && (
        <div className="add-colleague-btn-section">
          <button className="add-colleague-btn" onClick={openModal}>
            <img
              src={plusIcon}
              alt="plus-icon"
              className="add-colleague-btn-icon"
              width={"30px"}
            />
          </button>
        </div>
      )}

      {/* Invite Modal */}
      <div
        className="modal fade"
        id="inviteModal"
        tabIndex="-1"
        aria-labelledby="inviteModalLabel"
        aria-hidden="true"
        ref={modalRef}
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
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
                style={{ background: "none", border: "none" }}
              >
                <FaTimes className="text-white" size={24} />
              </button>
            </div>
            <div className="modal-body invite-modal-body">
              <div className="phone-input-container">
                <select
                  className="phone-input-select"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  {countryCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className={`invite-modal-input ${
                    phoneError ? "is-invalid" : ""
                  }`}
                  value={invitedPhone}
                  style={{ border: "none", backgroundColor: "transparent" }}
                  onChange={(e) => setInvitedPhone(e.target.value)}
                />
              </div>
              {phoneError && (
                <div className="text-danger mt-1">{phoneError}</div>
              )}

              <div className="mt-3">
                <label className="form-label">Select Access Role:</label>
                <div
                  className="btn-group w-100 mt-2"
                  role="group"
                  aria-label="Access Role selection"
                >
                  <button
                    type="button"
                    className={`btn ${
                      accessRole === "user"
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setAccessRole("user")}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      accessRole === "management"
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setAccessRole("management")}
                  >
                    Management
                  </button>
                </div>
                {accessRoleError && (
                  <div className="text-danger mt-1">{accessRoleError}</div>
                )}
              </div>

              <button
                type="button"
                className="invite-modal-btn mt-3 btn btn-primary w-100"
                onClick={handleInviteSend}
                disabled={loading || isSendingInvite}
              >
                {loading || isSendingInvite ? (
                  <span>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </span>
                ) : (
                  "Send Invite"
                )}
              </button>
              {error && <div className="text-danger mt-2">{error}</div>}
            </div>
          </div>
        </div>
      </div>
      {userAccessRole === "management" && (
        <div className="colleague-btn-section">
          <button
            onClick={() => setIndex(0)}
            className={`colleagues-btn ${index === 0 ? "active" : ""}`}
          >
            My Team ({members?.length || 0})
          </button>

          <button
            onClick={() => setIndex(1)}
            className={`colleagues-btn ${index === 1 ? "active" : ""}`}
          >
            Invites ({invites?.length || 0})
          </button>
        </div>
      )}

      {index === 0 && <MyTeam members={members} loading={membersLoading} />}
      {index === 1 && userAccessRole === "management" && (
        <Invites invites={invites} loading={invitesLoading} />
      )}
    </div>
  );
}
