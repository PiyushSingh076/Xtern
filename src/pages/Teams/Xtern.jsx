import React, { useState } from "react";
import profile from "../../assets/images/banner/mentor.png";
import medal from "../../assets/svg/medal.png";
import useFetchSubscribedCandidates from "../../hooks/Teams/useFetchSubscribedCandidates";
import useUnsubscribeCandidate from "../../hooks/Teams/useUnsubscribeCandidate";

export default function Xtern() {
  const { subscribedCandidates, loading } = useFetchSubscribedCandidates();
  const { unsubscribeCandidate, loading: unsubscribeLoading } =
    useUnsubscribeCandidate();
  const [loadingIds, setLoadingIds] = useState({}); // Track loading for specific candidates

  if (loading) {
    return <div>Loading subscribed candidates...</div>;
  }

  const handleUnsubscribe = async (candidate) => {
    setLoadingIds((prev) => ({ ...prev, [candidate.internDetails.uid]: true }));
    await unsubscribeCandidate(candidate);
    setLoadingIds((prev) => ({
      ...prev,
      [candidate.internDetails.uid]: false,
    }));
  };

  return (
    <div className="info-card-container">
      {subscribedCandidates.map((candidate, index) => (
        <div className="info-card-xtern" key={index}>
          <div className="info-card-img-section">
            <img
              src={candidate.internDetails.photo_url || profile}
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
              <button
                className="unsubscribe-btn"
                onClick={() => handleUnsubscribe(candidate)}
                disabled={
                  unsubscribeLoading || loadingIds[candidate.internDetails.uid]
                }
              >
                {loadingIds[candidate.internDetails.uid]
                  ? "Unsubscribing..."
                  : "Unsubscribe"}
              </button>
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
