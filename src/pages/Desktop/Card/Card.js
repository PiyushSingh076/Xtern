import React from "react";
import "./Card.css"; // Import related styles
import { useNavigate } from "react-router-dom";
import { Chip, Stack, Tooltip } from "@mui/material"; // Import Material-UI components

const consultingChargesConfig = {
  astrologist: true,
  lawyer: true,
};

const Card = ({ data }) => {
  const navigate = useNavigate();

  const handleChatClick = (event) => {
    event.stopPropagation(); // Prevent card click from triggering
    navigate(
      `/chat?firstName=${encodeURIComponent(
        data.firstName
      )}&uid=${encodeURIComponent(data.uid)}`
    );
  };

  const handleCallClick = (event) => {
    event.stopPropagation(); // Prevent card click from triggering
    alert(`Calling ${data.phone_number}`);
  };

  const handleCardClick = () => {
    navigate(`/profile/${data.uid}`);
  };

  // Destructure necessary data
  const {
    photo_url,
    firstName,
    lastName,
    experience,
    consultingPrice,
    phone_number,
    type,
    skillSet,
    city,
    state,
  } = data;

  return (
    <div
      className="card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }} // Add pointer cursor to indicate clickability
    >
      {/* User Image */}
      <div
        className="profile-image"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #ccc",
        }}
      >
        <img
          src={photo_url}
          alt={`${firstName} ${lastName}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* User Information */}
      <span className="filter-card-name">
        {firstName} {lastName}
      </span>
      <span>Year of experience: {experience}</span>

      {/* Display consulting price based on type */}
      {consultingChargesConfig[type?.toLowerCase()] && consultingPrice && (
        <span>
          <span style={{ color: "#009DED" }}>&#8377;{consultingPrice}/min</span>
        </span>
      )}

      {/* Skill Badges */}
      {(type === "Developer" || type === "Intern") && skillSet && (
        <div style={{ marginTop: "10px" }}>
          <Stack direction="row" spacing={1}>
            {skillSet.map((skillObj) => (
              <Tooltip
                title={`Rating: ${skillObj.skillRating}/5`}
                key={skillObj.skill}
              >
                <Chip
                  label={skillObj.skill}
                  color="primary"
                  variant="outlined"
                />
              </Tooltip>
            ))}
          </Stack>
        </div>
      )}

      {/* Location */}
      <div className="location-details" style={{ marginTop: "10px" }}>
        {city && <span>City: {city}</span>}
        {state && <span>State: {state}</span>}
      </div>

      {/* Action Buttons */}
      <div className="card-footer" style={{ marginTop: "15px" }}>
        <button onClick={handleCallClick}>Call</button>
        <button onClick={handleChatClick}>Chat</button>
        <button
          onClick={(event) => {
            event.stopPropagation(); // Prevent card click from triggering
            navigate(`/profile/${data.uid}`);
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default Card;
