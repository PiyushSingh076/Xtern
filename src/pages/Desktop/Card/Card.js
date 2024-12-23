import React from "react";
import "./Card.css"; // Import related styles
import { useNavigate } from "react-router-dom";

const Card = ({ data }) => {
  const navigate = useNavigate();
  
  const handleChatClick = () => {
    navigate(
      `/chat?firstName=${encodeURIComponent(data.firstName)}&uid=${encodeURIComponent(data.uid)}`
    );
  };

  return (
    <div className="card">
      <img
        src={data.photo_url}
        alt={data.name}
        width={"100px"}
        style={{ borderRadius: "50%", border: "1px solid #ccc" }}
      />
      <span className="filter-card-name">
        {data.firstName} {data.lastName}
      </span>
      <span>Year of experience : {data.experience}</span>
      <span>
        <span style={{ color: "#009DED" }}>
          &#8377;{data.consultingPrice}/min
        </span>
      </span>

      <div className="card-footer">
        <button onClick={() => navigate(`/videocall?firstName=${encodeURIComponent(data.firstName)}&uid=${encodeURIComponent(data.uid)}`)}>
          Call
        </button>
        <button onClick={handleChatClick}>
          Chat
        </button>
        <button onClick={() => navigate(`/profile/${data.uid}`)}>
          Details
        </button>
      </div>
    </div>
  );
};

export default Card;
