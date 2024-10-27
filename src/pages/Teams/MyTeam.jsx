import React from "react";
import profile from "../../assets/images/banner/mentor.png";
import useFetchOrganizationMembers from "../../hooks/Teams/useFetchOrganizationMembers";

export default function MyTeam() {
  const { members, loading } = useFetchOrganizationMembers();
  console.log(members, "llll");
  if (loading) {
    return <div>Loading team members...</div>;
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
            <span className="position-tag">{item.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
