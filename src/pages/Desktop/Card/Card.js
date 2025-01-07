import React from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";
import { Chip, Stack, Tooltip } from "@mui/material";

import CallIcon from "@mui/icons-material/Call";
import ChatIcon from "@mui/icons-material/Chat";
import InfoIcon from "@mui/icons-material/Info";

const consultingChargesConfig = {
  astrologist: true,
  lawyer: true,
};

const formatName = (name) => {
  if (!name) return ""; // Handle cases where the name is empty
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const Card = ({ data }) => {
  const navigate = useNavigate();

  const handleChatClick = (event) => {
    event.stopPropagation();
    navigate(
      `/chat?firstName=${encodeURIComponent(
        data.firstName
      )}&uid=${encodeURIComponent(data.uid)}`
    );
  };

  const handleCallClick = (event) => {
    event.stopPropagation();
    navigate(
      `/videocall?firstName=${encodeURIComponent(
        data.firstName
      )}&uid=${encodeURIComponent(data.uid)}`
    );
  };

  const handleCardClick = () => {
    navigate(`/profile/${data.uid}`);
  };

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
    uid,
  } = data;

  const MAX_VISIBLE_SKILLS = 3;

  const renderSkills = (skills) => {
    if (!skills || skills.length === 0) {
      return (
        <Chip
          label="No Skills Added"
          color="default"
          variant="outlined"
          size="small"
        />
      );
    }

    // Check if screen width is less than 480px
    const isSmallScreen = window.innerWidth < 480;

    // Display only the first skill on small screens
    const visibleSkills = isSmallScreen
      ? [skills[0]]
      : skills.slice(0, MAX_VISIBLE_SKILLS);
    const extraSkills =
      skills.length > MAX_VISIBLE_SKILLS
        ? skills.slice(MAX_VISIBLE_SKILLS)
        : [];

    return (
      <Stack direction="row" spacing={1}>
        {visibleSkills.map((skillObj) => (
          <Tooltip
            title={`Rating: ${skillObj.skillRating}/5`}
            key={skillObj.skill}
          >
            <Chip
              label={skillObj.skill}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Tooltip>
        ))}

        {extraSkills.length > 0 && (
          <Tooltip
            title={extraSkills
              .map(
                (skillObj) =>
                  `${skillObj.skill} (Rating: ${skillObj.skillRating}/5)`
              )
              .join(", ")}
          >
            <Chip
              label={`+${extraSkills.length}`}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Tooltip>
        )}
      </Stack>
    );
  };

  return (
    <div
      className="card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div
        className="profile-image"
        style={{
          width: "85px",
          height: "85px",
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid #ccc",
        }}
      >
        <img
          src={
            photo_url
              ? photo_url
              : "https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
          }
          alt={`${firstName} ${lastName}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* format the name if it is entered in all caps or the length of 
      the name in the card overflow then display the first name only */}
      <span className="filter-card-name">
        {`${formatName(firstName)}${
          `${firstName} ${lastName}`.length > 12
            ? ""
            : ` ${formatName(lastName)}`
        }`}
      </span>
      <span>Experience: {experience}</span>

      {consultingChargesConfig[type?.toLowerCase()] && consultingPrice && (
        <span>
          <span style={{ color: "#009DED" }}>&#8377;{consultingPrice}/min</span>
        </span>
      )}

      {(type === "Developer" || type === "Intern") && (
        <div style={{ marginTop: "10px" }}>{renderSkills(skillSet)}</div>
      )}

      <div
        className="location-details"
        style={{ marginTop: "10px", color: "#777" }}
      >
        {state && <span>📍 {state}</span>}
        {city && <span style={{ marginRight: "10px" }}>, {city}</span>}
      </div>

      <div className="card-footer" style={{ marginTop: "15px" }}>
        <button onClick={handleCallClick}>
          <span className="footer-text">Call</span>
          <CallIcon className="footer-icon" />
        </button>
        <button onClick={handleChatClick}>
          <span className="footer-text">Chat</span>
          <ChatIcon className="footer-icon" />
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/profile/${uid}`);
          }}
        >
          <span className="footer-text">Details</span>
          <InfoIcon className="footer-icon" />
        </button>
      </div>
    </div>
  );
};

export default Card;
