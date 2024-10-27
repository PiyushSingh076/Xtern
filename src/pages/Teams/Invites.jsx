import React from "react";
import profile from "../../assets/images/banner/mentor.png";
import { FaRegEnvelopeOpen } from "react-icons/fa";
import useFetchInvites from "../../hooks/Teams/useFetchInvites";

export default function Invites() {
  const { invites, loading, error } = useFetchInvites();
  console.log(invites, "iiiii");
  if (loading) {
    return <div>Loading invites...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className="info-card-container" style={{ marginTop: "20px" }}>
      {invites.length === 0 ? (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-muted">
          <FaRegEnvelopeOpen size={50} className="mb-3" />
          <h4>No invites yet</h4>
        </div>
      ) : (
        invites.map((invite, index) => (
          <div key={index} className="info-card-myteam">
            <img
              src={invite.invitedUser?.photo_url || profile}
              alt="profile"
              width={"80px"}
              className="rounded-circle"
            />
            <div className="info-card-myteam-content">
              <h4>{invite.invitedUser?.display_name || "Unknown"}</h4>
              <span className="position-tag">{invite.role}</span>
              <p className="text-muted">
                Invited on:{" "}
                {new Date(invite.createdAt.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
