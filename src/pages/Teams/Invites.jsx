import React from "react";
import profile from "../../assets/images/banner/mentor.png";
import { FaRegEnvelopeOpen } from "react-icons/fa";

export default function Invites({ invites, loading }) {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!invites || invites.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-muted">
        <FaRegEnvelopeOpen size={50} className="mb-3" />
        <h4>No invites yet</h4>
      </div>
    );
  }

  return (
    <div className="info-card-container" style={{ marginTop: "20px" }}>
      {invites.map((invite, index) => (
        <div key={index} className="info-card-myteam">
          <img
            src={
              invite.invitedUser?.photo_url ||
              invite.invitedUser?.profilePicture ||
              profile
            }
            alt="profile"
            width={"80px"}
            className="rounded-circle"
          />
          <div className="info-card-myteam-content">
            <h4>{invite.invitedUser?.display_name || `User ${index}`}</h4>
            <span className="position-tag">{invite.role}</span>
            <p className="text-muted">
              Invited on:{" "}
              {new Date(invite.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
