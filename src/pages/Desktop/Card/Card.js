import React from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";
import { Chip, Stack, Tooltip } from "@mui/material";

const consultingChargesConfig = {
  astrologist: true,
  lawyer: true,
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

    const visibleSkills = skills.slice(0, MAX_VISIBLE_SKILLS);
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

      <span className="filter-card-name">
        {firstName} {lastName}
      </span>
      <span>experience: {experience}</span>

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
        <button onClick={handleCallClick}>Call</button>
        <button onClick={handleChatClick}>Chat</button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/profile/${uid}`);
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default Card;
