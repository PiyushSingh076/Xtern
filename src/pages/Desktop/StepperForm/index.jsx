import React, { useState } from "react";
import {
  Box,
  Grid,
  Avatar,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
} from "@mui/material";

import { FiTrash } from "react-icons/fi";
import { State, City } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { setDetail } from "../../../Store/Slice/UserDetail";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import LinkedInFetcher from "../../Teams/LinkedInFetcher";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AddPhotoAlternateIcon } from "@mui/icons-material";
import useSaveProfileData from "../../../hooks/Linkedin/useSaveProfileData";
import toast from "react-hot-toast";

export default function StepperForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saveProfileData, loading } = useSaveProfileData();
  const dataRole = useSelector((state) => state.user);

  console.log(dataRole, "sd");

  // Form Detail Elements
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Xpert, setXpert] = useState("");
  const [Experience, setExperience] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [Education, setEducation] = useState([]);
  const [Work, setWork] = useState([]);
  const [Skills, setSkills] = useState([]);
  const [Projects, setProjects] = useState([]);
  const [Services, setServices] = useState([]);
  const [ConsultingPrice, setConsultingPrice] = useState("");
  const [ConsultingDuration, setConsultingDuration] = useState("");
  const [ConsultingDurationType, setConsultingDurationType] = useState("");

  // Flow control
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Profile", "Offering"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [isLinkedInFetched, setIsLinkedInFetched] = useState(false); // Flag to check if LinkedIn data is fetched

  // Handle Profile Image Upload
  const handleProfileImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Clear Profile Image
  const clearProfileImage = () => {
    setProfileImg(null);
  };

  // Handle State Change
  const handleStateChange = (stateCode) => {
    setSelectedState(stateCode);
    const stateCities = City.getCitiesOfState("IN", stateCode);
    setCities(stateCities);
    setSelectedCity("");
  };

  // Open Modal
  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  // Save Detail
  const saveDetail = (type, data) => {
    switch (type.toLowerCase()) {
      case "education":
        setEducation([...Education, data]);
        break;
      case "work":
        setWork([...Work, data]);
        break;
      case "skill":
        setSkills([...Skills, data]);
        break;
      case "project":
        setProjects([...Projects, data]);
        break;
      case "service":
        setServices([...Services, data]);
        break;
      default:
        console.error("Invalid type");
    }
  };

  // Delete Detail
  const deleteDetail = (type, index) => {
    switch (type.toLowerCase()) {
      case "education":
        setEducation(Education.filter((_, i) => i !== index));
        break;
      case "work":
        setWork(Work.filter((_, i) => i !== index));
        break;
      case "skill":
        setSkills(Skills.filter((_, i) => i !== index));
        break;
      case "project":
        setProjects(Projects.filter((_, i) => i !== index));
        break;
      case "service":
        setServices(Services.filter((_, i) => i !== index));
        break;
      default:
        console.error("Invalid type");
    }
  };
  // Handle form submission
  const handleSubmitInfo = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate required fields
    if (
      FirstName &&
      LastName &&
      dataRole.XpertType &&
      Experience &&
      selectedState &&
      profileImg &&
      selectedCity
    ) {
      const data = {
        profileImage: profileImg,
        firstName: FirstName,
        lastName: LastName,
        experience: Experience,
        type: dataRole.XpertType,
        state: selectedState,
        city: selectedCity,
        education: Education,
        work: Work,
        skills: Skills,
        projects: Projects,
        services: Services,
        consultingPrice: ConsultingPrice,
        consultingDuration: ConsultingDuration,
        consultingDurationType: ConsultingDurationType,
      };

      console.log("Form Data:", data);

      // Dispatch to Redux store (if necessary)
      dispatch(setDetail(data));

      try {
        // Save to Firestore
        await saveProfileData(data);
        // Show success toast // Replace with your actual route
      } catch (error) {
        // Show error toast
        toast.error(`Error saving data: ${error.message || error}`);
      }
    } else {
      // Display specific toast alerts
      if (!FirstName) toast.error("First Name is required");
      if (!LastName) toast.error("Last Name is required");
      if (!dataRole.XpertType) toast.error("Xpert Type is required");
      if (!Experience) toast.error("Years of Experience is required");
      if (!selectedState) toast.error("State is required");
      if (!profileImg) toast.error("Profile Image is required");
      if (!selectedCity) toast.error("City is required");
    }
  };

  // Handle Modal Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Check if an image is uploaded
    const imageFile = formData.get("projectImage");
    const Fdata = Object.fromEntries(formData.entries());

    // Include image file or Base64 string in the data object
    if (imageFile && imageFile instanceof File) {
      // If you want to convert it to Base64 (optional)
      const reader = new FileReader();
      reader.onload = () => {
        Fdata.projectImage = reader.result; // Base64 string of the image
        saveDetail(modalType, Fdata);
      };
      reader.readAsDataURL(imageFile); // Convert to Base64
    } else {
      saveDetail(modalType, Fdata);
    }

    console.log(Fdata, "Submitted Data");
    closeModal();
  };

  // Fetch Indian States
  const indiaStates = State.getAllStates().filter(
    (item) => item.countryCode === "IN"
  );

  // Define Expertise Types and Degrees
  const expertiseTypes = [
    "Developer",
    "Designer",
    "Cloud Devops",
    "Content Creator",
    "Digital Marketing",
    "Lawyer",
    "HR",
    "Accountant",
  ];

  const degrees = ["High-School", "Bachelor", "Master", "PhD"];

  // Callback to handle LinkedIn data
  const handleLinkedInData = (data) => {
    console.log("Received LinkedIn Data:", data); // Debugging
    if (data) {
      // Auto-fill Profile Fields
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setXpert(data.occupation || "");
      setExperience(calculateExperience(data.experiences) || "");
      setProfileImg(data.profile_pic_url || "");
      setIsLinkedInFetched(true); // Set flag to hide sections

      // Mapping state and city
      if (data.state && data.city) {
        const stateObj = State.getStatesOfCountry("IN").find(
          (state) => state.name.toLowerCase() === data.state.toLowerCase()
        );
        if (stateObj) {
          setSelectedState(stateObj.isoCode);
          const stateCities = City.getCitiesOfState("IN", stateObj.isoCode);
          setCities(stateCities);
          const cityObj = stateCities.find(
            (city) => city.name.toLowerCase() === data.city.toLowerCase()
          );
          if (cityObj) {
            setSelectedCity(cityObj.name);
          }
        }
      }

      // Prefilling Education
      if (data.education && Array.isArray(data.education)) {
        const eduData = data.education.map((edu) => ({
          degree: edu.degree_name || "",
          stream: edu.field_of_study || "",
          college: edu.school || "",
          startDate: formatDate(edu.starts_at),
          endDate: edu.ends_at ? formatDate(edu.ends_at) : "Present",
          cgpa: edu.grade || "",
        }));
        setEducation(eduData);
      }

      // Prefilling Work Experience
      if (data.experiences && Array.isArray(data.experiences)) {
        const workData = data.experiences.map((exp) => ({
          position: exp.title || "",
          company: exp.company || "",
          startDate: formatDate(exp.starts_at),
          endDate: exp.ends_at ? formatDate(exp.ends_at) : "Present",
        }));
        setWork(workData);
      }

      // Prefilling Projects
      if (
        data.accomplishment_projects &&
        Array.isArray(data.accomplishment_projects)
      ) {
        const projectData = data.accomplishment_projects.map((proj) => ({
          projectName: proj.title || "",
          duration: `${formatDate(proj.starts_at)} - ${
            proj.ends_at ? formatDate(proj.ends_at) : "Present"
          }`,
          liveLink: proj.url || "",
          description: proj.description || "",
        }));
        setProjects(projectData);
      }

      // Prefilling Skills
      if (data.skills && Array.isArray(data.skills)) {
        const skillData = data.skills.map((skill) => ({
          skill: skill.name || "",
        }));
        setSkills(skillData);
      }
    }
  };

  // Helper function to calculate total experience
  const calculateExperience = (experiences) => {
    if (!experiences || experiences.length === 0) return "";
    const currentDate = new Date();
    let totalMonths = 0;
    experiences.forEach((exp) => {
      const start = new Date(
        exp.starts_at.year,
        exp.starts_at.month - 1,
        exp.starts_at.day
      );
      const end = exp.ends_at
        ? new Date(exp.ends_at.year, exp.ends_at.month - 1, exp.ends_at.day)
        : currentDate;
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      totalMonths += months;
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return `${years} ${years > 1 ? "Years" : "Year"} ${
      months > 0 ? `${months} ${months > 1 ? "Months" : "Month"}` : ""
    }`;
  };

  // Helper function to format date
  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    const { year, month, day } = dateObj;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ width: "100%", padding: 4, overflow: "hidden" }}>
      {/* Stepper Navigation */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Form Content */}
      <Box sx={{ height: "80vh", overflow: "auto" }}>
        {activeStep === 0 && (
          <Grid container spacing={4} alignItems="flex-start">
            {/* Left Column - Profile Fields */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                position: { md: "sticky" }, // Apply sticky positioning on medium and larger screens
              }}
            >
              <Card sx={{ padding: 3, boxShadow: 3, width: "100%" }}>
                <CardContent>
                  {/* Profile Image */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 4,
                      position: "relative",
                    }}
                  >
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
                          sx={{ width: 120, height: 120 }} // Increased size
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
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,1)",
                          },
                        }}
                        size="small"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      Click to upload
                    </Typography>
                  </Box>

                  {/* First Name */}
                  <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={FirstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    size="small"
                    sx={{ mb: 3 }}
                  />

                  {/* Last Name */}
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={LastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    size="small"
                    sx={{ mb: 3 }}
                  />

                  {/* Expertise Type */}
                  {/* <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
                    <InputLabel id="expertise-label">Xpert Type</InputLabel>
                    <Select
                      labelId="expertise-label"
                      value={Xpert}
                      label="Xpert Type"
                      onChange={(e) => setXpert(e.target.value)}
                    >
                      {expertiseTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl> */}

                  {/* Years of Experience */}
                  <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
                    <InputLabel id="experience-label">
                      Years of Experience
                    </InputLabel>
                    <Select
                      labelId="experience-label"
                      value={Experience}
                      label="Years of Experience"
                      onChange={(e) => setExperience(e.target.value)}
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(
                        (year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>

                  {/* State */}
                  <FormControl fullWidth required size="small" sx={{ mb: 3 }}>
                    <InputLabel id="state-label">State</InputLabel>
                    <Select
                      labelId="state-label"
                      value={selectedState}
                      label="State"
                      onChange={(e) => handleStateChange(e.target.value)}
                    >
                      {indiaStates.map((state) => (
                        <MenuItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* City */}
                  <FormControl fullWidth required size="small">
                    <InputLabel id="city-label">City</InputLabel>
                    <Select
                      labelId="city-label"
                      value={selectedCity}
                      label="City"
                      onChange={(e) => setSelectedCity(e.target.value)}
                      disabled={!selectedState}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.id} value={city.name}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - LinkedInFetcher and Details Sections */}
            <Grid item xs={12} md={8}>
              {/* LinkedInFetcher */}
              {!isLinkedInFetched && (
                <Box sx={{ mb: 2 }}>
                  <LinkedInFetcher onFetchSuccess={handleLinkedInData} />
                </Box>
              )}

              {/* Conditionally Render Sections Only If Not Fetched via LinkedIn */}

              <>
                {/* Education Section */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardHeader
                    title="Education"
                    titleTypographyProps={{ variant: "h6" }}
                    action={
                      <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => openModal("Education")}
                        size="small"
                        sx={{ textTransform: "none" }}
                      >
                        Add Education
                      </Button>
                    }
                    sx={{ padding: 2 }}
                  />
                  <Divider />
                  <CardContent sx={{ padding: 2 }}>
                    {Education.map((item, index) => (
                      <Box key={index} sx={{ mb: 3, position: "relative" }}>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deleteDetail("education", index)}
                        >
                          <FiTrash color="red" size={16} />
                        </IconButton>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "20px",
                          }}
                        >
                          <Box>
                            {/* <img src={item.projectImage} alt="image" width={'140px'} /> */}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">
                              <strong>{item.degree}</strong> in {item.stream}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.college}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.startDate} - {item.endDate}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              CGPA: {item.cgpa}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                {/* Skills Section */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardHeader
                    title="Skills"
                    titleTypographyProps={{ variant: "h6" }}
                    action={
                      <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => openModal("Skill")}
                        size="small"
                        sx={{ textTransform: "none" }}
                      >
                        Add Skill
                      </Button>
                    }
                    sx={{ padding: 2 }}
                  />
                  <Divider />
                  <CardContent sx={{ padding: 2 }}>
                    {Skills.map((item, index) => (
                      <Box key={index} sx={{ mb: 3, position: "relative" }}>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deleteDetail("skill", index)}
                        >
                          <FiTrash color="red" size={16} />
                        </IconButton>
                        <Typography variant="body1">{item.skill}</Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                {/* Work Experience Section */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardHeader
                    title="Work Experience"
                    titleTypographyProps={{ variant: "h6" }}
                    action={
                      <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => openModal("Work")}
                        size="small"
                        sx={{ textTransform: "none" }}
                      >
                        Add Experience
                      </Button>
                    }
                    sx={{ padding: 2 }}
                  />
                  <Divider />
                  <CardContent sx={{ padding: 2 }}>
                    {Work.map((item, index) => (
                      <Box key={index} sx={{ mb: 3, position: "relative" }}>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deleteDetail("work", index)}
                        >
                          <FiTrash color="red" size={16} />
                        </IconButton>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "20px",
                          }}
                        >
                          <Box>
                            {/* <img src={item.projectImage} alt="image" width={'140px'} /> */}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">
                              <strong>{item.position}</strong> at {item.company}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.startDate} - {item.endDate}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                {/* Projects/Assignments Section */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardHeader
                    title="Projects/Assignments"
                    titleTypographyProps={{ variant: "h6" }}
                    action={
                      <Button
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => openModal("Project")}
                        size="small"
                        sx={{ textTransform: "none" }}
                      >
                        Add Project
                      </Button>
                    }
                    sx={{ padding: 2 }}
                  />
                  <Divider />
                  <CardContent sx={{ padding: 2 }}>
                    {Projects.map((item, index) => (
                      <Box key={index} sx={{ mb: 3, position: "relative" }}>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          sx={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deleteDetail("project", index)}
                        >
                          <FiTrash color="red" size={16} />
                        </IconButton>
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "20px",
                            }}
                          >
                            {/* <img src={item.projectImage} alt="image" width={'140px'} /> */}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">
                              <strong>{item.projectName}</strong>
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {item.duration}
                            </Typography>
                            {item.liveLink && (
                              <Typography variant="body2" color="primary">
                                <a
                                  href={item.liveLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ textDecoration: "none" }}
                                >
                                  Live Link
                                </a>
                              </Typography>
                            )}
                            <Typography variant="body2" color="textSecondary">
                              {item.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </>
            </Grid>

            {/* Navigation Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setActiveStep(1)}
                  size="large"
                >
                  Next Step
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={4}>
            {/* Left Column - Profile Summary */}
            <Grid item xs={12} md={4}>
              <Card sx={{ padding: 3, boxShadow: 3, width: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={
                        profileImg
                          ? profileImg
                          : "https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
                      }
                      sx={{ width: 120, height: 120 }} // Increased size
                    />
                    <Typography variant="h6" sx={{ mt: 3 }}>
                      {FirstName} {LastName}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      {Xpert}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {Experience} {Experience === 1 ? "Year" : "Years"} of
                      Experience
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ mt: 2 }}
                    >
                      {selectedCity},{" "}
                      {
                        State.getStateByCodeAndCountry(selectedState, "IN")
                          ?.name
                      }
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Offering Details */}
            <Grid item xs={12} md={8}>
              {/* Consulting Charges Section */}
              <Card sx={{ mb: 4, boxShadow: 2, width: "100%" }}>
                <CardHeader
                  title="Consulting Charges"
                  titleTypographyProps={{ variant: "h6" }}
                  sx={{ padding: 2 }}
                />
                <Divider />
                <CardContent sx={{ padding: 2 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Price (₹)"
                        variant="outlined"
                        fullWidth
                        value={ConsultingPrice}
                        onChange={(e) => setConsultingPrice(e.target.value)}
                        required
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Duration"
                        variant="outlined"
                        fullWidth
                        value={ConsultingDuration}
                        onChange={(e) => setConsultingDuration(e.target.value)}
                        required
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth required size="small">
                        <InputLabel id="duration-type-label">
                          Duration Type
                        </InputLabel>
                        <Select
                          labelId="duration-type-label"
                          value={ConsultingDurationType}
                          label="Duration Type"
                          onChange={(e) =>
                            setConsultingDurationType(e.target.value)
                          }
                        >
                          <MenuItem value="per hour">Per Hour</MenuItem>
                          <MenuItem value="per day">Per Day</MenuItem>
                          <MenuItem value="per week">Per Week</MenuItem>
                          <MenuItem value="per month">Per Month</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Services Section */}
              <Card sx={{ mb: 4, boxShadow: 2, width: "100%" }}>
                <CardHeader
                  title="Services"
                  titleTypographyProps={{ variant: "h6" }}
                  action={
                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => openModal("Service")}
                      size="small"
                      sx={{ textTransform: "none" }}
                    >
                      Add Service
                    </Button>
                  }
                  sx={{ padding: 2 }}
                />
                <Divider />
                <CardContent sx={{ padding: 2 }}>
                  {Services.map((item, index) => (
                    <Box key={index} sx={{ mb: 3, position: "relative" }}>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 0 }}
                        onClick={() => deleteDetail("service", index)}
                      >
                        <FiTrash color="red" size={16} />
                      </IconButton>
                      <Typography variant="subtitle1">
                        <strong>{item.serviceName}</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.serviceDescription}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Price: ₹{item.servicePrice}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setActiveStep(0)}
                  size="large"
                  sx={{ mr: 2 }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitInfo}
                  size="large"
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* You can add more steps here if needed */}
      </Box>

      {/* Modal Component */}
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3, // Slightly more rounded
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Add {modalType}
          <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            {modalType === "Education" && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box
                    onClick={() => document.getElementById("add-logo").click()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dotted #ccc",
                      padding: 2,
                      height: "100px",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#ccc" }}>
                      Add logo
                    </Typography>
                  </Box>
                  <input
                    id="add-logo"
                    type="file"
                    accept="image/*"
                    name="projectImage"
                    onChange={(e) => console.log(e.target.files[0])}
                    style={{ marginBottom: 20, display: "none" }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Degree"
                    name="degree"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Stream"
                    name="stream"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="College"
                    name="college"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date"
                    name="endDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="CGPA"
                    name="cgpa"
                    type="number"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      step: 0.1,
                    }}
                    required
                    size="small"
                  />
                </Grid>
              </Grid>
            )}

            {modalType === "Skill" && (
              <TextField
                label="Skill Name"
                name="skill"
                variant="outlined"
                fullWidth
                required
                size="small"
              />
            )}

            {modalType === "Work" && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box
                    onClick={() => document.getElementById("add-logo").click()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dotted #ccc",
                      padding: 2,
                      height: "100px",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#ccc" }}>
                      Add logo
                    </Typography>
                  </Box>
                  <input
                    id="add-logo"
                    type="file"
                    accept="image/*"
                    name="projectImage"
                    onChange={(e) => console.log(e.target.files[0])}
                    style={{ marginBottom: 20, display: "none" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Position"
                    name="position"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Company"
                    name="company"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date"
                    name="startDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date"
                    name="endDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    size="small"
                  />
                </Grid>
              </Grid>
            )}

            {modalType === "Project" && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box
                    onClick={() => document.getElementById("add-logo").click()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dotted #ccc",
                      padding: 2,
                      height: "100px",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#ccc" }}>
                      Select Image
                    </Typography>
                  </Box>
                  <input
                    id="add-logo"
                    type="file"
                    accept="image/*"
                    name="projectImage"
                    onChange={(e) => console.log(e.target.files[0])}
                    style={{ marginBottom: 20, display: "none" }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Project Name"
                    name="projectName"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Duration"
                    name="duration"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Live Link"
                    name="liveLink"
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    required
                    size="small"
                  />
                </Grid>
              </Grid>
            )}

            {modalType === "Service" && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Service Name"
                    name="serviceName"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Service Description"
                    name="serviceDescription"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    required
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Service Price (₹)"
                    name="servicePrice"
                    type="number"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeModal}
              color="secondary"
              variant="outlined"
              size="large"
            >
              Cancel
            </Button>
            // Inside your ProfileForm component's return statement
            <Button
              variant="contained"
              color="primary"
              type="submit" // Changed from onClick to type="submit" for better form handling
              size="large"
              disabled={loading} // Disable the button when loading is true
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              } // Optional: Add spinner before text
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
