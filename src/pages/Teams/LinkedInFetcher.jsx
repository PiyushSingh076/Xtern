// src/Components/Admin/Profile/LinkedInFetcher.jsx

import React, { useState } from "react";
import useFetchLinkedInProfile from "../../hooks/Linkedin/useFetchLinkedInProfile";
import linkedinLogo from "../../assets/svg/linkedin.png";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Card,
} from "@mui/material";

const LinkedInFetcher = ({ onFetchSuccess, close }) => {
  const { fetchLinkedInProfile, loading, error, successMessage, linkedInData } =
    useFetchLinkedInProfile();
  const [profileUrl, setProfileUrl] = useState("");

  // URL Validation Function
  const validateLinkedInUrl = (url) => {
    const regex = /^https?:\/\/(www\.)?linkedin\.com\/.*$/;
    return regex.test(url);
  };

  const handleFetch = async () => {
    if (!profileUrl) {
      alert("Please provide a LinkedIn Profile URL.");
      return;
    }
    if (!validateLinkedInUrl(profileUrl)) {
      alert("Please enter a valid LinkedIn Profile URL.");
      return;
    }
    const data = await fetchLinkedInProfile(profileUrl);
    if (data && onFetchSuccess) {
      console.log("Fetched LinkedIn Data:", data); // Debugging
      onFetchSuccess(data.linkedInData); // Passing the linkedInData directly
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Light overlay
        position: "fixed",
        inset: 0,
        zIndex: 1000, // Ensuring proper layer priority
      }}
    >
      <Card
        sx={{
          padding: 4,
          width: "400px", // Adjust card width for better responsiveness
          backgroundColor: "#ffffff", // White background for the card
          borderRadius: 3,
          color: "#000000",
          boxShadow: 6,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.02)", // Slight zoom effect on hover
            boxShadow: 10,
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* LinkedIn Logo */}
        <Box
          sx={{
            height: "50px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <img
            src={linkedinLogo}
            alt="LinkedIn Logo"
            style={{ width: "40px", height: "40px" }}
          />
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
            Import LinkedIn Profile
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: "column",
            width: "100%",
          }}
        >
          <TextField
            label="LinkedIn Profile URL"
            variant="outlined"
            fullWidth
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            size="medium"
            InputProps={{
              style: { color: "#000000", borderColor: "#000000" },
            }}
            InputLabelProps={{
              style: { color: "#555555" }, // Darker grey label
            }}
            sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetch}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
            size="large"
            sx={{
              backgroundColor: "#0077b5",
              "&:hover": { backgroundColor: "#005582" },
            }}
          >
            {loading ? "Fetching..." : "Import Profile"}
          </Button>
          <Button
            onClick={() => close(true)}
            sx={{
              marginTop: "10px",
              width: "100%",
              backgroundColor: "transparent",
              border: "1px solid #0077b5",
              color: "#0077b5",
              borderRadius: 1,
              padding: "10px 0",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#e6f2ff",
              },
            }}
          >
            Add Manually
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3, width: "100%" }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mt: 3, width: "100%" }}>
            {successMessage}
          </Alert>
        )}
      </Card>
    </div>
  );
};

export default LinkedInFetcher;
