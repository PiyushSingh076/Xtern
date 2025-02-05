// Xtern.js
import React, { useState, useEffect } from "react";
import profile from "../../assets/images/banner/mentor.png";
import medal from "../../assets/svg/medal.png";
import useFetchSubscribedCandidates from "../../hooks/Teams/useFetchSubscribedCandidates";
import useUnsubscribeCandidate from "../../hooks/Teams/useUnsubscribeCandidate";
import { FaRegSadCry } from "react-icons/fa";

export default function Xtern({ user }) {

  return (
    <div className="info-card-container">
    
          <div className="info-card-xtern">
            <div className="info-card-img-section">
              <img
                src={user.photo_url || "/placeholder.svg"} 
                className="info-card-img rounded-circle"
                alt="profile"
                width={"70px"}
              />
            </div>
            <div className="info-card-content">
              <div className="info-card-name-section">
                <h4>
                {user.display_name || 'Anonymous User'} ({user.type})                </h4>
                {/* <div className="medal-section">
                  <img src={medal} alt="medal" width={"15px"} /> Brown
                </div> */}
              </div>
              <span className="subscribed-tag">Subscribed</span>
              <div className="info-card-action-section">
                  <>
                    {/* <button
                      className="unsubscribe-btn"
                      // onClick={() => handleUnsubscribe(candidate)}
                      disabled={
                        unsubscribeLoading ||
                        loadingIds[candidate.internDetails.uid]
                      }
                    >
                      {loadingIds[candidate.internDetails.uid]
                        ? "Unsubscribing..."
                        : "Unsubscribe"}
                    </button> */}
                  </>
                
              </div>
              <span className="info-card-phone-number">
                Phone Number:{" "}
                {user.phone_number || "Not Available"}
              </span>
            </div>
          </div>
 
    </div>
  );
}
