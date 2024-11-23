import React from "react";
import profile from "../../assets/images/banner/mentor.png";

export default function MyTeam({ members, loading }) {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "20px" }} className="info-card-container">
      {members.map((item, index) => (
        <div key={index} className="info-card-myteam">
          <img
            src={item.photo_url || profile}
            alt="profile"
            width={"80px"}
            className="rounded-circle"
          />
          <div className="info-card-myteam-content">
            <h4>{item.display_name}</h4>
            <span className="position-tag">{item.role || "Member"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
