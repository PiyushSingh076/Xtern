// src/Components/Profile/MainProfile.js

import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { IconButton, Tooltip, Chip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { MdEdit } from "react-icons/md";
import { FaSpa, FaAppleAlt } from "react-icons/fa";
import toast from "react-hot-toast";

/**
 * Utility function to safely format experience.
 * Returns "Less than 1 Yr" if the experience is invalid or <= 0.
 * Otherwise, returns the experience followed by " Yr".
 */
function formatExperience(expValue) {
  // console.log("Experience Value:", expValue);

  // Attempt to parse the experience value
  const parsed = parseInt(expValue, 10);

  // Check if the parsed value is a valid number and greater than 0
  if (isNaN(parsed) || parsed <= 0) return "Less than 1 Yearr";

  // Return the parsed experience with the "Yr" suffix
  return `${parsed} Year`;
}

export default function MainProfile({
  userdata,
  loading,
  handleEdit,
  handleShare,
}) {
  return (
    <div className="single-mentor-first-wrap" style={styles.container}>
      {/* Profile Picture and Share Icon */}
      <div className="mentor-img-sec" style={styles.imageContainer}>
        {loading ? (
          <Skeleton variant="circular" width={96} height={96} />
        ) : (
          <>
            <img
              src={userdata?.photo_url || "/default-profile.png"}
              alt="client-img"
              width={80}
              height={80}
              style={styles.profileImage}
              onError={(e) => (e.target.src = "/default-profile.png")}
            />
            <Tooltip title="Share Profile" arrow>
              <IconButton
                onClick={handleShare}
                style={styles.shareButton}
                size="small"
              >
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}

        {/* Edit Button */}
        <Tooltip title="Edit Profile" arrow>
          <IconButton
            onClick={handleEdit}
            style={styles.editButton}
            size="small"
          >
            <MdEdit size={20} color="#007bff" />
          </IconButton>
        </Tooltip>
      </div>

      {/* User Details */}
      <div className="single-mentor-details" style={styles.detailsContainer}>
        {loading ? (
          <>
            <Skeleton variant="text" width={150} height={28} />
            <Skeleton
              variant="text"
              width={120}
              height={24}
              style={{ marginTop: 12 }}
            />
            <Skeleton
              variant="text"
              width={180}
              height={20}
              style={{ marginTop: 16 }}
            />
          </>
        ) : (
          <>
            <h3 style={styles.name}>
              {userdata?.firstName} {userdata?.lastName}
            </h3>
            <h4 style={styles.experience}>
              Experience: {formatExperience(userdata?.experience)}
            </h4>
            <p className="" style={styles.badge}>
              {userdata?.type}
            </p>

            {/* Conditional Skill Icons */}
            {userdata?.type?.toLowerCase() === "dietician" && (
              <Chip
                icon={<FaAppleAlt />}
                label="Nutrition Expert"
                size="small"
                style={styles.chip}
              />
            )}
            {userdata?.type?.toLowerCase() === "yoga" && (
              <Chip
                icon={<FaSpa />}
                label="Yoga Instructor"
                size="small"
                style={styles.chip}
              />
            )}
            {/* Add more role-based skills as needed */}
          </>
        )}
      </div>
    </div>
  );
}

// Inline styles for simplicity. Consider using CSS or styled-components for better management.
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    position: "relative",
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    borderRadius: "50%",
    objectFit: "cover",
  },
  shareButton: {
    position: "absolute",
    top: -10,
    left: -10,
    backgroundColor: "#007bff",
    color: "#fff",
    "&:hover": { backgroundColor: "#0056b3" },
  },
  editButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "transparent",
    color: "#007bff",
    "&:hover": { backgroundColor: "#f0f0f0" },
  },
  detailsContainer: {
    marginLeft: "10px",
    flex: 1,
  },
  name: {
    margin: 0,
    fontSize: "1.2rem",
  },
  experience: {
    margin: "5px 0",
    fontWeight: "600",
  },
  badge: {
    margin: "5px 0",
    color: "#007bff",
    fontWeight: "bold",
  },
  chip: {
    marginTop: "5px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #424242",
    color: "#424242",
  },
};
