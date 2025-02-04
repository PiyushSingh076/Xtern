import React from "react";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./Card.css";

const CreateJobCard = () => {
  const navigate = useNavigate();

  const handleCreateJobClick = () => {
    // Navigate to the create job page
    navigate("/createjob");
  };

  return (
    <div
      className="card"
      onClick={handleCreateJobClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "2px dashed #1976d2",
      }}
    >
      <div className="profile-image">
        <AddCircleOutlineIcon style={{ fontSize: "48px", color: "#1976d2" }} />
      </div>
      <span
        className="filter-card-name"
        style={{
          marginTop: "10px",
          fontWeight: "bold",
          color: "#1976d2",
          fontSize: "16px",
        }}
      >
        Create Job
      </span>
    </div>
  );
};

export default CreateJobCard;
