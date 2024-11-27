import React, { useState } from "react";
import useFetchLinkedInProfile from "../../hooks/Linkedin/useFetchLinkedInProfile";
import linkedinLogo from '../../assets/svg/linkedin.png';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Card,
} from "@mui/material";

const LinkedInFetcher = ({ onFetchSuccess  , close}) => {
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
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Modal-like dark overlay
        position: "fixed",
        inset: 0,
        zIndex: 1000, // Ensuring proper layer priority
      }}
    >
      <Card
        sx={{
          padding: 3,
          width: "400px", // Adjust card width for better responsiveness
          backgroundColor: "#121212", // Dark background for the card
          borderRadius: 5,
          color: "white",
          boxShadow: 6,
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.05)", // Slight zoom effect on hover
            boxShadow: 10,
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* LinkedIn Logo */}
      <Box sx={{height: '50px' , display: 'flex', flexDirection: 'row' , alignItems: 'center' , gap: '20px' , marginBottom: '10px'}}>
      <img
          src={linkedinLogo}
          alt="LinkedIn Logo"
          style={{ width: "30px", marginBottom: "10px"  , filter: 'invert(1)'}}
        />
        <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
          LinkedIn Profile
        </Typography>
      </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", width: "100%" }}>
          <TextField
            label="LinkedIn Profile URL"
            variant="outlined"
            fullWidth
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            size="small"
            InputProps={{
              style: { color: "white", borderColor: "white" },
            }}
            InputLabelProps={{
              style: { color: "#aaa" }, // Light grey label
            }}
            sx={{ backgroundColor: "#1e1e1e", borderRadius: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetch}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
            size="small"
            sx={{
              marginTop: '5px',
              width: '100%',
            backgroundColor: "#0077b5", 
"&:hover": { backgroundColor: "#006097" },
            }}
          >
            {loading ? "Fetching" : "Import Profile"}
          </Button>
          <Button
          onClick={()=>close(true)}
          sx={{
            marginTop: '5px',
            width: '100%',
            backgroundColor: "transparent",
            border: 'none',
            cursor: 'pointer'
          }}
          >
            ADD  Manually
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}
      </Card>
    </div>
  );
};

export default LinkedInFetcher;