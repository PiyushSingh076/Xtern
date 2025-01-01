import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Avatar,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import useSaveProfileData from "../../../hooks//Linkedin/useSaveProfileData";
import { setEntrepreneurDetails } from "../../../Store/Slice/EntrepreneurDetails";

const EntrepreneurDetailsForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [yearsInOperation, setYearsInOperation] = useState("");
  const [industry, setIndustry] = useState("");
  const [numCandidates, setNumCandidates] = useState(1);
  const [jobRoles, setJobRoles] = useState([]);
  const [skillsRequired, setSkillsRequired] = useState([]);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { saveProfileData, loading } = useSaveProfileData();
 

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
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
      const entrepreneurDetails = {
        firstName,
        lastName,
        profileImg,
        businessName,
        yearsInOperation,
        industry,
        websiteUrl,
        numCandidates,
        jobRoles,
        skillsRequired,
      };
  
      dispatch(setEntrepreneurDetails(entrepreneurDetails));
      alert("Entrepreneur profile submitted successfully!");
  
      try {
        await saveProfileData(entrepreneurData);
        toast.success("Entrepreneur profile saved successfully!");
        navigate("/dashboard");
      } catch (error) {
        toast.error(`Error saving profile: ${error.message || error}`);
        console.error(error);
      }
    } else {
      missingFields.forEach((field) => toast.error(`${field} is required`));
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Entrepreneur Registration
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <input
            accept="image/*"
            id="upload-profile-img"
            type="file"
            style={{ display: "none" }}
            onChange={handleProfileImageUpload}
          />
          <label htmlFor="upload-profile-img">
            <Button variant="contained" component="span">
              Upload Profile Picture
            </Button>
          </label>
          {profileImg && <Avatar src={profileImg} sx={{ width: 100, height: 100 }} />}
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Business Name"
            fullWidth
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Years in Operation"
            type="number"
            fullWidth
            value={yearsInOperation}
            onChange={(e) => setYearsInOperation(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Industry"
            fullWidth
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Website URL (optional)"
            fullWidth
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Number of Candidates"
            type="number"
            fullWidth
            value={numCandidates}
            onChange={(e) => setNumCandidates(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Job Roles"
            fullWidth
            value={jobRoles.join(", ")}
            onChange={(e) => setJobRoles(e.target.value.split(",").map((role) => role.trim()))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Skills Required"
            fullWidth
            value={skillsRequired.join(", ")}
            onChange={(e) => setSkillsRequired(e.target.value.split(",").map((skill) => skill.trim()))}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmitInfo}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EntrepreneurDetailsForm;
