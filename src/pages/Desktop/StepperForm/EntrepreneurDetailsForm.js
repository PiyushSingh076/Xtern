import React, { useState } from "react";
import {
  Box,
  Grid,
  Avatar,
  TextField,
  FormControl,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid2,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import LinkedInLogo from "../../../assets/svg/linkedin.png";
import LinkedInFetcher from "../../Teams/LinkedInFetcher";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";
import useSaveEntrepreneurDetailsbFirebaseData from "../../../hooks/Auth/useSaveEntrepreneurDetailsFirebaseData";

export default function EntrepreneurProfileForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [yearsInOperation, setYearsInOperation] = useState("");
  const [industry, setIndustry] = useState("");
  const [numCandidates, setNumCandidates] = useState("");
  const [jobRoles, setJobRoles] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState(""); // New state for LinkedIn
  const [activeStep, setActiveStep] = useState(0);
  const [isLinkedInFetched, setIsLinkedInFetched] = useState(false);

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    businessName: false,
    websiteUrl: false,
    yearsInOperation: false,
    industry: false,
    numCandidates: false,
    jobRoles: false,
    skillsRequired: false,
    linkedinProfile: false, // Error state for LinkedIn
  });

  const handleProfileImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };
 
  const { userData } = useFetchUserData();
   const navigate = useNavigate();
const location = useLocation();

  const { profileData } = location.state || {};

  const{saveData,loading}=useSaveEntrepreneurDetailsbFirebaseData();

  const clearProfileImage = () => {
    setProfileImg(null);
  };

  const handleLinkedInEntrepreneurData = (data) => {
    if (data) {
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setProfileImg(data.profile_pic_url || "");
  
      // Entrepreneur-specific fields
      setBusinessName(data.business_name || "");
      setYearsInOperation(data.years_in_operation || "");
      
      // Set website URL if available
      if (data.website_url) {
        setWebsiteUrl(data.website_url);
      }
      
      setIndustry(data.industry || "");
      setNumCandidates(data.num_candidates || "");
  
      if (data.job_roles && Array.isArray(data.job_roles)) {
        const jobRoleData = data.job_roles.map((role) => ({
          roleName: role.title || "",
          roleDescription: role.description || "",
        }));
        setJobRoles(jobRoleData);
      }
  
      if (data.skills_required && Array.isArray(data.skills_required)) {
        const skillsRequiredData = data.skills_required.map((skill) => ({
          skill: skill.name || "",
          skillRating: 0,
        }));
        setSkillsRequired(skillsRequiredData);
      }
    }
  };
  

  const handleBlur = (field) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: !eval(field), // Check if the field value is empty
    }));
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!firstName) missingFields.push("First Name");
    if (!lastName) missingFields.push("Last Name");
    if (!businessName) missingFields.push("Business Name");
    if (!yearsInOperation) missingFields.push("Years in Operation");
    if (!industry) missingFields.push("Industry");

    if (missingFields.length === 0) {
      const entrepreneurData = {
        profileImage: profileImg || null,
        firstName,
        lastName,
        businessName,
        yearsInOperation,
        industry,
        websiteUrl: websiteUrl || null,
        numCandidates,
        jobRoles,
        skillsRequired,
      };

      try {
        await saveData(entrepreneurData);
        toast.success("Entrepreneur profile saved successfully!");
        navigate("/profile");
      } catch (error) {
        toast.error(`Error saving profile: ${error.message || error}`);
        console.error(error);
      }
    } else {
      missingFields.forEach((field) => toast.error(`${field} is required`));
    }
  };



  const handleSubmit = () => {
    
  };

  return (
    <Box sx={{ width: "80wh", overflow: "auto"  }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        <Step key="Profile">
          <StepLabel>Profile</StepLabel>
        </Step>
      </Stepper>

      <Grid container spacing={4} justifyContent="flex-start">
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      position: { md: "sticky" },
                      top: 20,
                    }}
                  >
                    
           <Card sx={{ padding: 3, boxShadow: 3, width: "100%" }}>
                  <CardContent>
                      <Box
                               sx={{
                                 display: "flex",
                                 flexDirection: "column",
                                 alignItems: "center",
                                 mb: 4,
                                 position: "relative",
                               }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleProfileImage}
                />
                <label htmlFor="profile-image-upload">
                  <IconButton component="span">
                    <Avatar
                      src={
                        profileImg
                          ? profileImg
                          : "https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
                      }
                      sx={{ width: 120, height: 120 }}
                    />
                  </IconButton>
                </label>
                {profileImg && (
                  <IconButton
                    aria-label="clear"
                    onClick={clearProfileImage}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(255,255,255,0.7)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                    }}
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  Click to upload
                </Typography>
              </Box>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                size="small"
                error={errors.firstName}
                helperText={errors.firstName ? "First name is required" : ""}
                sx={{ mb: 3 }}
                onBlur={() => handleBlur("firstName")}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                size="small"
                error={errors.lastName}
                helperText={errors.lastName ? "Last name is required" : ""}
                sx={{ mb: 3 }}
                onBlur={() => handleBlur("lastName")}
              />
              <TextField
                label="Business Name"
                variant="outlined"
                fullWidth
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                size="small"
                error={errors.businessName}
                helperText={errors.businessName ? "Business name is required" : ""}
                sx={{ mb: 3 }}
                onBlur={() => handleBlur("businessName")}
              />
              <TextField
                label="Website URL"
                variant="outlined"
                fullWidth
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                size="small"
                error={errors.websiteUrl}
                helperText={errors.websiteUrl ? "Website URL is required" : ""}
              
              />

            </CardContent>
        
          </Card>
        </Grid>

        {/* Second Column */}
         <Grid
                      sx={{
                        marginTop: "10px",
                      }}
                      item
                      xs={12}
                      md={8}
                    >
                      {!profileData &&
        (<Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "center",
                    gap: "10px",
                    width: "100%",
                    height: "50px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    onClick={() => setIsLinkedInFetched(false)}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "10px",
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <img
                      src={LinkedInLogo}
                      alt="LinkedIn Logo"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <span>Import LinkedIn Profile</span>
                  </div>
                </Box>
              )}
              
              {!isLinkedInFetched && (
                <Box sx={{ mb: 2 }}>
                  <LinkedInFetcher
                    close={setIsLinkedInFetched}
                    onFetchSuccess={handleLinkedInEntrepreneurData}
                  />
                </Box>
              )}

       
          <Card sx={{ padding: 3 }}>
            <CardContent>
              <TextField
                label="Years in Operation"
                variant="outlined"
                fullWidth
                type="number"
                value={yearsInOperation}
                onChange={(e) => setYearsInOperation(e.target.value)}
                required
                size="small"
                error={errors.yearsInOperation}
                helperText={errors.yearsInOperation ? "Years in operation is required" : ""}
                sx={{ mb: 3 }}
                onBlur={() => handleBlur("yearsInOperation")}
              />
              <TextField
                label="Industry"
                variant="outlined"
                fullWidth
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                size="small"
                error={errors.industry}
                helperText={errors.industry ? "Industry is required" : ""}
                sx={{ mb: 3 }}
                onBlur={() => handleBlur("industry")}
              />
              <TextField
                label="Number of Candidates"
                variant="outlined"
                fullWidth
                type="number"
                value={numCandidates}
                onChange={(e) => setNumCandidates(e.target.value)}
                required
                size="small"
                error={errors.numCandidates}
                helperText={errors.numCandidates ? "Number of candidates is required" : ""}
                sx={{ mb: 3 }}
                onBlur={() => handleBlur("numCandidates")}
              />
              <TextField
                label="Job Roles"
                variant="outlined"
                fullWidth
                value={jobRoles}
                onChange={(e) => setJobRoles(e.target.value)}
                required
                size="small"
                error={errors.jobRoles}
                helperText={errors.jobRoles ? "Job roles are required" : ""}
                sx={{ mb: 3 }}
                onBlur={() => handleBlur("jobRoles")}
              />
              <TextField
                label="Skills Required"
                variant="outlined"
                fullWidth
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
                required
                size="small"
                error={errors.skillsRequired}
                helperText={errors.skillsRequired ? "Skills are required" : ""}
                onBlur={() => handleBlur("skillsRequired")}
              />
              <TextField
                label="LinkedIn Profile"
                variant="outlined"
                fullWidth
                value={linkedinProfile}
                onChange={(e) => setLinkedinProfile(e.target.value)}
                size="small"
                error={errors.linkedinProfile}
                helperText={errors.linkedinProfile ? "LinkedIn profile URL is required" : ""}
                sx={{ mt: 3 }}
              
              />
            </CardContent>
          </Card>
        </Grid>
    </Grid> 
    <Grid item={4} sx={{m:3,display:"flex",justifyContent:"flex-end"}} >
          <Button 
            variant="contained"
            color="primary"
        
           
            onClick={handleSubmitInfo}
            disabled={Object.values(errors).includes(true)} // Disable button if any error exists
          >
            Submit
          </Button>
          </Grid>
         
          
       
          </Box>
  );
}
