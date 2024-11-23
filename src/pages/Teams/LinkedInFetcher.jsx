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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import ApiIcon from "@mui/icons-material/Api";
import BuildIcon from "@mui/icons-material/Build";
import GitHubIcon from "@mui/icons-material/GitHub";

const LinkedInFetcher = () => {
  const {
    fetchLinkedInProfile,
    loading,
    error,
    successMessage,
    linkedInData,
    groupSkillsByCategory,
  } = useFetchLinkedInProfile();
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

  // Truncate text function
  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  // Function to get icon based on skill category
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "frontend":
        return <CodeIcon />;
      case "backend":
        return <StorageIcon />;
      case "api":
        return <ApiIcon />;
      case "devops":
        return <BuildIcon />;
      case "version control":
        return <GitHubIcon />;
      default:
        return <CodeIcon />;
    }
  };

  // Function to get color based on skill category
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "frontend":
        return "primary";
      case "backend":
        return "secondary";
      case "api":
        return "success";
      case "devops":
        return "warning";
      case "version control":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        margin: "20px auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fafafa",
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
            {/* Banner Section */}
            {linkedInData.background_cover_image_url && (
              <Box
                component="img"
                src={linkedInData.background_cover_image_url}
                alt="Background Cover"
                sx={{
                  width: "100%",
                  height: { xs: "150px", sm: "200px" },
                  objectFit: "cover",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
            )}

            <CardContent sx={{ position: "relative", paddingTop: 2 }}>
              <Grid container spacing={2}>
                {/* Profile Picture */}
                <Grid
                  item
                  xs={12}
                  sm={3}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Avatar
                    src={linkedInData.profile_pic_url}
                    alt={`${linkedInData.first_name} ${linkedInData.last_name}`}
                    sx={{
                      width: { xs: 100, sm: 150 },
                      height: { xs: 100, sm: 150 },
                      border: "4px solid #1976d2",
                      boxShadow: 3,
                    }}
                  />
                </Grid>

                {/* Personal Information */}
                <Grid item xs={12} sm={9}>
                  <Typography variant="h5" gutterBottom>
                    {linkedInData.first_name} {linkedInData.last_name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    gutterBottom
                  >
                    {linkedInData.headline || "No headline provided"}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {linkedInData.location || "No location provided"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Summary */}
              {linkedInData.summary && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Summary
                  </Typography>
                  <Typography variant="body1">
                    {truncate(linkedInData.summary, 300)}
                    {linkedInData.summary.length > 300 && (
                      <Tooltip title={linkedInData.summary}>
                        <Typography
                          variant="body2"
                          color="primary"
                          component="span"
                          sx={{ cursor: "pointer", ml: 1 }}
                        >
                          Read more
                        </Typography>
                      </Tooltip>
                    )}
                  </Typography>
                </Box>
              )}

              {/* Experiences */}
              {linkedInData.experiences &&
                linkedInData.experiences.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Experience
                    </Typography>
                    {linkedInData.experiences.map((exp, index) => (
                      <Accordion key={index} sx={{ mb: 1 }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`experience-content-${index}`}
                          id={`experience-header-${index}`}
                        >
                          <Typography variant="subtitle1">
                            <strong>{exp.position}</strong> at {exp.company}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                          >
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
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}

              {/* Education */}
              {linkedInData.education && linkedInData.education.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Education
                  </Typography>
                  {linkedInData.education.map((edu, index) => (
                    <Accordion key={index} sx={{ mb: 1 }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`education-content-${index}`}
                        id={`education-header-${index}`}
                      >
                        <Typography variant="subtitle1">
                          <strong>{edu.degree}</strong> in {edu.stream}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
                          {edu.institution}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
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
                        <Typography variant="body1">
                          CGPA: {edu.grade}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}

              {/* Skills */}
              {linkedInData.skills && linkedInData.skills.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Skills
                  </Typography>
                  {Object.entries(
                    groupSkillsByCategory(linkedInData.skills)
                  ).map(([category, skills], index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {category}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {skills.map((skill, idx) => (
                          <Tooltip key={idx} title={skill.name} arrow>
                            <Chip
                              icon={getCategoryIcon(skill.category)}
                              label={skill.name}
                              color={getCategoryColor(skill.category)}
                              variant="outlined"
                              sx={{
                                fontSize: "0.9rem",
                                padding: "5px 10px",
                                marginBottom: "5px",
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                  boxShadow: 1,
                                },
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Stack>
                    </Box>
                  ))}
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
