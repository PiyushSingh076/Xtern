import React, {useState} from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";
import { Chip, Stack, Tooltip, Skeleton  } from "@mui/material";

import CallIcon from "@mui/icons-material/Call";
import ChatIcon from "@mui/icons-material/Chat";
import InfoIcon from "@mui/icons-material/Info";
import WorkIcon from "@mui/icons-material/Work";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"

// ShimmerCard component
export const ShimmerCard = () => (
  <div className="card">
    {/* Profile Image Shimmer */}
    <div
      style={{
        width: "75px",
        height: "75px",
        margin: "0 auto",
      }}
    >
      <Skeleton variant="circular" width={75} height={75} animation="wave" />
    </div>

    {/* Name Shimmer */}
    <Skeleton
      variant="text"
      width={110}
      height={20}
      animation="wave"
      style={{ margin: "8px auto" }}
    />

    {/* Experience Shimmer */}
    <Skeleton
      variant="text"
      width={90}
      height={18}
      animation="wave"
      style={{ margin: "8px auto" }}
    />

    {/* Price Shimmer */}
    <Skeleton
      variant="text"
      width={70}
      height={18}
      animation="wave"
      style={{ margin: "8px auto" }}
    />

    {/* Skills Shimmer */}
    <div
      style={{
        marginTop: "8px",
        display: "flex",
        justifyContent: "center",
        gap: "6px",
      }}
    >
      <Skeleton variant="rounded" width={55} height={22} animation="wave" />
      <Skeleton variant="rounded" width={55} height={22} animation="wave" />
      <Skeleton variant="rounded" width={55} height={22} animation="wave" />
    </div>

    {/* Location Shimmer */}
    <Skeleton
      variant="text"
      width={130}
      height={18}
      animation="wave"
      style={{ margin: "8px auto" }}
    />

    {/* Footer Buttons Shimmer */}
    <div className="card-footer" style={{ marginTop: "12px" }}>
      <Skeleton variant="rounded" width={75} height={34} animation="wave" />
      <Skeleton variant="rounded" width={75} height={34} animation="wave" />
      <Skeleton variant="rounded" width={75} height={34} animation="wave" />
    </div>
  </div>
);


const consultingChargesConfig = {
  astrologist: true,
  lawyer: true,
};

const formatName = (name) => {
  if (!name) return ""; // Handle cases where the name is empty
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const Card = ({ data }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

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
    firstName,
    lastName,
    photo_url,
    experience,
    consultingPrice,
    type,
    skillSet,
    state,
    city,
    phone_number,
    uid,
    isPhoneVerified,
  } = data;

  const MAX_VISIBLE_SKILLS = 3;

  const renderSkills = (skills) => {
    if (!skills || skills.length === 0) {
      return <Chip label="No Skills Added" color="default" variant="outlined" size="small" />
    }

    // Show all skills when hovered, otherwise show limited skills
    const visibleSkills = isHovered
      ? skills
      : window.innerWidth < 480
        ? [skills[0]]
        : skills.slice(0, MAX_VISIBLE_SKILLS)
    const extraSkills = !isHovered && skills.length > MAX_VISIBLE_SKILLS ? skills.slice(MAX_VISIBLE_SKILLS) : []

    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: "wrap",
          gap: "4px",
          justifyContent: "center",
        }}
      >
        {visibleSkills.map((skillObj) => (
          <Tooltip title={`Rating: ${skillObj.skillRating}/5`} key={skillObj.skill}>
            <Chip label={skillObj.skill} color="primary" variant="outlined" size="small" />
          </Tooltip>
        ))}

        {!isHovered && extraSkills.length > 0 && (
          <Tooltip
            title={extraSkills.map((skillObj) => `${skillObj.skill} (Rating: ${skillObj.skillRating}/5)`).join(", ")}
          >
            <Chip label={`+${extraSkills.length}`} color="primary" variant="outlined" size="small" />
          </Tooltip>
        )}
      </Stack>
    )
  }

  return (
    <div
      className={`card ${isHovered ? "card-hovered" : ""}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer" }}
    >
      <div className="card-content">
        <div className="profile-image">
          <img
            src={
              data.photo_url ||
              "https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg" ||
              "/placeholder.svg"
            }
            alt={`${data.firstName} ${data.lastName}`}
          />
        </div>

        <span className="filter-card-name">
          {`${formatName(data.firstName)}${`${data.firstName} ${data.lastName}`.length > 12 ? "" : ` ${formatName(data.lastName)}`}`}
        </span>

        <span className="experience">
          {window.innerWidth < 480 ? <WorkIcon sx={{ color: "#0a65fc" }} /> : "Experience:"} {data.experience}{" "}
          {data.experience === 1 ? "Year" : "Years"}
        </span>

        {consultingChargesConfig[data.type?.toLowerCase()] && data.consultingPrice && (
          <span className="price">
            <span>&#8377;{data.consultingPrice}/min</span>
          </span>
        )}

        {(data.type === "Developer" || data.type === "Intern") && (
          <div className="skills-container">{renderSkills(data.skillSet)}</div>
        )}

        <div className="location-details">
          {data.state && <span>📍 {data.state}</span>}
          {data.city && <span>, {data.city}</span>}
        </div>

        {/* Netflix-style expanded content */}
        <div className={`expanded-content ${isHovered ? "show" : ""}`}>
          {data.email && (
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{data.email}</span>
            </div>
          )}
          {data.phone_number && (
            <div className="info-row">
              <span className="info-label">Phone:</span>
              <span className="info-value">{data.phone_number}</span>
            </div>
          )}
          {data.type && (
            <div className="info-row">
              <span className="info-label">Type:</span>
              <span className="info-value">{data.type}</span>
            </div>
          )}
          {data.consultingDuration && (
            <div className="info-row">
              <span className="info-label">Duration:</span>
              <span className="info-value">{`${data.consultingDuration} ${data.consultingDurationType || ""}`}</span>
            </div>
          )}
          <div className="info-row">
            <span className="info-label">Verified:</span>
            <span className="info-value">
              {data.isPhoneVerified ? <CheckCircleIcon color="primary" /> : <CancelIcon color="error" />}
            </span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button onClick={handleCallClick}>
          <span className="footer-text">Call</span>
          <CallIcon className="footer-icon" />
        </button>
        <button onClick={handleChatClick}>
          <span className="footer-text">Chat</span>
          <ChatIcon className="footer-icon" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/profile/${data.uid}`)
          }}
        >
          <span className="footer-text">Details</span>
          <InfoIcon className="footer-icon" />
        </button>
      </div>
    </div>
  )
}

export default Card

