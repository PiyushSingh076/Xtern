import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import "./PopupDetails.css";

const PopupDetails = ({ data }) => {
  // console.log(data);
  return (
    <Box
      sx={{
        position: "absolute",
        top: "0", // Center vertically within the parent
        left: "0", // Position it to the right of the card
        transform: "translate(10px, -50%)", // Adjust the position slightly to the right and center it vertically
        padding: 2,
        borderRadius: 1,
        backgroundColor: "lightgray",
        boxShadow: 3,
        minWidth: "180px",
        zIndex: 10, // Ensure it's on top
        display: {
          xs: "none", // Hide on xs screens (mobile devices, <= 480px)
          sm: "block", // Show on small and larger screens
        },
      }}
    >
      <Typography variant="body1">
        <span className="popup-title">Price</span>:{" "}
        {data.consultingPrice ? `$${data.consultingPrice}` : "Value for money"}
      </Typography>
      <Typography variant="body1">
        <span className="popup-title">Consulting Duration</span>:{" "}
        {data.consultingDuration || "N/A"}
      </Typography>
      <Typography variant="body1">
        <span className="popup-title"> Duration Type</span>:{" "}
        {data.consultingDurationType || "N/A"}
      </Typography>
      <Typography variant="body1">
        <span className="popup-title">Verified</span>:{" "}
        {data.isPhoneVerified ? (
          <CheckCircleIcon color="primary" />
        ) : (
          <CancelIcon color="error" />
        )}
      </Typography>
    </Box>
  );
};

export default PopupDetails;
