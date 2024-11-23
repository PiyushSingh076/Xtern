// src/components/LinkedInFetcher.jsx
import React, { useState } from "react";
import useFetchLinkedInProfile from "../../hooks/Linkedin/useFetchLinkedInProfile";
import {
  Box,
  Button,
  Input,
  Typography,
  Alert,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";

const LinkedInFetcher = () => {
  const { fetchLinkedInProfile, loading, error, successMessage, linkedInData } =
    useFetchLinkedInProfile();
  const [profileUrl, setProfileUrl] = useState("");
  console.log("linkedInData", linkedInData);
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
    await fetchLinkedInProfile(profileUrl);
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "20px auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Fetcher Section */}
      <Typography variant="h4" align="center" gutterBottom>
        LinkedIn Profile Fetcher
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Input
          fullWidth
          placeholder="Enter LinkedIn Profile URL"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          sx={{
            mb: 2,
            padding: 1,
            border: "1px solid #ccc",
            borderRadius: 1,
            backgroundColor: "#fff",
          }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleFetch}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
          sx={{ height: 50 }}
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

      {/* Display Fetched Data */}
      {linkedInData && (
        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                {/* Profile Picture */}
                <Grid
                  item
                  xs={12}
                  sm={3}
                  display="flex"
                  justifyContent="center"
                >
                  <Avatar
                    src={linkedInData.profile_pic_url}
                    alt={`${linkedInData.first_name} ${linkedInData.last_name}`}
                    sx={{ width: 100, height: 100 }}
                  />
                </Grid>

                {/* Personal Information */}
                <Grid item xs={12} sm={9}>
                  <Typography variant="h5">
                    {linkedInData.first_name} {linkedInData.last_name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {linkedInData.headline || "No headline provided"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {linkedInData.location || "No location provided"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Background Cover Image */}
              {linkedInData.background_cover_image_url && (
                <Box
                  component="img"
                  src={linkedInData.background_cover_image_url}
                  alt="Background Cover"
                  sx={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
              )}

              {/* Summary */}
              {linkedInData.summary && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">Summary</Typography>
                  <Typography variant="body1">
                    {linkedInData.summary}
                  </Typography>
                </Box>
              )}

              {/* Experiences */}
              {linkedInData.experiences &&
                linkedInData.experiences.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Experience</Typography>
                    {linkedInData.experiences.map((exp, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="subtitle1">
                          <strong>{exp.position}</strong> at {exp.company}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {exp.startDate
                            ? new Date(exp.startDate).toLocaleDateString(
                                "default",
                                {
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "Start Date"}{" "}
                          -{" "}
                          {exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString(
                                "default",
                                {
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "Present"}
                        </Typography>
                        <Typography variant="body1">
                          {exp.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

              {/* Education */}
              {linkedInData.education && linkedInData.education.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">Education</Typography>
                  {linkedInData.education.map((edu, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="subtitle1">
                        <strong>{edu.degree}</strong> in {edu.stream}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {edu.institution}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {edu.startDate
                          ? new Date(edu.startDate).toLocaleDateString(
                              "default",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Start Date"}{" "}
                        -{" "}
                        {edu.endDate
                          ? new Date(edu.endDate).toLocaleDateString(
                              "default",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Present"}
                      </Typography>
                      <Typography variant="body1">CGPA: {edu.grade}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Skills */}
              {linkedInData.skills && linkedInData.skills.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">Skills</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {linkedInData.skills.map((skill, index) => (
                      <Chip key={index} label={skill} variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default LinkedInFetcher;
