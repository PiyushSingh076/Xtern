import React, { useState } from "react";
import useFetchLinkedInProfile from "../../hooks/Linkedin/useFetchLinkedInProfile";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  Tooltip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const LinkedInFetcher = ({ onFetchSuccess }) => {
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

  // Truncate text function
  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  // Helper function to format date
  const formatDate = (dateObj) => {
    if (!dateObj) return "Present";
    const { year, month, day } = dateObj;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card sx={{ padding: 2, boxShadow: 2 }}>
      {/* Fetcher Section */}
      <Typography variant="h6" gutterBottom>
        LinkedIn Profile
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 1, flexWrap: "wrap" }}>
        <TextField
          label="LinkedIn URL"
          variant="outlined"
          fullWidth
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetch}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
          size="small"
        >
          {loading ? "Fetching" : "Fetch"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Display Fetched Data */}
      {linkedInData && (
        <Box sx={{ mt: 2 }}>
          {/* Banner and Profile Picture */}
          <Card variant="outlined" sx={{ boxShadow: 1 }}>
            {/* Banner Section */}
            {linkedInData.background_cover_image_url && (
              <Box
                component="img"
                src={linkedInData.background_cover_image_url}
                alt="Background Cover"
                sx={{
                  width: "100%",
                  height: { xs: "100px", sm: "150px" },
                  objectFit: "cover",
                  borderTopLeftRadius: 1,
                  borderTopRightRadius: 1,
                }}
              />
            )}

            <CardContent sx={{ padding: 3 }}>
              <Grid container spacing={3}>
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
                      width: 120,
                      height: 120,
                      border: "2px solid #1976d2",
                    }}
                  />
                </Grid>

                {/* Personal Information */}
                <Grid item xs={12} sm={9}>
                  <Typography variant="h5" fontWeight="bold">
                    {linkedInData.first_name} {linkedInData.last_name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    {linkedInData.headline || "No headline provided"}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    {linkedInData.occupation || "No occupation provided"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1 }}
                  >
                    Followers: {linkedInData.follower_count || 0}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ mt: 2 }}
                  >
                    {linkedInData.city}, {linkedInData.state},{" "}
                    {linkedInData.country_full_name}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Summary */}
              {linkedInData.summary && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
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
                          sx={{ cursor: "pointer", ml: 0.5 }}
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
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="experiences-content"
                      id="experiences-header"
                    >
                      <Typography variant="h6">Experiences</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {linkedInData.experiences.map((exp, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                          <Grid container spacing={2}>
                            {/* Company Logo */}
                            {exp.logo_url && (
                              <Grid item xs={12} sm={2}>
                                <Avatar
                                  src={exp.logo_url}
                                  alt={exp.company}
                                  variant="square"
                                  sx={{ width: 60, height: 60 }}
                                />
                              </Grid>
                            )}

                            {/* Experience Details */}
                            <Grid item xs={12} sm={exp.logo_url ? 10 : 12}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {exp.title} at {exp.company}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mt: 0.5 }}
                              >
                                {formatDate(exp.starts_at)} -{" "}
                                {exp.ends_at
                                  ? formatDate(exp.ends_at)
                                  : "Present"}
                              </Typography>
                              {exp.location && (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  Location: {exp.location}
                                </Typography>
                              )}
                              {exp.description && (
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                  {exp.description}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}

              {/* Education */}
              {linkedInData.education && linkedInData.education.length > 0 && (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="education-content"
                    id="education-header"
                  >
                    <Typography variant="h6">Education</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {linkedInData.education.map((edu, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {edu.degree_name} in {edu.field_of_study}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mt: 0.5 }}
                        >
                          {edu.school}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mt: 0.5 }}
                        >
                          {formatDate(edu.starts_at)} -{" "}
                          {edu.ends_at ? formatDate(edu.ends_at) : "Present"}
                        </Typography>
                        {edu.grade && (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mt: 0.5 }}
                          >
                            Grade: {edu.grade}
                          </Typography>
                        )}
                        {edu.description && (
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            {edu.description}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Projects */}
              {linkedInData.accomplishment_projects &&
                linkedInData.accomplishment_projects.length > 0 && (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="projects-content"
                      id="projects-header"
                    >
                      <Typography variant="h6">Projects</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {linkedInData.accomplishment_projects.map(
                        (proj, index) => (
                          <Box key={index} sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {proj.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ mt: 0.5 }}
                            >
                              {formatDate(proj.starts_at)} -{" "}
                              {proj.ends_at
                                ? formatDate(proj.ends_at)
                                : "Present"}
                            </Typography>
                            {proj.url && (
                              <Typography variant="body2" color="primary">
                                <Link
                                  href={proj.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  underline="hover"
                                >
                                  Live Demo
                                </Link>
                              </Typography>
                            )}
                            {proj.description && (
                              <Typography variant="body1" sx={{ mt: 1 }}>
                                {proj.description}
                              </Typography>
                            )}
                          </Box>
                        )
                      )}
                    </AccordionDetails>
                  </Accordion>
                )}

              {/* Certifications */}
              {linkedInData.certifications &&
                linkedInData.certifications.length > 0 && (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="certifications-content"
                      id="certifications-header"
                    >
                      <Typography variant="h6">Certifications</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {linkedInData.certifications.map((cert, index) => (
                        <Box key={index} sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {cert.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mt: 0.5 }}
                          >
                            Authority: {cert.authority}
                          </Typography>
                          {cert.starts_at && (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ mt: 0.5 }}
                            >
                              Date: {formatDate(cert.starts_at)}
                            </Typography>
                          )}
                          {cert.url && (
                            <Typography variant="body2" color="primary">
                              <Link
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                              >
                                View Certificate
                              </Link>
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}

              {/* Additional Sections (e.g., Groups) */}
              {linkedInData.groups && linkedInData.groups.length > 0 && (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="groups-content"
                    id="groups-header"
                  >
                    <Typography variant="h6">Groups</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {linkedInData.groups.map((group, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                          {/* Group Logo */}
                          {group.profile_pic_url && (
                            <Grid item xs={12} sm={2}>
                              <Avatar
                                src={group.profile_pic_url}
                                alt={group.name}
                                variant="square"
                                sx={{ width: 60, height: 60 }}
                              />
                            </Grid>
                          )}

                          {/* Group Details */}
                          <Grid
                            item
                            xs={12}
                            sm={group.profile_pic_url ? 10 : 12}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {group.name}
                            </Typography>
                            {group.url && (
                              <Typography variant="body2" color="primary">
                                <Link
                                  href={group.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  underline="hover"
                                >
                                  Visit Group
                                </Link>
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Connections */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold">
                  Connections
                </Typography>
                <Typography variant="body1">
                  {linkedInData.connections} Connections
                </Typography>
              </Box>

              {/* People Also Viewed */}
              {/* {linkedInData.people_also_viewed &&
                linkedInData.people_also_viewed.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      People Also Viewed
                    </Typography>
                    <Grid container spacing={2}>
                      {linkedInData.people_also_viewed.map((person, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card variant="outlined" sx={{ padding: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {person.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {person.summary || "No summary provided"}
                            </Typography>
                            {person.link && (
                              <Typography variant="body2" color="primary">
                                <Link
                                  href={person.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  underline="hover"
                                >
                                  View Profile
                                </Link>
                              </Typography>
                            )}
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )} */}
            </CardContent>
          </Card>
        </Box>
      )}
    </Card>
  );
};

export default LinkedInFetcher;
