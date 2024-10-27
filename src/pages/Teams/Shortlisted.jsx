
import React from "react";
import profile from "../../assets/images/banner/mentor.png";
import share from "../../assets/svg/share.svg";
import chat from "../../assets/svg/chat.png";
import useFetchShortlistedInterns from "../../hooks/Teams/useFetchShortlistedInterns";
import useSubscribeIntern from "../../hooks/Teams/useSubscribeIntern";

export default function Shortlisted() {
  const { shortlistedInterns, loading } = useFetchShortlistedInterns();
  const { subscribeIntern, loading: subscribeLoading } = useSubscribeIntern();

  if (loading) {
    return <div>Loading shortlisted interns...</div>;
  }

  const handleSubscribe = (intern) => {
    subscribeIntern(intern.uid); // Pass intern's ID as `internRef`
    console.log(intern.uid, "pppppppp");
  };

  return (
    <div className="info-card-container">
      {shortlistedInterns.map((intern, index) => (
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
              disabled={subscribeLoading}
            >
              {subscribeLoading ? "Subscribing..." : "Subscribe xtern"}
            </button>
            <button className="replace-btn">Schedule Interview</button>
            <button className="unsubscribe-btn">Reject</button>
          </div>

        </div>
    );
}
