import React from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "./projectDetail.css";

const LeaveReviewBox = ({ onCancel }) => {
  return (
    <div
      className="review-item"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      <textarea
        placeholder="Write your review here..."
        style={{
          width: "100%",
          height: "80px",
          resize: "none",
          padding: "8px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      ></textarea>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Star Rating */}
        <div style={{ display: "flex" }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index}>
              <StarBorderIcon sx={{ color: "#0a65fc", cursor: "pointer" }} />
            </span>
          ))}
        </div>
        {/* Submit and Cancel Buttons */}
        <div>
          <button
            style={{
              backgroundColor: "#0a65fc",
              color: "white",
              fontSize: "12px",
              padding: "4px 10px",
              borderRadius: "4px",
              border: "none",
              marginRight: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
          <button
            style={{
              backgroundColor: "#ccc",
              color: "black",
              fontSize: "12px",
              padding: "4px 10px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewBox;
