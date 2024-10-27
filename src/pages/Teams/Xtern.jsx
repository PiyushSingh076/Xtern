import React from "react";
import profile from "../../assets/images/banner/mentor.png";
import medal from "../../assets/svg/medal.png";
import useFetchSubscribedCandidates from "../../hooks/Teams/useFetchSubscribedCandidates";

export default function Xtern() {
  const { subscribedCandidates, loading } = useFetchSubscribedCandidates();

  if (loading) {
    return <div>Loading subscribed candidates...</div>;
  }

  return (
    <div className="info-card-container">
      {subscribedCandidates.map((candidate, index) => (
        <div className="info-card-xtern" key={index}>
          <div className="info-card-img-section">
            <img
              // src={candidate.internDetails.photo_url || profile}
              src={profile}
              className="info-card-img rounded-circle"
              alt="profile"
              width={"70px"}
            />
          </div>
          <div className="info-card-content">
            <div className="info-card-name-section">
              <h4>
                {candidate.internDetails.display_name || "No Name Available"}
              </h4>
              <div className="medal-section">
                <img src={medal} alt="medal" width={"15px"} /> Brown
              </div>
            </div>
            <span className="subscribed-tag">Subscribed</span>
            <div className="info-card-action-section">
              <button className="replace-btn">Replace</button>
              <button className="unsubscribe-btn">Unsubscribe</button>
            </div>
            <span className="info-card-phone-number">
              Phone Number:{" "}
              {candidate.internDetails.phone_number || "Not Available"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
