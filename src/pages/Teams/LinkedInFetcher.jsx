import React, { useState } from "react";
import useFetchLinkedInProfile from "../../hooks/Linkedin/useFetchLinkedInProfile";
import { Box, Button, Input, Typography, Alert } from "@mui/material";

const LinkedInFetcher = () => {
  const { fetchLinkedInProfile, loading, error, successMessage } =
    useFetchLinkedInProfile();
  const [profileUrl, setProfileUrl] = useState("");

  const handleFetch = async () => {
    if (!profileUrl) {
      alert("Please provide a LinkedIn Profile URL.");
      return;
    }
    await fetchLinkedInProfile(profileUrl);
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        LinkedIn Profile Fetcher
      </Typography>
      <Input
        fullWidth
        placeholder="Enter LinkedIn Profile URL"
        value={profileUrl}
        onChange={(e) => setProfileUrl(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleFetch}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Profile"}
      </Button>

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
    </Box>
  );
};

export default LinkedInFetcher;
